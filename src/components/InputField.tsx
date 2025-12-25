type InputFieldProps = {
    label: string;
    min: number;
    max?: number;
    step: number;
    defaultValue: number;
    name: string;
};

export function InputField({
    label,
    min,
    max,
    step,
    defaultValue,
    name,
}: InputFieldProps) {
    return (
        <label className="flex flex-row gap-2">
            {label}
            <input type="number" min={min} max={max} step={step} defaultValue={defaultValue} name={name} />
        </label>
    );
}
