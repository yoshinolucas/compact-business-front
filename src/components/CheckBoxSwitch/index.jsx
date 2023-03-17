import './CheckBoxSwitch.css';

const CheckBoxSwitch = ({defaultChecked, name}) => {
  return (
    <>
      <input
        className="switch-checkbox"
        id={`switch-${name}`}
        type="checkbox"
        defaultChecked={defaultChecked}
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