import React from 'react';
import { CHANNEL_FREQUENCIES } from '../models/ChannelFrequencies';

interface ChannelSelectProps {
    channel: number;
    setChannel: (channel: number) => void;
    sendChannelFrequency: (frequency: number) => void; // New prop for sending frequency
}

const ChannelSelect: React.FC<ChannelSelectProps> = (props: ChannelSelectProps) => {
    return (
        <div className="main-page__channel-select">
            <label htmlFor="channelSelect" className="main-page__select-label">Select Channel:</label>
            <select
                id="channelSelect"
                className="main-page__select"
                value={props.channel}
                onChange={(e) => {
                    const newChannel = parseInt(e.target.value);
                    props.setChannel(newChannel);
                    const selectedFrequency = CHANNEL_FREQUENCIES.find((channel) => channel.channel === newChannel)?.frequency;
                    if (selectedFrequency) {
                        props.sendChannelFrequency(selectedFrequency);
                    } else {
                        console.error(`Frequency not found for channel ${newChannel}`);
                    }
                }}
            >
                {CHANNEL_FREQUENCIES.map(({ channel: ch, frequency }) => (
                    <option key={ch} value={ch}>
                        Channel {ch} - {frequency.toFixed(3)} MHz
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ChannelSelect;