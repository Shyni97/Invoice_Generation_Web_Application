import Navbar from "./Navbar";
import InvoiceForm from "../forms/InvoiceForm";
import InvoicePreview from "../preview/InvoicePreview";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Side */}
          <InvoiceForm />

          {/* Right Side */}
          <InvoicePreview />

        </div>
      </div>
    </div>
  );
};

export default AppLayout;