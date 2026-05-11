import { calculateLineItemTotal, formatCurrency } from "../../utils/invoiceCalculations";
import { TrashIcon } from "../common/Icons";

const InvoiceItemRow = ({
  item,
  index,
  errors = {},
  onChange,
  onRemove,
}) => {
  const rowTotal = calculateLineItemTotal(item.quantity, item.unitPrice);

  return (
    <div className="group grid grid-cols-[minmax(0,1fr)_92px_120px] items-start gap-3 px-4 py-4 transition hover:bg-slate-50/70 sm:px-5">
      <div className="relative min-w-0">
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:hidden">Description</label>
        <input
          value={item.description}
          onChange={(event) => onChange(index, "description", event.target.value)}
          placeholder="Item description"
          className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Remove item"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="sm:px-1">
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:hidden">Quantity</label>
        <input
          type="number"
          min="0"
          step="1"
          value={item.quantity}
          onChange={(event) => onChange(index, "quantity", event.target.value)}
          className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
        {errors.quantity ? <span className="mt-2 block text-xs font-medium text-red-500">{errors.quantity}</span> : null}
      </div>

      <div className="text-right">
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400 sm:hidden">Rate</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={item.unitPrice}
          onChange={(event) => onChange(index, "unitPrice", event.target.value)}
          className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-right text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
        />
        {errors.unitPrice ? <span className="mt-2 block text-xs font-medium text-red-500">{errors.unitPrice}</span> : null}
        <div className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{formatCurrency(rowTotal)}</div>
      </div>
    </div>
  );
};

export default InvoiceItemRow;