import { useEffect, useState } from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { logout } from '../../services/auth';

const Sidebar = () => {
    const [ openSidebar, setOpenSidebar ] = useState(false);
    const [ openSubmenu, setOpenSubmenu ] = useState({active:''})

    const handleOpenSidebar = (e) => setOpenSidebar(!openSidebar);
    
    const handleSubMenu = (e) => {
        var submenu = e.target.id;
        if(submenu === openSubmenu.active) setOpenSubmenu({active:''});
        else setOpenSubmenu({active:submenu});
    }
    

    useEffect(()=>{
       
    },[]);

    return(
        <>
            <aside>
                <button onClick={handleOpenSidebar} className='openbtn-sidebar'><i className='fa fa-bars'></i></button>
                <div className={`sidebar ${openSidebar ? 'open-sidebar' : 'close-sidebar'}`}>
                
                    <nav>
                        <ul>
                            <h5 style={{visibility: openSidebar ? "visible" : "hidden"}}>Predefinidos</h5>
                            <li>
                                <Link to="/home"><i className="fa-solid fa-dashboard"></i> { openSidebar && 'Início'}<div className='markdown-btn'></div></Link>
                            </li>
                            <li><Link to="/faturamentos"><i className="fa-solid fa-dollar-sign"></i>{ openSidebar && 'Finanças'}<div className='markdown-btn'></div></Link></li>
                            
                            <h5 style={{visibility: openSidebar ? "visible" : "hidden"}}>Geral</h5>
                            <li 
                            id="empresa" 
                            onClick={handleSubMenu} 
                            className="sub-menu">
                                <i id="empresa" className="fa-solid fa-building"></i>
                                { openSidebar && 'Empresa'}
                                <div className='wrapper' id="empresa">
                                    { openSidebar && <i id="empresa" className={`fa fa-angle-${openSubmenu.active === 'empresa' ? 'up' : 'down'}`}></i> }
                                    <div className='markdown-btn'></div>
                                </div>
                            </li>
                            <ul style={{display: openSubmenu.active === 'empresa' ? 'block' : 'none'}} >
                                <li><Link to="/users"><i className="fa-solid fa-users"></i>{ openSidebar && 'Equipe'}<div className='markdown-btn'></div></Link></li>
                            </ul>

                            <li 
                            id="relatorios" 
                            onClick={handleSubMenu} 
                            className="sub-menu">
                                <i id="relatorios" className="fa-solid fa-file-lines"></i>
                                { openSidebar && 'Relatórios'}
                                <div className='wrapper' id="relatorios">
                                    { openSidebar && <i id="relatorios" className={`fa fa-angle-${openSubmenu.active === 'relatorios' ? 'up' : 'down'}`}></i>}
                                    <div className='markdown-btn'></div>
                                </div>
                            </li>
                            <ul style={{display: openSubmenu.active === 'relatorios' ? 'block' : 'none'}} >
                                <li><Link><i className="fa-solid fa-wallet"></i>{ openSidebar && 'Comissionamentos'}<div className='markdown-btn'></div></Link></li>
                                <li><Link to=""><i className="fa-solid fa-file"></i>{ openSidebar && 'Documentos'}<div className='markdown-btn'></div></Link></li>
                                <li><Link to=""><i className="fa-solid fa-file"></i>{ openSidebar && 'Mais relatórios'}<div className='markdown-btn'></div></Link></li>
                            </ul>
                            
                            
                            
                            <li 
                            id="informacoes" 
                            onClick={handleSubMenu} 
                            className="sub-menu">
                                <i id="informacoes" className="fa-solid fa-chart-simple"></i>
                                { openSidebar && 'Informações'}
                                <div className='wrapper' id="informacoes">
                                    { openSidebar && <i id="informacoes" className={`fa fa-angle-${openSubmenu.active === 'informacoes' ? 'up' : 'down'}`}></i>}
                                    <div className='markdown-btn'></div>
                                </div>
                            </li>
                            <ul style={{display: openSubmenu.active === 'informacoes' ? 'block' : 'none'}} >
                                <li><Link to="/acessos"><i className="fa-solid fa-flag"></i>{ openSidebar && 'Acessos'}<div className='markdown-btn'></div></Link></li>
                                <li><Link to="/alteracoes"><i className="fa-solid fa-clock-rotate-left"></i>{ openSidebar && 'Alterações'}<div className='markdown-btn'></div></Link></li>
                            </ul>
                            <h5 style={{visibility: openSidebar ? "visible" : "hidden"}}>Configurações</h5>
                            <li><Link to="/" onClick={()=>{ logout(); return true }}><i className='fa fa-right-from-bracket'></i>{ openSidebar && 'Sair'}<div className='markdown-btn'></div></Link></li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;