import { useState,useEffect } from "react";
import './Users.css';
import api from '../../services/api';
import Header from "../../includes/Header";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Modal from "../Modal";
import Footer from "../../includes/Footer";
import SearchInput from "../SearchInput";
import MsgText from "../MsgText";
import { STATUS_CADASTRO } from "../../services/config";
import CheckBoxPill from "../CheckBoxPill";

const Users = () => {
    const maxItems = 15;
    const[ allSelect, setAllSelect ] = useState([]);
    const[ params ] = useSearchParams();
    const navigate = useNavigate();
    const[ msg, setMsg ] = useState({show: false, content: "", style: ""});
    const[ users, setUser ] = useState([]);
    const[ infoRecords, setInfoRecord ] = useState({totalPages: 1, totalRecords: 0});
    const[ modalRemove, setModalRemove ] = useState(false);
    const [ modalStatus, setModalStatus ] = useState(false);

    const[ openFilter, setOpenFilter] = useState(false);
    const[ filters , setFilters] = useState({
        status: [1,2],
        data: [1]
    });

    const [ search, setSearch ] = useState("");
    const [ currentPage, setCurrentPage] = useState(1);

    const [ pages, setPages ] = useState([1,2,3])

    const handleSelected = (e) => {
        setMsg({show:false});   
        var user = e.target.tagName === 'TD' ?
        e.target.parentElement  :
        e.target.parentElement.tagName === 'TD' ?  e.target.parentElement.parentElement : 
        null;

        var checkbox = e.target.tagName === 'TD' ?
        e.target.children[0] : 
        e.target.parentElement.tagName === 'TD' ? e.target : 
        null;

        if(user === null && checkbox === null) {
            var rows = document.querySelectorAll("tbody tr");
            setAllSelect([]); 
            var allCheckbox = e.target;
            if(allCheckbox.checked) {                               
                for(let i = 0; i < rows.length; i++) {
                    rows[i].className = "selected"
                    checkbox = rows[i].children[0].children[0];
                    checkbox.checked = true;              
                    setAllSelect(values => [...values,rows[i].id]);                   
                }
            } else {
                for(let i = 0; i < rows.length; i++) {
                    rows[i].className = ""
                    checkbox = rows[i].children[0].children[0];
                    checkbox.checked = false;
                }
            }             
        } else {
            if(user.classList.contains('selected')) {
                checkbox.checked = false;
                user.className = "";     
                setAllSelect(values => values.filter(value => value !== user.id))          
            } else { 
                checkbox.checked = true;
                user.className = "selected";
                setAllSelect(values => [...values,user.id])
            }
        }
        
    }

    const handleRemove = (e) => {
        setMsg({show:false});       
        setModalRemove(true);
    }
    
    const handleRemoveConfirm = (e) => {
        e.preventDefault();
        var json = {ids:allSelect};
        api.post('/users/remove', json)
        .then((res) => {
            navigate("/users?msg=3");
            window.location.reload(false);
        }).catch(err => console.log(err))
    }

    const handlePages = (e) => {
        var max = infoRecords.totalPagesWithSearch > 0 ? infoRecords.totalPagesWithSearch : infoRecords.totalPages;
        if(e.target.id === 'previous') {
            if( pages[0] > 1 ) setPages([pages[0] - 1, pages[1] - 1, pages[2] - 1]);
            setCurrentPage(currentPage - 1)
        } else {
            
            if( pages[0] + 2 < max ) setPages([pages[0] + 1, pages[1] + 1, pages[2] + 1]);
            setCurrentPage(currentPage + 1)
        }
        
    }

    const handleOpenFilter = (e) => {
        setMsg({show:false});
        setOpenFilter(!openFilter);
    }

    const handleFilter = (e) => {
        var name = e.target.name;
        var value = e.target.value;

        if(name === "status") { 
            var newStatus = filters.status;
            value = parseFloat(value)
            if(newStatus.includes(value)) newStatus = newStatus.filter(v => v !== value)
            else newStatus.push(value);
            setFilters(v => ({...v,[name]: newStatus}))
        }
    }

    const handleArchive = (e) => {
        e.preventDefault();
        var json = {
            ids:allSelect, 
            columns: ['status'],
            user: {
                status: 3
            }
        };
        api.post('/users/update', json)
        .then((res) => {
            navigate("/users?msg=2");
            window.location.reload(false);
        }).catch(err => console.log(err))
    }

    const handleStatus = (e) => {
        e.preventDefault();
        setMsg({show:false});
        setModalStatus(true);
    }

    const handleStatusConfirm = (e) => {
        e.preventDefault();
    }


    useEffect(() => {
        if(params.get("msg") === '1') setMsg({show:true, content: "Usuário cadastrado com sucesso.", style: "success"});
        if(params.get("msg") === '2') setMsg({show:true, content: "Usuário(s) atualizado(s) com sucesso.", style: "success"});
        if(params.get("msg") === '3') setMsg({show:true, content: "Usuário(s) excluído(s) com sucesso.", style: "success"});
        if(params.get("msg") === '4') setMsg({show:true, content: "Erro no servidor. Tente novamente mais tarde.", style: "danger"});
        params.delete("msg");
        var data = {
            "maxItems" : maxItems,
            "currentPage" : currentPage > infoRecords.totalPagesWithSearch ? 1 : currentPage,
            "search" : search,
            "filters": filters
        };

        api.post('/users/table', data)
        .then((res)=>{
            setInfoRecord(
                {
                    totalPages: res.data.totalPages,
                    totalRecords: res.data.totalRecords,
                    totalPagesWithSearch: res.data.totalPagesWithSearch,
                    totalRecordsWithSearch: res.data.totalRecordsWithSearch
                })
            setUser(res.data.users)
        }).catch(err => console.log(err));
    },[params,filters,search, currentPage,infoRecords.totalPagesWithSearch]);

    return(
        <>
            <Header />
            <main>
                <div className="users">
                    
                        <div className="container">
                            <div className="panel">   


                                <div className="panel-header">
                                    <div className="panel-header-wrapper">
                                        <h3 className="panel-title">Home / Equipe</h3>

                                        <div className="group-button">
                                            <Link to="/users/edit?id=0" className="btn-custom success btn-long btn-pill"><i className="fa-solid fa-add"></i>Novo Usuário</Link>
                                        </div>
                                    </div>
                                    <MsgText show={msg.show} style={msg.style} content={msg.content}/>
                                    
                                    <div className="hr"></div>
                                </div>

                                

                                <div className="panel-body">


                                        <div 
                                        className="group-button"
                                        style={{justifyContent: 'flex-end', marginBottom: '16px'}}
                                        >
                                            <h5>Exportar</h5>
                                            <button className="btn-custom btn-border btn-pill warning-border"><i className="fa fa-file"></i>PDF</button>
                                            <button className="btn-custom btn-border btn-pill success-border"><i className="fa fa-file"></i>Excel</button>
                                        </div>
                                        <div className="section">    

                                            <div className="section-header">
                                                <h4 className="section-title">Ferramentas</h4>
                                            </div>  
                                            <div className="section-body">
                                                <div className="section-wrapper" style={{display:'flex', justifyContent:'space-between'}}>
                                                    <div className="group-button">
                                                        <Link to={`/users/edit?id=${allSelect[0]}&copy=1`} className={document.querySelectorAll(".selected").length === 1 ? "btn-custom btn-medium warning" : "btn-custom btn-border btn-medium disabled-border"}><i className="fa-solid fa-copy"></i>Duplicar</Link>
                                                        <button onClick={handleArchive} className={allSelect.length > 0 ? "btn-custom btn-medium info" : "btn-custom btn-border btn-medium disabled-border"}><i className="fa-solid fa-inbox"></i>Arquivar</button>
                                                        <button onClick={handleStatus}  className={allSelect.length > 0 ? "btn-custom btn-medium warning" : "btn-custom btn-border btn-medium disabled-border"}><i className="fa-solid fa-user"></i>Mudar Status</button>
                                                        
                                                    </div>      
                                                    <div className="group-button">
                                                        <button className={allSelect.length > 0 ? "btn-custom btn-medium danger" : "btn-custom btn-border btn-medium disabled-border"} onClick={handleRemove}><i className="fa-solid fa-trash"></i>Excluir</button>
                                                    </div>                                              
                                                </div>
                                                                                              
                                            </div>                                                                                                                               
                                        </div>
                                        
                                       
                                        <div className="table-custom">

                                            <div className="table-custom-info">
                                               

                                                <h4>{allSelect.length > 0 ? allSelect.length : 0} Selecionado(s)</h4>
                                                
                                                                                               
                                                <div className="table-custom-info-wrapper">
                                                    <SearchInput 
                                                    search={search} 
                                                    setSearch={setSearch}
                                                    setCurrentPage={setCurrentPage}
                                                    setPages={setPages}
                                                    />
                                                    <div className="group-button">   
                                                        <div className="dropdown">
                                                        <button 
                                                        className="btn-custom btn-border table-custom-info-button" 
                                                        onClick={handleOpenFilter}><i className="fa-solid fa-filter"></i> 
                                                        Filtros
                                                        </button>
                                                        {
                                                            openFilter && 
                                                            <div className="menu filters">
                                                                <div className="menu-wrapper">
                                                                    <div className="menu-header">
                                                                        <button onClick={e => setOpenFilter(false)} className="transparent"><i className="fa fa-arrow-left"></i></button>
                                                                        <button className="btn-custom btn-pill btn-border">Redefinir</button>
                                                                    </div>


                                                                    <div className="menu-body">

                                                                        <h5>Filtros predefinidos</h5>
                                                                        <div className="group-button">
                                                                            <CheckBoxPill 
                                                                            defaultChecked={filters.status.includes(1)} 
                                                                            onClick={handleFilter} 
                                                                            name="status" 
                                                                            value={1} 
                                                                            placeholder="Ativos" 
                                                                            css="success" 
                                                                            size="medium"
                                                                            />
                                                                                                        
                                                                            <CheckBoxPill 
                                                                            defaultChecked={filters.status.includes(2)}
                                                                            value={2} 
                                                                            onClick={handleFilter} 
                                                                            name="status" 
                                                                            placeholder="Pendentes" css="warning" 
                                                                            size="medium"/>
                                                                        </div>

                                                                        <h5>Outros filtros</h5>
                                                                        <div className="group-button">
                                                                            <CheckBoxPill 
                                                                            defaultChecked={filters.status.includes(4)}
                                                                            onClick={handleFilter} 
                                                                            name="status" 
                                                                            value={4} 
                                                                            placeholder="Inativos" 
                                                                            css="danger"
                                                                            size="medium"/>
                                                                            <CheckBoxPill 
                                                                            defaultChecked={filters.status.includes(3)}
                                                                            onClick={handleFilter} 
                                                                            name="status"
                                                                            value={3} 
                                                                            placeholder="Arquivados" 
                                                                            css="info" 
                                                                            />
                                                                        </div>
                                                                        <div className="group-button">
                                                                            <CheckBoxPill 
                                                                            onClick={handleFilter} 
                                                                            placeholder="Em férias" 
                                                                            css="warning"
                                                                            size="medium"/>
                                                                            <CheckBoxPill 
                                                                            onClick={handleFilter} 
                                                                            name="90" 
                                                                            placeholder="Férias próximo mês" 
                                                                            css="info" 
                                                                            />
                                                                        </div>

                                                                        <h5>Equipe</h5>
                                                                        <div className="group-button">
                                                                            <CheckBoxPill 
                                                                            onClick={handleFilter} 
                                                                            name="status" 
                                                                            placeholder="Contabilidade" 
                                                                            css="danger"
                                                                            size="medium"/>
                                                                            <CheckBoxPill 
                                                                            onClick={handleFilter} 
                                                                            name="90" 
                                                                            placeholder="Design" 
                                                                            css="info" 
                                                                            />
                                                                            
                                                                        </div>

                                                                        <h5>Data de cadastro</h5>
                                                                        <div className="group-button">
                                                                            <CheckBoxPill 
                                                                            onClick={handleFilter} 
                                                                            placeholder="Qualquer data" 
                                                                            css="success"/>
                                                                            <CheckBoxPill 
                                                                            onClick={handleFilter} 
                                                                            name="90" 
                                                                            placeholder="Hoje" 
                                                                            css="info" 
                                                                            />
                                                                            <CheckBoxPill 
                                                                            onClick={handleFilter} 
                                                                            name="90" 
                                                                            placeholder="Ontem" 
                                                                            css="info" 
                                                                            />
                                                                            
                                                                        </div>
                                                                        <div className="group-button">
                                                                            <CheckBoxPill 
                                                                            onClick={handleFilter} 
                                                                            name="90" 
                                                                            placeholder="Esta semana" 
                                                                            css="info" 
                                                                            />
                                                                            <CheckBoxPill                                                                  
                                                                            onClick={handleFilter} 
                                                                            name="status" 
                                                                            placeholder="Últimos 30 dias" 
                                                                            css="info"/>
                                                                            
                                                                        </div>
                                                                        <div className="group-button">
                                                                            <CheckBoxPill 
                                                                            onClick={handleFilter} 
                                                                            name="90" 
                                                                            placeholder="Últimos 90 dias" 
                                                                            css="info" 
                                                                            />
                                                                            <CheckBoxPill 
                                                                            onClick={handleFilter} 
                                                                            name="90" 
                                                                            placeholder="Últimos 180 dias" 
                                                                            css="info" 
                                                                            />
                                                                        
                                                                        </div>
                                                                        <div className="group-button">
                                                                            <CheckBoxPill 
                                                                            onClick={handleFilter} 
                                                                            name="90" 
                                                                            placeholder="Há 1 ano" 
                                                                            css="info" 
                                                                            />
                                                                            <CheckBoxPill 
                                                                            onClick={handleFilter} 
                                                                            name="90" 
                                                                            placeholder="Últimos 3 anos" 
                                                                            css="info" 
                                                                            />
                                                                        </div>

                                                                        


                                                                        

                                                                        
                                                                        
                                                                    </div>
                                                                        <div className="group-button">
                                                                            <button className="btn-custom btn-long">Editar filtros</button>
                                                                            <button className="btn-custom btn-border btn-long">Data customizada</button>
                                                                        </div>
                                                                        

                                                                    

                                                                    
                                                                </div>
                                                                
                                                            </div>

                                                            }
                                                        </div>
                                                        <button className="btn-custom btn-border table-custom-info-button"><i className="fa-solid fa-table-columns"></i> Colunas</button>
                                                        <button className="btn-custom btn-border table-custom-info-button"><i className="fa-solid fa-arrow-down-wide-short"></i> Ordem</button>
                                                    </div>
                                                </div>
                                                
                                            </div>

                                            <table className="table-custom-01">
                                                <thead>
                                                    <tr>
                                                        <th id="user_all"><input 
                                                        onChange={() => {}} 
                                                        checked={
                                                            allSelect.length === maxItems ? true 
                                                            : 
                                                            allSelect.length === infoRecords.totalRecords ?
                                                            true
                                                            :
                                                            false} 
                                                        type="checkbox" 
                                                        onClick={handleSelected}
                                                        /></th>
                                                        <th>Nome</th>
                                                        <th>Sobrenome</th>
                                                        <th>Username</th>
                                                        <th>Email</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {users.map((user, i) => {
                                                        return(
                                                            <tr onClick={e => navigate(`/users/edit?id=${e.target.parentElement.id}`)} key={i} id={user.id}>
                                                                <td onClick={e => { e.stopPropagation(); handleSelected(e) }}><input type="checkbox" /></td>
                                                                <td>{user.nome}</td>
                                                                <td>{user.sobrenome}</td>
                                                                <td>{user.username}</td>
                                                                <td>{user.email}</td>
                                                                <td onClick={e=>e.stopPropagation(e)}>{STATUS_CADASTRO[user.status]}</td>
                                                            </tr>
                                                        );
                                                    })}                                         
                                                </tbody>
                                            </table>

                                            <div className="table-custom-footer">
                                                <h5>Total de registro: {infoRecords.totalRecords} usuários</h5>
                                            
                                                <div className="pages">
                                                    
                                                    {                                
                                                        (() => {
                                                            var a = [];

                                                            var max = infoRecords.totalPagesWithSearch > 0 ? infoRecords.totalPagesWithSearch : infoRecords.totalPages;
                                                            var len = max >= 3 ? 3 : max;
                                                        
                                                            if(currentPage !== 1) {    
                                                                a.push(
                                                                    <button
                                                                    className="btn-custom first"
                                                                    onClick={(e) => {
                                                                        handleSelected(e);
                                                                        setCurrentPage(1);
                                                                        setPages([1,2,3]);
                                                                    }}
                                                                    >
                                                                    Primeiro
                                                                    </button>
                                                                );                                                                              
                                                                a.push(
                                                                    <button
                                                                    id='previous'
                                                                    className="btn-custom"
                                                                    onClick={(e) => handlePages(e)}
                                                                    >
                                                                    <i id='previous' className="fa fa-angle-left"></i>
                                                                    </button>);
                                                            }
                                                                
                                                            
                                                            for( var i = 1; i <= len; i++ ) {

                                                                a.push(
                                                                <button key={pages[i - 1]} 
                                                                id={pages[i - 1]} 
                                                                className={currentPage === pages[i - 1] ? "btn-custom current-page" : "btn-custom"} 
                                                                onClick={e => {setCurrentPage(parseFloat(e.target.id)); handleSelected(e)}}
                                                                >
                                                                {pages[i - 1]}
                                                                </button>);
                                                            }

                                                            if(currentPage < max) {
                                                                a.push(
                                                                    <button
                                                                    id='next'
                                                                    className="btn-custom"
                                                                    onClick={(e) => handlePages(e)}
                                                                    >
                                                                    <i id='next' className="fa fa-angle-right"></i>
                                                                    </button>
                                                                );       
                                                                a.push(
                                                                    <button
                                                                    className="btn-custom last"
                                                                    onClick={(e) => {
                                                                        handleSelected(e)
                                                                        setCurrentPage(max);
                                                                        if(max > 2) {                                                             
                                                                            setPages([max-2,max-1,max]);
                                                                        } else {
                                                                            setPages([1,2])
                                                                        }
                                                                    }}
                                                                    >
                                                                    Último
                                                                    </button>
                                                                );                                                 
                                                            }
                                                            return a;
                                                        })()}
                                                </div>
                                            </div>
                                            
                                        </div>                   
 
                                </div>


                            </div>
                        </div>
                    
                    <Modal isOpen={modalRemove} setIsOpen={setModalRemove}>
                        <div className="modal-content">
                            <div className="modal-body">
                                <h3>Tem certeza que deseja excluir {allSelect.length} usuário(s) do sistema?</h3>
                            </div>
                            <div className="modal-footer">
                                <button onClick={() => setModalRemove(false)} className="btn-custom warning">Cancelar</button>
                                <button onClick={handleRemoveConfirm} className="btn-custom success">Confirmar</button>
                            </div>
                        </div>
                    </Modal>

                    <Modal isOpen={modalStatus} setIsOpen={setModalStatus}>
                        <div className="modal-content">
                            <div className="modal-body">
                                
                            </div>
                            <div className="modal-footer">
                                <button onClick={() => setModalStatus(false)} className="btn-custom warning">Cancelar</button>
                                <button onClick={handleStatusConfirm} className="btn-custom success">Confirmar</button>
                            </div>
                        </div>
                    </Modal>
                </div>          
            </main>
            <Footer />
        </>
    );
}

export default Users;