
interface DisconnectButtonProps {
    onClick: () => void;
    className?: string;
}

const DisconnectButton = (props:DisconnectButtonProps) => {
    return (
        <button onClick={props.onClick} className={props.className}>
            Disconnect
        </button>
    );
};

export default DisconnectButton;