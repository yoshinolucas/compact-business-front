import './Products.css';
import Layout from '../../includes/Layout';
import { Link,useNavigate } from 'react-router-dom';
import MsgText from '../../components/MsgText';
import { useEffect, useState } from 'react';
import api from '../../services/api';


const Products = () => {
    const defaultFilters = {
        status: [1,2],
        teams: [],
        date: -1,
        archived: false,
        date_range: ['1909-01-01','2100-01-01'],
        order: ''
    };
    const defaultColumnsShow = [false,true, true, true, true, true,false,false,false];
    const [ msg, setMsg ] = useState({});
    const [ products, setProducts ] = useState([{}]);
    const [ columns, setColumns ] = useState([]);
    const [ rowsSelected, setRowsSelected ] = useState([]);
    const [ openImportModal, setOpenImportModal ] = useState(false);
    const [infoRecords, setInfoRecords ] = useState({maxItems:20, currentPage: 1});
    const navigate = useNavigate();
    const [filters, setFilters ] = useState(defaultFilters);
    const [ search, setSearch ] = useState("");

    const handleArchive = (e) => {

    }

    const handleOpenMultiple = (e) => {

    }

    const handleRemove = (e) => {

    }

    const handleExcel = (e) => {

    }

    const handleSelected = (e) => {

    }


    useEffect(() => {
        api.get("/products/pages",infoRecords).then(res => setProducts(res.data));
    },[]);

    return(
        <>
        <Layout hasSidebar={true}>
        <div className='panel-header'>
            <div className='panel-header-wrapper'>
                <div className='panel-title'> 
                    <Link to="/home"><h4><u>Início</u></h4></Link> <h4>&nbsp;&nbsp;&gt;&nbsp; </h4> <h3> Estoque / Produtos</h3>
                    <Link to="/produtos"></Link>
                </div>
                    <Link className='btn-custom success btn-pill btn-medium'><i className='fa fa-add'></i>Novo</Link>
            </div>
            <MsgText show={msg.show} style={msg.style} content={msg.content}/>
            <div className='panel-tab'>
                <Link to="/negocios">Negócios</Link>
                <Link className='current' to="/produtos">Estoque</Link>
                <Link to="/produtos">Vendas</Link>
                <Link to="/produtos">Clientes</Link>
                <Link to="/produtos">Notas fiscais</Link>
            </div> 
        </div>


        <div className='panel-body'>
            <div className='section'>
                <div className='section-header'>
                    <h4>Ferramentas</h4>
                </div>
                <div className='section-body'>
                    <div className='section-wrapper'>
                        <Link to={`/Products/edit?id=0&copy=${rowsSelected[0]}`} className={document.querySelectorAll(".selected").length === 1 ? "btn-custom btn-medium warning" : "btn-custom btn-border btn-medium disabled-border"}><i className="fa-solid fa-copy"></i>Duplicar</Link>
                        <button onClick={handleArchive} className={rowsSelected.length > 0 ? "btn-custom btn-medium info" : "btn-custom btn-border btn-medium disabled-border"}><i className="fa-solid fa-inbox"></i>Arquivar</button>
                        <button onClick={handleOpenMultiple}  className={rowsSelected.length > 0 ? "btn-custom btn-medium warning" : "btn-custom btn-border btn-medium disabled-border"}><i className="fa-solid fa-edit"></i>Alterar dados</button>                                                     
                        <button className={rowsSelected.length > 0 ? "btn-custom btn-medium danger" : "btn-custom btn-border btn-medium disabled-border"} onClick={handleRemove}><i className="fa-solid fa-trash"></i>Excluir</button>
                        <button onClick={handleExcel} title="Excel" className="btn-custom btn-medium success"><i className="fa fa-cloud-arrow-down"></i>Exportar</button>
                        <button onClick={setOpenImportModal} title="Excel" className="btn-custom btn-medium info"><i className="fa fa-upload"></i>Importar</button>
                    </div>

                </div>
            </div>

            <div className='table-custom'>
                <div className="table-wrapper">
                        <table className="table-custom-01">
                            <thead>
                                <tr>
                                    <th id="products_all"><input 
                                    onChange={() => {}} 
                                    checked={rowsSelected.length === infoRecords.currentPageLength ? true : false} 
                                    type="checkbox" 
                                    onClick={handleSelected}
                                    /></th>
                                    {/* {columns.show.map((column,i) => <th key={`showColumn-${i}`} className={columns.show[i] ? "" : "hidden"}>{columns.header[i]}</th>)} */}
                                </tr>
                            </thead>
                            <tbody>
                                {/* {products.map((product, i) => {
                                    return(
                                        <tr onClick={e => navigate(`/products/edit?id=${e.target.parentElement.id}&copy=0`)} key={`producst-${i}`} id={product.id}>
                                            <td onClick={e => { e.stopPropagation(); handleSelected(e) }}><input type="checkbox" /></td>
                                            <td className={columns.show[0] ? "" : "hidden"}></td>
                                            <td className={columns.show[1] ? "" : "hidden"}></td>
                                            <td className={columns.show[2] ? "" : "hidden"}></td>
                                            <td className={columns.show[3] ? "" : "hidden"}></td>
                                            <td className={columns.show[4] ? "" : "hidden"}></td>
                                            <td className={columns.show[5] ? "" : "hidden"}></td>
                                            <td className={columns.show[6] ? "" : "hidden"}></td>
                                            <td className={columns.show[7] ? "" : "hidden"}></td>
                                            <td className={columns.show[8] ? "" : "hidden"}></td>
                                        </tr>
                                    );
                                })}                                          */}
                            </tbody>
                        </table>
                </div>
            </div>
            
        </div>


        </Layout>
        </>
    )
}

export default Products;