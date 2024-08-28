import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectButton from '../../components/buttons/ConnectButton';
import { useWebSocketController } from '../../controller/useWebSocketController.tsx';
import './RegisterPage.css';
import LoginButton from "../../components/buttons/LoginButton.tsx";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { connect } = useWebSocketController();
    const [serverAddress, setServerAddress] = useState<string>('');
    const [personalNumber, setPersonalNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordagain, setPasswordAgain] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<number>(1);

    const handleConnect = async () => {
        try {
            await connect(serverAddress);
            navigate('/main');
        } catch (error) {
            console.error('Connection error:', error);
        }
    };
    const handleLogin = async () => {
        try {
            navigate('/');
        } catch (error) {
            console.error('Connection error:', error);
        }
    };
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(Number(e.target.value));
    };


    return (
        <div className="connection-page">
            <div className="connection-box">
                <div className="connection-page__logo_container">
                    <img src="/vite.svg" alt="Logo" className="connection-page__logo"/>
                </div>
                <h1 className="connection-page__title">AudioPTTCLIENT</h1>
                <input
                    type="text"
                    value={serverAddress}
                    onChange={(e) => setServerAddress(e.target.value)}
                    placeholder="Enter server IP"
                    className="connection-page__input"
                />
                <input
                    type="text"
                    value={personalNumber}
                    onChange={(e) => setPersonalNumber(e.target.value)}
                    placeholder="Enter personal number"
                    className="connection-page__input"
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="connection-page__input"
                />
                
                <input
                    type="password"
                    value={passwordagain}
                    onChange={(e) => setPasswordAgain(e.target.value)}
                    placeholder="Enter password again"
                    className="connection-page__input"
                />   
                <select
                    value={selectedOption}
                    onChange={handleSelectChange}
                    className="connection-page__input_select">
                            
                        <option value={1}>חייל היבשה</option>
                        <option value={2}>חייל הים</option>
                        <option value={3}>חייל היבשה</option>
                        <option value={4}>מג"ב</option>
                </select>
                <ConnectButton onClick={handleConnect} className="connection-page__button"/>
                <LoginButton onClick={handleLogin} className="connection-page__button_Login"/>

            </div>
        </div>
    );
};

export default RegisterPage;