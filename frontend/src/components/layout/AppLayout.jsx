import { useEffect, useRef, useState } from "react";

import InvoiceDraftManager from "./InvoiceDraftManager";
import Navbar from "./Navbar";
import InvoiceForm from "../forms/InvoiceForm";
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
    saveActiveDraftId(nextDraftId);
  };

  const handleLoadDraft = (draftId) => {
    const draft = savedDrafts.find((item) => item.id === draftId);

    if (!draft) {
      return;
    }

    setActiveDraftId(draft.id);
    setInvoiceData(draft.data);
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
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onExportPdf={handleExportPdf} onCreateNew={handleCreateNewDraft} isExporting={isExporting} />

      <InvoiceDraftManager
        drafts={savedDrafts}
        activeDraftId={activeDraftId}
        onCreateNew={handleCreateNewDraft}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft}
      />

      <main className="w-full px-0 py-6">
        <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-2">

          <div>
            <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
          </div>

          <div ref={previewRef} className="lg:sticky lg:top-6">
            <InvoicePreview invoiceData={invoiceData} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default AppLayout;