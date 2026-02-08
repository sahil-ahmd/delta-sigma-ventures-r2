import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "danger" | "option";
  size?: "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  // Combine classes based on props
  const buttonClass = ["btn", `btn-${variant}`, `btn-${size}`, className].join(
    " ",
  );

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};
