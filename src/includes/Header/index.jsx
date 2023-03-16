import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { logout } from '../../services/auth';
import './Header.css';

const Header = () => {
    function LogoutHandler() {
        logout();
        return true;
    }

    const [ user, setUser ] = useState("");

    useEffect(() => {     
        api.get(`/users/id/1`).then(res => setUser(res.data)).catch(err => console.log(err))
    }, [])
    return(
        <>
            <header>
                <div className='top'>
                    <Link to="/home">Logo</Link>
                    <nav>
                        <ul>   
                            <li><Link to="/home">Home</Link></li>                        
                            <li><Link to="/users">Equipe</Link></li>
                            <li className='user-info'>
                                <button><i className='fa fa-user'></i></button>
                                <div>
                                    <h3>{user.nome}</h3>
                                    <h4>{user.email}</h4>
                                </div> 
                            </li>
                            <li><Link to="/" onClick={LogoutHandler}><i className='fa fa-right-from-bracket'></i></Link></li>
                        </ul>
                    </nav>
                    
                    
                </div>
            </header>
        </>
    );
}

export default Header;