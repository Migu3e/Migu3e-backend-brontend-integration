import React from 'react';

interface ClientIdDisplayProps {
    clientId: string;
    className?: string;
}

const ClientIdDisplay: React.FC<ClientIdDisplayProps> = ({ clientId, className = '' }) => {
    return <div className={className}>Client ID: {clientId}</div>;
};

export default ClientIdDisplay;