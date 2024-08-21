import styled from 'styled-components';

const StatusDisplay = styled.div`
    font-family: 'Courier New', monospace;
    color: #002942;
    background-color: #55521f;
    padding: 0.625rem; 
    border-radius: 0.3125rem; 
    width: 19.375rem; 
    height: 11.875rem;
`;

const StatusRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.625rem; 
`;

const StatusRowOther = styled(StatusRow)`
    justify-content: center;
    align-items: center;
`;

const TopRow = styled.div`
    align-items: center;
`;

const StatusItem = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const VolumeItem = styled(StatusItem)`
    align-items: flex-start;
`;

const ClientIdItem = styled(StatusItem)`
    align-items: flex-end;
`;

const StatusLabel = styled.div`
    font-size: 1rem; 
    margin-bottom: 0.125rem; 
`;
const StatusFreqLabel = styled(StatusLabel)`
    font-size: 1.0625rem; 
    margin-bottom: 0.1875rem; 
    font-weight: bold;
`;

const StatusValue = styled.div`
    font-size: 1rem; 
`;
const StatusFreqValue = styled(StatusValue)`
    font-size: 1.0625rem; 
    font-weight: bolder;
`;

const DisplayOn = styled(StatusDisplay)`
    opacity: 1;
    margin-bottom: 3.9375rem; 
`;

const DisplayOff = styled(StatusDisplay)`
    background-color: #3e3c1d;
    margin-bottom: 3.9375rem; 
`;

export {
    StatusDisplay,
    StatusRow,
    StatusRowOther,
    TopRow,
    StatusItem,
    VolumeItem,
    ClientIdItem,
    StatusLabel,
    StatusValue,
    DisplayOn,
    StatusFreqLabel,
    StatusFreqValue,
    DisplayOff,
};
