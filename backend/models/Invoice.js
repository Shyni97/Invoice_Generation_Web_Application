const mongoose = require('mongoose');
const { Schema } = mongoose;

const ItemSchema = new Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0, default: 1 },
  unitPrice: { type: Number, required: true, min: 0, default: 0 },
  total: { type: Number, min: 0 }
});

const PartySchema = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  email: { type: String },
  phone: { type: String }
}, { _id: false });

const InvoiceSchema = new Schema({
  invoiceNumber: { type: String, required: true, index: true, unique: true },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  biller: { type: PartySchema, required: true },
  client: { type: PartySchema, required: true },
  items: { type: [ItemSchema], default: [] },
  tax: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  notes: { type: String },
  totals: {
    subtotal: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 }
  }
}, { timestamps: true });

// compute totals before saving
InvoiceSchema.pre('save', function (next) {
  try {
    const invoice = this;
    let subtotal = 0;
    invoice.items = invoice.items.map(item => {
      const q = Number(item.quantity) || 0;
      const p = Number(item.unitPrice) || 0;
      const t = Math.round((q * p) * 100) / 100;
      subtotal += t;
      return Object.assign({}, item.toObject ? item.toObject() : item, { total: t });
    });
    subtotal = Math.round(subtotal * 100) / 100;
    const taxAmount = Math.round((subtotal * (Number(invoice.tax) || 0) / 100) * 100) / 100;
    const discountAmount = Math.round((subtotal * (Number(invoice.discount) || 0) / 100) * 100) / 100;
    const grandTotal = Math.round((subtotal + taxAmount - discountAmount) * 100) / 100;
    invoice.totals = { subtotal, taxAmount, discountAmount, grandTotal };
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
