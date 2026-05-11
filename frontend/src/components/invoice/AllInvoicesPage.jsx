import Card from "../common/Card";
import Button from "../common/Button";
import { FileTextIcon, TrashIcon } from "../common/Icons";
import { calculateInvoiceTotals, formatCurrency } from "../../utils/invoiceCalculations";
import { getDraftDisplayLabel, getDraftUpdatedLabel } from "../../utils/invoiceDraftStorage";

const getDraftTotal = (draft) => {
  const totals = calculateInvoiceTotals(
    draft?.data?.items || [],
    draft?.data?.tax || 0,
    draft?.data?.discount || 0,
  );
  return totals.grandTotal;
};

const AllInvoicesPage = ({ drafts, activeDraftId, onOpenInvoice, onDeleteInvoice, onCreateNew }) => {
  return (
    <section className="space-y-5">
      <Card className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Invoices</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">All Invoices</h2>
            <p className="mt-2 text-sm text-slate-500">
              Browse and open your saved invoice drafts.
            </p>
          </div>

          <Button variant="primary" className="h-11 px-5" onClick={onCreateNew}>
            New Invoice
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-[minmax(0,1fr)_140px_180px_160px] border-b border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          <div>Invoice</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Updated</div>
          <div className="text-right">Actions</div>
        </div>

        {drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-500">
              <FileTextIcon className="h-6 w-6" />
            </span>
            <h3 className="text-lg font-semibold text-slate-900">No invoices yet</h3>
            <p className="max-w-md text-sm text-slate-500">
              Start by creating an invoice. It will appear here after auto-save.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {drafts.map((draft) => {
              const isActive = draft.id === activeDraftId;
              return (
                <div
                  key={draft.id}
                  className={`grid grid-cols-[minmax(0,1fr)_140px_180px_160px] items-center px-5 py-4 text-sm ${
                    isActive ? "bg-blue-50/50" : "bg-white"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900">{getDraftDisplayLabel(draft)}</p>
                    <p className="mt-1 truncate text-slate-500">{draft?.data?.client?.name || "No client name"}</p>
                  </div>

                  <div className="text-right font-semibold text-slate-900">{formatCurrency(getDraftTotal(draft))}</div>

                  <div className="text-right text-slate-500">{getDraftUpdatedLabel(draft)}</div>

                  <div className="flex items-center justify-end gap-2">
                    <Button variant="secondary" className="h-9 px-3 text-xs" onClick={() => onOpenInvoice(draft.id)}>
                      Open
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-9 w-9 p-0 text-slate-500 hover:text-red-600"
                      onClick={() => onDeleteInvoice(draft.id)}
                      aria-label="Delete invoice"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </section>
  );
};

export default AllInvoicesPage;
