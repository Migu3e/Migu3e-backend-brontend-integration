import React from 'react';
import { CHANNEL_FREQUENCIES } from '../models/channelFrequencies';

interface ChannelSelectProps {
    channel: number;
    setChannel: (channel: number) => void;
}

const ChannelSelect: React.FC<ChannelSelectProps> = (props:ChannelSelectProps) => {
    return (
        <div className="main-page__channel-select">
            <label htmlFor="channelSelect" className="main-page__select-label">Select Channel:</label>
            <select
                id="channelSelect"
                className="main-page__select"
                value={props.channel}
                onChange={(e) => props.setChannel(parseInt(e.target.value))}
            >
                {CHANNEL_FREQUENCIES.map(({ channel: ch, frequency }) => (
                    <option key={frequency} value={frequency}>
                        Channel {ch} - {frequency.toFixed(3)} MHz
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ChannelSelect;
