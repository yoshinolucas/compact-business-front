import { useEffect, useState } from 'react';
import { Form, Link, useNavigate, useSearchParams } from 'react-router-dom';
import api, { cep } from '../../../services/api';
import './FormUserInfo.css';
import MsgText from '../../MsgText';
import { getUserId, isAdm } from '../../../services/auth';
import Layout from '../../../includes/Layout';

const FormUserInfo = () => {
    const navigate = useNavigate(); 
    const initialValuesUser = { 
        gender:undefined,
        birthday_date:undefined,
        role: 3,
        status:2,
        salary:undefined,
    };

    const initialValuesAddress = {
        id: 0,
        street:undefined,
        number:undefined,
        district:undefined,
        city:undefined,
        state:undefined,
        country:undefined,
        zip_code:undefined,
        userId:undefined
    }

    const initialValuesDocument = {
        id:0,
        cpf:undefined,
        rg:undefined,
        pis:undefined,
        ctps:undefined,
        cnh:undefined,
        userId:undefined
    }
    const [ msg, setMsg ] = useState({show: false});
    const [ inputsUser, setInputsUser ] = useState(initialValuesUser);
    const [ inputsAddress, setInputsAddress ] = useState(initialValuesAddress);
    const [ inputsDocument, setInputsDocument ] = useState(initialValuesDocument);
    const [ params ] = useSearchParams();

    const renderMsg = (content,style) => {
        setMsg({show:true,content:content,style:style})
        setTimeout(()=>{
            setMsg({show:false})
        },3000)  
    }
    const handleZipCode = (e) => {
        cep.get(`/ws/${inputsAddress.zip_code}/json/`).then(res => {
            setInputsAddress(values => (
                {
                    ...values,
                    street:res.data.logradouro,
                    district:res.data.bairro,
                    state: res.data.uf,
                    city:res.data.localidade,
                }
            ))
        })
    }
    const handleChangesUser = (e) => {
        var { name, value } = e.target;
        if(name==='status' || name==='role') {
            value = parseFloat(value);
            if(name==='status') {
                if(!e.target.checked) value = 3;
            }
        }
        setInputsUser(values => ({...values,[name]:value}));
    }
    const handleChangesAddress = (e) => {
        const { name, value } = e.target;
        setInputsAddress(values => ({...values,[name]:value}));
    }
    const handleChangesDocument = (e) => {
        const { name, value } = e.target;
        setInputsDocument(values => ({...values,[name]:value}));
    }
    const validate = () => {
        if(inputsDocument.rg === undefined
            || inputsDocument.cpf === undefined
            || inputsAddress.zip_code === undefined
            || inputsAddress.street === undefined
            || inputsAddress.city === undefined
            || inputsAddress.state === undefined
            || inputsAddress.country === undefined) {
                return false;
            } else {
                return true;
            }
    }
    const userFormHandler = (e) => {
        e.preventDefault();
        if(validate()) {
            const id = params.get('id')
            api.post("/users/edit",{
                columns:['birthday_date','gender','role','status','salary'],
                ids: [id],
                user: {
                    birthday_date: inputsUser.birthday_date,
                    gender: inputsUser.gender,
                    role: inputsUser.role,
                    status: inputsUser.status,
                    salary: inputsUser.salary
                }
            }).then(res => {
                if(inputsAddress.id == 0) {
                    api.post("/addresses/create",inputsAddress)
                } else {
                    api.post(`/addresses/edit/${inputsAddress.id}`,inputsAddress)
                }
                if(inputsDocument.id == 0) {
                    api.post("/documents/create",inputsDocument)
                    .then(res => navigate('/users?msg=1'))
                } else {
                    api.post(`/documents/edit/${inputsDocument.id}`,inputsDocument)
                    .then(res => navigate('/users?msg=2'))
                }
            })
        } else {
            renderMsg("Complete os campos obrigatórios para completar o cadastro.","danger");
        }
    }

    useEffect(() => {
        if(params.get('id') !== '0') {            
            var url = params.get('copy') === '0' ? `/users/details/${params.get('id')}` : `/users/details/${params.get('copy')}`;
            api.get(url)
            .then(res => {
                var data = res.data[0];
                if(data.address !== null) {
                    setInputsAddress(data.address);
                } else {
                    setInputsAddress(v=>({...v,userId:parseFloat(params.get("id"))}))
                }
                if(data.document !== null) {
                    setInputsDocument(data.document);
                } else {
                    setInputsDocument(v=>({...v,userId:parseFloat(params.get("id"))}))
                }
                setInputsUser(data);    
            })
        }
    }, [params])

        
        
    
    return(
        <>
           <Layout>
                <div className='panel-header'>   
                    
                    <Link style={{marginRight:'32px'}} className='transparent' to={`/users/edit?id=${params.get('id')}&copy=${params.get('copy')}`}><i className='fa fa-arrow-left'></i></Link>
                    <h3>Editar Usuário </h3>       
                    <MsgText show={msg.show} style={msg.style} content={msg.content}/>
                </div>
                <div className='panel-body'>
                    <div className='form-wrapper'>
                        <Form
                        onSubmit={userFormHandler}
                        method='post'>
                            <h3>Mais dados pessoais</h3>
                            <div className='hr'></div>
                            <div className='form-wrapper'>
                                <div className='form-input'>
                                    <label>RG:</label>
                                    <input 
                                    style={{border: msg.show && inputsDocument.rg === undefined ? '2px solid var(--danger)' : '1px solid var(--black05)'}} 
                                    onChange={handleChangesDocument} 
                                    value={inputsDocument.rg || ""} 
                                    name="rg" 
                                    type="text"/>
                                </div>    
                                <div className='form-input'>
                                    <label>Data de nascimento (Opcional):</label>
                                    <input 
                                    onChange={handleChangesUser} 
                                    value={inputsUser.birthday_date || ""} 
                                    name="birthday_date" 
                                    type="date"/>
                                </div>     
                            </div>
                            <div className='form-wrapper'>
                                <div className='form-input'>
                                    <label>CPF:</label>
                                    <input 
                                    style={{border: msg.show && inputsDocument.cpf === undefined ? '2px solid var(--danger)' : '1px solid var(--black05)'}} 
                                    onChange={handleChangesDocument} 
                                    value={inputsDocument.cpf || ""} 
                                    name="cpf" 
                                    type="text" />
                                </div>
                                <div className='form-input'>
                                    <label>Gênero (Opcional):</label>
                                    <select 
                                    name="gender"
                                    onChange={handleChangesUser} 
                                    value={inputsUser.gender || ""}
                                    >
                                        <option disabled value="">Escolha um gênero</option>
                                        <option value="Masculino">Masculino</option>
                                        <option value="Feminino">Feminino</option>
                                        <option value="">Indefinido</option>
                                    </select>
                                    
                                </div>
                            </div>
                            
                            <h3>Endereço</h3>
                            <div className='hr'></div>
                            <div className='form-wrapper'>                    
                                <div className='form-input'>
                                    <label>CEP:</label>
                                    <input 
                                    style={{border: msg.show && inputsAddress.zip_code === undefined ? '2px solid var(--danger)' : '1px solid var(--black05)'}} 
                                    onChange={handleChangesAddress}
                                    onBlur={handleZipCode} 
                                    value={inputsAddress.zip_code || ""}  
                                    name="zip_code" 
                                    type="text"/>
                                </div>    
                                <div className='form-input'>
                                    <label>País:</label>
                                    <input 
                                    style={{border: msg.show && inputsAddress.country === undefined ? '2px solid var(--danger)' : '1px solid var(--black05)'}} 
                                    onChange={handleChangesAddress}
                                    onBlur={handleZipCode} 
                                    value={inputsAddress.country || ""}  
                                    name="country" 
                                    type="text"/>
                                </div>       
                            </div>
                            <div className='form-wrapper'>
                                <div className='form-input'>
                                    <label>Rua:</label>
                                    <input 
                                    style={{border: msg.show && inputsAddress.street === undefined ? '2px solid var(--danger)' : '1px solid var(--black05)'}} 
                                    onChange={handleChangesAddress}
                                    value={inputsAddress.street || ""} 
                                    name="street" 
                                    type="text"/>
                                </div>   
                                <div className='form-group-input'>
                                    <div className='form-input'>
                                        <label>Número (Opcional):</label>
                                        <input 
                                        onChange={handleChangesAddress}
                                        value={inputsAddress.number || ""} 
                                        name="number" 
                                        type="number"/>
                                    </div>
                                    <div className='form-input'>
                                        <label>Estado:</label>
                                        <input 
                                        style={{border: msg.show && inputsAddress.state === undefined ? '2px solid var(--danger)' : '1px solid var(--black05)'}} 
                                        onChange={handleChangesAddress}
                                        value={inputsAddress.state || ""} 
                                        name="state" 
                                        type="text"/>
                                    </div>
                                <div>
                            </div>
                                                                                            
                                </div>      
                                                                                                            
                            </div>
                            <div className='form-wrapper'>
                                <div className='form-input'>
                                    <label>Cidade:</label>
                                    <input 
                                    style={{border: msg.show && inputsAddress.city === undefined ? '2px solid var(--danger)' : '1px solid var(--black05)'}} 
                                    onChange={handleChangesAddress}
                                    value={inputsAddress.city || ""} 
                                    name="city" 
                                    type="text"/>
                                </div>  
                                <div className='form-input'>
                                    <label>Bairro (Opcional):</label>
                                    <input 
                                    onChange={handleChangesAddress}
                                    value={inputsAddress.district || ""} 
                                    name="district" 
                                    type="text"/>
                                </div>
                            </div>
                            <h3>Outros dados</h3>
                            <div className='hr'></div>
                            <div className='form-wrapper'>
                                        
                                <div className='form-input'>
                                    <label>CTPS (Opcional):</label>
                                    <input 
                                    onChange={handleChangesDocument}
                                    value={inputsDocument.ctps || ""}  
                                    name="ctps" 
                                    type="number"/>
                                </div>   
                                <div className='form-input'>
                                    <label>PIS (Opcional):</label>
                                    <input 
                                    onChange={handleChangesDocument} 
                                    value={inputsDocument.pis || ""} 
                                    name="pis" 
                                    type="text"/>
                                </div> 
                            </div>
                            <div className='form-wrapper'>     
                            {
                                isAdm() &&
                                <div className='form-input'>
                                <label>Salário (Opcional):</label>
                                <input 
                                onChange={handleChangesUser}
                                value={inputsUser.salary || ""} 
                                name="salary" 
                                type="text"/>
                                </div> 
                            }                                                                                                       
                            <div className='form-input'>
                                <label>Privilégios no sistema:</label>
                                <select value={inputsUser.role || ""} onChange={handleChangesUser} name="role">
                                    <option disabled>Escolha um privilégio</option>
                                    { isAdm() && <option value={1}>Main</option> }
                                    { isAdm() && <option value={2}>Adm</option> }
                                    <option value={3}>Normal</option>
                                    <option value={4}>Parcial</option>
                                </select>
                            </div>
                            </div>
                            <div className='form-wrapper'>
                                <div className='form-input'>
                                    <label>CNH (Opcional):</label>
                                    <input 
                                    onChange={handleChangesDocument}
                                    value={inputsDocument.cnh || ""} 
                                    name="cnh" 
                                    type="text"/>
                                </div>  

                                {
                                    params.get('id') !== getUserId() && 
                                    <div className='form-input'>
                                    <label>Ativo:</label>
                                    <input 
                                    checked={inputsUser.status !== 3 ? true : false}
                                    onChange={handleChangesUser}
                                    value={1} 
                                    name="status" 
                                    type="checkbox"/>
                                    </div>
                                }
                            </div>
                            <div className='wrapper'>
                                <Link className='btn-custom warning' to="/users">Cancelar</Link>
                                <Link className='btn-custom info' to={`/users/edit?id=${params.get('id')}&copy=${params.get('copy')}`}>Voltar</Link>
                                <button className='btn-custom btn-long success' type="submit">Completar cadastro</button>  
                                <h4  className='panel-subtitle'>Passo 2 de 2</h4>
                            </div>
                        </Form>
                    </div>
                </div>
            </Layout>
        </>
    );
}
export default FormUserInfo;