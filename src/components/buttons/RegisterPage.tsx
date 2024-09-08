
interface RegisterButtonProps {
    onClick: () => void;
    className?: string;
}

const RegisterButton = (props:RegisterButtonProps) => {
    return (
        <button onClick={props.onClick} className={props.className}>
            Register
        </button>
    );
};

export default RegisterButton;


