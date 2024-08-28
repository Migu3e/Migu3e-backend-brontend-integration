import React from 'react';

interface RegisterButtonProps {
    onClick: () => void;
    className?: string;
}

const RegisterButton: React.FC<RegisterButtonProps> = (props:RegisterButtonProps) => {
    return (
        <button onClick={props.onClick} className={props.className}>
            Register
        </button>
    );
};

export default RegisterButton;


