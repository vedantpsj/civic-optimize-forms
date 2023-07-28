import { FieldErrors, FieldValues } from "react-hook-form";
import "../../App.scss";

export interface InputProps {
  name: string;
  label?: string;
  placeholder: string;
  errors?: FieldErrors<FieldValues | any>;
  register: any;
  type: "text" | "number";
  autocomplete?: "on" | "off";
  extraClass?: string | undefined;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

export default function Input(props: InputProps) {
  const {
    register,
    name,
    disabled = false,
    label,
    errors,
    type,
    placeholder,
    autocomplete = "off",
    required = false,
    readOnly = false,
  } = props;

  return (
    <div className="mb-3">
      <label className="theaterData__form-formLabel mb-1">
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
      <div className="form-floating theaterData__form-formFloating mb-3">
        <input
          disabled={disabled}
          {...register(name)}
          type={type}
          placeholder={placeholder}
          autoComplete={autocomplete}
          readOnly={readOnly}
          class="form-control"
        />
        <label htmlFor="floatingInput">{label}</label>
      </div>
    </div>
  );
}
