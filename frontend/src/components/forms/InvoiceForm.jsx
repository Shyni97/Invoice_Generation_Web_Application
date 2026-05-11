import { useEffect, useMemo, useState } from "react";

import InvoiceMetadataSection from "./InvoiceMetadataSection";
import InvoiceItemsTable from "./InvoiceItemsTable";
import PartyDetailsSection from "./PartyDetailsSection";
import { calculateSubtotal, formatCurrency } from "../../utils/invoiceCalculations";

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

const InvoiceForm = ({ invoiceData, setInvoiceData }) => {
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
      setInvoiceData(prev => ({ ...prev, invoiceNumber: generateInvoiceNumber() }));
    }
  }, [invoiceData.invoiceNumber, setInvoiceData]);

  const handleChange = (path, val) => {
    setInvoiceData(prev => {
      const next = { ...prev };
      const keys = path.split('.');
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        cur[k] = { ...cur[k] };
        cur = cur[k];
      }
      cur[keys[keys.length - 1]] = val;
      return next;
    });
  };

  const updatePartyField = (section, field, value) => {
    handleChange(`${section}.${field}`, value);

    if (touched[section][field]) {
      const nextValues = { ...invoiceData[section], [field]: value };
      setErrors(prev => ({ ...prev, [section]: validateParty(section, nextValues) }));
    }
  };

  const markFieldTouched = (section, field) => {
    setTouched(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: true },
    }));

    setErrors(prev => ({
      ...prev,
      [section]: validateParty(section, invoiceData[section]),
    }));
  };

  const updateMetadataField = (field, value) => {
    handleChange(field, value);

    setErrors(prev => ({
      ...prev,
      metadata: validateMetadata({ ...invoiceData, [field]: value }),
    }));
  };

  const markMetadataTouched = (field) => {
    setTouched(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: true },
    }));

    setErrors(prev => ({
      ...prev,
      metadata: validateMetadata(invoiceData),
    }));
  };

  const handleItemChange = (index, field, value) => {
    const sanitizedValue = field === "description" ? value : value === "" ? "" : Math.max(0, Number(value));

    setInvoiceData(prev => {
      const items = prev.items.map((it, i) => (i === index ? { ...it, [field]: sanitizedValue } : it));
      return { ...prev, items };
    });

    setErrors(prev => {
      const nextItems = invoiceData.items.map((item, i) => (
        i === index ? { ...item, [field]: sanitizedValue } : item
      ));

      return { ...prev, items: validateItems(nextItems) };
    });
  };

  const addItem = () => {
    setInvoiceData(prev => ({ ...prev, items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }] }));
    setErrors(prev => ({ ...prev, items: [...prev.items, { quantity: '', unitPrice: '' }] }));
  };

  const removeItem = (index) => {
    setInvoiceData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    setErrors(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const subtotal = useMemo(() => calculateSubtotal(invoiceData.items), [invoiceData.items]);

  return (
    <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Invoice Details</h2>
        <p className="mt-1 text-sm text-gray-500">Enter biller and client details to keep the preview in sync.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <PartyDetailsSection
          title="Biller details"
          description="The company or person issuing the invoice."
          fields={billerFields}
          values={invoiceData.biller}
          errors={errors.biller}
          touched={touched.biller}
          onFieldChange={(field, value) => updatePartyField("biller", field, value)}
          onFieldBlur={(field) => markFieldTouched("biller", field)}
        />

        <PartyDetailsSection
          title="Client details"
          description="The customer receiving the invoice."
          fields={clientFields}
          values={invoiceData.client}
          errors={errors.client}
          touched={touched.client}
          onFieldChange={(field, value) => updatePartyField("client", field, value)}
          onFieldBlur={(field) => markFieldTouched("client", field)}
        />

        <InvoiceMetadataSection
          values={invoiceData}
          errors={errors.metadata}
          touched={touched.metadata}
          onFieldChange={updateMetadataField}
          onFieldBlur={markMetadataTouched}
        />
      </div>

      <InvoiceItemsTable
        items={invoiceData.items}
        errors={errors.items}
        onAddItem={addItem}
        onItemChange={handleItemChange}
        onRemoveItem={removeItem}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-gray-600">
          Subtotal: <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
        </div>
        <div className="text-sm text-gray-500">Quantity and price fields are clamped at zero to prevent negative values.</div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="font-medium text-gray-700">Tax (%)</span>
          <input value={invoiceData.tax} onChange={e => handleChange('tax', Number(e.target.value))} type="number" className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-gray-700">Discount (%)</span>
          <input value={invoiceData.discount} onChange={e => handleChange('discount', Number(e.target.value))} type="number" className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </label>
        <label className="block text-sm">
          <span className="font-medium text-gray-700">Notes</span>
          <textarea value={invoiceData.notes} onChange={e => handleChange('notes', e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" rows={3} />
        </label>
      </div>
    </div>
  );
};

export default InvoiceForm;