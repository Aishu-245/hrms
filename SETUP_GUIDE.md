# 📋 HRMS Application - Setup and Deployment Guide

## How to Copy This Application to Another Machine

This guide explains the **folder structure** and the **exact order** of files you should copy when moving this application to a new machine.

---

## 📂 What to Copy

You need to copy the **entire `hrms` folder** which contains both `backend` and `frontend` subdirectories.

### Folder Structure Overview

```
hrms/                           # Main project folder
├── README.md                   # Main documentation
├── SETUP_GUIDE.md             # This file
│
├── backend/                    # Backend application
│   ├── src/                   # Source code
│   │   ├── controllers/       # Business logic
│   │   │   ├── authController.js
│   │   │   ├── employeeController.js
│   │   │   ├── teamController.js
│   │   │   └── logController.js
│   │   ├── middlewares/       # Middleware functions
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── models/            # Database models
│   │   │   ├── Organisation.js
│   │   │   ├── User.js
│   │   │   ├── Employee.js
│   │   │   ├── Team.js
│   │   │   ├── EmployeeTeam.js
│   │   │   ├── Log.js
│   │   │   └── index.js
│   │   ├── routes/            # API routes
│   │   │   ├── auth.js
│   │   │   ├── employees.js
│   │   │   ├── teams.js
│   │   │   └── logs.js
│   │   ├── scripts/           # Utility scripts
│   │   │   └── initDb.js      # Database seeding
│   │   ├── db.js              # Database configuration
│   │   └── index.js           # Server entry point
│   ├── package.json           # Dependencies list
│   ├── .env                   # Environment variables
│   ├── .env.example           # Example env file
│   └── .gitignore             # Git ignore rules
│
└── frontend/                   # Frontend application
    ├── public/                # Static files
    │   └── index.html         # HTML template
    ├── src/                   # Source code
    │   ├── components/        # React components
    │   │   ├── Navbar.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── context/           # React context
    │   │   └── AuthContext.js
    │   ├── pages/             # Page components
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Employees.jsx
    │   │   ├── Teams.jsx
    │   │   └── Logs.jsx
    │   ├── services/          # API services
    │   │   └── api.js
    │   ├── App.js             # Main component
    │   ├── App.css            # Styles
    │   ├── index.js           # Entry point
    │   └── index.css          # Global styles
    ├── package.json           # Dependencies list
    ├── .env                   # Environment config
    └── .gitignore             # Git ignore rules
```

---

## 🔄 Step-by-Step Copy Process

### What to Copy (and What NOT to Copy)

#### ✅ **COPY THESE:**

1. **Entire `hrms` folder** including:
   - All `.js`, `.jsx`, `.json`, `.css`, `.html` files
   - `.env` files (both in backend and frontend)
   - `.gitignore` files
   - `README.md` and documentation files

#### ❌ **DO NOT COPY:**

1. **`node_modules/`** folders (in both backend and frontend)
   - These are huge (100,000+ files)
   - Will be reinstalled using `npm install`

2. **`database.sqlite`** (in backend folder)
   - Will be created fresh on new machine
   - Old data won't work on new machine

3. **`build/`** folder (in frontend, if exists)
   - Production build folder
   - Will be recreated if needed

---

## 📝 Copying Methods

### Method 1: Using a ZIP File (Recommended)

1. **On the original machine:**
   ```bash
   # Navigate to the parent directory
   cd C:\
   
   # Compress the hrms folder (excludes node_modules automatically if you use .gitignore)
   # Use Windows built-in compression or 7-Zip
   ```

2. **Select the `hrms` folder** → Right-click → **Send to** → **Compressed (zipped) folder**

3. **Transfer `hrms.zip`** to the new machine via:
   - USB drive
   - Cloud storage (Google Drive, Dropbox, OneDrive)
   - Email (if small enough)
   - Network share

4. **On the new machine:**
   - Extract the ZIP file to a location like `C:\hrms`

### Method 2: Using Git (If you know Git)

1. **On original machine:**
   ```bash
   cd C:\hrms
   git init
   git add .
   git commit -m "Initial commit"
   # Push to GitHub, GitLab, or Bitbucket
   ```

2. **On new machine:**
   ```bash
   git clone <your-repo-url>
   cd hrms
   ```

### Method 3: Manual Copy (Network/USB)

1. Copy the entire `hrms` folder
2. Paste to new machine at desired location

---

## 🖥️ Setup on New Machine

### Prerequisites

**Install these on the new machine FIRST:**

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation:
     ```bash
     node --version
     npm --version
     ```

### Installation Steps

#### Step 1: Backend Setup

```bash
# Navigate to backend
cd C:\hrms\backend

# Install dependencies (this creates node_modules folder)
npm install

# Initialize database with sample data
npm run init-db

# Start the backend server
npm run dev
```

**Expected output:**
```
✓ Database connection established
✓ Database tables synchronized
🚀 HRMS Backend Server is running
📍 Port: 5000
🌐 API: http://localhost:5000
```

#### Step 2: Frontend Setup

**Open a NEW terminal window:**

```bash
# Navigate to frontend
cd C:\hrms\frontend

# Install dependencies
npm install

# Start the frontend server
npm start
```

**Expected output:**
```
Compiled successfully!
You can now view hrms-frontend in the browser.
  Local:            http://localhost:3000
```

---

## 🎯 Quick Start Commands

### After copying to new machine:

```bash
# Terminal 1 - Backend
cd C:\hrms\backend
npm install
npm run init-db
npm run dev

# Terminal 2 - Frontend (open new terminal)
cd C:\hrms\frontend
npm install
npm start
```

---

## 📋 File Priority List

If you need to copy files individually, here's the order of importance:

### Critical Files (Must have):
1. `package.json` (both backend and frontend)
2. All `.js` and `.jsx` files
3. `.env` files
4. `public/index.html`

### Important Files:
5. All `.css` files
6. `.gitignore` files
7. `README.md`

### Can be recreated:
- `node_modules/` - Run `npm install`
- `database.sqlite` - Run `npm run init-db`
- `build/` - Run `npm run build`

---

## 🔧 Common Issues and Solutions

### Issue 1: "command not found: npm"
**Solution:** Install Node.js first

### Issue 2: "Port 5000 already in use"
**Solution:** 
- Stop other applications using port 5000, OR
- Change PORT in `backend/.env` to another number (e.g., 5001)

### Issue 3: "Port 3000 already in use"
**Solution:** Press `Y` when asked to use another port

### Issue 4: Dependencies install errors
**Solution:**
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

### Issue 5: Database errors
**Solution:**
```bash
# Delete database and reinitialize
cd backend
del database.sqlite  # Windows
rm database.sqlite   # Mac/Linux
npm run init-db
```

---

## 📦 Minimal Copy List

**Absolute minimum to copy** (excluding node_modules):

```
hrms/
├── backend/
│   ├── src/          (entire folder)
│   ├── package.json
│   └── .env
└── frontend/
    ├── public/       (entire folder)
    ├── src/          (entire folder)
    ├── package.json
    └── .env
```

Size: Approximately **500 KB - 2 MB** without node_modules

---

## ✅ Verification Checklist

After setup on new machine, verify:

- [ ] Node.js is installed (`node --version`)
- [ ] Backend dependencies installed (check `backend/node_modules` exists)
- [ ] Frontend dependencies installed (check `frontend/node_modules` exists)
- [ ] Backend server starts without errors (port 5000)
- [ ] Frontend server starts without errors (port 3000)
- [ ] Database created (`backend/database.sqlite` exists)
- [ ] Can login with admin@acme.com / admin123
- [ ] Can view employees and teams
- [ ] Can create/edit/delete records

---

## 🚀 Production Deployment

For deploying to a server:

### Backend (Node.js server)
```bash
cd backend
npm install --production
npm start
```

### Frontend (Static files)
```bash
cd frontend
npm install
npm run build
# Deploy the 'build' folder to a web server
```

---

## 📞 Need Help?

1. Check console logs in both terminals for error messages
2. Verify all files were copied correctly
3. Ensure Node.js version is 18 or higher
4. Make sure both servers are running simultaneously

---

**Happy Coding! 🎉**
