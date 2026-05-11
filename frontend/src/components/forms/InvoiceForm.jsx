import { useEffect, useMemo, useState } from "react";

import Card from "../common/Card";
import Button from "../common/Button";
import SectionTitle from "../common/SectionTitle";
import InvoiceMetadataSection from "./InvoiceMetadataSection";
import InvoiceItemsTable from "./InvoiceItemsTable";
import PartyDetailsSection from "./PartyDetailsSection";
import { calculateInvoiceTotals, calculateSubtotal, formatCurrency } from "../../utils/invoiceCalculations";

const billerFields = [
  { name: "name", label: "Company name", placeholder: "Acme Studio", required: true },
  { name: "address", label: "Address", placeholder: "Street, city, state", required: true, multiline: true, span: 2 },
  { name: "email", label: "Email", placeholder: "billing@acme.com", type: "email", required: true },
  { name: "contact", label: "Contact number", placeholder: "+1 555 123 4567", required: true },
];

const clientFields = [
  { name: "name", label: "Client name", placeholder: "Client name", required: true },
  { name: "address", label: "Address", placeholder: "Street, city, state", required: true, multiline: true, span: 2 },
  { name: "email", label: "Email", placeholder: "client@example.com", type: "email", required: true },
];

const emptyPartyErrors = { name: "", address: "", email: "", contact: "" };

const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

const generateInvoiceNumber = () => {
  const stamp = new Date();
  const datePart = `${stamp.getFullYear()}${String(stamp.getMonth() + 1).padStart(2, "0")}${String(stamp.getDate()).padStart(2, "0")}`;
  const timePart = `${String(stamp.getHours()).padStart(2, "0")}${String(stamp.getMinutes()).padStart(2, "0")}${String(stamp.getSeconds()).padStart(2, "0")}`;

  return `INV-${datePart}-${timePart}`;
};

const validateParty = (section, values) => {
  const errors = { ...emptyPartyErrors };

  if (!values.name.trim()) errors.name = section === "biller" ? "Company name is required." : "Client name is required.";
  if (!values.address.trim()) errors.address = "Address is required.";
  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!validateEmail(values.email)) errors.email = "Enter a valid email address.";

  if (section === "biller" && !values.contact.trim()) {
    errors.contact = "Contact number is required.";
  }

  return errors;
};

const validateMetadata = (values) => {
  const errors = {
    invoiceNumber: values.invoiceNumber.trim() ? "" : "Invoice number is required.",
    issueDate: values.issueDate ? "" : "Issue date is required.",
    dueDate: values.dueDate ? "" : "Due date is required.",
  };

  if (values.issueDate && values.dueDate && values.dueDate < values.issueDate) {
    errors.dueDate = "Due date cannot be before issue date.";
  }

  return errors;
};

const validateItems = (items) => {
  return items.map((item) => ({
    quantity:
      Number(item.quantity) < 0
        ? "Quantity cannot be negative."
        : Number.isNaN(Number(item.quantity))
          ? "Quantity must be a number."
          : "",
    unitPrice:
      Number(item.unitPrice) < 0
        ? "Unit price cannot be negative."
        : Number.isNaN(Number(item.unitPrice))
          ? "Unit price must be a number."
          : "",
  }));
};

const tabs = [
  { id: "basic", label: "Basic Details" },
  { id: "items", label: "Line Items" },
  { id: "notes", label: "Additional Notes" },
];

const InvoiceForm = ({ invoiceData, setInvoiceData }) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [touched, setTouched] = useState({
    biller: { name: false, address: false, email: false, contact: false },
    client: { name: false, address: false, email: false },
    metadata: { invoiceNumber: false, issueDate: false, dueDate: false },
  });

  const [errors, setErrors] = useState({
    biller: validateParty("biller", invoiceData.biller),
    client: validateParty("client", invoiceData.client),
    metadata: validateMetadata(invoiceData),
    items: validateItems(invoiceData.items),
  });

  useEffect(() => {
    if (!invoiceData.invoiceNumber) {
      setInvoiceData((prev) => ({ ...prev, invoiceNumber: generateInvoiceNumber() }));
    }
  }, [invoiceData.invoiceNumber, setInvoiceData]);

  const handleChange = (path, val) => {
    setInvoiceData((prev) => {
      const next = { ...prev };
      const keys = path.split(".");
      let cur = next;
      for (let index = 0; index < keys.length - 1; index += 1) {
        const key = keys[index];
        cur[key] = { ...cur[key] };
        cur = cur[key];
      }
      cur[keys[keys.length - 1]] = val;
      return next;
    });
  };

  const updatePartyField = (section, field, value) => {
    handleChange(`${section}.${field}`, value);

    if (touched[section][field]) {
      const nextValues = { ...invoiceData[section], [field]: value };
      setErrors((prev) => ({ ...prev, [section]: validateParty(section, nextValues) }));
    }
  };

  const markFieldTouched = (section, field) => {
    setTouched((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: true },
    }));

    setErrors((prev) => ({
      ...prev,
      [section]: validateParty(section, invoiceData[section]),
    }));
  };

  const updateMetadataField = (field, value) => {
    handleChange(field, value);

    setErrors((prev) => ({
      ...prev,
      metadata: validateMetadata({ ...invoiceData, [field]: value }),
    }));
  };

  const markMetadataTouched = (field) => {
    setTouched((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: true },
    }));

    setErrors((prev) => ({
      ...prev,
      metadata: validateMetadata(invoiceData),
    }));
  };

  const handleItemChange = (index, field, value) => {
    const sanitizedValue = field === "description" ? value : value === "" ? "" : Math.max(0, Number(value));

    setInvoiceData((prev) => {
      const items = prev.items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: sanitizedValue } : item));
      return { ...prev, items };
    });

    setErrors((prev) => {
      const nextItems = invoiceData.items.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: sanitizedValue } : item));

      return { ...prev, items: validateItems(nextItems) };
    });
  };

  const addItem = () => {
    setInvoiceData((prev) => ({ ...prev, items: [...prev.items, { description: "", quantity: 1, unitPrice: 0 }] }));
    setErrors((prev) => ({ ...prev, items: [...prev.items, { quantity: "", unitPrice: "" }] }));
    setActiveTab("items");
  };

  const removeItem = (index) => {
    setInvoiceData((prev) => ({ ...prev, items: prev.items.filter((_, itemIndex) => itemIndex !== index) }));
    setErrors((prev) => ({ ...prev, items: prev.items.filter((_, itemIndex) => itemIndex !== index) }));
  };

  const subtotal = useMemo(() => calculateSubtotal(invoiceData.items), [invoiceData.items]);
  const totals = useMemo(
    () => calculateInvoiceTotals(invoiceData.items, invoiceData.tax, invoiceData.discount),
    [invoiceData.discount, invoiceData.items, invoiceData.tax],
  );

  const renderBasicDetails = () => (
    <div className="space-y-5">
      <InvoiceMetadataSection
        values={invoiceData}
        errors={errors.metadata}
        touched={touched.metadata}
        onFieldChange={updateMetadataField}
        onFieldBlur={markMetadataTouched}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PartyDetailsSection
          title="From (you)"
          description="Business details shown on the invoice header."
          fields={billerFields}
          values={invoiceData.biller}
          errors={errors.biller}
          touched={touched.biller}
          onFieldChange={(field, value) => updatePartyField("biller", field, value)}
          onFieldBlur={(field) => markFieldTouched("biller", field)}
        />

        <PartyDetailsSection
          title="Bill to"
          description="Customer details for the invoice recipient."
          fields={clientFields}
          values={invoiceData.client}
          errors={errors.client}
          touched={touched.client}
          onFieldChange={(field, value) => updatePartyField("client", field, value)}
          onFieldBlur={(field) => markFieldTouched("client", field)}
        />
      </div>
    </div>
  );

  const renderLineItems = () => (
    <div className="space-y-5">
      <InvoiceItemsTable
        items={invoiceData.items}
        errors={errors.items}
        onAddItem={addItem}
        onItemChange={handleItemChange}
        onRemove={removeItem}
      />

      <Card className="p-5">
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4 text-slate-500">
            <span>Subtotal</span>
            <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-500">
            <span>Tax ({invoiceData.tax || 0}%)</span>
            <span className="font-medium text-slate-900">{formatCurrency(totals.taxAmount)}</span>
          </div>
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between gap-4 text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>{formatCurrency(totals.grandTotal)}</span>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderNotes = () => (
    <Card className="p-5 sm:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block text-sm">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Tax (%)</span>
          <input
            value={invoiceData.tax}
            onChange={(event) => handleChange("tax", Number(event.target.value))}
            type="number"
            className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </label>
        <label className="block text-sm">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Discount (%)</span>
          <input
            value={invoiceData.discount}
            onChange={(event) => handleChange("discount", Number(event.target.value))}
            type="number"
            className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />
        </label>
      </div>

      <label className="mt-4 block text-sm">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Additional notes</span>
        <textarea
          value={invoiceData.notes}
          onChange={(event) => handleChange("notes", event.target.value)}
          rows={5}
          className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          placeholder="Add payment terms, bank details, or a thank-you note..."
        />
      </label>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        <p className="leading-6">
          The invoice preview updates automatically as you edit. Drafts continue to save locally in the browser.
        </p>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionTitle
          title="New Invoice"
          description="Create a professional invoice for your client."
        />

        <Button variant="secondary" className="h-11 px-5 text-sm font-semibold" onClick={() => {}}>
          Save Draft
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 px-5 pt-5 sm:px-6">
          <div className="flex items-center gap-6 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative shrink-0 pb-4 text-sm font-medium transition ${
                    isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                  {isActive ? <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-600" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {activeTab === "basic" ? renderBasicDetails() : null}
          {activeTab === "items" ? renderLineItems() : null}
          {activeTab === "notes" ? renderNotes() : null}
        </div>
      </Card>
    </div>
  );
};

export default InvoiceForm;
