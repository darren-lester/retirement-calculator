type FieldsetProps = {
    children: React.ReactNode;
    label: string;
};

export function Fieldset({ children, label }: FieldsetProps) {
    return (
        <fieldset className="mb-6 last:mb-0">
            <legend
                className="text-base font-semibold mb-4 text-slate-900"
            >
                {label}
            </legend>
            <div className="space-y-4">
                {children}
            </div>
        </fieldset>
    );
}