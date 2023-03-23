import api from "./api";

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const formatApi = (obj) => {
    Object.keys(obj).map((k,i) => obj[k] = 
        typeof obj[k] == 'string' 
        ? 
        obj[k].trim() 
        : 
        obj[k] == null ? "" 
        : obj[k]
    ); 
}

export const hasUpperCase = (str) => {
    return /[A-Z]/.test(str);
}

export const formatDate = (date) => {
    if(date == null) return;
    var arr = date.split('-');
    var day = arr[2].split('T');
    var time = day[1].split('.');
    var result = `${day[0]}/${arr[1]}/${arr[0]} ${time[0]}`;

    return result;
}

export const formatOnlyDate = (date) => {
    var arr = date.split('/');
    var year = arr[2].split(' ');
    return `${year[0]}-${arr[0]}-${arr[1]}`;
}

export const STATUS_CADASTRO = {
    1: <div className="status-table success">Cadastro completo</div>,
    2: <div className="status-table warning">Cadastro pendente</div>,
    3: <div className="status-table danger">Inativo</div>,
    99: <div className="status-table info">Arquivado</div>,
}

export const ROLES = {
    1: "Main",
    2: "Adm",
    3: "Normal",
    4: "Parcial"
}

export const SECTIONS = {
    1: "Equipe"
}

export const ACTIONS = {
    1: "Cadastro",
    2: "Edição",
    3: "Remoção"
}

export const register = (userId,section,action,before,after) => {
    var beforeJson = null;
    if(before !== null) {
        formatApi(before);
        beforeJson = JSON.stringify(before);
    }
    formatApi(after)
    var afterJson = JSON.stringify(after);  
    parseFloat(userId)
    api.post('/records/register', {
        section: section,
        userId: userId,
        before: beforeJson,
        after: afterJson,
        action: action
    })
}