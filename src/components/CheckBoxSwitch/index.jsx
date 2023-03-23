import './CheckBoxSwitch.css';

const CheckBoxSwitch = ({defaultChecked, name, checked,onClick,value}) => {
  return (
    <>
      <input
        className="switch-checkbox"
        id={`switch-${name}`}
        type="checkbox"
        defaultChecked={defaultChecked}
        onChange={()=>{}}
        checked={checked}  
        onClick={onClick} 
        value={value}   
        name={name}
      />
      <label
        className="switch-label"
        htmlFor={`switch-${name}`}
      >
        <span className={`switch-button`} />
      </label>
    </>
  );
};

export default CheckBoxSwitch;