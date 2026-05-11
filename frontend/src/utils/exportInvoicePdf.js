import html2canvas from "html2canvas";
import * as jsPdfModule from "jspdf";

const unsupportedColorPatterns = ["oklch(", "lch(", "lab(", "color("];

const hasUnsupportedColorValue = (value) => {
  const normalizedValue = String(value || "").toLowerCase();
  return unsupportedColorPatterns.some((pattern) => normalizedValue.includes(pattern));
};

const copyComputedStyles = (sourceRoot, targetRoot) => {
  const sourceNodes = [sourceRoot, ...sourceRoot.querySelectorAll("*")];
  const targetNodes = [targetRoot, ...targetRoot.querySelectorAll("*")];

  for (let index = 0; index < sourceNodes.length; index += 1) {
    const sourceNode = sourceNodes[index];
    const targetNode = targetNodes[index];

    if (!sourceNode || !targetNode) {
      continue;
    }

    const computed = window.getComputedStyle(sourceNode);
    for (let propertyIndex = 0; propertyIndex < computed.length; propertyIndex += 1) {
      const propertyName = computed[propertyIndex];
      const propertyValue = computed.getPropertyValue(propertyName);

      // html2canvas does not support modern color functions like oklch/lab/lch in parsed styles.
      if (propertyName.startsWith("--") || hasUnsupportedColorValue(propertyValue)) {
        continue;
      }

      targetNode.style.setProperty(propertyName, propertyValue, computed.getPropertyPriority(propertyName));
    }
  }
};

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

  const elementRect = element.getBoundingClientRect();
  if (!elementRect.width || !elementRect.height) {
    throw new Error("Invoice preview is not visible yet. Please try again.");
  }

  const exportMarker = `pdf-export-${Date.now()}`;
  element.setAttribute("data-pdf-export-marker", exportMarker);

  let canvas;
  try {
    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      onclone: (clonedDocument) => {
        const clonedElement = clonedDocument.querySelector(`[data-pdf-export-marker=\"${exportMarker}\"]`);
        if (!clonedElement) {
          return;
        }

        clonedDocument.querySelectorAll("style, link[rel='stylesheet']").forEach((node) => node.remove());

        copyComputedStyles(element, clonedElement);
        clonedElement.style.setProperty("width", `${element.scrollWidth}px`);
        clonedElement.style.setProperty("background", "#ffffff");
      },
    });
  } finally {
    element.removeAttribute("data-pdf-export-marker");
  }

  if (!canvas.width || !canvas.height) {
    throw new Error("Failed to render invoice preview for export.");
  }

  const JsPdfCtor = jsPdfModule.jsPDF || jsPdfModule.default;
  if (!JsPdfCtor) {
    throw new Error("PDF generator failed to initialize.");
  }

  const imageData = canvas.toDataURL("image/png", 1.0);
  const pdf = new JsPdfCtor({ orientation: "p", unit: "mm", format: "a4" });
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