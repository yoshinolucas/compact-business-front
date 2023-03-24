import './Accesses.css';
import Layout from '../../includes/Layout';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatDate } from '../../services/config';
import MsgText from '../../components/MsgText';


const Accesses = () => {
    const [ msg, setMsg ] = useState({show:false});
    const [ accesses, setAccesses ] = useState([]);
    const [ infoTable, setInfoTable ] = useState({maxItems:15, currentPage:1, filters:{},search:""})
    const [ columns, setColumns ] = useState([]);
    const [ openModal, setOpenModal ] = useState(false);
    const [ accessesSelected, setAccessesSelected ] = useState([]);
    const [ params ] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(params.get('msg')==='3') setMsg({show:true,content:"Histórico limpo com sucesso.", style:"info"})
        
        api.post("/accesses/pages",infoTable).then(res=> {
            setAccesses(res.data.accesses);    
            setInfoTable(v=>({
                ...v,
                currentPageLength: res.data.currentPageLength
            }))  
        });
        
    },[]);

    const handleSelected = (e) => {
        setMsg({show:false});   
        var access = e.target.tagName === 'TD' ?
        e.target.parentElement  :
        e.target.parentElement.tagName === 'TD' ?  e.target.parentElement.parentElement : 
        null;

        var checkbox = e.target.tagName === 'TD' ?
        e.target.children[0] : 
        e.target.parentElement.tagName === 'TD' ? e.target : 
        null;

        if(access === null && checkbox === null) {
            var rows = document.querySelectorAll("tbody tr");
            setAccessesSelected([]); 
            var allCheckbox = e.target;
            if(allCheckbox.checked) {                               
                for(let i = 0; i < rows.length; i++) {
                    rows[i].className = "selected"
                    checkbox = rows[i].children[0].children[0];
                    checkbox.checked = true;              
                    setAccessesSelected(values => [...values,parseFloat(rows[i].id)]);                   
                }
            } else {
                for(let i = 0; i < rows.length; i++) {
                    rows[i].className = ""
                    checkbox = rows[i].children[0].children[0];
                    checkbox.checked = false;
                }
            }             
        } else {
            if(access.classList.contains('selected')) {
                checkbox.checked = false;
                access.className = "";     
                setAccessesSelected(values => values.filter(value => value !== parseFloat(access.id)))          
            } else { 
                checkbox.checked = true;
                access.className = "selected";
                setAccessesSelected(values => [...values,parseFloat(access.id)])
            }
        }
    }

    const handleRemove = (e) => {
        api.post("/accesses/delete",{ids:accessesSelected}).then(
            res=> {
                navigate("/acessos?msg=3");
                window.location.reload(false);
            }
        );
    }

    const handleRemoveAll = (e) => {
        api.post("/accesses/deleteall",{ids:accessesSelected});
    }


    return(
        <>
        <Layout hasSidebar={true} background={'var(--panel)'}>
        <div className='panel-header'>
            <div className='panel-header-wrapper'>
                <div className='panel-title'> 
                <Link to="/home"><h4><u>Início</u></h4></Link> <h4>&nbsp;&nbsp;&gt;&nbsp; </h4> <h3> Histórico de acessos</h3>
                </div>
            </div>
            <MsgText show={msg.show} content={msg.content} style={msg.style}/>
            <hr />
        </div>


        <div className='panel-body'>
            <section>
                <div className='section'>
                    <div className='section-header'>
                        <h4>Ferramentas</h4>
                    </div>
                    <div className='section-body'>
                        <div className='section-wrapper'>
                            <button onClick={handleRemove} className={`btn-custom ${accessesSelected.length > 0 ? 'danger':'btn-border  disabled-border'}`}><i className='fa fa-trash'></i>Limpar</button>
                            <button onClick={handleRemoveAll} className={`btn-custom danger btn-medium`}><i className='fa fa-trash'></i>Limpar tudo</button>
                        </div>

                    </div>
                </div>
            </section>
            <section>
            <div className='table-custom'>
                <div className='table-wrapper'>
                <table>
                    <thead>
                        <tr>
                            <th id="user_all"><input 
                            onChange={()=>{}}
                            checked={accessesSelected.length == infoTable.currentPageLength ? true : false}
                            onClick={handleSelected} type="checkbox"
                            /></th>
                            <th>Usuário Id</th>
                            <th>Nome</th>
                            <th>Nome de usuário</th>
                            <th>Data de acesso</th>
                            <th>Data de saída</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            accesses.map((access, i) => {
                                return(
                                    <tr id={access.id} key={i}>
                                        <td onClick={handleSelected}><input type="checkbox"/></td>
                                        <td>{access.userId}</td>
                                        <td>{access.user.name}</td>
                                        <td>{access.user.username}</td>
                                        <td>{formatDate(access.login_at)}</td>
                                        <td>{access.logout_at ? formatDate(access.logout_at) : ""}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                </div>
            </div>  
            </section>
        </div>


        </Layout>
        </>
    )
}

export default Accesses;