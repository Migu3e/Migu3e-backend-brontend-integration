import React from 'react';

interface ConnectButtonProps {
    onClick: () => void;
    className?: string;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ onClick, className = '' }) => {
    return (
        <button onClick={onClick} className={className}>
            Connect
        </button>
    );
};

export default ConnectButton;