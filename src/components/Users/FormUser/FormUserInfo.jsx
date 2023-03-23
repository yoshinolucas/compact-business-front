import { useEffect, useState } from 'react';
import { Form, Link, useNavigate, useSearchParams } from 'react-router-dom';
import api, { cep } from '../../../services/api';
import { formatApi, formatOnlyDate } from '../../../services/config';
import Header from '../../../includes/Header';
import './FormUserInfo.css';
import Footer from '../../../includes/Footer';
import MsgText from '../../MsgText';
import { getUserId, isAdm } from '../../../services/auth';

const FormUserInfo = () => {
    const navigate = useNavigate(); 
    const initialValuesUser = { 
        gender:"",
        birthday_date:"",
        role: 3,
        status:1,
        salary:"",
    };

    const initialValuesAddress = {
        id: 0,
        street:"",
        number:"",
        district:"",
        city:"",
        state:"",
        country:"Brasil",
        zip_code:""
    }

    const initialValuesDocument = {
        id:0,
        cpf:"",
        rg:"",
        pis:"",
        ctps:"",
        cnh:""
    }
    const [ msg, setMsg ] = useState({show: false});
    const [ inputsUser, setInputsUser ] = useState(initialValuesUser);
    const [ inputsAddress, setInputsAddress ] = useState(initialValuesAddress);
    const [ inputsDocument, setInputsDocument ] = useState(initialValuesDocument);
    const [ params ] = useSearchParams();

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
        if(inputsDocument.rg 
            || inputsDocument.cpf 
            || inputsAddress.cep 
            || inputsAddress.street 
            || inputsAddress.city 
            || inputsAddress.state) return true
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
                if(inputsAddress.id == 0 || inputsUser.addressId == "") {
                    api.post("/addresses/create",inputsAddress)
                    .then(res => {
                        var data = {
                            ids: [id],
                            columns:['addressId'],
                            user: {
                                addressId:res.data
                            }
                        }
                        api.post(`/users/edit`, data)
                    })
                } else {
                    api.post(`/addresses/edit/${inputsAddress.id}`,inputsAddress).then(res => console.log("chego"))
                }
        
                if(inputsDocument.id == 0 || inputsUser.documentId == "") {
                    api.post("/documents/create",inputsDocument)
                    .then(res => {
                        var data = {
                            ids: [id],
                            columns:['documentId'],
                            user: {
                                documentId:res.data
                            }
                        }
                        api.post(`/users/edit`, data).then(
                            res => navigate('/users?msg=1')
                        )
                    })
                } else {
                    api.post(`/documents/edit/${inputsDocument.id}`,inputsDocument)
                    .then(res => navigate('/users?msg=2'))
                }
            })
        } else {
            setMsg({show:true,content:"Complete os campos obrigatórios para completar o cadastro.",style:"danger"});
        }
    }

    useEffect(() => {
        if(params.get('id') !== '0') {            
            var url = params.get('copy') === '0' ? `/users/details/${params.get('id')}` : `/users/details/${params.get('copy')}`;
            api.get(url)
            .then(res => {
                
                formatApi(res.data);
                if(res.data.birthday_date != "") {
                    res.data.birthday_date = formatOnlyDate(res.data.birthday_date)
                }
                setInputsUser(res.data);
                
                if(res.data.status !== 3) setInputsUser(v=>({...v,status:1}))
                
                if(res.data.addressId !== "") {
                    api.get(`/addresses/details/${res.data.addressId}`)
                    .then(res => {
                        formatApi(res.data)
                        setInputsAddress(res.data)
                        if(params.get('copy') !== '0') setInputsAddress(v=>({...v,id:0}));
                    })
                }
                if(res.data.documentId !== ""){
                    api.get(`/documents/details/${res.data.documentId}`)
                    .then(res => {
                        formatApi(res.data)
                        setInputsDocument(res.data)
                        if(params.get('copy') !== '0') setInputsDocument(v=>({...v,id:0}));
                    })
                }
                
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
                                <div className='panel-title'>
                                <Link style={{marginRight:'32px'}} className='transparent' to={`/users/edit?id=${params.get('id')}&copy=${params.get('copy')}`}><i className='fa fa-arrow-left'></i></Link>
                                    <h4>Equipe</h4> <h3> / Editar Usuário </h3>
                                </div>                            
                               
                                    
                                <MsgText show={msg.show} style={msg.style} content={msg.content}/>
                            </div>
                            <div className='panel-body'>
                                <div className='form-custom'>
                                    <Form
                                    onSubmit={userFormHandler}
                                    method='post'>

                                        <div className='form-section'>
                                            <div className='form-section-header'>
                                                <h3 className='form-section-title'>Mais dados pessoais</h3>
                                                <div className='hr'></div>
                                            </div>
                                        
                                            <div className='form-wrapper'>
                                                <div className='col-1'>  
                                                    <div className='form-input'>
                                                        <label>RG:</label>
                                                        <input 
                                                        onChange={handleChangesDocument} 
                                                        value={inputsDocument.rg} 
                                                        name="rg" 
                                                        type="text"/>
                                                    </div>    
                                                    <div className='form-group-input'>
                                                        <div className='form-input'>
                                                            <label>Data de nascimento (Opcional):</label>
                                                            <input 
                                                            onChange={handleChangesUser} 
                                                            value={inputsUser.birthday_date} 
                                                            name="birthday_date" 
                                                            type="date"/>
                                                        </div>     
                                                    </div>  
                                                                                                                                                               
                                                </div>
                                                <div className='col-2'>
                                                    <div className='form-input'>
                                                        <label>CPF:</label>
                                                        <input 
                                                        onChange={handleChangesDocument} 
                                                        value={inputsDocument.cpf} 
                                                        name="cpf" 
                                                        type="text" />
                                                    </div>
                                                    <div className='form-input'>
                                                        <label>Gênero (Opcional):</label>
                                                        <select 
                                                        name="gender"
                                                        onChange={handleChangesUser} 
                                                        value={inputsUser.gender}
                                                        >
                                                            <option disabled value="">Escolha um gênero</option>
                                                            <option value="Masculino">Masculino</option>
                                                            <option value="Feminino">Feminino</option>
                                                            <option value="">Indefinido</option>
                                                        </select>
                                                        
                                                    </div>
                                                                                       

                                                </div>  
                                                
                                            </div>

                                        </div>

                                        <div className='form-section'>
                                            <div className='form-section-header'>
                                                <h3 className='form-section-title'>Endereço</h3>
                                                <div className='hr'></div>
                                            </div>

                                            <div className='form-wrapper'>
                                                <div className='col-1'>                                 
                                                    <div className='form-input'>
                                                        <label>CEP:</label>
                                                        <input 
                                                        onChange={handleChangesAddress}
                                                        onBlur={handleZipCode} 
                                                        value={inputsAddress.zip_code}  
                                                        name="zip_code" 
                                                        type="text"/>
                                                    </div>   
                                                    <div className='form-input'>
                                                        <label>Bairro (Opcional):</label>
                                                        <input 
                                                        onChange={handleChangesAddress}
                                                        value={inputsAddress.district} 
                                                        name="district" 
                                                        type="text"/>
                                                    </div>           
                                                    <div className='form-input'>
                                                        <label>Cidade:</label>
                                                        <input 
                                                        onChange={handleChangesAddress}
                                                        value={inputsAddress.city} 
                                                        name="city" 
                                                        type="text"/>
                                                    </div>                                                                                               
                                                </div>
                                                <div className='col-2'>                                  
                                                    <div className='form-input'>
                                                        <label>Rua:</label>
                                                        <input 
                                                        onChange={handleChangesAddress}
                                                        value={inputsAddress.street} 
                                                        name="street" 
                                                        type="text"/>
                                                    </div>
                                                    <div className='form-group-input'>
                                                        <div className='form-input'>
                                                            <label>Estado:</label>
                                                            <input 
                                                            onChange={handleChangesAddress}
                                                            value={inputsAddress.state} 
                                                            name="state" 
                                                            type="text"/>
                                                        </div>
                                                        <div className='form-input'>
                                                            <label>Número (Opcional):</label>
                                                            <input 
                                                            onChange={handleChangesAddress}
                                                            value={inputsAddress.number} 
                                                            name="number" 
                                                            type="number"/>
                                                        </div>
                                                    </div>
                                                    
                                                    
                                                <div>
                                            </div>                                                                    
                                        </div>      
                                    </div>
                                        </div>

                                        <div className='form-section'>
                                            <div className='form-section-header'>
                                                <h3 className='form-section-title'>Outros dados</h3>
                                                <div className='hr'></div>
                                            </div>

                                            <div className='form-wrapper'>
                                                <div className='col-1'>                                 
                                                    <div className='form-input'>
                                                        <label>CTPS (Opcional):</label>
                                                        <input 
                                                        onChange={handleChangesDocument}
                                                        value={inputsDocument.ctps}  
                                                        name="ctps" 
                                                        type="number"/>
                                                    </div>   
                                                    <div className='form-input'>
                                                        <label>PIS (Opcional):</label>
                                                        <input 
                                                        onChange={handleChangesDocument} 
                                                        value={inputsDocument.pis} 
                                                        name="pis" 
                                                        type="text"/>
                                                    </div>           
                                                    {
                                                        isAdm() &&
                                                        <div className='form-input'>
                                                        <label>Salário (Opcional):</label>
                                                        <input 
                                                        onChange={handleChangesUser}
                                                        value={inputsUser.salary} 
                                                        name="salary" 
                                                        type="text"/>
                                                        </div> 
                                                    }                                                                                              
                                                </div>
                                                <div className='col-2'>                                  
                                                    <div className='form-input'>
                                                        <label>Privilégios no sistema:</label>
                                                        <select value={inputsUser.role} onChange={handleChangesUser} name="role">
                                                            <option disabled>Escolha um privilégio</option>
                                                            { isAdm() && <option value={1}>Main</option> }
                                                            { isAdm() && <option value={2}>Adm</option> }
                                                            <option value={3}>Normal</option>
                                                            <option value={4}>Parcial</option>
                                                        </select>
                                                    </div>
                                                    <div className='form-input'>
                                                        <label>CNH (Opcional):</label>
                                                        <input 
                                                        onChange={handleChangesDocument}
                                                        value={inputsDocument.cnh} 
                                                        name="cnh" 
                                                        type="text"/>
                                                    </div>  
                                                    
                                                    {
                                                        params.get('id') !== getUserId() && <div className='form-input-checkbox'>
                                                        <label>Ativo:</label>
                                                        <input 
                                                        checked={inputsUser.status !== 3 ? true : false}
                                                        onChange={handleChangesUser}
                                                        value={1} 
                                                        name="status" 
                                                        type="checkbox"/>
                                                        </div>
                                                    }
                                                    
                                                <div>
                                            </div>                                                                    
                                        </div>      
                                    </div>
                                        </div>
                                        
            
                                        <div className='group-button'>
                                        <Link className='btn-custom warning' to="/users">Cancelar</Link>
                                            <Link className='btn-custom info' to={`/users/edit?id=${params.get('id')}&copy=${params.get('copy')}`}>Voltar</Link>
                                            <button className='btn-custom btn-long success' type="submit">Completar cadastro</button>  
                                            <h4  className='panel-subtitle'>Passo 2 de 2</h4>
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
export default FormUserInfo;