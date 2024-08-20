import React from 'react';
import './StatusDisplay.css';

interface StatusDisplayProps {
    clientId: string;
    volume: number;
    channel: number;
    frequency: number | undefined;
}

const StatusDisplay: React.FC<StatusDisplayProps> = (Props) => {
    const currentDate = new Date().toLocaleDateString(); // This will give you a localized date string

    return (
        <div className="status-display">
            <div className="status-row top-row">
                <div className="status-item volume-item">
                    <span className="status-label">Volume:</span>
                    <span className="status-value">{Props.volume}</span>
                </div>
                <div className="status-item">
                    <span className="status-label">Date:</span>
                    <span className="status-value">{currentDate}</span>
                </div>
                <div className="status-item client-id-item">
                    <span className="status-label">Client ID:</span>
                    <span className="status-value">{Props.clientId}</span>
                </div>
            </div>
            <div className="status-row-other">
                <div className="status-item">
                    <span className="status-label">Frequency:</span>
                    <span className="status-value">{Props.frequency}.0000</span>
                </div>
            </div>
            <div className="status-row-other">

                <div className="status-item">
                    <span className="status-label">Channel:</span>
                    <span className="status-value">{Props.channel}</span>
                </div>
            </div>

        </div>
    );
};

export default StatusDisplay;