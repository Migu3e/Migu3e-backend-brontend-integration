import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectButton from '../../components/buttons/ConnectButton';
import { useWebSocketContext } from '../../services/Context/WebSocketContext.tsx';
import './ConnectionPage.css';
import RegisterButton from "../../components/buttons/RegisterPage.tsx";

const ConnectionPage = () => {
    const navigate = useNavigate();
    const { connect } = useWebSocketContext();
    const [serverAddress, setServerAddress] = useState<string>('');
    const [personalNumber, setPersonalNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleConnect = async () => {
        if (!serverAddress || !personalNumber || !password) {
            setError('fill all fields');
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
                await connect(serverAddress, personalNumber); // personalNumber is clientId
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
        <div className="flex justify-center items-center h-screen">
            <div className="bg-[#282828] rounded-lg p-[2.5rem] w-[27.125rem] shadow-[0_4px_60px_rgba(0,0,0,0.5)] text-center flex flex-col items-center">
                <div>
                    <img src="/vite.svg" alt="Logo" className="w-[3.125rem] h-[3.125rem] mb-[1.25rem]"/>
                </div>
                <h1 className="text-white mb-[2rem] text-[2rem]">AudioPTTCLIENT</h1>
                {error && <p className="error-message">{error}</p>}
                <input
                    type="text"
                    value={serverAddress}
                    onChange={(e) => setServerAddress(e.target.value)}
                    placeholder="Enter server IP"
                    className="bg-[#3E3E3E] text-white border-2 border-[#535353] rounded-full py-[0.75rem] px-[1.5rem] text-base w-full mb-[1.5rem] focus:outline-none focus:border-[#1DB954] transition-colors duration-300"
                />
                <input
                    type="text"
                    value={personalNumber}
                    onChange={(e) => setPersonalNumber(e.target.value)}
                    placeholder="Enter personal number"
                    className="bg-[#3E3E3E] text-white border-2 border-[#535353] rounded-full py-[0.75rem] px-[1.5rem] text-base w-full mb-[1.5rem] focus:outline-none focus:border-[#1DB954] transition-colors duration-300"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="bg-[#3E3E3E] text-white border-2 border-[#535353] rounded-full py-[0.75rem] px-[1.5rem] text-base w-full mb-[1.5rem] focus:outline-none focus:border-[#1DB954] transition-colors duration-300 "
                />
                <ConnectButton onClick={handleConnect} className="bg-[#1DB954] text-white border border-[#1DB954] rounded-full py-[0.875rem] px-[2rem] m-3 text-base font-bold w-full transition-colors duration-300 hover:bg-[#282828] hover:text-[#1DB954]"></ConnectButton>
                <RegisterButton onClick={handleRegister} className="bg-[#CDFD02] text-white border border-[#CDFD02] rounded-full py-[0.875rem] px-[2rem] text-base font-bold w-full transition-colors duration-300 hover:bg-[#282828] hover:text-[#CDFD02]"/>
            </div>
        </div>
    );
};

export default ConnectionPage;