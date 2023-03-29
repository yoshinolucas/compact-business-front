import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MsgText from "../../../components/MsgText";
import Layout from "../../../includes/Layout";
import Modal from "../../../components/Modal";
import api from "../../../services/api";
import { formatDate, TIPOS } from "../../../services/config";

const DetailsProduct = () => {

    const defaultInputsValue = {
        productId:undefined,
        amount:undefined,
        trade_date:undefined,
        price:undefined,
        type:undefined
    }
    const navigate = useNavigate();
    const [ infoRecords, setInfoRecords ] = useState({maxItems:15,currentPage:1});
    const [ msg, setMsg ] = useState({show:false});
    const [ msgModal, setMsgModal ] = useState({show:false});
    const [ params ] = useSearchParams(); 
    const [ openNewProductRelease, setOpenNewProductRealease ] = useState(false);
    const [ openDelete, setOpenDelete ] = useState(false);
    const [ inputs, setInputs ] = useState(defaultInputsValue);
    const [ productsTrades , setProductsTrades ] = useState([]);
    const [ rowsSelected, setRowsSelected ] = useState([]);

    const renderMsg = (content,style) => {
        setMsg({show:true,content:content,style:style})
        setTimeout(()=>{
            setMsg({show:false})
        },2000)  
    }

    useEffect(() => {
        if(params.get("msg") === '1') renderMsg("Novo lançamento incluído com sucesso.","success");
        if(params.get("msg") === '2') renderMsg("Produto atualizado com sucesso.","info");
        var data = infoRecords;
        data.filters = {id:parseFloat(params.get('id'))};
        api.post("/products/trades/pages",data).then(res=> {
            setInfoRecords(v => ({...v,
                totalAmount: res.data.totalAmount,
                totalIn : res.data.totalIn,
                totalOut: res.data.totalOut,
                totalPrice: res.data.totalPrice,
                totalPriceIn: res.data.totalPriceIn,
                totalPriceOut: res.data.totalPriceOut
            }))
            setProductsTrades(res.data.productsTrades)
        });

        api.get("/products/details/"+params.get("id")).then(res => {
            setInfoRecords(v=>({...v,
                title:res.data.description,
                sale_price: res.data.price,
                measure: res.data.measure
            }))
        })
            
    },[]);

    const handleOpenDelete = (e) => {
        setOpenDelete(true);
        setRowsSelected([parseFloat(e.target.parentElement.parentElement.parentElement.id)]);
    }

    const handleDeleteConfirm = () => {
        api.post("/products/trades/delete",{ids:rowsSelected}).then(res=>{
            navigate(`/produtos/detalhes?id=${params.get('id')}&msg=2`);
            window.location.reload(false);
        })
    }

    const handleChanges = (e) => {
        setInputs(v=>({...v,[e.target.name]:e.target.value}))
    }

    const handleOpenNewProductRealease = () => {
        setInputs(v=>({...v,productId:parseFloat(params.get("id"))}))
        setOpenNewProductRealease(true);
    }

    const validate = () => {
        if(inputs.amount === undefined || inputs.price === undefined || inputs.trade_date === undefined) {
            setMsgModal({show:true,content:"Verifique os campos obrigatórios",style:"danger"})
            return false
        } 
        return true;
    }

    const handleProductNewRealease = (e) => {
        e.preventDefault();
        if(validate()) {
            api.post("/products/trades/register",inputs).then(res=>{
                navigate(`/produtos/detalhes?id=${params.get('id')}&msg=1`);
                window.location.reload(false);
            })
        }
    }

    return(
        <>
        <Layout>
        <div className='panel-header'>
            <div className='wrapper space-between'>
                <div className='wrapper'> 
                    <Link to="/produtos"><p><u>Estoque</u> /</p></Link>
                    <h3>{infoRecords.title}</h3>
                    <Link to={"/produtos/edit?id="+params.get('id')}><i className='fa fa-edit'></i></Link>
                </div>
                <div className="wrapper">
                    <button onClick={handleOpenNewProductRealease} className='btn-custom success btn-pill btn-long'><i className='fa fa-add'></i>Novo lançamento</button>
                </div>
            </div>
            <MsgText show={msg.show} style={msg.style} content={msg.content}/>
        </div>


        <div className='panel-body'>
            <section>
                <div className='cards'>
                    <div className='card'>
                    <div className="card-header">
                        <h4>Saldo</h4>
                        </div>
                        <div className="card-body">
                            <h2 style={{color:infoRecords.totalPrice > 0 ? "var(--success)" : "var(--danger)"}}>R$ {infoRecords.totalPrice > 0 ? '+' : ''}{infoRecords.totalPrice}</h2>
                        </div>
                    </div>
                    <div className='card'>
                        <div className="card-header">
                            <h4>Quantidade atual</h4>
                        </div>
                        <div className="card-body">
                            <h2>{infoRecords.totalAmount}</h2>
                        </div>
                    </div>
                    <div className='card'>
                        <div className="card-body">
                            <p><b>{infoRecords.totalIn}</b>entrada(s) (R$ {infoRecords.totalPriceIn})</p>
                            <p><b>{infoRecords.totalOut}</b>saída(s) (R$ {infoRecords.totalPriceOut})</p>
                        </div> 
                    </div>
                </div>       
            </section>
            <div className='table-custom'>
                <div className="table-wrapper">
                        <table className="table-custom-01">
                            <thead>
                                <tr>
                                    <th>Quantidade</th>
                                    <th>Custo unitário</th>
                                    <th>Tipo</th>
                                    <th>Data do lançamento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    productsTrades.map((trade,i) => {
                                        return(
                                            <tr id={trade.id} key={i}>
                                                <td>{trade.amount}</td>
                                                <td>R$ {trade.price}</td>
                                                <td style={{
                                                    fontWeight:"600",
                                                    color:trade.type == 1 ? "var(--success)":"var(--danger)"}
                                                }>{TIPOS[trade.type]}</td>
                                                <td>{formatDate(trade.trade_date)}<div className="options-hidden"><i onClick={handleOpenDelete} className="fa fa-trash"></i></div></td>
                                                
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                </div>
            </div>
            <Modal setIsOpen={setOpenNewProductRealease} isOpen={openNewProductRelease}>
                <div className="modal-content">
                    <MsgText show={msgModal.show} content={msgModal.content} style={msgModal.style}/>
                    <h4>Dados do lançamento</h4>                        
                    <div className="form-wrapper">
                        <div className="form-input">
                            <label>Tipo</label>
                            <select defaultChecked="" onChange={handleChanges} name="type">
                                <option value="">Escolha um tipo de lançamento</option>
                                <option value={1}>Entrada</option>
                                <option value={2}>Saída</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-wrapper">
                        <div className="form-group-input">
                            <div className="form-input">
                                <label>Quantidade</label>
                                <input name="amount" onChange={handleChanges} type="number" value={inputs.amount || ''} />
                            </div>
                            <div className="form-input">
                                <label>UM</label>
                                <input value={infoRecords.measure || ''} readOnly/>
                            </div>
                        </div>
                    </div>
                    <div className="form-wrapper">
                        <div className="form-group-input">
                            <div className="form-input">
                                <label>Custo unitário</label>
                                <input onChange={handleChanges} name="price" value={inputs.price || ''} />
                            </div>
                            <div className="form-input">
                                <label>Valor de venda</label>
                                <input value={infoRecords.sale_price || ''} readOnly/>
                            </div>
                        </div>
                    </div>
                    <div className="form-wrapper">
                        <div className="form-input">
                            <label>Data/Hora do lançamento</label>
                            <input onChange={handleChanges} name="trade_date" value={inputs.trade_date || ''} type="datetime-local"/>
                        </div>
                    </div>
                    <div className="wrapper">
                        <button onClick={e=>setOpenNewProductRealease(false)} className="btn-custom warning">Cancelar</button>
                        <button onClick={handleProductNewRealease} type="submit" className="btn-custom success"><i className="fa fa-save"></i>Salvar</button>
                    </div>                 
                </div>
            </Modal>    

            <Modal setIsOpen={setOpenDelete} isOpen={openDelete}>
                <h4>Deseja excluir o item selecionado?</h4>
                <div className="wrapper">
                    <button onClick={e=>setOpenDelete(false)} className="btn-custom warning">Cancelar</button>
                    <button onClick={handleDeleteConfirm} className="btn-border danger-border">Confirmar</button>
                </div>
            </Modal>
        </div>
        


        </Layout>
        </>
    )
}

export default DetailsProduct;