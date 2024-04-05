import "./ToggleSwitch.scss";
export interface ToggleSwitchProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: any;
}

const ToggleSwitch = ({ id, name, checked, onChange }: ToggleSwitchProps) => {
  return (
    <>
      <label className="toggle-switch" tabIndex={1} htmlFor={id}>
        <input
          type="checkbox"
          name={name}
          className="toggle-switch-checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />

        <span className={"toggle-switch-inner"} tabIndex={-1} />
      </label>
    </>
  );
};

export default ToggleSwitch;
