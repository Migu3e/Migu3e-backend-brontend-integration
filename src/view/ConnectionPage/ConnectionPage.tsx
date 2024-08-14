import React from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectButton from '../../components/buttons/ConnectButton.tsx';
import { connect } from '../../controller/WebSocketUtils.tsx';
import './ConnectionPage.css';

const ConnectionPage: React.FC = () => {
    const navigate = useNavigate();

    const handleConnect = async () => {
        try {
            await connect();
            navigate('/main');
        } catch (error) {
            console.error('Connection error:', error);
        }
    };

    return (
        <div className="connection-page">
            <div className="connection-box">
                <img src="../../../public/vite.svg" alt="Logo" className="connection-page__logo" />
                <h1 className="connection-page__title">AudioPTTCLIENT</h1>
                <ConnectButton onClick={handleConnect} className="connection-page__button" />
            </div>
        </div>
    );
};

export default ConnectionPage;