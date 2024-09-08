
interface ConnectButtonProps {
    onClick: () => void;
    className?: string;
}

const ConnectButton = (props:ConnectButtonProps) => {
    return (
        <button onClick={props.onClick} className={props.className}>
            Connect
        </button>
    );
};

export default ConnectButton;