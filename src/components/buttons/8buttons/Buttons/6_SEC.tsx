import React from "react";

interface ButtonProps {
    label: string;
    className?: string;
    children?: React.ReactNode;
}

const Button6Sec: React.FC<ButtonProps> = (prop:ButtonProps) => (
    <button className={`button ${prop.className}`}>
        {prop.label}
        {prop.children}
    </button>
);
export default Button6Sec;
