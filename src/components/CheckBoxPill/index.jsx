import './CheckBoxPill.css';

const CheckBoxPill = ({checked, defaultChecked,name, css, placeholder,size, onClick, value}) => {
    var sizePill = size = "" ? "" : `btn-${size}`;
    return(
        <>
            <div>
            <input onChange={()=>{}} checked={checked} defaultChecked={defaultChecked} onClick={onClick} value={value} type="checkbox" id={`checkbox-btn-${name}-${value}`} name={name} />
            <label
            htmlFor={`checkbox-btn-${name}-${value}`}
            className={` btn-checkbox btn-pill ${css}-checkbox ${sizePill}`}
            >{placeholder}</label>
            </div>
        </>
    );
}

export default CheckBoxPill;