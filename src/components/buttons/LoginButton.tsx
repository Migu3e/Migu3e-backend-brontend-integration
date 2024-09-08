
interface LogintButtonProps {
    onClick: () => void;
    className?: string;
}

const LoginButton = (props:LogintButtonProps) => {
    return (
        <button onClick={props.onClick} className={props.className}>
            Login
        </button>
    );
};

export default LoginButton;
