import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const sanitizeFileNamePart = (value) =>
  String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();

export const buildInvoiceFileName = (invoiceNumber) => {
  const stamp = new Date();
  const datePart = `${stamp.getFullYear()}${String(stamp.getMonth() + 1).padStart(2, "0")}${String(stamp.getDate()).padStart(2, "0")}`;
  const invoicePart = sanitizeFileNamePart(invoiceNumber) || "invoice";

  return `${invoicePart}-${datePart}.pdf`;
};

export const exportElementAsPdf = async (element, fileName) => {
  if (!element) {
    throw new Error("Invoice preview element was not found.");
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    scrollX: 0,
    scrollY: -window.scrollY,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  });

  const imageData = canvas.toDataURL("image/png", 1.0);
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imageWidth = pageWidth;
  const imageHeight = (canvas.height * imageWidth) / canvas.width;

  let remainingHeight = imageHeight;
  let position = 0;

  pdf.addImage(imageData, "PNG", 0, position, imageWidth, imageHeight);
  remainingHeight -= pageHeight;

  while (remainingHeight > 0) {
    position = remainingHeight - imageHeight;
    pdf.addPage();
    pdf.addImage(imageData, "PNG", 0, position, imageWidth, imageHeight);
    remainingHeight -= pageHeight;
  }

  pdf.save(fileName);
};