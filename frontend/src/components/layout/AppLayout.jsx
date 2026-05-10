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
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <InvoiceForm
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
          />

          <InvoicePreview
            invoiceData={invoiceData}
          />

        </div>
      </div>
    </div>
  );
};

export default AppLayout;