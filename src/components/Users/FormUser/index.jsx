import { useEffect, useState } from 'react';
import { Form, Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../../services/api';
import { formatApi, hasUpperCase, register } from '../../../services/config';
import './FormUser.css';
import Footer from '../../../includes/Footer';
import MsgText from '../../MsgText';
import RadioPill from '../../RadioPill';
import { getUserId } from '../../../services/auth';
import Layout from "../../../includes/Layout";

const FormUser = () => {
    const navigate = useNavigate(); 
    const initialValues = { 
        username: "", 
        email: "", 
        password: "", 
        name:"",
        lastname: "", 
        status: 2, 
        role: 3,
        team: "",
        archived: 0
    };
    const [ msg, setMsg ] = useState({show: false});
    const [ inputs, setInputs ] = useState(initialValues);
    const [ params ] = useSearchParams();
    const [openMoreTeamOptions , setOpenMoreTeamOptions] = useState(false);
    const [ teamOptions, setTeamOptions ] = useState([]);
    const [ registerUser, setRegisterUser ] = useState([]);

    const renderMsg = (content,style) => {
        setMsg({show:true,content:content,style:style})
        setTimeout(()=>{
            setMsg({show:false})
        },3000)  
    }

    const handleSubmit2 = (e) => {
        if(validate()){
            api.post("/users/create", inputs)
            .then(res => {
                api.get(`/users/details/${res.data}`).then(res => {
                    register(getUserId(),1,1,{},res.data)
                    navigate("/users?msg=1")
                })     
            })
            .catch(err => renderMsg("Campos como Username ou Email já foram cadastrados anteriormente.","warning"))
        }   
    }
    const handleChanges = (e) => {
        const { name, value } = e.target;
        setInputs(values => ({...values,[name]:value}));
    }

    const validate = () => {
        if(inputs.username === "" 
            ||inputs.email === "" 
            || inputs.name === "") { 
            renderMsg("Por favor, verifique os campos obrigatórios.","danger") 
            return false;
        }
        if(inputs.password === "" && params.get('id') === '0') {
            renderMsg("Por favor, digite uma senha","danger");
            return false;
        }
        if(hasUpperCase(inputs.username)) {
            renderMsg("Username deve conter apenas letras minúsculas e números","warning")
            return false;
        }

        return true;
    }
    const userFormHandler = (e) => {
        e.preventDefault();

        if(validate()) { 
            if((params.get('id') !== '0' && params.get('copy') === '0') 
                || (params.get('id') !== '0' && params.get('copy') !== '0')) {
                api.post("/users/edit", {
                    ids: [inputs.id],
                    columns:[],
                    user: inputs
                })
                .then(res => {
                    register(getUserId(),1,2,registerUser,inputs);
                    if(params.get('copy') === '0'){                     
                        navigate(`/users/edit/users-info?id=${params.get('id')}&copy=0`)
                    } else {
                        navigate(`/users/edit/users-info?id=${params.get('id')}&copy=${params.get('copy')}`);
                    }
                })
                .catch(err => setMsg({show:true, content:"Campos como Username ou Email já foram cadastrados anteriormente.", style:"warning"}));
            } else {
                api.post("/users/create", inputs)
                .then(res => {
                    var id = res.data
                    api.get(`/users/details/${id}`).then(res=>{
                        register(getUserId(),1,1,{},res.data);
                        if(params.get('copy') === '0'){
                            navigate(`/users/edit/users-info?id=${id}&copy=0`)
                        } else {
                            navigate(`/users/edit/users-info?id=${id}&copy=${params.get('copy')}`);
                        }
                    })
                })
                .catch(err => setMsg({show:true, content:"Campos como Username ou Email já foram cadastrados anteriormente.",style:"warning"}))
            }        
        }  
    }

    useEffect(() => {
        
        if(params.get('id') !== '0' || params.get('copy') !== '0') {            
            var url = params.get('id') !== '0' || 
            params.get('copy') === '0'
            ? `/users/details/${params.get('id')}`
            : `/users/details/${params.get('copy')}`;
            api.get(url)
            .then(res => {
                console.log(res.data)
                setInputs(res.data[0]);
                setRegisterUser(res.data[0]);
            })
        }

        api.post('/users/pages', {currentPage:1,maxItems:1,search:"",filters:{
            status: [1,2],
            teams: [],
            date: -1,
            archived: false,
            date_range: ['1909-01-01','2100-01-01'],
            order: ''
        }}).then((res)=>{
            setTeamOptions(res.data.teamOptions);
        }).catch(err => console.log(err));
        
    }, [params])
    return(
        <>
            <Layout>
                <div className='panel-header'>   
                    <Link to="/users"><i className='fa fa-arrow-left'></i></Link>
                    <h3>{params.get("id") > 0 ? 'Editar Usuário' : 'Novo Usuário'}</h3>                           
                    <MsgText show={msg.show} style={msg.style} content={msg.content}/>
                </div>
                <div className='panel-body'>    
                <div className='form-wrapper'>           
                    <Form
                    onSubmit={userFormHandler}
                    method='post'
                    >
                    <h3>Dados pessoais</h3>       
                    <div className='hr'></div>     
                    <div className='form-wrapper'>
                        <div className='form-input'>
                            <label>Nome:</label>
                            <input 
                            style={{border: msg.show && inputs.name === "" ? '2px solid var(--danger)' : '1px solid var(--black05)'}} 
                            onChange={handleChanges} 
                            value={inputs.name || ''} 
                            name="name" 
                            type="text"/>
                        </div>                                                                                                                  
                    
                        <div className='form-input'>
                            <label>Sobrenome (Opcional):</label>
                            <input 
                            onChange={handleChanges} 
                            value={inputs.lastname || ''} 
                            name="lastname" 
                            type="text" />
                        </div>
                    </div>

                    <h3>Dados profissionais</h3>
                    <div className='hr'></div>

                    <div className='form-wrapper'>                                
                        <div className='form-input'>
                            <label>Username:</label>
                            <input 
                            style={{border: msg.show && inputs.username === "" ? '2px solid var(--danger)' : '1px solid var(--black05)'}}
                            onChange={handleChanges} 
                            value={inputs.username || ''}  
                            name="username" 
                            type="text"/>
                        </div>   
                        <div className='form-input'>
                            <label>Email:</label>
                            <input 
                            style={{border: msg.show && inputs.email === "" ? '2px solid var(--danger)' : '1px solid var(--black05)'}}
                            onChange={handleChanges} 
                            value={inputs.email || ''} 
                            name="email" 
                            type="email"/>
                        </div>                                                                                                          
                    </div>

                    <div className='form-wrapper'>
                        {
                            (params.get('id') === '0' || params.get('copy') === '1') && 
                            <div className='form-input'>
                                <label>Senha:</label>
                                <input 
                                style={{border: msg.show && inputs.password === "" ? '2px solid var(--danger)' : '1px solid var(--black05)'}}
                                onChange={handleChanges} 
                                value={inputs.password || ''} 
                                name="password" 
                                type="password"/>
                            </div> 
                        }                                
                        
                        <div className='form-input'>
                            <label>Equipe (Opcional):</label>
                            <input 
                            onChange={e => {
                                handleChanges(e);
                                setOpenMoreTeamOptions(false)
                            }} 
                            value={inputs.team || ''} 
                            name="team" 
                            type="text"/>
                            <div className='dropdown'>
                                <i onClick={e => setOpenMoreTeamOptions(!openMoreTeamOptions)} className='fa fa-search search-input'></i>
                                {
                                    openMoreTeamOptions && 
                                    <div className='menu'>
                                    {
                                        teamOptions.map((team,i) => {
                                            if(team !== "") return(
                                                <RadioPill
                                                name="team" 
                                                onClick={handleChanges} 
                                                placeholder={team} 
                                                css='info'
                                                value={team}
                                                defaultChecked={inputs.team == team}
                                                />
                                            )
                                        })
                                    }
                                    </div>
                                }
                            </div>
                            
                        </div>  
                    </div>                                                                
                    <div className='wrapper'>
                        <Link to="/users" className='btn-custom warning'>Cancelar</Link>
                        { params.get('id') === '0' && <button name="later" onClick={handleSubmit2} className='btn-custom info' type="button">Salvar Rascunho</button> }
                        <button name="continuar" className='btn-custom success' type="submit">Próximo</button><h4>Passo 1 de 2</h4>
                    </div>
                    </Form> 
                    </div>   
                </div>
            </Layout>    
        </>
    );
}
export default FormUser;