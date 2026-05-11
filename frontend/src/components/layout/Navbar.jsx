const Navbar = ({ onExportPdf, onCreateNew, isExporting }) => {
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="w-full px-0 sm:px-0 lg:px-0">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-md flex items-center justify-center text-white font-bold">IG</div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Invoice Generator</h1>
              <p className="text-xs text-gray-500">Create clean, professional invoices</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onCreateNew}
              className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50"
            >
              New Invoice
            </button>
            <button
              type="button"
              onClick={onExportPdf}
              disabled={isExporting}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white shadow transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isExporting ? "Exporting..." : "Download PDF"}
            </button>
            <button className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">Help</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;