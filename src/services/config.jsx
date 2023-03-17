export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const formatApi = (obj) => {
    Object.keys(obj).map(k => obj[k] = 
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

export const STATUS_CADASTRO = {
    1: <div className="status-table success">Cadastro completo</div>,
    2: <div className="status-table warning">Pendente</div>,
    3: <div className="status-table danger">Inativo</div>,
    99: <div className="status-table info">Arquivado</div>,
}