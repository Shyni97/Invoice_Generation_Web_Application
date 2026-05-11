import Card from "../common/Card";
import Button from "../common/Button";
import {
  BriefcaseIcon,
  PlusIcon,
} from "../common/Icons";
import { getDraftDisplayLabel, getDraftUpdatedLabel } from "../../utils/invoiceDraftStorage";
import { calculateInvoiceTotals } from "../../utils/invoiceCalculations";

const getDraftAmount = (draft) => {
  const totals = calculateInvoiceTotals(draft?.data?.items || [], draft?.data?.tax || 0, draft?.data?.discount || 0);
  return totals.grandTotal;
};

const DashboardSidebar = ({ drafts, activeDraftId, onCreateNew, onLoadDraft, onDeleteDraft }) => {
  return (
    <aside className="space-y-5">
      <Card className="p-4 lg:p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">Saved drafts</p>
            <h3 className="mt-2 text-sm font-semibold text-slate-900">Recent invoices</h3>
          </div>
          <Button variant="ghost" className="h-9 px-3 text-xs text-slate-600" onClick={onCreateNew}>
            <PlusIcon className="h-3.5 w-3.5" />
            New
          </Button>
        </div>

        <div className="space-y-3">
          {drafts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
              No saved drafts yet. Your current invoice will auto-save here.
            </div>
          ) : (
            drafts.map((draft) => {
              const isActive = draft.id === activeDraftId;

              return (
                <div
                  key={draft.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onLoadDraft(draft.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onLoadDraft(draft.id);
                    }
                  }}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    isActive
                      ? "border-blue-200 bg-blue-50/70"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{getDraftDisplayLabel(draft)}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{draft?.data?.biller?.name || "Company name"}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-slate-900">
                      ${getDraftAmount(draft).toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-slate-400">
                    <span>{getDraftUpdatedLabel(draft)}</span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDeleteDraft(draft.id);
                      }}
                      className="rounded-md px-2 py-1 text-red-500 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      <Card className="p-4 lg:p-5">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            <BriefcaseIcon className="h-4 w-4" />
            Workspace
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Drafts are stored locally and the live invoice preview stays synced while you edit.
          </p>
        </div>
      </Card>
    </aside>
  );
};

export default DashboardSidebar;
