import React from 'react';

interface ClientIdDisplayProps {
    clientId: string;
}

const ClientIdDisplay: React.FC<ClientIdDisplayProps> = ({ clientId }) => {
    return <div>client id - {clientId}</div>;
};

export default ClientIdDisplay;