# MERN Invoice Generator

A professional invoice generator built with the MERN stack. The application lets users create, preview, export, and manage invoices with a responsive React UI and a Node.js + Express + MongoDB backend.

## Project Overview

This project is a full-stack invoice management system designed for freelancers, small businesses, and finance teams that need a fast way to generate polished invoices. The frontend provides a clean invoice editor with live preview, PDF export, and draft persistence. The backend exposes a REST API for storing and managing invoices in MongoDB.

## Features

- Create and edit invoices with biller and client details.
- Add, remove, and update invoice line items dynamically.
- Auto-calculate subtotal, tax, discount, and grand total.
- Live invoice preview with print-friendly styling.
- PDF export using jsPDF and html2canvas.
- Local draft persistence in the browser.
- REST API for saving, fetching, updating, and deleting invoices.
- Validation for required fields and numeric values.
- Responsive layout for desktop and mobile screens.

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- jsPDF
- html2canvas

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- express-validator
- CORS

## Installation

### Prerequisites

- Node.js 18 or later
- npm
- MongoDB running locally or a MongoDB Atlas connection string

### 1. Clone the repository

```bash
git clone <repository-url>
cd Invoice_Generation_Web_Application
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` folder and add the variables shown below.

### 5. Start the backend

```bash
cd backend
npm run dev
```

### 6. Start the frontend

Open a new terminal window:

```bash
cd frontend
npm run dev
```

## Environment Variables

Create `backend/.env` with the following values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/invoice_app
```

If you use MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

## Screenshots

Add screenshots here to showcase the UI, invoice preview, PDF export, and backend API responses.

- Dashboard / invoice editor
- Live invoice preview
- PDF export output
- Draft management panel

Suggested screenshot paths:

- `docs/screenshots/editor.png`
- `docs/screenshots/preview.png`
- `docs/screenshots/pdf-export.png`
- `docs/screenshots/api-postman.png`

## API Endpoints

Base URL: `/api/invoices`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/invoices` | Create and save a new invoice |
| GET | `/api/invoices` | Get all invoices |
| GET | `/api/invoices/:id` | Get a single invoice by ID |
| PUT | `/api/invoices/:id` | Update an invoice by ID |
| DELETE | `/api/invoices/:id` | Delete an invoice by ID |

### Example Request Body

```json
{
  "invoiceNumber": "INV-1001",
  "issueDate": "2026-05-11",
  "dueDate": "2026-05-25",
  "biller": {
    "name": "Acme Studios",
    "address": "123 Business Street",
    "email": "billing@acme.com",
    "phone": "+1 555 0100"
  },
  "client": {
    "name": "Client Name",
    "address": "456 Client Avenue",
    "email": "client@example.com",
    "phone": "+1 555 0200"
  },
  "items": [
    {
      "description": "Design work",
      "quantity": 2,
      "unitPrice": 150
    }
  ],
  "tax": 10,
  "discount": 5,
  "notes": "Payment due within 14 days."
}
```

## Responsive Support

The frontend is built to adapt to different screen sizes:

- Desktop: two-column layout with form and live preview side by side.
- Tablet: stacked layout with clear spacing and readable sections.
- Mobile: single-column flow for easy editing on smaller screens.

## PDF Export Feature

The invoice preview can be exported as a PDF directly from the frontend.

- Uses `html2canvas` to capture the preview.
- Uses `jsPDF` to generate a downloadable PDF.
- Preserves the invoice styling for a clean print-ready result.
- Supports long invoices by splitting content across multiple pages.

## Future Improvements

- Add authentication and invoice ownership per user.
- Add pagination, search, and filtering for invoices.
- Add invoice status tracking such as draft, sent, paid, and overdue.
- Add email sending for generated invoices.
- Add server-side PDF generation.
- Add test coverage for API endpoints and frontend invoice flows.

## Project Structure

```text
Invoice_Generation_Web_Application/
├─ frontend/
│  ├─ src/
│  └─ package.json
├─ backend/
│  ├─ controllers/
│  ├─ middleware/
│  ├─ models/
│  ├─ routes/
│  ├─ config/
│  └─ package.json
└─ README.md
```

## License

No license has been specified yet.
