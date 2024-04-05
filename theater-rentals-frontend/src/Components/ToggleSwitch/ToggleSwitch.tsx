export interface IToggleSwitch{
    id: string,
    name?: string,
    checked: boolean,
    onChange: any,
    optionLabels?: any,
    small?: any,
    disabled?: boolean
}

const ToggleSwitch = ({
    id,
    name,
    checked,
    onChange,
    optionLabels,
    small,
    disabled
  }: IToggleSwitch)=>{
  function handleKeyPress(e: any) {
    if (e.keyCode !== 32) return;

    e.preventDefault();
    onChange(!checked);
  }
    
  return (
    <div className={"toggle-switch" + (small ? " small-switch" : "")}>
      <input
        type="checkbox"
        name={name}
        className="toggle-switch-checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      {id ? (
        <label
          className="toggle-switch-label"
          tabIndex={disabled ? -1 : 1}
          onKeyDown={(e) => handleKeyPress(e)}
          htmlFor={id}
        >
          <span
            className={
              disabled
                ? "toggle-switch-inner toggle-switch-disabled"
                : "toggle-switch-inner"
            }
            data-yes={optionLabels[0]}
            data-no={optionLabels[1]}
            tabIndex={-1}
          />
          <span
            className={
              disabled
                ? "toggle-switch-switch toggle-switch-disabled"
                : "toggle-switch-switch"
            }
            tabIndex={-1}
          />
        </label>
      ) : null}
    </div>
  );
};

ToggleSwitch.defaultProps = {
    optionLabels: ["Yes", "No"]
  };
  
// ToggleSwitch.propTypes = {
// id: PropTypes.string.isRequired,
// checked: PropTypes.bool.isRequired,
// onChange: PropTypes.func.isRequired,
// name: PropTypes.string,
// optionLabels: PropTypes.array,
// small: PropTypes.bool,
// disabled: PropTypes.bool
// };
export default ToggleSwitch;