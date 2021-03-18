import React, { ButtonHTMLAttributes, forwardRef, Ref } from "react";
import Spinner from "./Spinner";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  height?: string;
  width?: string;
  loading?: boolean;
  spinnerColor?: string;
  spinnerHeight?: number;
  spinnerWidth?: number;
}

const Button = forwardRef(
  (
    { children,disabled,style,className, height = "2.7rm", width = "9rem",spinnerColor,spinnerHeight,spinnerWidth, loading,...props }: Props,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        className={`btn ${className}`}
        ref={ref}
        disabled={disabled}
        style={{
          cursor: loading || disabled ? "not-allowed" : undefined,
          height,
          width,
          ...style
        }}
        {...props}
      >
        {loading ? <Spinner color={spinnerColor} height={spinnerHeight} /> : children}

      </button>
    );
  }
);

export default Button;
