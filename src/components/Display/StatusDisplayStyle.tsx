import styled from 'styled-components';

const StatusDisplay = styled.div`
    font-family: 'Courier New', monospace;
    color: #002942;
    background-color: #55521f;
    padding: 10px;
    border-radius: 5px;
    width: 310px;
    height: 190px;


`;

const StatusRow = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

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
    font-size: 16px;
    margin-bottom: 2px;
`;
const StatusFreqLabel = styled(StatusLabel)`
    font-size: 17px;
    margin-bottom: 3px;
    font-weight: bold;
`;


const StatusValue = styled.div`
    font-size: 16px;
`;
const StatusFreqValue = styled(StatusValue)`
    font-size: 17px;
    font-weight: bolder;
`;

const DisplayOn = styled(StatusDisplay)`
    opacity: 1;
    margin-bottom: 63px;
`;

const DisplayOff = styled(StatusDisplay)`
    background-color: #3e3c1d;
    margin-bottom: 63px;

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
