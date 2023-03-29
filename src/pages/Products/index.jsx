import './Products.css';
import Layout from '../../includes/Layout';
import { Link,useNavigate, useSearchParams } from 'react-router-dom';
import MsgText from '../../components/MsgText';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import SearchInput from '../../components/SearchInput';
import * as XLSX from "xlsx/xlsx.mjs";

const Products = () => {
    const defaultFilters = {
        status: [1,2],
        teams: [],
        date: -1,
        archived: false,
        date_range: ['1909-01-01','2100-01-01'],
        order: ''
    };

    const defaultColumnsName = ['Id','Descrição','SKU', 'Categoria','Preço de venda','UM','Data de cadastro', 'Última atualização'];
    const defaultColumnsShow = [false,true, true, true, true,true,false,false];
    const [ msg, setMsg ] = useState({show:false});
    const [ columns, setColumns ] = useState(
        {
            header: defaultColumnsName,
            show: defaultColumnsShow
        }
    )

    const [ openFiltersMenu, setOpenFiltersMenu ] = useState(false);
    const [ params ] = useSearchParams();
    const [ rowsSelected, setRowsSelected ] = useState([]);
    const [ openDeleteModal, setOpenDeleteModal ] = useState(false);
    const [products, setProducts ] = useState({maxItems:10, currentPage: 1, list: [],search:""});
    const navigate = useNavigate();
    
    const [ pages, setPages ] = useState([1,2,3])

    const handlePages = (e) => {
        var max = products.totalPages;
        if(e.target.id === 'previous') {
            if( pages[0] > 1 ) setPages([pages[0] - 1, pages[1] - 1, pages[2] - 1]);
            setProducts(v=> ({...v,currentPage:products.currentPage-1}));
        } else {
            if( pages[0] + 2 < max ) setPages([pages[0] + 1, pages[1] + 1, pages[2] + 1]);
            setProducts(v=> ({...v,currentPage:products.currentPage+1}));
        }
        
    }


    const handleDelete = (e) => {
        api.post("/products/delete",{ids:rowsSelected}).then(res=>{
            navigate("/produtos?msg=1");
            window.location.reload(false);
        });
    }

    const handleExcel = (e) => {
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(products.list);
        XLSX.utils.book_append_sheet(wb,ws,"Produtos");

        XLSX.writeFile(wb,"produtos.xlsx");
    }

    const handleSelected = (e) => {  
        var product = e.target.tagName === 'TD' ?
        e.target.parentElement  :
        e.target.parentElement.tagName === 'TD' ?  e.target.parentElement.parentElement : 
        null;

        var checkbox = e.target.tagName === 'TD' ?
        e.target.children[0] : 
        e.target.parentElement.tagName === 'TD' ? e.target : 
        null;

        if(product === null && checkbox === null) {
            var rows = document.querySelectorAll("tbody tr");
            setRowsSelected([]); 
            var allCheckbox = e.target;
            if(allCheckbox.checked) {                               
                for(let i = 0; i < rows.length; i++) {
                    rows[i].className = "selected"
                    checkbox = rows[i].children[0].children[0];
                    checkbox.checked = true;              
                    setRowsSelected(values => [...values,parseFloat(rows[i].id)]);                   
                }
            } else {
                for(let i = 0; i < rows.length; i++) {
                    rows[i].className = ""
                    checkbox = rows[i].children[0].children[0];
                    checkbox.checked = false;
                }
            }             
        } else {
            if(product.classList.contains('selected')) {
                checkbox.checked = false;
                product.className = "";     
                setRowsSelected(values => values.filter(value => value !== parseFloat(product.id)))          
            } else { 
                checkbox.checked = true;
                product.className = "selected";
                setRowsSelected(values => [...values,parseFloat(product.id)])
            }
        }

    }

    const renderMsg = (content,style) => {
        setMsg({show:true,content:content,style:style})
        setTimeout(()=>{
            setMsg({show:false})
        },2000);
    }

    const renderNumPages = () => {
        let result = [];
        var len = 3 < products.totalPages ? 3 : products.totalPages;
        if(products.currentPage !== 1) {
        result.push(
            <button key={-2} id='previous' className="btn-custom btn-rounded" onClick={(e) => {
                handlePages(e);
                handleSelected(e)
            }}>
            <i id='previous' className="fa fa-angle-left"></i>
            </button>);
        }
        for(var i = 1; i <= len; i++) {
            result.push(<button key={i} id={pages[i-1]} onClick={(e)=>{
                setProducts(v=>({...v,currentPage:parseFloat(e.target.id)}));
                handleSelected(e)
            }} className={`btn-custom btn-rounded ${products.currentPage == pages[i-1] ? '' : 'secondary03'}`}>{pages[i-1]}</button>)
        }
        if(products.currentPage !== products.totalPages){
        result.push(
            <button key={-3} id='next' className="btn-custom btn-rounded" onClick={(e) => {
                handlePages(e);
                handleSelected(e);
            }}>
            <i id='next' className="fa fa-angle-right"></i>
            </button>);
        }
        return result;
    }

    useEffect(() => { 
        var data = {
            currentPage:products.currentPage,
            maxItems:products.maxItems,
            filters:products.filters,
            search: products.search
        };
        if(params.get('msg') === '1') renderMsg("Produto cadastrado com sucesso.","success");
        params.delete('msg');
        api.post("/products/pages",data).then(res => {
            setProducts(res.data)
        });
    },[products.currentPage,products.search]);

    return(
        <>
        <Layout hasSidebar={'true'}>
        <div className='panel-header'>
            <div className='wrapper space-between'>
                <div className='wrapper'>
                    <Link to="/inicio"><u>Inicio</u> /</Link><h3>Controle de estoque</h3>
                </div>
                <div className='wrapper'>
                    <button onClick={handleExcel} title="Excel" className="btn-custom btn-border btn-pill btn-medium"><i className="fa fa-cloud-arrow-down"></i>Exportar</button>
                    <Link to="/produtos/edit?id=0" className='btn-custom success btn-pill btn-medium'><i className='fa fa-add'></i>Novo</Link>
                </div>
                
            </div>
            <MsgText show={msg.show} style={msg.style} content={msg.content}/>
        </div>


        <div className='panel-body'>
            <div className='table-custom'>
                <div className="wrapper space-between table-custom-info">
                    <div className='wrapper'>
                        <button className={rowsSelected.length > 0 ? "btn-icon danger-border" : "btn-icon disabled-border"} onClick={e=>setOpenDeleteModal(true)}><i className="fa-solid fa-trash"></i></button>
                        <Link className={rowsSelected.length === 1 ? "btn-icon warning-border" : "btn-icon disabled-border"}><i className="fa-solid fa-copy"></i></Link>
                    </div>
                    <div className='wrapper'>
                        <SearchInput setCurrentPage={setProducts} handleSelected={handleSelected} setPages={setPages} search={products.search} setSearch={setProducts}/>
                        <div className='dropdown'>
                            <button onClick={e=>setOpenFiltersMenu(!openFiltersMenu)} className='btn-border'><i className='fa fa-filter'></i>Filtros</button>
                            {   openFiltersMenu &&
                                <div className='menu'>
                                    <div className='wrapper space-between'>
                                        <i style={{color:'var(--secondary03)'}} onClick={e=>openFiltersMenu(false)} className='fa fa-arrow-left'></i>
                                        <button className='btn-border btn-min btn-pill'>Redefinir</button>
                                    </div>
                                    
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="table-wrapper">
                    <table className="table-custom-01">
                        
                        <thead>
                            <tr>
                                <th id="products_all"><input 
                                onChange={() => {}} 
                                checked={rowsSelected.length === products.currentPageLength ? true : false} 
                                type="checkbox" 
                                onClick={handleSelected}
                                /></th>
                                {columns.show.map((column,i) => <th key={`showColumn-${i}`} className={columns.show[i] ? "" : "hidden"}>{columns.header[i]}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {products.list.map((product, i) => {
                                return(
                                    <tr onClick={e => navigate(`/produtos/detalhes?id=${e.target.parentElement.id}&copy=0`)} key={`producst-${i}`} id={product.id}>
                                        <td onClick={e => { e.stopPropagation(); handleSelected(e) }}><input type="checkbox" /></td>
                                        <td className={columns.show[0] ? "" : "hidden"}>{product.id}</td>
                                        <td className={columns.show[1] ? "" : "hidden"}>{product.description}</td>
                                        <td className={columns.show[2] ? "" : "hidden"}>{product.sku}</td>
                                        <td className={columns.show[3] ? "" : "hidden"}>{product.category}</td>
                                        <td className={columns.show[4] ? "" : "hidden"}>{product.price}</td>
                                        <td className={columns.show[5] ? "" : "hidden"}>{product.measure}</td>
                                        <td className={columns.show[6] ? "" : "hidden"}>{product.created_at}</td>
                                        <td className={columns.show[7] ? "" : "hidden"}>{product.updated_at}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className='wrapper space-between mt'>
                        <h5>Total de {products.totalRecords} registros</h5>
                        <div className='wrapper'>
                            {renderNumPages()}
                        </div>
                    </div>
                </div>
            </div>
            <Modal isOpen={openDeleteModal} setIsOpen={setOpenDeleteModal}>
                <h3 className='mt-2'>Tem certeza que deseja excluir {rowsSelected.length} usuário(s) do sistema?</h3>
                <div className="wrapper mt-2">
                    <button onClick={() => setOpenDeleteModal(false)} className="btn-custom warning">Cancelar</button>
                    <button onClick={handleDelete} className="btn-custom success">Confirmar</button>
                </div>
            </Modal>
        </div>


        </Layout>
        </>
    )
}

export default Products;