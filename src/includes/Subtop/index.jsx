import { Link } from "react-router-dom"

const Subtop = () => {
    return(
        <div className='sub-top'>
            <nav>
                <ul>
                    <li><Link to="/home">Início</Link></li>                        
                    <li><Link to="/users">Equipe</Link></li>  
                    {/* <li><Link to="/produtos">Produtos</Link></li> */}
                    {/* <li><Link to="/vendas">Vendas</Link></li> */}
                    <li><Link to="/faturamentos">Finanças</Link></li>
                    <li><Link to="/relatorios">Relatórios</Link></li>
                </ul>
            </nav>
        </div>
    )
}

export default Subtop