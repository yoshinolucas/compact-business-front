import './Records.css';
import Layout from '../../includes/Layout';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ACTIONS, formatDate, SECTIONS } from '../../services/config';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import Modal from '../../components/Modal';
import MsgText from '../../components/MsgText';


const Records = () => {
    const [ msg, setMsg ] = useState({show:false});
    const [ records, setRecords ] = useState([]);
    const [ infoTable, setInfoTable ] = useState({maxItems:15, currentPage:1, filters:{},search:""})
    const [ columns, setColumns ] = useState([]);
    const [ openModal, setOpenModal ] = useState(false);
    const [ recordSelected, setRecordSelected ] = useState({});
    const [ rowsSelected, setRowsSelected ] = useState([]);
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const renderMsg = (content,style) => {
        setMsg({show:true,content:content,style:style})
        setTimeout(()=>{
            setMsg({show:false})
        },2000)
        
    }
    useEffect(() => {
        if(params.get("msg")==='1') renderMsg("Registros apagados com sucesso.","success");
        api.post("/records/pages",infoTable).then(res=> {
            setInfoTable(v => ({
                ...v,
                maxItems:res.data.maxItems,
                currentPage:res.data.currentPage,
                filters:res.data.filters,
                currentPageLength:res.data.currentPageLength,
                search:res.data.search
            }));
            setRecords(res.data.records)
        });
    },[]);

    const handleRecordSelected = (id) => {
        setRecordSelected(records.find(record => record.id === id));
    }

    const handleRemove = (e) => {
        api.post("/records/delete",{ids:rowsSelected}).then(res=>{
            navigate("/alteracoes?msg=1")
            window.location.reload(false);
        })
    }

    const handleSelected = (e) => {
        setMsg({show:false});   
        var row = e.target.tagName === 'TD' ?
        e.target.parentElement  :
        e.target.parentElement.tagName === 'TD' ?  e.target.parentElement.parentElement : 
        null;

        var checkbox = e.target.tagName === 'TD' ?
        e.target.children[0] : 
        e.target.parentElement.tagName === 'TD' ? e.target : 
        null;

        if(row === null && checkbox === null) {
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
            if(row.classList.contains('selected')) {
                checkbox.checked = false;
                row.className = "";     
                setRowsSelected(values => values.filter(value => value !== parseFloat(row.id)))          
            } else { 
                checkbox.checked = true;
                row.className = "selected";
                setRowsSelected(values => [...values,parseFloat(row.id)])
            }
        }
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
            <div className='wrapper'>
            <Link to="/home"><p><u>Início</u>/</p></Link><h3> Histórico de alterações</h3>
            </div>
            <MsgText show={msg.show} content={msg.content} style={msg.style}/>
        </div>


        <div className='panel-body'>
            <div className='table-custom'>
                <div className='wrapper space-between'>
                    <button onClick={handleRemove} className={`btn-custom ${rowsSelected.length > 0 ? 'btn-icon danger':'btn-icon disabled-border'}`}><i className='fa fa-trash'></i></button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th><input
                            onChange={()=>{}}
                            checked={infoTable.currentPageLength === rowsSelected.length}
                            onClick={handleSelected} type="checkbox"/></th>
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
                                        <td onClick={e=>{e.stopPropagation(); handleSelected(e)}}><input onChange={()=>{}} type="checkbox"/></td>
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