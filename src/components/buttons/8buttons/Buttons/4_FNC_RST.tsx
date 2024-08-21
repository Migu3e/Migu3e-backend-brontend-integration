import React from "react";

interface ButtonProps {
    label: string;
    subLabel?: string;
    className?: string;
}

const Button4FncRst: React.FC<ButtonProps> = (prop:ButtonProps) => (
    <button className={`button ${prop.className}`}>
        {prop.label}
        {prop.subLabel && (
            <>
                <span className="button-divider"></span>
                <span className="sub-label">{prop.subLabel}</span>
            </>
        )}
    </button>
);
export default Button4FncRst;
