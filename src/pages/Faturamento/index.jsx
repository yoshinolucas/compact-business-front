import './Faturamento.css';
import Layout from '../../includes/Layout';
import { Link } from 'react-router-dom';
import MsgText from '../../components/MsgText';
import { useEffect, useState } from 'react';
import Sidebar from '../../includes/Sidebar';


const Faturamento = () => {
    const [ msg, setMsg ] = useState({});
    const [ faturamento, setFaturamento ] = useState([]);
    const [ columns, setColumns ] = useState([]);

    useEffect(() => {

    },[]);

    return(
        <>
        <Layout hasSidebar={true} hasShadow={false} background={'var(--panel)'}>
        <div className='panel-header'>
            <div className='panel-header-wrapper'>
                <div className='panel-title'> 
                    <Link to="/home"><h4><u>Início</u></h4></Link> <h4>&nbsp;&nbsp;&gt;&nbsp; </h4> <h3> Finanças</h3>
                </div>
                    <Link className='btn-custom success btn-pill btn-medium'><i className='fa fa-add'></i>Novo</Link>
            </div>
            <MsgText show={msg.show} style={msg.style} content={msg.content}/>
            <hr />
        </div>


        <div className='panel-body faturamento'>

            <div className='cards'>
                <div className='card'>
                    <div className='card-header'>
                        <div className='wrapper'>
                            <h2>1.324,00</h2><h3>+ 20%</h3>
                        </div>         
                        <h5>Caixa</h5>      
                    </div>
                    
                </div>
                <div className='card'>
                    <div className='card-header'>
                        <div className='wrapper'>
                            <h2>572,24</h2><h3>-102%</h3>
                        </div> 
                        <h5>Despesas</h5> 
                    </div>
                    
                </div>
                <div className='card'>
                    <div className='card-header'>
                        <div className='wrapper'>
                            <h2>1.324,00</h2><h3>+ 0.6%</h3>
                        </div>
                        <h5>Futuros lançamentos</h5> 
                    </div>
                    
                </div>
            </div>                                           


            <div className="section">    
                <div className="section-header">
                    <h4 className="section-title">Ferramentas</h4>
                </div>  
                <div className="section-body">
                    <div className="section-wrapper">
                        <div className="group-button">
                            
                        </div>      
                        <div className="group-button">
                            
                        </div>                                              
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

export default Faturamento;