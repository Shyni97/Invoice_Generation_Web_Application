import InvoiceItemRow from "./InvoiceItemRow";

const InvoiceItemsTable = ({
  items,
  errors = [],
  onAddItem,
  onItemChange,
  onRemoveItem,
}) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Invoice items</h3>
          <p className="mt-1 text-sm text-gray-500">Add line items and keep totals updated in real time.</p>
        </div>

        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          Add row
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-100 text-left">
          <thead className="bg-gray-50">
            <tr className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Unit price</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
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
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default InvoiceItemsTable;