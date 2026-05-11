import { useEffect, useRef, useState } from "react";

import Navbar from "./Navbar";
import DashboardSidebar from "../sidebar/DashboardSidebar";
import InvoiceForm from "../forms/InvoiceForm";
import AllInvoicesPage from "../invoice/AllInvoicesPage";
import InvoicePreview from "../preview/InvoicePreview";
import { buildInvoiceFileName, exportElementAsPdf } from "../../utils/exportInvoicePdf";
import {
  createDraftId,
  deleteInvoiceDraft,
  loadActiveDraftId,
  loadInvoiceDrafts,
  saveActiveDraftId,
  saveInvoiceDrafts,
  upsertInvoiceDraft,
} from "../../utils/invoiceDraftStorage";

const createEmptyInvoiceData = () => ({
  biller: {
    name: "",
    address: "",
    email: "",
    contact: "",
  },
  client: {
    name: "",
    address: "",
    email: "",
  },
  invoiceNumber: "",
  issueDate: "",
  dueDate: "",
  items: [
    {
      description: "",
      quantity: 1,
      unitPrice: 0,
    },
  ],
  tax: 0,
  discount: 0,
  notes: "",
});

const AppLayout = () => {
  const previewRef = useRef(null);
  const hydrationRef = useRef(false);
  const savedDraftsRef = useRef([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isExporting, setIsExporting] = useState(false);
  const [invoiceData, setInvoiceData] = useState(createEmptyInvoiceData);
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [activeDraftId, setActiveDraftId] = useState("");

  useEffect(() => {
    savedDraftsRef.current = savedDrafts;
  }, [savedDrafts]);

  useEffect(() => {
    const drafts = loadInvoiceDrafts();
    const storedActiveDraftId = loadActiveDraftId();

    setSavedDrafts(drafts);

    if (drafts.length > 0) {
      const activeDraft = drafts.find((draft) => draft.id === storedActiveDraftId) || drafts[0];
      setInvoiceData(activeDraft.data || createEmptyInvoiceData());
      setActiveDraftId(activeDraft.id);
      saveActiveDraftId(activeDraft.id);
    } else {
      const nextDraftId = createDraftId();
      setActiveDraftId(nextDraftId);
      saveActiveDraftId(nextDraftId);
    }

    hydrationRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydrationRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const draftId = activeDraftId || createDraftId();
      const now = new Date().toISOString();
      const currentDrafts = savedDraftsRef.current;
      const existingDraft = currentDrafts.find((draft) => draft.id === draftId);

      const nextDraft = {
        id: draftId,
        label: invoiceData.invoiceNumber?.trim() || "Untitled invoice",
        data: invoiceData,
        createdAt: existingDraft?.createdAt || now,
        updatedAt: now,
      };

      const nextDrafts = upsertInvoiceDraft(currentDrafts, nextDraft);
      setSavedDrafts(nextDrafts);
      saveInvoiceDrafts(nextDrafts);
      saveActiveDraftId(draftId);

      if (!activeDraftId) {
        setActiveDraftId(draftId);
      }
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [invoiceData, activeDraftId]);

  const handleCreateNewDraft = () => {
    const nextDraftId = createDraftId();
    const emptyInvoiceData = createEmptyInvoiceData();

    setActiveDraftId(nextDraftId);
    setInvoiceData(emptyInvoiceData);
    setActiveTab("dashboard");
    saveActiveDraftId(nextDraftId);
  };

  const handleLoadDraft = (draftId) => {
    const draft = savedDrafts.find((item) => item.id === draftId);

    if (!draft) {
      return;
    }

    setActiveDraftId(draft.id);
    setInvoiceData(draft.data);
    setActiveTab("dashboard");
    saveActiveDraftId(draft.id);
  };

  const handleDeleteDraft = (draftId) => {
    const nextDrafts = deleteInvoiceDraft(savedDrafts, draftId);
    setSavedDrafts(nextDrafts);
    saveInvoiceDrafts(nextDrafts);

    if (activeDraftId === draftId) {
      if (nextDrafts.length > 0) {
        const nextActiveDraft = nextDrafts[0];
        setActiveDraftId(nextActiveDraft.id);
        setInvoiceData(nextActiveDraft.data);
        saveActiveDraftId(nextActiveDraft.id);
      } else {
        const nextDraftId = createDraftId();
        setActiveDraftId(nextDraftId);
        setInvoiceData(createEmptyInvoiceData());
        saveActiveDraftId(nextDraftId);
      }
    }
  };

  const handleExportPdf = async () => {
    if (isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const fileName = buildInvoiceFileName(invoiceData.invoiceNumber);
      await exportElementAsPdf(previewRef.current, fileName);
    } catch (error) {
      console.error("Failed to export PDF:", error);
      window.alert(error?.message || "Unable to export PDF right now. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-900">
      <Navbar
        onExportPdf={handleExportPdf}
        onCreateNew={handleCreateNewDraft}
        isExporting={isExporting}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {activeTab === "invoices" ? (
          <AllInvoicesPage
            drafts={savedDrafts}
            activeDraftId={activeDraftId}
            onOpenInvoice={handleLoadDraft}
            onDeleteInvoice={handleDeleteDraft}
            onCreateNew={handleCreateNewDraft}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)_minmax(420px,480px)]">
            <div className="xl:sticky xl:top-[94px] xl:self-start">
              <DashboardSidebar
                drafts={savedDrafts}
                activeDraftId={activeDraftId}
                onCreateNew={handleCreateNewDraft}
                onLoadDraft={handleLoadDraft}
                onDeleteDraft={handleDeleteDraft}
              />
            </div>

            <div className="space-y-6">
              <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
            </div>

            <div className="space-y-4 xl:sticky xl:top-[94px] xl:self-start">
              <div className="flex items-center justify-between px-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">PDF export preview</p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50"
                  >
                    <span className="text-sm">⌕</span>
                  </button>
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50"
                  >
                    <span className="text-sm">⎙</span>
                  </button>
                </div>
              </div>

              <div ref={previewRef}>
                <InvoicePreview invoiceData={invoiceData} />
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isExporting ? "Exporting..." : "Download PDF"}
                </button>
                <p className="text-center text-xs text-slate-400">Last auto-saved 2 minutes ago</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AppLayout;