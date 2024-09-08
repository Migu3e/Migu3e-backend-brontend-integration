import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectButton from '../../components/buttons/ConnectButton';
import { useWebSocketController } from '../../controller/useWebSocketController.tsx';
import './ConnectionPage.css';
import RegisterButton from "../../components/buttons/RegisterPage.tsx";

const ConnectionPage = () => {
    const navigate = useNavigate();
    const { connect } = useWebSocketController();
    const [serverAddress, setServerAddress] = useState<string>('');
    const [personalNumber, setPersonalNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleConnect = async () => {
        if (!serverAddress || !personalNumber || !password) {
            setError('All fields are required');
            return;
        }

        try {
            const response = await fetch(`http://${serverAddress}:5000/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ClientID: personalNumber,
                    Password: password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                await connect(serverAddress, personalNumber); // Pass personalNumber as clientId
                navigate('/main')
                

            } else {
                const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
                setError(errorData.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred during login. Please check the server address and try again.');
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="connection-page">
            <div className="connection-box">
                <div className="connection-page__logo_container">
                    <img src="/vite.svg" alt="Logo" className="connection-page__logo"/>
                </div>
                <h1 className="connection-page__title">AudioPTTCLIENT</h1>
                {error && <p className="error-message">{error}</p>}
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
                <ConnectButton onClick={handleConnect} className="connection-page__button"></ConnectButton>
                <RegisterButton onClick={handleRegister} className="connection-page__button_Login"/>
            </div>
        </div>
    );
};

export default ConnectionPage;