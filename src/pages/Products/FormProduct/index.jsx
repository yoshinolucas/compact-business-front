import { useEffect, useState } from 'react';
import { Form, Link, useNavigate, useSearchParams } from 'react-router-dom';
import './FormProduct.css';
import { register } from '../../../services/config';
import MsgText from '../../../components/MsgText';
import Layout from "../../../includes/Layout";
import api from '../../../services/api';
import { getUserId } from '../../../services/auth';

const FormProduct = () => {
    const navigate = useNavigate(); 
    const initialValues = { 
        description: undefined, 
        sku: undefined, 
        brand:undefined,
        category: undefined,
        price:0,
        measure:undefined
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
        if(inputs.description === undefined || inputs.sku === undefined) { 
            setMsg({show: true, content:"Por favor, verifique os campos obrigatórios.", style: "danger"}) 
            return false;
        }
        return true;
    }
    const productFormHandler = (e) => {
        e.preventDefault();
        if(validate()) { 
            if(params.get('id')!=='0') {
                api.post("/products/edit",{
                    ids:[inputs.id],
                    columns:[],
                    product:inputs
                }).then(res => {
                    register(getUserId(),2,1,{},inputs)
                    navigate("/produtos/edit/produto-info?id="+inputs.id);
                })
            } else {
                api.post("/products/create",inputs).then(res => {
                    register(getUserId(),2,1,{},inputs)
                    navigate("/produtos/edit/produto-info?id="+res.data);
                })
            }
        }  
    }

    useEffect(() => {
        if(params.get('msg')==='2') renderMsg("Produto atualizado com sucesso.","success");
        if(params.get('id')!=='0') {
            api.get("products/details/"+params.get('id')).then(res=>{
                setInputs(res.data);
            })
        }
       
    }, [])

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
                    <div className='form-wrapper'>                  
                    <Form
                    onSubmit={productFormHandler}
                    method='post'>
                            <h3>Dados gerais</h3>
                            <div className='hr'></div>
                            <div className='form-wrapper'>                     
                                <div className='form-input'>
                                    <label>Descrição:</label>
                                    <input 
                                    style={{border: msg.show && inputs.description === undefined ? '2px solid var(--danger)' : '1px solid var(--black05)'}} 
                                    onChange={handleChanges} 
                                    value={inputs.description || ''} 
                                    name="description" 
                                    type="text"/>
                                </div>   
                                <div className='form-input'>
                                    <label>SKU (Código Interno):</label>
                                    <input 
                                    style={{border: msg.show && inputs.sku === undefined ? '2px solid var(--danger)' : '1px solid var(--black05)'}} 
                                    onChange={handleChanges} 
                                    value={inputs.sku || ''} 
                                    name="sku" 
                                    type="text" />
                                </div> 
                                            
                            </div>
                            <div className='form-wrapper'>
                                <div className='form-group-input'>
                                    <div className='form-input'>
                                        <label>Preço de venda:</label>
                                        <input 
                                        onChange={handleChanges} 
                                        value={inputs.price || ''} 
                                        name="price" 
                                        type="text" />
                                    </div>    
                                    <div className='form-input'>
                                        <label>UM:</label>
                                        <select 
                                        onChange={handleChanges} 
                                        value={inputs.measure || ''} 
                                        name="measure" 
                                        type="text" >
                                            <option value="" disabled>Unidade de medida</option>
                                            <option value="UN">UN</option>
                                            <option value="KG">KG</option>
                                        </select>
                                    </div>    
                                </div>
                                <div className='form-input'>
                                    <label>Fabricante:</label>
                                    <input 
                                    onChange={handleChanges}
                                    value={inputs.producer || ''} 
                                    name="producer" 
                                    type="text"/>
                                </div>    
                            </div>
                            <div className='form-wrapper'>
                                <div className='form-input'>
                                    <label>Categoria:</label>
                                    <input 
                                    onChange={handleChanges} 
                                    value={inputs.category || ''} 
                                    name="category" 
                                    type="text" />
                                </div>
                                <div className='form-input'>
                                    <label>Marca:</label>
                                    <input 
                                    onChange={handleChanges} 
                                    value={inputs.brand || ''} 
                                    name="brand" 
                                    type="text" />
                                </div> 
                            </div>
                        <div className='wrapper'>
                            <Link to="/produtos" className='btn-custom warning'>Cancelar</Link>
                            <button className='btn-custom info' type="submit"><i className='fa fa-save'></i>Salvar</button>
                            <button className='btn-custom success btn-long'>Próximo passo</button>
                        </div>                  
                    </Form>
                </div> 
            </div>
        </Layout>  
        </>
    );
}
export default FormProduct;