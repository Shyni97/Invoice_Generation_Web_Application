const fieldStyles =
  "mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

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
      <span className="flex items-center gap-1 font-medium text-gray-700">
        {label}
        {required ? <span className="text-red-500">*</span> : null}
      </span>

      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          className={`${fieldStyles} resize-none`}
          aria-invalid={Boolean(error)}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={fieldStyles}
          aria-invalid={Boolean(error)}
        />
      )}

      {error ? <span className="mt-1 block text-xs text-red-500">{error}</span> : null}
    </label>
  );
};

export default FormField;