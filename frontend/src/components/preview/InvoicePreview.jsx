import { calculateInvoiceTotals, calculateLineItemTotal, formatCurrency } from "../../utils/invoiceCalculations";

const InvoicePreview = ({ invoiceData }) => {
  const { subtotal, taxAmount, discountAmount, grandTotal } = calculateInvoiceTotals(
    invoiceData.items,
    invoiceData.tax,
    invoiceData.discount,
  );

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">A4 invoice preview</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                IF
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                  {invoiceData.biller.name || "Technical Billing Ltd"}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {invoiceData.biller.address || "123 Developer Lane, Tech City"}
                </p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-semibold tracking-[0.22em] text-slate-900">INVOICE</div>
            <div className="mt-2 space-y-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
              <div>#{invoiceData.invoiceNumber || "INV-2024-001"}</div>
              <div>Date: {invoiceData.issueDate || "May 15, 2024"}</div>
              <div>Due: {invoiceData.dueDate || "June 15, 2024"}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="grid gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Bill to</p>
            <div className="mt-3 text-sm leading-6 text-slate-600">
              <div className="font-semibold text-slate-900">{invoiceData.client.name || "CloudScale Systems"}</div>
              <div>{invoiceData.client.address || "456 Enterprise Way"}</div>
              <div>{invoiceData.client.email || "sanfrancisco@cloudscale.com"}</div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="grid grid-cols-[minmax(0,1fr)_72px_120px] bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              <div>Description</div>
              <div className="text-center">Qty</div>
              <div className="text-right">Amount</div>
            </div>

            <div className="divide-y divide-slate-100 text-sm">
              {invoiceData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-[minmax(0,1fr)_72px_120px] items-start px-4 py-4">
                  <div className="pr-3 text-slate-700">{item.description || "Line item description"}</div>
                  <div className="text-center font-medium text-slate-600">{item.quantity}</div>
                  <div className="text-right font-medium text-slate-900">
                    {formatCurrency(calculateLineItemTotal(item.quantity, item.unitPrice))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">Footer note</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {invoiceData.notes || "Thank you for your business. Payment is due within 30 days."}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="space-y-3 text-sm text-slate-500">
                <div className="flex items-center justify-between gap-4">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span>VAT ({invoiceData.tax || 0}%)</span>
                  <span className="font-mono font-semibold text-slate-900">{formatCurrency(taxAmount)}</span>
                </div>
                {discountAmount > 0 ? (
                  <div className="flex items-center justify-between gap-4">
                    <span>Discount</span>
                    <span className="font-mono font-semibold text-slate-900">-{formatCurrency(discountAmount)}</span>
                  </div>
                ) : null}
                <div className="border-t border-slate-200 pt-3 flex items-center justify-between gap-4 text-base font-semibold text-slate-900">
                  <span>Total due</span>
                  <span className="font-mono text-lg">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            Payment terms: Payment is due within 30 days.
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
