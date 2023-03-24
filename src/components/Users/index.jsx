import { useState,useEffect } from "react";
import './Users.css';
import api from '../../services/api';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Modal from "../Modal";
import SearchInput from "../SearchInput";
import MsgText from "../MsgText";
import { formatDate, register, ROLES, STATUS_CADASTRO } from "../../services/config";
import CheckBoxPill from "../CheckBoxPill";
import CheckBoxSwitch from "../CheckBoxSwitch";
import RadioPill from "../RadioPill";
import RadioPillSwitch from "../RadioPillSwitch";
import Layout from "../../includes/Layout";
import { getUserId } from "../../services/auth";
import * as XLSX from "xlsx/xlsx.mjs";
import Divisor from "../Divisor";


const Users = () => {

    const defaultFilters = {
        status: [1,2],
        teams: [],
        date: -1,
        archived: false,
        date_range: ['1909-01-01','2100-01-01'],
        order: ''
    };
    const defaultColumnsShow = [false,true, true, true, true, true,false,false,false];
    const[ rowsSelected, setRowsSelected ] = useState([]);
    const[ params ] = useSearchParams();
    const navigate = useNavigate();
    const[ msg, setMsg ] = useState({show: false, content: "", style: ""});
    const[ users, setUser ] = useState([]);
    const[ infoRecords, setInfoRecord ] = useState({maxItems: 15, totalPages: 1, totalRecords: 0,teamOptions: []});
    const[ modalRemove, setModalRemove ] = useState(false);
    const[ modalMultiple, setModalMultiple ] = useState(false);
    const[ openMoreTeamOptions, setOpenMoreTeamOptions ] = useState(false);
    const[ openFilter, setOpenFilter] = useState(false);
    const[ filters , setFilters] = useState(defaultFilters);
    const [ openColumn, setOpenColumn ] = useState(false);
    const [ columns, setColumns ] = useState(
        {
            header: ['Id','Nome completo','Username','Email','Equipe','Status','Privilégios','Data de cadastro / Admissão', 'Última atualização'],
            show: defaultColumnsShow
        }
    )
    const [ openOrder, setOpenOrder ] = useState(false);
    const [ search, setSearch ] = useState("");
    const [ currentPage, setCurrentPage] = useState(1);
    const [ pages, setPages ] = useState([1,2,3])
    const [ multiple, setMultiple ] = useState({team:'',unarchive:false});
    const [ openImportModal, setOpenImportModal ] = useState(false);

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
            setRowsSelected([]); 
            var allCheckbox = e.target;
            if(allCheckbox.checked) {                               
                for(let i = 0; i < rows.length; i++) {
                    rows[i].className = "selected"
                    checkbox = rows[i].children[0].children[0];
                    checkbox.checked = true;              
                    setRowsSelected(values => [...values,parseFloat(rows[i].id)]);                   
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
                setRowsSelected(values => values.filter(value => value !== parseFloat(user.id)))          
            } else { 
                checkbox.checked = true;
                user.className = "selected";
                setRowsSelected(values => [...values,parseFloat(user.id)])
            }
        }
        
    }
    const handleRemove = (e) => {
        setMsg({show:false});       
        setModalRemove(true);
    }  
    const handleRemoveConfirm = (e) => {
        e.preventDefault();
        var json = {ids:rowsSelected};
        api.post('/users/delete', json)
        .then((res) => {
            register(getUserId(),1,3,json,{})
            navigate("/users?msg=3");
            window.location.reload(false);
        }).catch(err => console.log(err));
    }
    const handlePages = (e) => {
        var max = infoRecords.totalPagesWithFilters > 0 ? infoRecords.totalPagesWithFilters : infoRecords.totalPages;
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
        setOpenColumn(false);
        setOpenOrder(false);
        setOpenFilter(!openFilter);
    }   
    const handleOpenColumn = (e) => {
        setMsg({show:false});
        setOpenFilter(false);
        setOpenOrder(false);
        setOpenColumn(!openColumn);
    }
    const handleOpenOrder = (e) => {
        setMsg({show:false});
        setOpenFilter(false);
        setOpenColumn(false);
        setOpenOrder(!openOrder);
    }
    const handleColumns = (e) => {
        var value = e.target.value;
        var newShow = columns.show.slice();
        
        var index = columns.header.indexOf(value);
        newShow[index] = !columns.show[index];
        setColumns(v => ({...v,show: newShow}))
           
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
        if(name === "teams"){
            var newTeam = filters.teams;
            value = value.trim();
            if(newTeam.includes(value)) newTeam = newTeam.filter(v => v !== value)
            else newTeam.push(value);
            setFilters(v => ({...v,[name]: newTeam}))
        }

        if(name === "archived") {
            setFilters(v => ({...v,[name]: !filters.archived}))
        }

        if(name === "date") { 
            setFilters(v => ({...v,date_range: ['1909-01-01','2100-01-01']}))
            value = parseFloat(value)
            setFilters(v => ({...v,[name]: value}))
        }

        if(name.includes("date_range")) {
            var min = filters.date_range[0];
            var max = filters.date_range[1];
            if(name.includes('min')) min = value;
            if(name.includes('max')) max = value;
            setFilters(v => ({...v,[name.substr(0,10)]: [min,max]}))
        }

        if(name === 'order') {
            setFilters(v => ({...v,order:value}));
        }
    }
    const handleArchive = (e) => {
        e.preventDefault();
        var json = {
            ids:rowsSelected, 
            columns: ['archived'],
            user: {
                archived: 1
            }
        };
        api.post('/users/edit', json)
        .then((res) => {
            register(getUserId(),1,2,{ids:rowsSelected},json.user);
            navigate("/users?msg=2");
            window.location.reload(false);
        }).catch(err => console.log(err))
    }
    const handleOpenMultiple = (e) => {
        e.preventDefault();
        setMsg({show:false});
        setModalMultiple(true);
    }
    const handleMultiple = (e) => {
        var name = e.target.name;
        var value = e.target.value;
        if(name==='equipe') {
            setMultiple(v=>({...v,equipe:value}));
        } else {
            setMultiple(v=>({...v,unarchive:!multiple.unarchive}));
        }
    }
    const handleMultipleConfirm = (e) => {
        e.preventDefault();
        var columnsMultiple = ['team']
        if(multiple.unarchive) columnsMultiple.push('archived');
        var json = {
            ids:rowsSelected, 
            columns: columnsMultiple,
            user:{
                team: multiple.team,
                archived:0
            }
        };    
        api.post('/users/edit', json)
        .then((res) => {
            register(getUserId(),1,2,{ids:rowsSelected},json.user);
            navigate("/users?msg=2");
            window.location.reload(false);
        }).catch(err => console.log(err))
    }
    const handleExcel = (e) => {
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(users);
        XLSX.utils.book_append_sheet(wb,ws,"Equipe");

        XLSX.writeFile(wb,"equipe.xlsx");
    }
    const handleImportFile = (e) => {
        const file = e.target.files[0];
        console.log(file)
    }

    useEffect(() => {
        if(params.get("msg") === '1') setMsg({show:true, content: "Usuário cadastrado com sucesso.", style: "success"});
        if(params.get("msg") === '2') setMsg({show:true, content: "Usuário(s) atualizado(s) com sucesso.", style: "success"});
        if(params.get("msg") === '3') setMsg({show:true, content: "Usuário(s) excluído(s) com sucesso.", style: "success"});
        if(params.get("msg") === '4') setMsg({show:true, content: "Erro no servidor. Tente novamente mais tarde.", style: "danger"});
        params.delete("msg");
        var data ={
            maxItems : infoRecords.maxItems,
            currentPage : currentPage > infoRecords.totalPagesWithFilters ? 1 : currentPage,
            search : search,
            filters: filters,
        }
        api.post('/users/pages', data).then((res)=>{
            const teamOptions = res.data.teamOptions.map(item=>item.team.trim());
            setInfoRecord(v=>
                ({  ...v,
                    totalPages: res.data.totalPages,
                    totalRecords: res.data.totalRecords,
                    totalPagesWithFilters: res.data.totalPagesWithFilters,
                    totalRecordsWithFilters: res.data.totalRecordsWithFilters,
                    teamOptions: teamOptions,
                    currentPageLength:res.data.currentPageLength
                }));

            setUser(res.data.users)
        }).catch(err => console.log(err));

    },[multiple,params,filters,search, currentPage,infoRecords.totalPagesWithFilters]);

    return(
        <>
        <Layout hasSidebar={true} background={'var(--panel)'}>
        
        <div className="panel-header">
            <div className="panel-header-wrapper">
                <div className="panel-title">
                <Link to="/home"><h4><u>Início</u></h4></Link> <h4>&nbsp;&nbsp;&gt;&nbsp; </h4> <h3> Equipe</h3>
                </div>
                

                <div className="group-button">
                    <Link to="/users/edit?id=0&copy=0" className="btn-custom success btn-medium btn-pill"><i className="fa-solid fa-add"></i>Novo</Link>
                </div>
            </div>
            <MsgText show={msg.show} style={msg.style} content={msg.content}/>
            
            <div className="hr"></div>
        </div>

        <div className="panel-body">
                <div className="section">    
                    <div className="section-header">
                        <h4 className="section-title">Ferramentas</h4>
                    </div>  
                    <div className="section-body">
                        <div className="section-wrapper">
                            <Link to={`/users/edit?id=0&copy=${rowsSelected[0]}`} className={document.querySelectorAll(".selected").length === 1 ? "btn-custom btn-medium warning" : "btn-custom btn-border btn-medium disabled-border"}><i className="fa-solid fa-copy"></i>Duplicar</Link>
                            <button onClick={handleArchive} className={rowsSelected.length > 0 ? "btn-custom btn-medium info" : "btn-custom btn-border btn-medium disabled-border"}><i className="fa-solid fa-inbox"></i>Arquivar</button>
                            <button onClick={handleOpenMultiple}  className={rowsSelected.length > 0 ? "btn-custom btn-medium warning" : "btn-custom btn-border btn-medium disabled-border"}><i className="fa-solid fa-edit"></i>Alterar dados</button>                                                     
                            <button className={rowsSelected.length > 0 ? "btn-custom btn-medium danger" : "btn-custom btn-border btn-medium disabled-border"} onClick={handleRemove}><i className="fa-solid fa-trash"></i>Excluir</button>
                            <button onClick={handleExcel} title="Excel" className="btn-custom btn-medium success"><i className="fa fa-cloud-arrow-down"></i>Exportar</button>
                            <button onClick={setOpenImportModal} title="Excel" className="btn-custom btn-medium info"><i className="fa fa-upload"></i>Importar</button>
                        </div>
                                                                    
                    </div>                                                                                                                               
                </div>                
                <div className="table-custom">

                    <div className="table-custom-info">
                        <h4>{rowsSelected.length > 0 ? rowsSelected.length : 0} Selecionado(s)</h4>                                             
                        <div className="table-custom-info-wrapper">
                            <SearchInput 
                            search={search} 
                            setSearch={setSearch}
                            setCurrentPage={setCurrentPage}
                            setPages={setPages}
                            handleSelected={handleSelected}
                            />
                            <div className="wrapper">
                                <div className="dropdown">
                                    <button 
                                    className="btn-custom btn-border btn-pill" 
                                    onClick={handleOpenFilter}><i className="fa-solid fa-filter"></i> 
                                    Filtros
                                    </button>
                                    {
                                        openFilter && 
                                        <div className="menu filters">
                                            <div className="menu-wrapper">
                                                <div className="menu-header">
                                                    <button onClick={e => setOpenFilter(false)} className="transparent"><i className="fa fa-arrow-left"></i></button>
                                                    <button onClick={e => {
                                                        setFilters(defaultFilters);
                                                        setOpenFilter(false);
                                                    }} className="btn-custom btn-pill btn-border">Redefinir</button>
                                                </div>
                                                <div className="menu-body">

                                                    <h5>Filtros predefinidos</h5>
                                                    <div className="group-button">
                                                        <CheckBoxPill 
                                                        defaultChecked={filters.status.includes(1)} 
                                                        onClick={handleFilter} 
                                                        name="status" 
                                                        value={1} 
                                                        placeholder="Cadastro completo" 
                                                        css="success" 
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
                                                        value={3} 
                                                        placeholder="Inativos" 
                                                        css="danger"
                                                        size="medium"/>
                                                        <CheckBoxPill 
                                                        defaultChecked={filters.archived === true}
                                                        onClick={handleFilter} 
                                                        name="archived"
                                                        value={true} 
                                                        placeholder="Arquivados" 
                                                        css="info" 
                                                        />
                                                    </div>

                                                    <h5>Equipes</h5>
                                                    <div className="group-button">
                                                        <CheckBoxPill          
                                                        checked={filters.teams.length > 0 ? false : true}
                                                        placeholder="Qualquer equipe"
                                                        css="info"/>
                                                    </div>

                                                    <div className="group-button">
                                                    {
                                                        ((() => {
                                                            var options = [];                                                                                    
                                                            for( var i = 0; i < 2; i++ ){
                                                                var team = infoRecords.teamOptions[i]
                                                                if(team != undefined)
                                                                    options.push(
                                                                        <CheckBoxPill 
                                                                        placeholder={team !== "" ? team : "Indefinido"}
                                                                        css="info"
                                                                        value={team}
                                                                        onClick={handleFilter}
                                                                        defaultChecked={filters.teams.includes(team)}
                                                                        name="teams"
                                                                        />
                                                                    )
                                                            }
                                                            
                                                            return options
                                                        })())
                                                    }
                                                    </div>
                                                    <div className="group-button">
                                                    {
                                                        ((() => {
                                                            var options = [];                                                                                    
                                                            for( var i = 2; i < 4; i++ ){
                                                                var team = infoRecords.teamOptions[i]
                                                                if(team != undefined)
                                                                options.push(
                                                                    <CheckBoxPill 
                                                                    placeholder={team !== "" ? team : "Indefinido"}
                                                                    css="info" 
                                                                    value={team}
                                                                    onClick={handleFilter}
                                                                    defaultChecked={filters.teams.includes(team)}
                                                                    name="teams"
                                                                    />
                                                                )
                                                            }
                                                            
                                                            return options
                                                        })())
                                                    }
                                                    </div>
                                                    {   infoRecords.teamOptions.length > 3 &&
                                                        <>
                                                        <button
                                                        className="btn-custom btn-long btn-border btn-pill"
                                                        onClick={e => setOpenMoreTeamOptions(!openMoreTeamOptions)}
                                                        >Mais equipes</button>
                                                        {
                                                                openMoreTeamOptions && 
                                                                <div className="select-custom select-multiple">
                                                                {
                                                                    infoRecords.teamOptions.map((team, i) => {
                                                                        if(i > 3) return (
                                                                            <CheckBoxPill 
                                                                            defaultChecked={filters.teams.includes(team)}
                                                                            css="info"
                                                                            value={team} 
                                                                            onClick={handleFilter}
                                                                            name="teams"
                                                                            placeholder={team !== "" ? team : "Indefinido"}
                                                                            />
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        }
                                                        </>
                                                    }
                                                    
                                                    

                                                    <h5>Data de cadastro</h5>
                                                    <div className="group-button">
                                                        <RadioPill
                                                        onClick={handleFilter} 
                                                        name="date"
                                                        value={-1}
                                                        css="neutral"   
                                                        placeholder="Qualquer data"  
                                                        defaultChecked={filters.date === -1}                                                                  
                                                        />
                                                        <RadioPill 
                                                        onClick={handleFilter} 
                                                        name="date"
                                                        value={0} 
                                                        placeholder="Hoje" 
                                                        css="info" 
                                                        defaultChecked={filters.date === 0} 
                                                        />
                                                        <RadioPill 
                                                        onClick={handleFilter} 
                                                        name="date"
                                                        value={1} 
                                                        placeholder="Ontem" 
                                                        css="info" 
                                                        defaultChecked={filters.date === 1} 
                                                        />
                                                        
                                                    </div>
                                                    <div className="group-button">
                                                        <RadioPill 
                                                        onClick={handleFilter} 
                                                        name="date"
                                                        value={7}                      
                                                        placeholder="Esta semana" 
                                                        css="info" 
                                                        defaultChecked={filters.date === 7} 
                                                        />
                                                        <RadioPill                                                                  
                                                        onClick={handleFilter} 
                                                        name="date" 
                                                        value={30}
                                                        placeholder="Últimos 30 dias" 
                                                        css="info"
                                                        defaultChecked={filters.date === 30} 
                                                        />
                                                        
                                                    </div>
                                                    <div className="group-button">
                                                        <RadioPill 
                                                        onClick={handleFilter} 
                                                        name="date" 
                                                        value={90}
                                                        placeholder="Últimos 90 dias" 
                                                        css="info" 
                                                        defaultChecked={filters.date === 90} 
                                                        />
                                                        <RadioPill 
                                                        onClick={handleFilter} 
                                                        name="date"
                                                        value={180}
                                                        placeholder="Últimos 180 dias" 
                                                        css="info" 
                                                        defaultChecked={filters.date === 180} 
                                                        />
                                                    
                                                    </div>
                                                    <div className="group-button">
                                                        <RadioPill 
                                                        onClick={handleFilter} 
                                                        name="date"
                                                        value={360} 
                                                        placeholder="Há 1 ano" 
                                                        css="info" 
                                                        defaultChecked={filters.date === 360} 
                                                        />
                                                        <RadioPill 
                                                        onClick={handleFilter} 
                                                        name="date" 
                                                        value={1080}
                                                        placeholder="Últimos 3 anos" 
                                                        css="info" 
                                                        defaultChecked={filters.date === 1080} 
                                                        />
                                                    </div>
                                                    <RadioPill 
                                                        placeholder={"Data customizada"}
                                                        name="date"
                                                        css="warning"
                                                        value={-2}
                                                        onClick={handleFilter}
                                                        defaultChecked={filters.date === -2}
                                                    />
                                                    {
                                                        <div className={`form-input ${filters.date === -2 ? "wrapper-content" : "hidden"}`}>
                                                            <input onBlur={handleFilter} name="date_range_min" type="date"/>
                                                            <label>Até</label>
                                                            <input onBlur={handleFilter} name="date_range_max" type="date"/>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                            
                                        </div>

                                    }
                                </div>
                                <div className="dropdown">
                                    <button 
                                    className="btn-custom btn-border btn-pill"
                                    onClick={handleOpenColumn}
                                    ><i className="fa-solid fa-table-columns"></i> Colunas</button>                                                          
                                    { 
                                        openColumn &&
                                            <div className="menu cols-menu">
                                                <div className="menu-wrapper">
                                                    <div className="menu-header">
                                                        <button onClick={e => setOpenColumn(false)} className="transparent"><i className="fa fa-arrow-left"></i></button>
                                                        <button onClick={e=> {
                                                            setColumns(v=>({...v,show: defaultColumnsShow}));
                                                            setOpenColumn(false)
                                                        }
                                                        } className="btn-custom btn-pill btn-border">Redefinir</button>
                                                    </div>
                                                    <div className="menu-body">
                                                        <h5>Colunas predefinidas</h5>
                                                        <div className="group-button">
                                                            <CheckBoxSwitch 
                                                            name="nome-competo" 
                                                            defaultChecked={columns.show[1]} 
                                                            value={"Nome completo"}
                                                            onClick={handleColumns}
                                                            />
                                                            <label>Nome completo</label>
                                                        </div>                   
                                                        <div className="group-button">
                                                            <CheckBoxSwitch 
                                                            name="username" 
                                                            defaultChecked={columns.show[2]} 
                                                            value={"Username"}
                                                            onClick={handleColumns}
                                                            />
                                                            <label>Username</label>
                                                        </div>
                                                        <div className="group-button">
                                                            <CheckBoxSwitch 
                                                            name="Email" 
                                                            defaultChecked={columns.show[3]} 
                                                            value={"Email"}
                                                            onClick={handleColumns}
                                                            />
                                                            <label>Email</label>
                                                        </div>
                                                        <div className="group-button">
                                                            <CheckBoxSwitch 
                                                            name="Equipe" 
                                                            defaultChecked={columns.show[4]} 
                                                            value={"Equipe"}
                                                            onClick={handleColumns}
                                                            />
                                                            <label>Equipe</label>
                                                        </div>
                                                        <div className="group-button">
                                                            <CheckBoxSwitch 
                                                            name="Status" 
                                                            defaultChecked={columns.show[5]} 
                                                            value={"Status"}
                                                            onClick={handleColumns}
                                                            />
                                                            <label>Status</label>
                                                        </div>
                                                        <h5>Outras colunas</h5>
                                                        <div className="group-button">
                                                            <CheckBoxSwitch 
                                                            name="Id"
                                                            defaultChecked={columns.show[0]}
                                                            value={'Id'}
                                                            onClick={handleColumns}/>
                                                            <label>Id</label>
                                                        </div>
                                                        <div className="group-button">
                                                            <CheckBoxSwitch 
                                                            name="Privilegios"
                                                            defaultChecked={columns.show[6]}
                                                            value={'Privilégios'}
                                                            onClick={handleColumns}/>
                                                            <label>Privilégios</label>
                                                        </div>
                                                        <div className="group-button">
                                                            <CheckBoxSwitch 
                                                            name="created_at"
                                                            defaultChecked={columns.show[7]}
                                                            value={'Data de cadastro / Admissão'}
                                                            onClick={handleColumns}/>
                                                            <label>Data de cadastro / admissão</label>
                                                        </div>
                                                        <div className="group-button">
                                                            <CheckBoxSwitch 
                                                            name="updated_at"
                                                            defaultChecked={columns.show[8]}
                                                            value={'Última atualização'}
                                                            onClick={handleColumns}/>
                                                            <label>Última atualização</label>
                                                        </div>
                                                    

                                                    </div>

                                                </div>
                                                

                                            </div>
                                    }
                                </div>                                       
                                <div className="dropdown">
                                    <button onClick={handleOpenOrder} className="btn-custom btn-border btn-pill"><i className="fa-solid fa-arrow-down-wide-short"></i> Ordem</button>
                                    { openOrder &&
                                        <div className="menu order-menu">
                                            <div className="menu-wrapper">
                                                <div className="menu-header">
                                                    <button onClick={e => setOpenOrder(false)} className="transparent"><i className="fa fa-arrow-left"></i></button>
                                                    <button onClick={e=> {
                                                        setFilters(v=>({...v,order: ''}));
                                                        setOpenOrder(false)
                                                    }
                                                    } className="btn-custom btn-pill btn-border">Redefinir</button>
                                                </div>
                                                <div className="menu-body">
                                                    <h5>Ordenar por</h5>
                                                    <div className="group-button">
                                                        <RadioPillSwitch
                                                        name="order" 
                                                        defaultChecked={filters.order === ''} 
                                                        value={""}
                                                        onClick={handleFilter}
                                                        />
                                                        <label>Id</label>
                                                    </div> 
                                                    <div className="group-button">
                                                        <RadioPillSwitch
                                                        name="order" 
                                                        defaultChecked={filters.order === 'name'} 
                                                        value={"name"}
                                                        onClick={handleFilter}
                                                        />
                                                        <label>Nome (A-Z)</label>
                                                    </div>                   
                                                    <div className="group-button">
                                                        <RadioPillSwitch 
                                                        name="order" 
                                                        defaultChecked={filters.order === 'name-desc'} 
                                                        value={"name-desc"}
                                                        onClick={handleFilter}
                                                        />
                                                        <label>Nome (Z-A)</label>
                                                    </div>
                                                    <div className="group-button">
                                                        <RadioPillSwitch 
                                                        name="order" 
                                                        defaultChecked={filters.order === 'created_at'} 
                                                        value={"created_at"}
                                                        onClick={handleFilter}
                                                        />
                                                        <label>Mais antigo</label>
                                                    </div>
                                                    <div className="group-button">
                                                        <RadioPillSwitch 
                                                        name="order" 
                                                        defaultChecked={filters.order === 'created_at-desc'} 
                                                        value={"created_at-desc"}
                                                        onClick={handleFilter}
                                                        />
                                                        <label>Mais novo</label>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    }       
                                </div> 
                            </div> 
                        </div>          
                    </div>
                    

                    <div className="table-wrapper">
                        <table className="table-custom-01">
                            <thead>
                                <tr>
                                    <th id="user_all"><input 
                                    onChange={() => {}} 
                                    checked={rowsSelected.length === infoRecords.currentPageLength ? true : false} 
                                    type="checkbox" 
                                    onClick={handleSelected}
                                    /></th>
                                    {columns.show.map((column,i) => <th key={`showColumn-${i}`} className={columns.show[i] ? "" : "hidden"}>{columns.header[i]}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, i) => {
                                    return(
                                        <tr onClick={e => navigate(`/users/edit?id=${e.target.parentElement.id}&copy=0`)} key={`user-${i}`} id={user.id}>
                                            <td onClick={e => { e.stopPropagation(); handleSelected(e) }}><input type="checkbox" /></td>
                                            <td className={columns.show[0] ? "" : "hidden"}>{user.id}</td>
                                            <td className={columns.show[1] ? "" : "hidden"}>{`${user.name} ${user.lastname ?? ""}`}</td>
                                            <td className={columns.show[2] ? "" : "hidden"}>{user.username}</td>
                                            <td className={columns.show[3] ? "" : "hidden"}>{user.email}</td>
                                            <td className={columns.show[4] ? "" : "hidden"}>{user.team ? user.team : "Indefinido"}</td>
                                            <td className={columns.show[5] ? "" : "hidden"} onClick={e=>e.stopPropagation(e)}>{STATUS_CADASTRO[user.archived === 1 ? 99 : user.status]}</td>
                                            <td className={columns.show[6] ? "" : "hidden"}>{ROLES[user.role] ?? ROLES[4]}</td>
                                            <td className={columns.show[7] ? "" : "hidden"}>{formatDate(user.created_at)}</td>
                                            <td className={columns.show[8] ? "" : "hidden"}>{formatDate(user.updated_at)}</td>
                                        </tr>
                                    );
                                })}                                         
                            </tbody>
                        </table>
                    </div>

                    <div className="table-custom-footer">
                        <h5>Total de {infoRecords.totalRecordsWithFilters ?? infoRecords.totalRecords} registros</h5>
                        
                        <div className="pages">
                            
                            {                                
                                (() => {
                                    var a = [];

                                    var max = infoRecords.totalPagesWithFilters > 0 ? infoRecords.totalPagesWithFilters : infoRecords.totalPages;
                                    var len = max >= 3 ? 3 : max;
                                
                                    if(currentPage !== 1) {    
                                        a.push(
                                            <button
                                            key={-1}
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
                                            key={-2}
                                            id='previous'
                                            className="btn-custom btn-rounded"
                                            onClick={(e) => handlePages(e)}
                                            >
                                            <i id='previous' className="fa fa-angle-left"></i>
                                            </button>);
                                    }
                                        
                                    
                                    for( var i = 1; i <= len; i++ ) {

                                        a.push(
                                        <button key={pages[i - 1]} 
                                        id={pages[i - 1]} 
                                        className={`btn-custom btn-rounded ${currentPage === pages[i - 1] ? "current-page" : ""}`} 
                                        onClick={e => {setCurrentPage(parseFloat(e.target.id)); handleSelected(e)}}
                                        >
                                        {pages[i - 1]}
                                        </button>);
                                    }

                                    if(currentPage < max) {
                                        a.push(
                                            <button
                                            key={-3}
                                            id='next'
                                            className="btn-custom btn-rounded"
                                            onClick={(e) => handlePages(e)}
                                            >
                                            <i id='next' className="fa fa-angle-right"></i>
                                            </button>
                                        );       
                                        a.push(
                                            <button
                                            key={-4}
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
        <Modal isOpen={modalRemove} setIsOpen={setModalRemove}>
        <div className="modal-body">
            <h3>Tem certeza que deseja excluir {rowsSelected.length} usuário(s) do sistema?</h3>
        </div>
        <div className="modal-footer">
            <button onClick={() => setModalRemove(false)} className="btn-custom warning">Cancelar</button>
            <button onClick={handleRemoveConfirm} className="btn-custom success">Confirmar</button>
        </div>
        </Modal>

        <Modal isOpen={modalMultiple} setIsOpen={setModalMultiple}>
        <div className="modal-content">
            <div className="modal-body">
                <div className="modal-body-wrapper">
                    <div className="form-input">
                        <label>Mover para equipe:</label>
                        <select name="team" onChange={handleMultiple}>
                        {
                            infoRecords.teamOptions.map((item, i) => {
                                return (
                                    <option value={item} key={`option-${i}`}>
                                        {item != "" ? item : "Indefinido"}
                                    </option>
                                )
                            })
                            
                        }
                        </select>
                    </div>             
                        <div className="group-button">
                            <input 
                            onChange={()=>{}} 
                            checked={multiple.unarchive} 
                            name="unarchive" 
                            onClick={handleMultiple} 
                            type="checkbox"
                            />
                            <label>Desarquivar selecionados</label>
                        </div>
                </div>
                
                
            </div>
            <div className="modal-footer">
                <button onClick={() => setModalMultiple(false)} className="btn-custom warning">Cancelar</button>
                <button onClick={handleMultipleConfirm} className="btn-custom success">Salvar</button>
            </div>
        </div>
        </Modal>

        <Modal isOpen={openImportModal} setIsOpen={setOpenImportModal}>
        <div className="modal-content">
            <h4>Importar arquivo Excel:</h4>
            <Divisor margin={12}/>
            <div className="form-input">
                <input type="file" onChange={handleImportFile}/>                
            </div>
        </div>
        </Modal>

        </Layout>
        </>
    );
}

export default Users;