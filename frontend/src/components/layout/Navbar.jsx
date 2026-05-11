import Button from "../common/Button";
import { Avatar, BellIcon, GridIcon, FileTextIcon } from "../common/Icons";

const tabs = [
  { id: "dashboard", label: "Dashboard", icon: GridIcon },
  { id: "invoices", label: "Invoices", icon: FileTextIcon },
];

const Navbar = ({ onExportPdf, onCreateNew, isExporting, activeTab, onTabChange }) => {
  return (
    <nav className="sticky top-0 z-30 h-[70px] border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-full w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => {
            onCreateNew();
            onTabChange("dashboard");
          }}
          className="text-xl font-semibold tracking-tight text-slate-900"
        >
          InvoiceFlow
        </button>

        <div className="hidden items-center gap-6 md:flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 pb-2 text-sm font-medium transition ${
                  isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {isActive ? <span className="absolute inset-x-0 -bottom-[1px] h-0.5 rounded-full bg-blue-600" /> : null}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="h-10 w-10 p-0 text-slate-500">
            <BellIcon className="h-4.5 w-4.5" />
          </Button>
          <Avatar />
          <Button variant="primary" className="hidden h-10 px-4 md:inline-flex" onClick={onExportPdf} disabled={isExporting}>
            {isExporting ? "Exporting..." : "Download PDF"}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;