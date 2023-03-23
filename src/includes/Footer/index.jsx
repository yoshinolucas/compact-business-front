import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return(
        <footer>
            <div className='bottom'>
                <img width={180} src="/img/logowhite.png" alt="logo-compact-white"/>
                <div className='bottom-wrapper'>
                    <div className='logo'>
                        <Link>Termos de uso</Link>
                    </div>
                    <div className='contato'>
                        <h3>Atendimento: </h3><p>Segunda a sexta</p>
                        <p>das 8h30 ás 17h30</p><br />
                        <h3>Telefone comercial: </h3><p>(11) 98467-7214</p>

                    </div>
                    <div className='redes'>

                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;