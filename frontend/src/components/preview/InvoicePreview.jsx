import { calculateInvoiceTotals, calculateLineItemTotal, formatCurrency } from "../../utils/invoiceCalculations";

const InvoicePreview = ({ invoiceData }) => {
  const { subtotal, taxAmount, discountAmount, grandTotal } = calculateInvoiceTotals(
    invoiceData.items,
    invoiceData.tax,
    invoiceData.discount,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg print:border-0 print:shadow-none">
      <div className="border-b border-gray-200 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 px-6 py-5 text-white print:bg-white print:text-gray-900">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300 print:text-gray-500">Invoice preview</div>
            <h3 className="mt-2 text-2xl font-semibold">{invoiceData.biller.name || "Your Company"}</h3>
            <p className="mt-1 max-w-xl text-sm text-slate-300 print:text-gray-600">{invoiceData.biller.address || "Company address"}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-300 print:text-gray-600">
              <span>{invoiceData.biller.email || "company@email.com"}</span>
              <span>{invoiceData.biller.contact || "Contact number"}</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-right backdrop-blur print:border-gray-200 print:bg-transparent">
            <div className="text-xs uppercase tracking-[0.2em] text-cyan-200 print:text-gray-500">Invoice</div>
            <div className="mt-1 text-xl font-semibold">#{invoiceData.invoiceNumber || "—"}</div>
            <div className="mt-2 text-sm text-slate-200 print:text-gray-600">Issued: {invoiceData.issueDate || "—"}</div>
            <div className="text-sm text-slate-200 print:text-gray-600">Due: {invoiceData.dueDate || "—"}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 px-6 py-6 print:px-0 print:py-0">
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 print:border-gray-200 print:bg-transparent">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Billed from</h4>
            <div className="mt-2 text-base font-semibold text-gray-900">{invoiceData.biller.name || "Your Company"}</div>
            <p className="mt-1 text-sm text-gray-600">{invoiceData.biller.address || "Company address"}</p>
            <p className="mt-1 text-sm text-gray-600">{invoiceData.biller.email || "company@email.com"}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 print:border-gray-200 print:bg-transparent">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Bill to</h4>
            <div className="mt-2 text-base font-semibold text-gray-900">{invoiceData.client.name || "Client Name"}</div>
            <p className="mt-1 text-sm text-gray-600">{invoiceData.client.address || "Client address"}</p>
            <p className="mt-1 text-sm text-gray-600">{invoiceData.client.email || "client@email.com"}</p>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 print:border-gray-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 print:bg-transparent">
                <tr className="border-b text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Unit price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="px-4 py-3 align-top font-medium text-gray-900">{item.description || "—"}</td>
                    <td className="px-4 py-3 align-top text-gray-700">{item.quantity}</td>
                    <td className="px-4 py-3 align-top text-gray-700">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-4 py-3 align-top text-right font-medium text-gray-900">{formatCurrency(calculateLineItemTotal(item.quantity, item.unitPrice))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-xl border border-gray-200 bg-gray-50 p-4 print:border-gray-200 print:bg-transparent">
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Notes / Payment terms</h4>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
              {invoiceData.notes || "Payment due within 15 days of the invoice date unless otherwise agreed in writing."}
            </p>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm print:border-gray-300 print:shadow-none">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between gap-4"><span>Subtotal</span><span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between gap-4"><span>Tax</span><span className="font-medium text-gray-900">{formatCurrency(taxAmount)}</span></div>
              <div className="flex justify-between gap-4"><span>Discount</span><span className="font-medium text-gray-900">-{formatCurrency(discountAmount)}</span></div>
              <div className="mt-3 border-t border-gray-200 pt-3 flex justify-between gap-4 text-base font-semibold text-gray-900">
                <span>Grand total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
