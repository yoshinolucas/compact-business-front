import './Accesses.css';
import Layout from '../../includes/Layout';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import { formatDate } from '../../services/config';


const Accesses = () => {
    const [ msg, setMsg ] = useState({});
    const [ accesses, setAccesses ] = useState([]);
    const [ infoTable, setInfoTable ] = useState({maxItems:15, currentPage:1, filters:{},search:""})
    const [ columns, setColumns ] = useState([]);
    const [ openModal, setOpenModal ] = useState(false);
    const [ AccessesSelected, setAccessesSelected ] = useState({});

    useEffect(() => {
        api.post("/accesses/pages",infoTable).then(res=> {
            console.log(res.data)
            setAccesses(res.data.accesses)
        });
    },[]);


    return(
        <>
        <Layout hasSidebar={true} background={'var(--panel)'}>
        <div className='panel-header'>
            <div className='panel-header-wrapper'>
                <div className='panel-title'> 
                <Link to="/home"><h4><u>Início</u></h4></Link> <h4>&nbsp;&nbsp;&gt;&nbsp; </h4> <h3> Histórico de acessos</h3>
                </div>
            </div>
            <hr />
        </div>


        <div className='panel-body'>
            <div className='table-custom-02'>
                <table className='table-custom-02-01'>
                    <thead>
                        <tr>
                            <th><input type="checkbox"/></th>
                            <th>Usuário</th>
                            <th>Data de acesso</th>
                            <th>Data de saída</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            accesses.map((access, i) => {
                                return(
                                    <tr key={i}>
                                        <td><input type="checkbox"/></td>
                                        <td>{access.userId}</td>
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


        </Layout>
        </>
    )
}

export default Accesses;