# Invoice Backend

Simple Node.js + Express + MongoDB backend for storing invoices.

Setup

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `PORT`.
2. Install dependencies:

```bash
cd backend
npm install
```

3. Run in development:

```bash
npm run dev
```

API

- `POST /api/invoices` — create invoice
- `GET /api/invoices` — list invoices
- `GET /api/invoices/:id` — get invoice by id
- `PUT /api/invoices/:id` — update invoice
- `DELETE /api/invoices/:id` — delete invoice

Validation

Basic validation is implemented with `express-validator`. Mongoose schema computes totals on save.
