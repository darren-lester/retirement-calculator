type InputFieldProps = {
    label: string;
    min: number;
    max?: number;
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
    return (
        <label className="flex flex-row gap-2">
            {label}
            <input
                type="number"
                min={min}
                max={max}
                step={step}
                value={value}
                name={name}
                onChange={(e) => onChange(Number(e.target.value))}
            />
        </label>
    );
}
