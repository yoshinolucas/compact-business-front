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
                <div className='openbtn-sidebar-wrapper'>
                <button onClick={handleOpenSidebar} className='openbtn-sidebar'><i className='fa fa-bars'></i></button>
                </div>
            
                <div className={openSidebar ? 'sidebar open-sidebar' : 'sidebar close-sidebar'}>              
                    <nav>
                        <Link to="/inicio"><i className="fa-solid fa-dashboard"></i><p>{ openSidebar && 'Início'}</p><div className='markdown-btn'></div></Link>
                        <Link to="/faturamentos"><i className="fa-solid fa-chart-line"></i><p>{ openSidebar && 'Finanças'}</p><div className='markdown-btn'></div></Link>

                        <Link onClick={handleSubMenu} id="negocios"><i id="negocios" className="fa-solid fa-globe"></i><p id="negocios">{ openSidebar && 'Negócios'}</p><div id="negocios" className={openSidebar && openSubmenu.active==='negocios'?'fa fa-angle-up':'fa fa-angle-down'}></div></Link>
                        { openSubmenu.active === "negocios" && 
                        <><Link className='sub-menu-sidebar' to="/produtos"><i className="fa-solid fa-warehouse"></i><p>{ openSidebar && 'Estoque'}</p><div className='markdown-btn'></div></Link></>}

                        <Link onClick={handleSubMenu} id="empresa"><i id="empresa" className="fa-solid fa-building"></i><p id="empresa">{ openSidebar && 'Empresa'}</p><div id="empresa" className={openSubmenu.active && openSidebar ==='empresa' ? 'fa fa-angle-up':'fa fa-angle-down'}></div></Link>
                        { openSubmenu.active === "empresa" && <Link className='sub-menu-sidebar' to="/users"><i className="fa-solid fa-users"></i><p>{ openSidebar && 'Equipe'}</p><div className='markdown-btn'></div></Link>}

                        <Link onClick={handleSubMenu} id="informacoes"><i id="informacoes" className="fa-solid fa-book"></i><p id="informacoes">{ openSidebar && 'Informações'}</p><div id="informacoes" className={openSidebar && openSubmenu.active==='informacoes'?'fa fa-angle-up':'fa fa-angle-down'}></div></Link>
                        { openSubmenu.active === "informacoes" && 
                        <><Link className='sub-menu-sidebar' to="/acessos"><i className="fa-solid fa-flag"></i><p>{ openSidebar && 'Acessos'}</p><div className='markdown-btn'></div></Link>
                        <Link to="/alteracoes" className='sub-menu-sidebar'><i className="fa-solid fa-clock-rotate-left"></i><p>{ openSidebar && 'Alterações'}</p><div className='markdown-btn'></div></Link></>}
                        <Link to="/" onClick={e => {logout(); return true;}}><i className="fa-solid fa-right-from-bracket"></i><p>{ openSidebar && 'Sair'}</p><div className='markdown-btn'></div></Link>
                    </nav>

                </div>
            </aside>
        </>
    );
};

export default Sidebar;