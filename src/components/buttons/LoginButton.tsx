import React from 'react';

interface LogintButtonProps {
    onClick: () => void;
    className?: string;
}

const LoginButton: React.FC<LogintButtonProps> = (props:LogintButtonProps) => {
    return (
        <button onClick={props.onClick} className={props.className}>
            Login
        </button>
    );
};

export default LoginButton;
