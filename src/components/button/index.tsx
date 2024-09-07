import React, { ButtonHTMLAttributes } from "react";
import s from "./style.module.scss";

type ButtonType = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: ButtonType;
}

const Button: React.FC<ButtonProps> = ({
  buttonType = "primary",
  ...props
}) => {
  const buttonClassName = `${s["button"]} ${s[buttonType]}`;

  return <button className={buttonClassName} {...props} />;
};

export default Button;
