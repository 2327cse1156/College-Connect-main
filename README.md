# College Connect

A full‑stack web application for college students to connect, collaborate and share resources.  
This repository contains two main parts:
- `Backend/` — Node.js + Express API (MongoDB, JWT auth, Cloudinary uploads)
- `College-Connect-main/` — Frontend (React + TypeScript + Vite + Tailwind)

---

## Tech stack

**Frontend**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Query, Framer Motion, lucide-react, react-hot-toast

**Backend**
- Node.js + Express
- MongoDB (Mongoose)
- Cloudinary (for uploads)
- JWT-based auth, nodemailer (for password reset)
- Dev tooling: nodemon

---

## Project structure

```
College-Connect-main-main/
├─ Backend/                     # Express API
│  ├─ config/                   # db.js, cloudinary.js
│  ├─ controllers/              # authController.js, profileController.js
│  ├─ middlewares/              # auth, upload
│  ├─ models/                   # User.js
│  ├─ routes/                   # auth.js, profile.js
│  └─ index.js                  # server entry (uses PORT, MONGODB_URI, etc.)
│
├─ College-Connect-main/        # Frontend (Vite + React + TS)
│  ├─ src/
│  │  ├─ components/
│  │  ├─ contexts/              # AuthContext.tsx
│  │  ├─ lib/
│  │  └─ pages/
│  └─ package.json
└─ README.md
```

---

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or Atlas)
- Cloudinary account (optional, for image uploads)

---

## Setup & Run (Backend)

1. Install
```bash
cd Backend
npm install
```

2. Create a `.env` file inside `Backend/` with at least the following keys:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_RESET_SECRET=your_jwt_reset_secret
EMAIL_USER=your_gmail_address_for_nodemailer
EMAIL_PASS=your_gmail_app_password_or_oauth_secret

# Cloudinary (if using uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Start the backend (development)
```bash
npm run dev
# This uses nodemon and runs index.js
```

The API will be available on `http://localhost:5000` by default.

---

## Setup & Run (Frontend)

1. Install
```bash
cd College-Connect-main
npm install
```

2. Development
```bash
npm run dev
# Vite dev server (likely at http://localhost:5173)
```

---

## Environment variables summary

**Backend (.env)**
- MONGODB_URI
- PORT (optional)
- JWT_SECRET
- JWT_RESET_SECRET
- EMAIL_USER
- EMAIL_PASS
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

---

## Notes & Next steps

- The backend currently allows CORS from `http://localhost:5173`. Update `index.js` CORS origin before deploying.
- Ensure you rotate secrets and never commit `.env` to source control.
- I can create deployment instructions for Vercel (frontend) and Render/Heroku/Railway (backend).

---

## Contribution

1. Fork the repo
2. Create a branch (`git checkout -b feature/my-feature`)
3. Commit & push
4. Open a Pull Request
