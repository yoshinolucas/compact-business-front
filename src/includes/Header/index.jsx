import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { getUserId } from '../../services/auth';
import Subtop from '../Subtop';
import './Header.css';

const Header = ({hasSubtop, hasShadow}) => {

    const [ user, setUser ] = useState("");
    const [ openPerfil, setOpenPerfil ] = useState(false);

    useEffect(() => {  
        var userId = getUserId();   
        api.get(`/users/details/${userId}`).then(res => setUser(res.data)).catch(err => console.log(err))
    }, [])
    return(
        <>
            <header>
                <div className='top' style={{boxShadow: hasShadow ? 'var(--shadow03)' : 'none'}}>
                    <Link to="/home">
                        <img width={130} src="/img/logo.png" alt="logo-compact"/>    
                    </Link>
                    <div className='dropdown'>
                        <button onClick={() => setOpenPerfil(!openPerfil)}><i className='fa fa-user'></i></button>
                            {
                                openPerfil &&
                                <div className='menu'>
                                <div className='menu-header'>
                                    <div>
                                        <p style={{marginBottom:'6px'}}>Logado como</p>
                                        <h3>{user.name}</h3>
                                        <h4>{user.email}</h4>
                                        <hr style={{marginTop:'6px'}}/>
                                    </div>
                                </div>
                                
                                <div className='menu-body'>
                                    <nav>
                                        <ul>
                                            <li><Link>Minhas tarefas</Link></li>
                                        </ul>
                                    </nav>
                                </div>
                            </div>
                            }
                    </div>
                </div>
                {
                    hasSubtop && <Subtop />
                }
                
            </header>
        </>
    );
}

export default Header;