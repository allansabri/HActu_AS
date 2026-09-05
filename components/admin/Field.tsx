export function InputField({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
  placeholder
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm text-white/70">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue || ""}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan"
      />
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  rows = 8,
  required = false,
  placeholder
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm text-white/70">
      {label}
      <textarea
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue || ""}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-white/10 bg-black/35 px-3 py-3 text-white outline-none focus:border-max-cyan"
      />
    </label>
  );
}
