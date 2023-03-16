import { useEffect, useState } from 'react';
import { Form, Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../../services/api';
import { formatApi } from '../../../services/config';
import Header from '../../../includes/Header';
import './FormUser.css';
import Footer from '../../../includes/Footer';
import MsgText from '../../MsgText';

const FormUser = () => {
    const navigate = useNavigate(); 
    const initialValues = { 
        username: "", 
        email: "", 
        password: "", 
        nome:"",
        sobrenome: "", 
        status: 2, 
        previlegio: 3
    };
    const [ msg, setMsg ] = useState({show: false});
    const [ inputs, setInputs ] = useState(initialValues);
    const [ params ] = useSearchParams();

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setInputs(values => ({...values,[name]:value}));
    }
    const userFormHandler = (e) => {
        e.preventDefault();

        if(inputs.username === "" || inputs.password === "" 
        || inputs.email === "" || inputs.nome === "") { 
            setMsg({show: true, content:"Por favor, verifique os campos obrigatórios.", style: "danger"}) 
        } else {
            if(params.get('id') !== '0' && params.get('copy') !== '1') {
                var updateUser = {
                    ids: [inputs.id],
                    columns:[],
                    user: inputs
                }
                api.post("/users/update", updateUser)
                .then(res => navigate("/users?msg=2"))
                .catch(err => navigate("/users?msg=4"));
            } else {
                api.post("/users/create", inputs)
                .then(res => navigate("/users?msg=1"))
                .catch(err => navigate("/users?msg=4"))
            }
            
        }  
    }

    useEffect(() => {
        
        if(params.get('id') !== '0') {            
            var url = `/users/id/${params.get('id')}`;
            api.get(url)
            .then(res => {
                formatApi(res.data);
                setInputs(res.data);
            })
        }
        
    }, [params])

        
        
    
    return(
        <>
            <Header />
            <main>
                <div className='form-user'>
                    <div className='container'>
                        <div className='panel panel-white'>

                            <div className='panel-header'>                               
                                <h3 className='panel-title'>Equipe / {params.get("id") > 0 ? 'Editar Usuário' : 'Novo Usuário'}</h3>
                                <h4  className='panel-subtitle'>Passo 1 de 2</h4>
                                    
                                <MsgText show={msg.show} style={msg.style} content={msg.content}/>
                            </div>


                            <div className='panel-body'>
                                <div className='form-custom'>
                                    <Form
                                    onSubmit={userFormHandler}
                                    method='post'>

                                        <div className='form-section'>
                                            <div className='form-section-header'>
                                                <h3 className='form-section-title'>Dados pessoais</h3>
                                                <div className='hr'></div>
                                            </div>
                                        
                                            <div className='form-wrapper'>
                                                <div className='col-1'>
                                                    <div className='form-input'>
                                                        <label>Nome:</label>
                                                        <input 
                                                        style={{border: msg.show && inputs.nome === "" ? '2px solid var(--danger)' : '1px solid rgba(73, 73, 73, 0.3)'}} 
                                                        onChange={handleChanges} 
                                                        value={inputs.nome} 
                                                        name="nome" 
                                                        type="text"/>
                                                    </div>    
                                                                                                                                                               
                                                </div>
                                                <div className='col-2'>
                                                    <div className='form-input'>
                                                        <label>Sobrenome (Opcional):</label>
                                                        <input 
                                                        onChange={handleChanges} 
                                                        value={inputs.sobrenome} 
                                                        name="sobrenome" 
                                                        type="text" />
                                                    </div>
                                                                                       

                                                </div>  
                                            </div>

                                        </div>

                                        <div className='form-section'>
                                            <div className='form-section-header'>
                                                <h3 className='form-section-title'>Dados profissionais</h3>
                                                <div className='hr'></div>
                                            </div>

                                            <div className='form-wrapper'>
                                                <div className='col-1'>                                 
                                                    <div className='form-input'>
                                                        <label>Username:</label>
                                                        <input 
                                                        style={{border: msg.show && inputs.username === "" ? '2px solid var(--danger)' : '1px solid rgba(73, 73, 73, 0.3)'}}
                                                        onChange={handleChanges} 
                                                        value={inputs.username}  
                                                        name="username" 
                                                        type="text"/>
                                                    </div>   
                                                    <div className='form-input'>
                                                        <label>Email:</label>
                                                        <input 
                                                        style={{border: msg.show && inputs.email === "" ? '2px solid var(--danger)' : '1px solid rgba(73, 73, 73, 0.3)'}}
                                                        onChange={handleChanges} 
                                                        value={inputs.email} 
                                                        name="email" 
                                                        type="email"/>
                                                    </div>                                                                                                          
                                                    </div>
                                                    <div className='col-2'>                                      
                                                        <div className='form-input'>
                                                            <label>Senha:</label>
                                                            <input 
                                                            style={{border: msg.show && inputs.password === "" ? '2px solid var(--danger)' : '1px solid rgba(73, 73, 73, 0.3)'}}
                                                            onChange={handleChanges} 
                                                            value={inputs.password} 
                                                            name="password" 
                                                            type="password"/>
                                                        </div>                                                                       
                                                    </div>  
                                            </div>
                                        </div>
                                        
            
                                        <div className='group-button'>
                                            <button className='btn-custom success' type="submit">Próximo</button>
                                            <Link className='btn-custom warning' to="/users">Cancelar</Link>
                                        </div>
                                        
                                    </Form>
                                </div>
                                
                            </div>

                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
export default FormUser;