import './SearchInput.css';


const SearchInput = ({search, setSearch, setCurrentPage, setPages, handleSelected}) => {
    return(
        <div className="search-wrapper">
            <i className="fa fa-search"></i>
            <input className="search border-radius03" value={search} 
        onChange={e => { 
            setSearch(v=>({...v,search:e.target.value})); 
            setCurrentPage(v=>({...v,currentPage:1})); 
            setPages([1,2,3]);
            handleSelected(e);
        }} 
        placeholder="Pesquisar..."/>                                        
        </div> 
    )
}

export default SearchInput;