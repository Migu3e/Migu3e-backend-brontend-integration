import React from 'react';

interface ClientIdDisplayProps {
    clientId: string;
    className?: string;
}

const ClientIdDisplay: React.FC<ClientIdDisplayProps> = (props:ClientIdDisplayProps) => {
    return <div className={props.className}>Client ID: {props.clientId}</div>;
};

export default ClientIdDisplay;