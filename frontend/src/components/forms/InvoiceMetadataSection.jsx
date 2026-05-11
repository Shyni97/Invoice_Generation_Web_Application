import FormField from "./FormField";

const InvoiceMetadataSection = ({
  values,
  errors = {},
  touched = {},
  onFieldChange,
  onFieldBlur,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">Invoice metadata</p>
        <p className="mt-2 text-sm leading-6 text-slate-500">Set the invoice number and payment dates.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField
          label="Invoice number"
          value={values.invoiceNumber}
          placeholder="INV-2026-0001"
          required
          error={touched.invoiceNumber ? errors.invoiceNumber : ""}
          onChange={(event) => onFieldChange("invoiceNumber", event.target.value)}
          onBlur={() => onFieldBlur("invoiceNumber")}
        />

        <FormField
          label="Issue date"
          type="date"
          value={values.issueDate}
          required
          error={touched.issueDate ? errors.issueDate : ""}
          onChange={(event) => onFieldChange("issueDate", event.target.value)}
          onBlur={() => onFieldBlur("issueDate")}
        />

        <FormField
          label="Due date"
          type="date"
          value={values.dueDate}
          required
          error={touched.dueDate ? errors.dueDate : ""}
          onChange={(event) => onFieldChange("dueDate", event.target.value)}
          onBlur={() => onFieldBlur("dueDate")}
        />
      </div>
    </section>
  );
};

export default InvoiceMetadataSection;