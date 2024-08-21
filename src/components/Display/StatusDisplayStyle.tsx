import styled from 'styled-components';

const StatusDisplay = styled.div`
    font-family: 'Courier New', monospace;
    color: #002942;
    background-color: #55521f;
    padding: 10px;
    border-radius: 5px;
    width: 310px;
    height: 170px;


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
    font-size: 12px;
    margin-bottom: 2px;
`;

const StatusValue = styled.div`
    font-size: 16px;
    font-weight: bold;
`;

const DisplayOn = styled(StatusDisplay)`
    opacity: 1;
    margin-bottom: 63px;
`;

const DisplayOff = styled(StatusDisplay)`
    background-color: #3e3c1d;
    margin-bottom: 63px;
    width: 310px;
    height: 170px;
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
    DisplayOff,
};
