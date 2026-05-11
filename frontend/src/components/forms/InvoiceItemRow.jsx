const InvoiceItemRow = ({
  item,
  index,
  errors = {},
  onChange,
  onRemove,
}) => {
  const rowTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);

  return (
    <tr className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/70">
      <td className="py-3 px-4 align-top">
        <label className="block text-xs font-medium text-gray-500 sm:hidden">Description</label>
        <input
          value={item.description}
          onChange={(event) => onChange(index, "description", event.target.value)}
          placeholder="Item description"
          className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </td>

      <td className="py-3 px-4 align-top sm:w-32">
        <label className="block text-xs font-medium text-gray-500 sm:hidden">Quantity</label>
        <input
          type="number"
          min="0"
          step="1"
          value={item.quantity}
          onChange={(event) => onChange(index, "quantity", event.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        {errors.quantity ? <span className="mt-1 block text-xs text-red-500">{errors.quantity}</span> : null}
      </td>

      <td className="py-3 px-4 align-top sm:w-36">
        <label className="block text-xs font-medium text-gray-500 sm:hidden">Unit price</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={item.unitPrice}
          onChange={(event) => onChange(index, "unitPrice", event.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        {errors.unitPrice ? <span className="mt-1 block text-xs text-red-500">{errors.unitPrice}</span> : null}
      </td>

      <td className="py-3 px-4 align-top sm:w-36">
        <div className="flex items-center justify-between gap-3 sm:block">
          <div>
            <label className="block text-xs font-medium text-gray-500 sm:hidden">Total</label>
            <div className="mt-1 text-sm font-semibold text-gray-900">${rowTotal.toFixed(2)}</div>
          </div>

          <button
            type="button"
            onClick={() => onRemove(index)}
            className="inline-flex items-center rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      </td>
    </tr>
  );
};

export default InvoiceItemRow;