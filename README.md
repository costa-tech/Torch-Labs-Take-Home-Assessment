# TorchCRM — Lead Management System

A modern, full-stack CRM (Customer Relationship Management) application built for small sales teams to manage leads, track pipeline progress, add notes, and view performance analytics.

![Dashboard](https://img.shields.io/badge/Status-Active-brightgreen) ![Tech Stack](https://img.shields.io/badge/Stack-React%20%2B%20Express%20%2B%20Firebase-blue)

---

## 🚀 Project Overview

TorchCRM is a sales lead management system that helps teams:

- **Track leads** through a customizable sales pipeline (New → Contacted → Qualified → Proposal Sent → Won/Lost)
- **Manage contacts** with full CRUD operations (Create, Read, Update, Delete)
- **Add notes** to leads after calls, emails, meetings, or follow-ups
- **Visualize performance** with a real-time dashboard showing KPIs, pipeline charts, and lead source breakdowns
- **Search & filter** leads by status, source, name, company, or email
- **Export data** to CSV for reporting

---

## 🛠️ Tech Stack

| Area | Technology |
|------|-----------|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3 |
| **Backend** | Node.js, Express.js |
| **Database** | Firebase Firestore (NoSQL) |
| **Authentication** | Firebase Authentication (Email/Password) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |
| **HTTP Client** | Axios |

---

## ✨ Features Implemented

### Core Features
- ✅ **Authentication** — Login/logout with Firebase Auth (email/password)
- ✅ **Protected Routes** — CRM is not accessible without logging in
- ✅ **Lead CRUD** — Create, view, edit, delete leads
- ✅ **Lead Details** — Full lead profile with all fields
- ✅ **Status Management** — Update lead status via clickable pipeline stage buttons
- ✅ **Lead Notes** — Add timestamped notes to any lead
- ✅ **Dashboard** — Real-time analytics with stat cards, pipeline bar chart, source pie chart, and recent leads table
- ✅ **Search** — Search leads by name, company, or email
- ✅ **Filtering** — Filter by status, lead source
- ✅ **Data Persistence** — All data stored in Firebase Firestore

### Lead Fields
Each lead includes: Name, Company, Email, Phone, Lead Source, Assigned Salesperson, Status, Estimated Deal Value, Created Date, Last Updated Date.

### Dashboard Metrics
- Total Leads, New Leads, Qualified Leads, Won Deals, Lost Deals
- Total Pipeline Value, Won Revenue
- Conversion Rate
- Sales Pipeline Bar Chart
- Lead Sources Pie Chart
- Recent Leads Table

### Bonus Features
- 🎨 **Premium Dark UI** — Glassmorphism design with smooth animations
- 📊 **Interactive Charts** — Pipeline and source visualizations using Recharts
- 📥 **CSV Export** — Download all leads as a CSV file
- 🔔 **Toast Notifications** — Success/error feedback for all actions
- 🔍 **Debounced Search** — Efficient search with 300ms debounce
- 🧹 **Batch Delete** — Deleting a lead also removes all its notes
- 🎯 **Status Pipeline** — Visual clickable pipeline in lead details
- ⚡ **Micro-Animations** — Fade-in, slide-up, staggered card animations

---

## 📁 Project Structure

```
Torch-Labs-Take-Home-Assessment/
├── backend/                    # Express.js API server
│   ├── src/
│   │   ├── config/
│   │   │   └── firebase.js     # Firebase Admin SDK initialization
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT token verification middleware
│   │   ├── routes/
│   │   │   ├── auth.js         # Login & user info routes
│   │   │   ├── leads.js        # Lead CRUD routes
│   │   │   ├── notes.js        # Lead notes routes
│   │   │   └── dashboard.js    # Dashboard statistics route
│   │   ├── index.js            # Express server entry point
│   │   └── seed.js             # Database seeder script
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # Sidebar, Header, AppLayout
│   │   │   ├── leads/          # LeadForm
│   │   │   └── ui/             # Button, Input, Modal, ConfirmDialog, StatusBadge
│   │   ├── config/
│   │   │   └── firebase.js     # Firebase Client SDK config
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx   # Dashboard with charts
│   │   │   ├── Leads.jsx       # Lead list with search/filter
│   │   │   ├── LeadDetailPage.jsx # Individual lead view + notes
│   │   │   └── Login.jsx       # Login page
│   │   ├── services/
│   │   │   └── api.js          # Axios instance + API helpers
│   │   ├── App.jsx             # Root component with routing
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles + Tailwind
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🏃 How to Run Locally

### Prerequisites
- **Node.js** v18+ installed
- **npm** v8+ installed
- A **Firebase project** with Firestore and Authentication (Email/Password) enabled

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Torch-Labs-Take-Home-Assessment.git
cd Torch-Labs-Take-Home-Assessment
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable **Firestore Database** (Start in test mode)
4. Enable **Authentication** → Sign-in method → **Email/Password**
5. Go to **Project Settings** → **Service Accounts** → **Generate New Private Key**
6. Save the JSON file in the project root as `serviceAccountKey.json`
7. Go to **Project Settings** → **General** → **Your Apps** → Add a **Web App** to get the Firebase config

### 3. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your values:
```env
PORT=5000
FIREBASE_SERVICE_ACCOUNT_PATH=../serviceAccountKey.json
FIREBASE_API_KEY=your-firebase-api-key
```

Install dependencies:
```bash
npm install
```

### 4. Configure Frontend

```bash
cd ../frontend
cp .env.example .env
```

Edit `frontend/.env` with your Firebase config:
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Install dependencies:
```bash
npm install
```

### 5. Seed the Database

```bash
cd ../backend
npm run seed
```

This creates the test user and 8 sample leads with notes.

### 6. Start the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### 7. Login

Open `http://localhost:5173` in your browser and log in.

---

## 🔑 Test Login Credentials

| Field | Value |
|-------|-------|
| **Email** | `admin@example.com` |
| **Password** | `password123` |

---

## 🗄️ Database Design

### Firestore Collections

**`leads`** (top-level collection)

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Lead's full name |
| `company` | string | Company name |
| `email` | string | Email address |
| `phone` | string | Phone number |
| `source` | string | Lead source (Website, LinkedIn, Referral, Cold Email, Event) |
| `assignedTo` | string | Assigned salesperson name |
| `status` | string | Pipeline stage (New, Contacted, Qualified, Proposal Sent, Won, Lost) |
| `dealValue` | number | Estimated deal value in USD |
| `createdAt` | timestamp | When the lead was created |
| `updatedAt` | timestamp | When the lead was last updated |
| `createdBy` | string | Email of the user who created the lead |

**`leads/{leadId}/notes`** (subcollection)

| Field | Type | Description |
|-------|------|-------------|
| `content` | string | Note text content |
| `createdBy` | string | Email of the user who wrote the note |
| `createdAt` | timestamp | When the note was created |

---

## 🌐 API Endpoints

All endpoints except `/api/auth/login` require a valid Firebase ID token in the `Authorization: Bearer <token>` header.

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login with email/password |
| `GET` | `/api/auth/me` | Get current authenticated user info |

### Leads
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/leads` | List all leads (supports `?status=`, `?source=`, `?assignedTo=`, `?search=`) |
| `GET` | `/api/leads/:id` | Get a single lead by ID |
| `POST` | `/api/leads` | Create a new lead |
| `PUT` | `/api/leads/:id` | Update a lead |
| `PATCH` | `/api/leads/:id/status` | Update lead status only |
| `DELETE` | `/api/leads/:id` | Delete a lead and all its notes |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/leads/:id/notes` | Get all notes for a lead |
| `POST` | `/api/leads/:id/notes` | Add a note to a lead |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/stats` | Get aggregated dashboard statistics |

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Path to Firebase Admin SDK service account key JSON |
| `FIREBASE_API_KEY` | Firebase Web API key (for auth REST API) |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (default: http://localhost:5000) |
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

---

## ⚠️ Known Limitations

- **Single user system** — Currently supports one test user. Could be extended with user registration and role-based access control.
- **No pagination** — All leads are loaded at once. For large datasets, server-side pagination should be implemented.
- **No real-time updates** — Dashboard stats refresh on page load, not in real-time. Could integrate Firestore onSnapshot listeners.
- **No file uploads** — Notes are text-only. Could add attachment support.
- **Client-side search** — Full-text search is done on the client. For production, use Algolia or Elasticsearch.
- **No deployment** — Application runs locally only.

---

## 💭 Reflection

### What I Learned
Building this CRM taught me how to integrate Firebase services (Firestore + Auth) with a traditional Express backend while maintaining clean separation between frontend and backend concerns. The Firebase Admin SDK handles token verification server-side, ensuring secure API access.

### Challenges & Solutions
1. **Firestore Query Limitations** — Firestore doesn't support full-text search or `LIKE` queries. I solved this by fetching filtered results from Firestore and applying text search on the server side.
2. **Token Management** — Firebase ID tokens expire after 1 hour. I implemented an Axios interceptor that automatically retrieves fresh tokens before each request.
3. **Subcollection Cleanup** — When deleting a lead, its notes (stored in a subcollection) must be deleted separately. I used Firestore batch operations for atomic deletion.

### Design Decisions
- **Dark theme with glassmorphism** — Chose a modern, premium aesthetic over a generic light theme to make the CRM feel high-end.
- **Notes as subcollections** — Stored notes as Firestore subcollections rather than arrays within the lead document, enabling independent scaling and better query performance.
- **Client-side Firebase Auth** — Used Firebase Client SDK for login (generating ID tokens) rather than routing auth through the backend, reducing latency and complexity.

### If I Had More Time
- Add drag-and-drop Kanban board view for leads
- Implement user registration and multi-user support with roles
- Add email integration for automated follow-up reminders
- Build a lead activity timeline tracking all changes
- Add data import from CSV/Excel
- Deploy to Vercel (frontend) and Railway/Render (backend)

---

## 📹 Demo Video

[Demo Video Link — To Be Added]

---

## 📄 License

This project was built as part of the Torch Labs Take-Home Assessment for the Intern Developer position.
