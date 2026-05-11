const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const roundToCents = (value) => Math.round((toNumber(value) + Number.EPSILON) * 100) / 100;

export const formatCurrency = (value) => `$${roundToCents(value).toFixed(2)}`;

export const calculateLineItemTotal = (quantity, unitPrice) => {
  return roundToCents(toNumber(quantity) * toNumber(unitPrice));
};

export const calculateSubtotal = (items = []) => {
  return roundToCents(items.reduce((sum, item) => sum + calculateLineItemTotal(item.quantity, item.unitPrice), 0));
};

export const calculateTaxAmount = (subtotal, taxRate) => {
  return roundToCents(toNumber(subtotal) * (toNumber(taxRate) / 100));
};

export const calculateDiscountAmount = (subtotal, discountRate) => {
  return roundToCents(toNumber(subtotal) * (toNumber(discountRate) / 100));
};

export const calculateGrandTotal = (subtotal, taxAmount, discountAmount) => {
  return roundToCents(toNumber(subtotal) + toNumber(taxAmount) - toNumber(discountAmount));
};

export const calculateInvoiceTotals = (items = [], taxRate = 0, discountRate = 0) => {
  const subtotal = calculateSubtotal(items);
  const taxAmount = calculateTaxAmount(subtotal, taxRate);
  const discountAmount = calculateDiscountAmount(subtotal, discountRate);
  const grandTotal = calculateGrandTotal(subtotal, taxAmount, discountAmount);

  return { subtotal, taxAmount, discountAmount, grandTotal };
};