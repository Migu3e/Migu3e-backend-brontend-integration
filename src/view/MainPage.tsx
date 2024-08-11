import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioButton from '../components/buttons/AudioButton';
import DisconnectButton from '../components/buttons/DisconnectButton';
import ClientIdDisplay from '../components/ClientIdDisplay';
import WebSocketService from '../services/Utils/WebSocketUtils';
import { useAudioSender } from '../controller/useAudioSender';

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const [clientId] = useState<string | null>(WebSocketService.getClientId());
    const { isTransmitting, startTransmission, stopTransmission, channel, setChannel } = useAudioSender();


    const handleDisconnect = () => {
        WebSocketService.disconnect();
        navigate('/');
    };

    const handleAudioButtonClick = () => {
        if (isTransmitting) {
            stopTransmission();
        } else {
            startTransmission();
        }
    };

    return (
        <div>
            <h1>AudioPTTCLIENT Page</h1>
            <ClientIdDisplay clientId={clientId || 'Not connected'} />
            <AudioButton onClick={handleAudioButtonClick} />
            <DisconnectButton onClick={handleDisconnect} />
            <div>
                <label htmlFor="channelSelect">Select Channel: </label>
                <select
                    id="channelSelect"
                    value={channel}
                    onChange={(e) => setChannel(parseInt(e.target.value))}
                >
                    {[1, 2, 3, 4, 5].map((ch) => (
                        <option key={ch} value={ch}>
                            Channel {ch}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default MainPage;