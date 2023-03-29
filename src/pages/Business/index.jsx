import './Business.css';
import Layout from '../../includes/Layout';
import { Link } from 'react-router-dom';
import MsgText from '../../components/MsgText';
import { useEffect, useState } from 'react';


const Business = () => {
    const [ msg, setMsg ] = useState({});
    const [ business, setBusiness ] = useState([]);
    const [ columns, setColumns ] = useState([]);
    const [ rowsSelected, setRowsSelected ] = useState([]);
    const [ openImportModal, setOpenImportModal ] = useState(false);

    const handleArchive = (e) => {

    }

    const handleOpenMultiple = (e) => {

    }

    const handleRemove = (e) => {

    }

    const handleExcel = (e) => {

    }


    useEffect(() => {

    },[]);

    return(
        <>
        <Layout hasSidebar={true}>
        <div className='panel-header'>
            <div className='wrapper space-between'>
                <div className='wrapper'>
                    <Link to="/home"><u>Início</u> /</Link><h3>Negócios gerais</h3>
                </div>
                <Link className='btn-custom success btn-pill btn-medium'><i className='fa fa-add'></i>Novo</Link>
            </div>
            <MsgText show={msg.show} style={msg.style} content={msg.content}/>
            <div className='panel-tab'>
                <Link className='current' to="/negocios">Negócios</Link>
                <Link to="/produtos">Estoque</Link>
                <Link to="/produtos">Vendas</Link>
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
                            <Link to={`/Business/edit?id=0&copy=${rowsSelected[0]}`} className={document.querySelectorAll(".selected").length === 1 ? "btn-custom btn-medium warning" : "btn-custom btn-border btn-medium disabled-border"}><i className="fa-solid fa-copy"></i>Duplicar</Link>
                            <button onClick={handleArchive} className={rowsSelected.length > 0 ? "btn-custom btn-medium info" : "btn-custom btn-border btn-medium disabled-border"}><i className="fa-solid fa-inbox"></i>Arquivar</button>
                            <button onClick={handleOpenMultiple}  className={rowsSelected.length > 0 ? "btn-custom btn-medium warning" : "btn-custom btn-border btn-medium disabled-border"}><i className="fa-solid fa-edit"></i>Alterar dados</button>                                                     
                            <button className={rowsSelected.length > 0 ? "btn-custom btn-medium danger" : "btn-custom btn-border btn-medium disabled-border"} onClick={handleRemove}><i className="fa-solid fa-trash"></i>Excluir</button>
                            <button onClick={handleExcel} title="Excel" className="btn-custom btn-medium success"><i className="fa fa-cloud-arrow-down"></i>Exportar</button>
                            <button onClick={setOpenImportModal} title="Excel" className="btn-custom btn-medium info"><i className="fa fa-upload"></i>Importar</button>
                    </div>

                </div>
            </div>

            <div className='table-custom'>
                <table className='table-custom-01'>
                    <thead>

                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
            
        </div>


        </Layout>
        </>
    )
}

export default Business;