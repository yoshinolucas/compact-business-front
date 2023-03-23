import './RadioPillSwitch.css';

const RadioPillSwitch = ({defaultChecked, name,onClick,value}) => {
  return (
    <>
      <input
        className="switch-radio-pill"
        id={`switch-radio-pill-${name}-${value}`}
        type="radio"
        defaultChecked={defaultChecked}
        onClick={onClick} 
        value={value}   
        name={name}
      />
      <label
        className="switch-radio-pill-label"
        htmlFor={`switch-radio-pill-${name}-${value}`}
      >
        <span className={`switch-radio-pill-button`} />
      </label>
    </>
  );
};

export default RadioPillSwitch;