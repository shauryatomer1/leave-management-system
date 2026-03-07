# LeavePlus — Leave Management System

A full-stack leave management web application where employees can apply for leave and employers can approve or reject requests.

## Tech Stack

- **Frontend**: Vue.js 3 + Vite + Tailwind CSS v4
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Auth**: JWT-based with role-based access control (Employee / Employer)

## Project Structure

```
leave-management/
├── server/                  # Backend API
│   ├── index.js             # Express entry point
│   ├── models/
│   │   ├── User.js          # User model (name, email, password, role)
│   │   └── Leave.js         # Leave model (type, dates, reason, status)
│   ├── middleware/
│   │   └── auth.js          # JWT verification & role checking
│   ├── routes/
│   │   ├── auth.js          # Signup & Login endpoints
│   │   └── leaves.js        # CRUD leave endpoints
│   ├── .env                 # Environment variables (not committed)
│   └── .env.example         # Template for env vars
├── client/                  # Frontend SPA
│   ├── src/
│   │   ├── views/           # Page components
│   │   ├── components/      # Shared components (Navbar)
│   │   ├── services/        # Axios API service
│   │   ├── router/          # Vue Router with auth guards
│   │   ├── App.vue
│   │   └── main.js
│   └── vite.config.js       # Vite config with Tailwind & API proxy
├── design.md                # UI design system reference
└── README.md                # This file
```

## Setup & Run Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone <repo-url>
cd leave-management
```

### 2. Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string and a JWT secret
npm install
npm run dev
```
The API server will start on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint            | Auth | Role     | Description             |
|--------|---------------------|------|----------|-------------------------|
| POST   | `/api/auth/signup`  | No   | —        | Register a new user     |
| POST   | `/api/auth/login`   | No   | —        | Login and receive JWT   |
| POST   | `/api/leaves`       | Yes  | Employee | Submit a leave request  |
| GET    | `/api/leaves`       | Yes  | Both     | List leave requests     |
| PATCH  | `/api/leaves/:id`   | Yes  | Employer | Approve or reject       |

## Features

- **JWT Authentication** with 7-day token expiry
- **Role-Based Access**: Employee vs Employer views
- **Input Validation**: express-validator on all API endpoints
- **Date Validation**: Start date must be before end date, no past dates
- **Status Management**: Pending → Approved / Rejected (no re-processing)
- **Responsive UI**: Mobile-friendly design using Tailwind CSS
- **Auto-redirect**: Based on user role after login/signup

## Design System

The UI follows the design tokens documented in `design.md`, including:
- Primary color: `#1e3fae` (Deep Blue)
- Inter font family
- Material Symbols Outlined icons
- Consistent card, button, and badge component patterns
