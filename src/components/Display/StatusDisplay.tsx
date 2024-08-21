import React from 'react';
import {
    StatusRow as StyledStatusRow,
    StatusRowOther as StyledStatusRowOther,
    TopRow as StyledTopRow,
    StatusItem as StyledStatusItem,
    VolumeItem as StyledVolumeItem,
    ClientIdItem as StyledClientIdItem,
    StatusLabel as StyledStatusLabel,
    StatusValue as StyledStatusValue,
    DisplayOn as StyledDisplayOn,
    DisplayOff as StyledDisplayOff,
    StatusFreqLabel as StyledStatusFreq,
    StatusFreqValue as StyledStatusFreqValue
} from './StatusDisplayStyle.tsx';

interface StatusDisplayProps {
    clientId: string;
    volume: number;
    channel: number;
    frequency: number | undefined;
    isOn: boolean;
}

const StatusDisplay: React.FC<StatusDisplayProps> = (props:StatusDisplayProps) => {
    const currentDate = new Date().toLocaleDateString();

    return (
        <>
            {props.isOn ? (
                <StyledDisplayOn>
                    <StyledTopRow>
                        <StyledStatusRow>
                            <StyledVolumeItem>
                                <StyledStatusLabel>Volume:</StyledStatusLabel>
                                <StyledStatusValue>{props.volume}</StyledStatusValue>
                            </StyledVolumeItem>
                            <StyledStatusItem>
                                <StyledStatusLabel>Date:</StyledStatusLabel>
                                <StyledStatusValue>{currentDate}</StyledStatusValue>
                            </StyledStatusItem>
                            <StyledClientIdItem>
                                <StyledStatusLabel>Client ID:</StyledStatusLabel>
                                <StyledStatusValue>{props.clientId}</StyledStatusValue>
                            </StyledClientIdItem>
                        </StyledStatusRow>
                        <StyledStatusRowOther>
                            <StyledStatusItem>
                                <StyledStatusFreq>Frequency:</StyledStatusFreq>
                                <StyledStatusFreqValue>{props.frequency}.0000</StyledStatusFreqValue>
                            </StyledStatusItem>
                        </StyledStatusRowOther>
                        <StyledStatusRowOther>
                            <StyledStatusItem>
                                <StyledStatusLabel>Channel:</StyledStatusLabel>
                                <StyledStatusValue>{props.channel}</StyledStatusValue>
                            </StyledStatusItem>
                        </StyledStatusRowOther>
                    </StyledTopRow>
                </StyledDisplayOn>
            ) : (
                <StyledDisplayOff />
            )}
        </>
    );
};

export default StatusDisplay;
