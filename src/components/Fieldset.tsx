type FieldsetProps = {
    children: React.ReactNode;
    label: string;
};

export function Fieldset({ children, label }: FieldsetProps) {
    return (
        <fieldset className="ml-2">
            <legend className="text-lg font-bold">{label}</legend>
            {children}
        </fieldset>
    );
}