# Quick Start - Railway Deployment

## 🚀 Fast Track Deployment (5 minutes)

### Prerequisites
- GitHub account
- Railway account (sign up at railway.app with GitHub)

---

## Step 1: Push to GitHub (2 minutes)

```powershell
# In C:\hrms directory
cd C:\hrms

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: HRMS application"

# Go to github.com and create a new PUBLIC repository named 'hrms'
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/hrms.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy on Railway (3 minutes)

### A. Create Project
1. Go to https://railway.app/
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `hrms` repository

### B. Configure Environment Variables
Click **"Variables"** and add:
```
PORT=5000
JWT_SECRET=hrms_super_secret_production_key_2025_change_this_to_something_unique
NODE_ENV=production
```

### C. Configure Build & Start
Click **"Settings"**:
- **Build Command**: `cd backend && npm install && cd ../frontend && npm install && npm run build`
- **Start Command**: `cd backend && node src/scripts/initDb.js && node src/index.js`
- **Watch Paths**: Leave default

### D. Generate Domain
1. Go to **"Settings"**
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. Save your URL: `https://your-app.up.railway.app`

---

## Step 3: Test Deployment

1. Visit: `https://your-app.up.railway.app/health`
   - Should show: `{"status":"OK","message":"HRMS API is running"}`

2. Visit: `https://your-app.up.railway.app`
   - Should show the HRMS login page

3. Login with demo credentials:
   - Email: `admin@acme.com`
   - Password: `admin123`

---

## Step 4: Update README

Update your GitHub repository README.md with:
- Your Railway deployment URL
- Your GitHub repository URL
- Demo credentials

---

## 📤 What to Submit to Company

**Email Template:**

```
Subject: HRMS Application Submission - [Your Name]

Dear Hiring Team,

I am submitting my Human Resource Management System (HRMS) application for your review.

📍 Live Application: https://your-app.up.railway.app
📁 GitHub Repository: https://github.com/YOUR_USERNAME/hrms

Demo Credentials:
Email: admin@acme.com
Password: admin123

The application includes:
✅ User Authentication & Authorization
✅ Employee Management (CRUD operations)
✅ Team Management & Assignments
✅ Activity Logging & Audit Trail
✅ Dashboard with Real-time Statistics
✅ Responsive Modern UI

Tech Stack: React, Node.js, Express, SQLite, JWT, Sequelize ORM

Thank you for your consideration.

Best regards,
[Your Name]
```

---

## 🐛 Troubleshooting

### Build Failed?
- Check Railway logs for errors
- Ensure both backend and frontend package.json are correct
- Try deploying backend only first, then add frontend

### Database Not Creating?
- Check logs for SQLite errors
- Verify init script ran successfully
- Railway should automatically create the database file

### 500 Internal Server Error?
- Check Railway logs
- Verify environment variables are set
- Ensure JWT_SECRET is configured

### Frontend Not Loading?
- Verify build command completed successfully
- Check that `frontend/build` directory was created
- Review browser console for errors

---

## 🔄 Making Updates

```powershell
# Make changes locally
git add .
git commit -m "Your change description"
git push

# Railway auto-deploys on push
```

---

## ⏱️ Railway Free Tier

- **$5/month credit** (enough for portfolio projects)
- App sleeps after 30 min inactivity
- Wakes automatically on request
- Perfect for demos!

---

**That's it! Your app is live! 🎉**
