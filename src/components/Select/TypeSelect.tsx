
interface SelectDropdownProps {
    value: number;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const TypeSelector= (props:SelectDropdownProps) => {
    const options = [
        { value: 1, label: 'חייל היבשה' },
        { value: 2, label: 'חייל הים' },
        { value: 3, label: 'חייל האוויר' },
        { value: 4, label: 'מג"ב' },
    ];
    return (
        <select
            value={props.value}
            onChange={props.onChange}
            className="bg-[#3E3E3E] text-white border-2 border-[#535353] rounded-full py-[0.75rem] px-[1.5rem] text-base w-full mb-[1.5rem] focus:outline-none focus:border-[#1DB954] transition-colors duration-300 text-center"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default TypeSelector;
