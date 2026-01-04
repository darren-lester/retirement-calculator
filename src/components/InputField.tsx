type InputFieldProps = {
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
    name: string;
    onChange: (value: number) => void;
};

export function InputField({
    label,
    min,
    max,
    step,
    value,
    name,
    onChange,
}: InputFieldProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value));
    };

    return (
        <label className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center gap-2">
                <span>{label}</span>
                <input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    name={name}
                    onChange={handleChange}
                    className="w-24 px-2 py-1 border border-gray-300 rounded"
                />
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
                className="w-full"
            />
        </label>
    );
}
