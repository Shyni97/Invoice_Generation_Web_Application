import { useMemo, useState } from "react";

import PartyDetailsSection from "./PartyDetailsSection";

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

const InvoiceForm = ({ invoiceData, setInvoiceData }) => {
  const [touched, setTouched] = useState({
    biller: { name: false, address: false, email: false, contact: false },
    client: { name: false, address: false, email: false },
  });

  const [errors, setErrors] = useState({
    biller: validateParty("biller", invoiceData.biller),
    client: validateParty("client", invoiceData.client),
  });

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

  const handleItemChange = (index, field, value) => {
    setInvoiceData(prev => {
      const items = prev.items.map((it, i) => (i === index ? { ...it, [field]: value } : it));
      return { ...prev, items };
    });
  };

  const addItem = () => {
    setInvoiceData(prev => ({ ...prev, items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }] }));
  };

  const removeItem = (index) => {
    setInvoiceData(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  const subtotal = useMemo(() => {
    return invoiceData.items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
  }, [invoiceData.items]);

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-gray-700">Invoice #</span>
            <input
              value={invoiceData.invoiceNumber}
              onChange={e => handleChange('invoiceNumber', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-gray-700">Issue Date</span>
            <input
              type="date"
              value={invoiceData.issueDate}
              onChange={e => handleChange('issueDate', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-gray-700">Due Date</span>
            <input
              type="date"
              value={invoiceData.dueDate}
              onChange={e => handleChange('dueDate', e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-gray-800 mb-2">Items</h3>

        <div className="space-y-3">
          {invoiceData.items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center">
              <input
                className="col-span-6 border border-gray-200 rounded-md px-3 py-2 text-sm"
                placeholder="Description"
                value={item.description}
                onChange={e => handleItemChange(idx, 'description', e.target.value)}
              />
              <input
                type="number"
                className="col-span-2 border border-gray-200 rounded-md px-3 py-2 text-sm"
                value={item.quantity}
                min="0"
                onChange={e => handleItemChange(idx, 'quantity', Number(e.target.value))}
              />
              <input
                type="number"
                className="col-span-3 border border-gray-200 rounded-md px-3 py-2 text-sm"
                value={item.unitPrice}
                min="0"
                step="0.01"
                onChange={e => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
              />
              <button onClick={() => removeItem(idx)} className="col-span-1 text-sm text-red-600">Remove</button>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button onClick={addItem} className="px-3 py-1.5 bg-gray-100 rounded-md text-sm">Add Item</button>
          <div className="text-sm text-gray-600">Subtotal: <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span></div>
        </div>
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