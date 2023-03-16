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

export const STATUS_CADASTRO = {
    1: <div className="status-table success">Ativo</div>,
    2: <div className="status-table warning">Pendente</div>,
    3: <div className="status-table info">Arquivado</div>,
    4: <div className="status-table danger">Inativo</div>
}