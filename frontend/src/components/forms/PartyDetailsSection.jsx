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
    <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm sm:p-5">
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">{title}</p>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p> : null}
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