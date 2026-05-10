import { useMemo } from "react";

const Input = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <label className="block text-sm">
    <span className="text-gray-600">{label}</span>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200"
    />
  </label>
);

const InvoiceForm = ({ invoiceData, setInvoiceData }) => {
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
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Biller Name" value={invoiceData.biller.name} onChange={e => handleChange('biller.name', e.target.value)} placeholder="Your company" />
        <Input label="Biller Email" value={invoiceData.biller.email} onChange={e => handleChange('biller.email', e.target.value)} placeholder="you@company.com" />
        <Input label="Biller Address" value={invoiceData.biller.address} onChange={e => handleChange('biller.address', e.target.value)} placeholder="Street, City" />
        <Input label="Biller Contact" value={invoiceData.biller.contact} onChange={e => handleChange('biller.contact', e.target.value)} placeholder="Phone" />

        <Input label="Client Name" value={invoiceData.client.name} onChange={e => handleChange('client.name', e.target.value)} placeholder="Client" />
        <Input label="Client Email" value={invoiceData.client.email} onChange={e => handleChange('client.email', e.target.value)} placeholder="client@company.com" />
        <Input label="Client Address" value={invoiceData.client.address} onChange={e => handleChange('client.address', e.target.value)} placeholder="Street, City" />

        <Input label="Invoice #" value={invoiceData.invoiceNumber} onChange={e => handleChange('invoiceNumber', e.target.value)} />
        <Input label="Issue Date" type="date" value={invoiceData.issueDate} onChange={e => handleChange('issueDate', e.target.value)} />
        <Input label="Due Date" type="date" value={invoiceData.dueDate} onChange={e => handleChange('dueDate', e.target.value)} />
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

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label="Tax (%)" type="number" value={invoiceData.tax} onChange={e => handleChange('tax', Number(e.target.value))} />
        <Input label="Discount (%)" type="number" value={invoiceData.discount} onChange={e => handleChange('discount', Number(e.target.value))} />
        <label className="block text-sm">
          <span className="text-gray-600">Notes</span>
          <textarea value={invoiceData.notes} onChange={e => handleChange('notes', e.target.value)} className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 text-sm" rows={3} />
        </label>
      </div>
    </div>
  );
};

export default InvoiceForm;