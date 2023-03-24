import './Records.css';
import Layout from '../../includes/Layout';
import { Link } from 'react-router-dom';
import { ACTIONS, formatDate, SECTIONS } from '../../services/config';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';


const Records = () => {
    const [ msg, setMsg ] = useState({});
    const [ records, setRecords ] = useState([]);
    const [ infoTable, setInfoTable ] = useState({maxItems:15, currentPage:1, filters:{},search:""})
    const [ columns, setColumns ] = useState([]);
    const [ openModal, setOpenModal ] = useState(false);
    const [ recordSelected, setRecordSelected ] = useState({});

    useEffect(() => {
        api.post("/records/pages",infoTable).then(res=> {
            setRecords(res.data.records)
        });
    },[]);

    const handleRecordSelected = (id) => {
        setRecordSelected(records.find(record => record.id === id));
    }

    const render = (obj,role) => {
        var result = [];
        Object.entries(recordSelected).map(([k,v]) => {
            if(k===role) {
                const obj = JSON.parse(v);
                Object.entries(obj).map(([k,v],i) => {
                    if(k==='ids') {
                        result.push(<tr key={i}><td>{k}</td><td>{v.toString()}</td></tr>)
                    } else{
                        result.push(<tr key={i}><td>{k}</td><td>{v}</td></tr>)
                }})
                
            }
        })
        return result;
    }

    return(
        <>
        <Layout hasSidebar={true} background={'var(--panel)'}>
        <div className='panel-header'>
            <div className='panel-header-wrapper'>
                <div className='panel-title'> 
                <Link to="/home"><h4><u>Início</u></h4></Link> <h4>&nbsp;&nbsp;&gt;&nbsp; </h4> <h3> Histórico de alterações</h3>
                </div>
            </div>
            <hr />
        </div>


        <div className='panel-body'>
            <div className='table-custom'>
                <table className='table-custom-01'>
                    <thead>
                        <tr>
                            <th>Seção</th>
                            <th>Usuário</th>
                            <th>Ação</th>
                            <th>Data do registro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            records.map((record, i) => {
                                return(
                                    <tr onClick={e => {
                                        handleRecordSelected(parseFloat(e.target.parentElement.id));
                                        setOpenModal(true);
                                    }} id={record.id} key={i}>
                                        <td>{SECTIONS[record.section]}</td>
                                        <td>{record.userId}</td>                              
                                        <td>{ACTIONS[record.action]}</td>
                                        <td>{formatDate(record.registered_at)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>  
            <Modal isOpen={openModal} setIsOpen={setOpenModal}>
                    <div className='modal-records'>
                        <div className='modal-records-number'>
                            <h5>Registro N° {recordSelected.id}</h5>
                        </div>
                        <div className='modal-records-wrapper'>
                            <div>
                                <h4>Antes</h4>
                                <table className='before'>
                                    <tbody>
                                    {render(recordSelected,'before')}
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <h4>Depois</h4>
                                <table className='after'>
                                    <tbody>
                                    {render(recordSelected,'after')}   
                                    </tbody> 
                                </table>                       
                            </div>
                        </div>                     
                    </div>
            </Modal> 
        </div>


        </Layout>
        </>
    )
}

export default Records;