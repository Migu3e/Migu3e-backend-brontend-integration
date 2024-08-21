import React from "react";

interface ButtonProps {
    label: string;
    className?: string;
    children?: React.ReactNode;
}

const Button5Clr: React.FC<ButtonProps> = (prop:ButtonProps) => (
    <button className={`button ${prop.className}`}>
        {prop.label}
        {prop.children}
    </button>
);
export default Button5Clr;
