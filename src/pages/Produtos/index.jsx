import './Produtos.css';
import Layout from '../../includes/Layout';
import { Link } from 'react-router-dom';
import MsgText from '../../components/MsgText';
import { useEffect, useState } from 'react';


const Produtos = () => {
    const [ msg, setMsg ] = useState({});
    const [ produtos, setProdutos ] = useState([]);
    const [ columns, setColumns ] = useState([]);

    useEffect(() => {

    },[]);

    return(
        <>
        <Layout>
        <div className='panel-header'>
            <div className='panel-header-wrapper'>
                <div className='panel-title'> 
                    <h4>Início</h4><h3>/ Produtos</h3>
                </div>
                    <Link className='btn-custom success btn-pill btn-medium'><i className='fa fa-add'></i>Novo</Link>
            </div>
            <MsgText show={msg.show} style={msg.style} content={msg.content}/>
            <hr />
        </div>


        <div className='panel-body'>
            <div className='section'>

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

export default Produtos;