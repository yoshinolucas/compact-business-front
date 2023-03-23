import './Relatorios.css';
import Layout from '../../includes/Layout';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const Relatorios = () => {
    const [ relatorios, setRelatorios ] = useState([]);

    useEffect(() => {

    },[]);

    return(
        <>
        <Layout>
        <div className='panel-header'>
            <div className='panel-header-wrapper'>
                <div className='panel-title'> 
                    <h4>Início</h4><h3>/ Relatórios</h3>
                </div>
            </div>
            <hr />
        </div>


        <div className='panel-body'>
            <div className='relatorios'>
                <div className='administrativo'>
                    <h3>Administrativo</h3>
                    <hr />
                    <nav>
                        <ul>
                            <li><Link>Documentos</Link></li>
                        </ul>
                    </nav>

                </div>
                <div className='estoque'>
                    <h3>Estoque</h3>
                    <hr />
                    <nav>
                        <ul>
                            <li><Link></Link></li>
                        </ul>
                    </nav>
                </div>
            </div>          
        </div>


        </Layout>
        </>
    )
}

export default Relatorios;