const Invoice = require('../models/Invoice');

exports.createInvoice = async (req, res, next) => {
  try {
    const payload = req.body;
    const invoice = new Invoice(payload);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
};

exports.getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 }).lean();
    res.json(invoices);
  } catch (err) {
    next(err);
  }
};

exports.getInvoiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id).lean();
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    next(err);
  }
};

exports.updateInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Invoice.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Invoice not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Invoice.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Invoice not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
