import FormField from "./FormField";

const PartyDetailsSection = ({
  title,
  description,
  fields,
  values,
  errors = {},
  touched = {},
  onFieldChange,
  onFieldBlur,
}) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={field.span === 2 ? "sm:col-span-2" : ""}>
            <FormField
              label={field.label}
              type={field.type}
              value={values[field.name] ?? ""}
              placeholder={field.placeholder}
              required={field.required}
              multiline={field.multiline}
              rows={field.rows}
              error={touched[field.name] ? errors[field.name] : ""}
              onChange={(event) => onFieldChange(field.name, event.target.value)}
              onBlur={() => onFieldBlur(field.name)}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PartyDetailsSection;