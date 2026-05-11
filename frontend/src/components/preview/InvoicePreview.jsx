import { calculateInvoiceTotals, calculateLineItemTotal, formatCurrency } from "../../utils/invoiceCalculations";

const InvoicePreview = ({ invoiceData }) => {
  const { subtotal, taxAmount, discountAmount, grandTotal } = calculateInvoiceTotals(
    invoiceData.items,
    invoiceData.tax,
    invoiceData.discount,
  );

  return (
    <div className="overflow-hidden rounded-xl bg-white p-6 shadow">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{invoiceData.biller.name || "Your Company"}</h3>
          <p className="text-sm text-gray-500">{invoiceData.biller.address}</p>
          <p className="text-sm text-gray-500">
            {invoiceData.biller.email} {invoiceData.biller.contact && `• ${invoiceData.biller.contact}`}
          </p>
        </div>

        <div className="text-right">
          <h4 className="text-sm text-gray-500">Invoice</h4>
          <div className="text-sm font-medium text-gray-800">#{invoiceData.invoiceNumber || "—"}</div>
          <div className="text-sm text-gray-500">Issued: {invoiceData.issueDate || "—"}</div>
          <div className="text-sm text-gray-500">Due: {invoiceData.dueDate || "—"}</div>
        </div>
      </div>

      <div className="mb-6">
        <h5 className="text-sm text-gray-500">Bill To</h5>
        <div className="text-sm font-medium text-gray-800">{invoiceData.client.name || "Client Name"}</div>
        <div className="text-sm text-gray-500">{invoiceData.client.address}</div>
        <div className="text-sm text-gray-500">{invoiceData.client.email}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="py-2">Description</th>
              <th className="py-2">Qty</th>
              <th className="py-2">Unit</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-3">{item.description || "—"}</td>
                <td className="py-3">{item.quantity}</td>
                <td className="py-3">{formatCurrency(item.unitPrice)}</td>
                <td className="py-3 text-right">{formatCurrency(calculateLineItemTotal(item.quantity, item.unitPrice))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="w-full max-w-xs">
          <div className="flex justify-between py-1 text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between py-1 text-sm text-gray-600">
            <span>Tax</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between py-1 text-sm text-gray-600">
            <span>Discount</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t pt-2 text-base font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      {invoiceData.notes ? (
        <div className="mt-6 text-sm text-gray-600">
          <h6 className="mb-1 font-medium text-gray-800">Notes</h6>
          <p>{invoiceData.notes}</p>
        </div>
      ) : null}
    </div>
  );
};

export default InvoicePreview;
