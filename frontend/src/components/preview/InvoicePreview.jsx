const formatCurrency = (n) => {
  return `$${Number(n || 0).toFixed(2)}`;
};

const InvoicePreview = ({ invoiceData }) => {
  const subtotal = invoiceData.items.reduce((s, it) => s + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
  const taxAmt = (subtotal * (Number(invoiceData.tax || 0) / 100));
  const discountAmt = (subtotal * (Number(invoiceData.discount || 0) / 100));
  const total = subtotal + taxAmt - discountAmt;

  return (
    <div className="bg-white p-6 rounded-xl shadow overflow-hidden">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{invoiceData.biller.name || 'Your Company'}</h3>
          <p className="text-sm text-gray-500">{invoiceData.biller.address}</p>
          <p className="text-sm text-gray-500">{invoiceData.biller.email} {invoiceData.biller.contact && `• ${invoiceData.biller.contact}`}</p>
        </div>

        <div className="text-right">
          <h4 className="text-sm text-gray-500">Invoice</h4>
          <div className="text-sm font-medium text-gray-800">#{invoiceData.invoiceNumber || '—'}</div>
          <div className="text-sm text-gray-500">Issued: {invoiceData.issueDate || '—'}</div>
          <div className="text-sm text-gray-500">Due: {invoiceData.dueDate || '—'}</div>
        </div>
      </div>

      <div className="mb-6">
        <h5 className="text-sm text-gray-500">Bill To</h5>
        <div className="text-sm font-medium text-gray-800">{invoiceData.client.name || 'Client Name'}</div>
        <div className="text-sm text-gray-500">{invoiceData.client.address}</div>
        <div className="text-sm text-gray-500">{invoiceData.client.email}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-2">Description</th>
              <th className="py-2">Qty</th>
              <th className="py-2">Unit</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((it, i) => (
              <tr key={i} className="border-b">
                <td className="py-3">{it.description || '—'}</td>
                <td className="py-3">{it.quantity}</td>
                <td className="py-3">{formatCurrency(it.unitPrice)}</td>
                <td className="py-3 text-right">{formatCurrency((Number(it.quantity)||0) * (Number(it.unitPrice)||0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="w-full max-w-xs">
          <div className="flex justify-between text-sm text-gray-600 py-1"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex justify-between text-sm text-gray-600 py-1"><span>Tax</span><span>{formatCurrency(taxAmt)}</span></div>
          <div className="flex justify-between text-sm text-gray-600 py-1"><span>Discount</span><span>-{formatCurrency(discountAmt)}</span></div>
          <div className="border-t mt-2 pt-2 flex justify-between text-base font-semibold"><span>Total</span><span>{formatCurrency(total)}</span></div>
        </div>
      </div>

      {invoiceData.notes && (
        <div className="mt-6 text-sm text-gray-600">
          <h6 className="font-medium text-gray-800 mb-1">Notes</h6>
          <p>{invoiceData.notes}</p>
        </div>
      )}
    </div>
  );
};

export default InvoicePreview;