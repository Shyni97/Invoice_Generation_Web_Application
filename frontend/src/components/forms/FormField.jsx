import Input from "../common/Input";

const FormField = ({
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  placeholder = "",
  error = "",
  required = false,
  multiline = false,
  rows = 3,
}) => {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <label className="block text-sm">
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
        {label}
        {required ? <span className="ml-1 text-blue-600">*</span> : null}
      </span>

      {multiline ? (
        <Input
          id={id}
          as="textarea"
          rows={rows}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
        />
      ) : (
        <Input
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          type={type}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
        />
      )}

      {error ? <span className="mt-2 block text-xs font-medium text-red-500">{error}</span> : null}
    </label>
  );
};

export default FormField;