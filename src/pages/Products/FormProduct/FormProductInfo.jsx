import { useEffect, useState } from 'react';
import { Form, Link, useNavigate, useSearchParams } from 'react-router-dom';
import './FormProductInfo.css';
import { register } from '../../../services/config';
import MsgText from '../../../components/MsgText';
import Layout from "../../../includes/Layout";
import api from '../../../services/api';
import { getUserId } from '../../../services/auth';

const FormProductInfo = () => {
    const navigate = useNavigate(); 
    const initialValues = { 
        image:undefined,
    };
    const [ msg, setMsg ] = useState({show: false});
    const [ inputs, setInputs ] = useState(initialValues);
    const [ params ] = useSearchParams();

    const renderMsg = (content,style) => {
        setMsg({show:true,content:content,style:style})
        setTimeout(()=>{
            setMsg({show:false})
        },2000)
        
    }
 
    const handleChanges = (e) => {
        const { name, value } = e.target;
        setInputs(values => ({...values,[name]:value}));
    }

    const validate = () => {
        
    }
    const productFormHandler = (e) => {
        
    }

    useEffect(() => {
        console.log(inputs)
        
       
    }, [inputs.image])

    return(
        <>
        <Layout>
            <div className='panel-header'>   
                <div className='panel-title'>
                    <Link to="/produtos"><i className='fa fa-arrow-left'></i></Link>
                    <h3>{params.get("id") > 0 ? 'Editar Produto' : 'Novo Produto'}</h3>
                </div>
                <MsgText show={msg.show} style={msg.style} content={msg.content}/>
            </div>
            <div className='panel-body'>
                <div className='form-wrapper '>    
                    <Form
                    onSubmit={productFormHandler}
                    method='post'>
                        <h3>Dados gerais</h3>
                        <div className='hr'></div>
                        <div className='form-wrapper'>
                            <img className='photo-demo' src={`/img/${inputs.image ?? "login-banner.jpg"}`} width="300" height="200" alt="imagem-produto"/>
                            <div className='form-input'>
                                <label>Imagem</label>
                                <input type="file" name="image" onChange={e=>setInputs(v=>({...v,image:e.target.files[0].name}))}/>
                            </div>
                            <div className='form-input'>
                                <label>Descrição para anúncios</label>
                                <textarea />
                            </div>
                            <div className='form-input'>
                                <label>Tags</label>
                                <select multiple/>
                            </div>
                        </div>
                            
                        <div className='wrapper'>
                            <Link to="/produtos" className='btn-custom warning'>Cancelar</Link>
                            <button className='btn-custom info' type="submit"><i className='fa fa-save'></i>Salvar</button>
                            <button className='btn-custom success btn-long' type="submit">Próximo passo</button>
                        </div>                  
                    </Form>
                </div> 
            </div>
            
        </Layout>  
        </>
    );
}
export default FormProductInfo;