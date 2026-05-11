import { useState } from "react";

import Navbar from "./Navbar";
import InvoiceForm from "../forms/InvoiceForm";
import InvoicePreview from "../preview/InvoicePreview";

const AppLayout = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="w-full px-0 py-6">
        <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-2">

          <div>
            <InvoiceForm invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
          </div>

          <div className="lg:sticky lg:top-6">
            <InvoicePreview invoiceData={invoiceData} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default AppLayout;