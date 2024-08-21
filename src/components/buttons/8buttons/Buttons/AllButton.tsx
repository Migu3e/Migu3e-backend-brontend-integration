import React from "react";

interface ButtonProps {
    label: string;
    subLabel?: string;
    className?: string;
    children?: React.ReactNode;
}
const Button: React.FC<ButtonProps> = (prop:ButtonProps) => (
    <button className={`button ${prop.className}`}>
        {prop.label}
        {prop.subLabel && (
            <>
                <span className="button-divider"></span>
                <span className="sub-label">{prop.subLabel}</span>
            </>
        )}
        {prop.children}
    </button>
);
// can do all, but i want to keep it so it will do nothing for now
export default Button;
