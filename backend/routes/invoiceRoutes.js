const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const validate = require('../middleware/validateRequest');
const controller = require('../controllers/invoiceController');

const invoiceValidators = [
  body('invoiceNumber').isString().notEmpty(),
  body('issueDate').isISO8601().toDate(),
  body('dueDate').isISO8601().toDate(),
  body('biller.name').isString().notEmpty(),
  body('client.name').isString().notEmpty(),
  body('items').isArray(),
  body('items.*.description').isString().notEmpty(),
  body('items.*.quantity').isFloat({ min: 0 }),
  body('items.*.unitPrice').isFloat({ min: 0 })
];

router.post('/', invoiceValidators, validate, controller.createInvoice);
router.get('/', controller.getInvoices);
router.get('/:id', param('id').isMongoId(), validate, controller.getInvoiceById);
router.put('/:id', param('id').isMongoId(), invoiceValidators, validate, controller.updateInvoice);
router.delete('/:id', param('id').isMongoId(), validate, controller.deleteInvoice);

module.exports = router;
