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
        <label className="flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center gap-4">
                <span 
                    className="text-sm font-medium flex-1"
                    style={{ color: 'var(--color-text-primary)' }}
                >
                    {label}
                </span>
                <input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    name={name}
                    onChange={handleChange}
                    className="w-24 px-3 py-2 text-sm text-right font-mono focus:outline-none transition-all"
                    style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--color-text-primary)',
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-border-focus)';
                        e.target.style.boxShadow = '0 0 0 3px var(--color-primary-light)';
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = 'var(--color-border)';
                        e.target.style.boxShadow = 'none';
                    }}
                />
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={handleChange}
                className="w-full h-2 cursor-pointer"
                style={{
                    accentColor: 'var(--color-primary)',
                }}
            />
        </label>
    );
}
