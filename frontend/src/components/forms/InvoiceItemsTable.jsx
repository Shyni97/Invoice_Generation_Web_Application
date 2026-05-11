import InvoiceItemRow from "./InvoiceItemRow";
import Button from "../common/Button";
import { PlusIcon } from "../common/Icons";

const InvoiceItemsTable = ({
  items,
  errors = [],
  onAddItem,
  onItemChange,
  onRemoveItem,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-400">Line items</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">Add line items and keep totals updated in real time.</p>
        </div>

        <Button
          type="button"
          onClick={onAddItem}
          variant="outline"
          className="h-10 px-4 text-xs font-semibold uppercase tracking-[0.16em]"
        >
          <PlusIcon className="h-4 w-4" />
          Add item
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="grid grid-cols-[minmax(0,1fr)_92px_120px] border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400 sm:px-5">
          <div>Description</div>
          <div className="text-center">Qty</div>
          <div className="text-right">Rate</div>
        </div>

        <div className="divide-y divide-slate-100">
          {items.map((item, index) => (
            <InvoiceItemRow
              key={index}
              item={item}
              index={index}
              errors={errors[index] || {}}
              onChange={onItemChange}
              onRemove={onRemoveItem}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvoiceItemsTable;