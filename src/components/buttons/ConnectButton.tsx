import React from 'react';

interface ConnectButtonProps {
    onClick: () => void;
    className?: string;
}

const ConnectButton: React.FC<ConnectButtonProps> = (props:ConnectButtonProps) => {
    return (
        <button onClick={props.onClick} className={props.className}>
            Connect
        </button>
    );
};

export default ConnectButton;