import './OnOffSwitch.css';

interface OnOffSwitchProps {
    isOn: boolean;
    onToggle: () => void;
}

const OnOffSwitch = (props:OnOffSwitchProps) => {
    return (

        <div>
            <label htmlFor="check" className="flex bg-gray-600 relative w-20 h-10 rounded-full cursor-pointer">
                <input
                    type="checkbox"
                    id="check"
                    checked={props.isOn}
                    onChange={props.onToggle}
                    className="sr-only peer"
                />
                <span className={`w-2/5 h-4/5 bg-black absolute rounded-full left-1 top-1 transition-all duration-200
                    ${props.isOn ? 'bg-yellow-400 left-11' : ''}`}
                />
            </label>
        </div>
    );
};

export default OnOffSwitch;