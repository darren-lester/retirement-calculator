type InputFieldProps = {
    label: string;
    min: number;
    max: number;
    step: number;
    value: number;
    name: string;
    onChange: (value: number | null) => void;
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
        onChange(e.target.value === "" ? null : Number(e.target.value));
    };


    return (
        <label className="flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center gap-4">
                <span
                    className="text-sm font-medium flex-1 text-slate-900"
                >
                    {label}
                </span>
                <input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={value ?? ""}
                    name={name}
                    onChange={handleChange}
                    className="w-24 px-3 py-2 text-sm text-right font-mono focus:outline-none transition-all bg-slate-50 border border-slate-200 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(219,234,254,1)] rounded-md text-slate-900"
                />
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value ?? ""}
                onChange={handleChange}
                className="w-full h-2 cursor-pointer accent-blue-600"
            />
        </label>
    );
}
