
interface AudioButtonProps {
    onMouseDown?: () => void;
    onMouseUp?: () => void;
    className?: string;
    isOn?: boolean
}

const AudioButton = (props:AudioButtonProps) => {
    return (
        <>
            {props.isOn ? (
                <button
                    onMouseDown={props.onMouseDown}
                    onMouseUp={props.onMouseUp}
                    className={props.className}
                >
                    Transmit
                </button>
            ): (
                <button
                    className={props.className}
                >
                    Transmit
                </button>
            )

            }
        </>
    );
};

export default AudioButton;
