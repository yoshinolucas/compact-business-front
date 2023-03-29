import './RadioPill.css';

const RadioPill = ({defaultChecked,name, css, placeholder,size, onClick, value}) => {
    var sizePill = size = "" ? "" : `btn-${size}`;
    return(
        <>
            <div className='radio-pill'>
                <input 
                onClick={onClick} 
                value={value} 
                type="radio" 
                id={`radio-btn-${name}-${value}`} 
                name={name}
                defaultChecked={defaultChecked} 
                />
                
                <label
                htmlFor={`radio-btn-${name}-${value}`}
                className={` btn-radio btn-pill ${css}-radio ${sizePill}`}
                >{placeholder}</label>
            </div>
        </>
    );
}

export default RadioPill;