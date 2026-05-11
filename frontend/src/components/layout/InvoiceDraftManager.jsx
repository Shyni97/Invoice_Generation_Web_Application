import { getDraftDisplayLabel, getDraftUpdatedLabel } from "../../utils/invoiceDraftStorage";

const InvoiceDraftManager = ({ drafts, activeDraftId, onCreateNew, onLoadDraft, onDeleteDraft }) => {
  return (
    <section className="w-full border-b border-gray-200 bg-white/90 px-0 py-4 backdrop-blur">
      <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-500">Saved drafts</h2>
          <p className="mt-1 text-sm text-gray-600">Auto-saved invoices are stored locally in your browser.</p>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          className="inline-flex items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
        >
          New Invoice
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {drafts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-500 sm:col-span-2 xl:col-span-3">
            No saved invoices yet. Your current form will be saved automatically as you type.
          </div>
        ) : (
          drafts.map((draft) => {
            const isActive = draft.id === activeDraftId;

            return (
              <article
                key={draft.id}
                className={`rounded-xl border px-4 py-4 shadow-sm transition ${
                  isActive ? "border-indigo-300 bg-indigo-50" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{getDraftDisplayLabel(draft)}</h3>
                    <p className="mt-1 text-xs text-gray-500">Updated {getDraftUpdatedLabel(draft)}</p>
                  </div>

                  {isActive ? (
                    <span className="rounded-full bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                      Active
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onLoadDraft(draft.id)}
                    className="inline-flex items-center rounded-md bg-gray-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-gray-800"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteDraft(draft.id)}
                    className="inline-flex items-center rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};

export default InvoiceDraftManager;