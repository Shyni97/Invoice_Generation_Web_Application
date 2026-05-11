import { useRef, useState } from "react";

import Navbar from "./Navbar";
import InvoiceForm from "../forms/InvoiceForm";
import InvoicePreview from "../preview/InvoicePreview";
import { buildInvoiceFileName, exportElementAsPdf } from "../../utils/exportInvoicePdf";

const AppLayout = () => {
  const previewRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
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
      <Navbar onExportPdf={handleExportPdf} isExporting={isExporting} />

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