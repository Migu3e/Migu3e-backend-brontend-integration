import React from "react";

interface ButtonProps {
    label: string;
    className?: string;
    children?: React.ReactNode;
}

const Button7Aj: React.FC<ButtonProps> = (prop:ButtonProps) => (
    <button className={`button ${prop.className}`}>
        {prop.label}
        {prop.children}
    </button>
);
export default Button7Aj;
