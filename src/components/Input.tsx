import React, { InputHTMLAttributes, forwardRef, Ref } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef(
  (
    { label, error, type = "text", ...props }: Props,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <div className="form__input-container">
        <label htmlFor={label} className="form__input">
          {label}
        </label>
        <input 
            type={type} 
            className="input"
            {...props} 
            ref={ref}
        />
        {error && <p className="paragraph paragraph--error-small">{error}</p>}
      </div>
    );
  }
);

export default Input;
