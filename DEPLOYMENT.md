# 🚀 Deployment Guide - Railway & GitHub

This guide will help you deploy your HRMS application to Railway and set up a GitHub repository.

## 📋 Prerequisites

1. **GitHub Account** - [Sign up here](https://github.com/join)
2. **Railway Account** - [Sign up here](https://railway.app/) (use GitHub to sign in)
3. **Git installed** - [Download here](https://git-scm.com/downloads)

---

## Part 1: Setting Up GitHub Repository

### Step 1: Initialize Git Repository

Open PowerShell in your project root (`C:\hrms`) and run:

```powershell
cd C:\hrms
git init
git add .
git commit -m "Initial commit: HRMS full-stack application"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com/) and log in
2. Click the **"+"** icon in the top-right corner
3. Select **"New repository"**
4. Repository settings:
   - **Name**: `hrms` or `human-resource-management-system`
   - **Description**: `A full-stack HRMS built with React, Node.js, Express, and SQLite`
   - **Visibility**: Public (required for company submission)
   - **DON'T** initialize with README (we already have one)
5. Click **"Create repository"**

### Step 3: Push Code to GitHub

Copy the commands from GitHub (should look like this):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/hrms.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Part 2: Deploying to Railway

### Step 1: Prepare Backend for Production

1. Make sure your backend `.env` has production-ready values:
   ```
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
   NODE_ENV=production
   ```

2. The database will be created automatically on first run.

### Step 2: Deploy to Railway

#### Option A: Deploy from GitHub (Recommended)

1. Go to [Railway](https://railway.app/)
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub
5. Select your `hrms` repository
6. Railway will detect Node.js automatically

#### Option B: Deploy using Railway CLI

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
cd C:\hrms
railway init

# Deploy
railway up
```

### Step 3: Configure Railway Environment Variables

1. In Railway dashboard, click on your project
2. Click **"Variables"** tab
3. Add the following environment variables:

```
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
NODE_ENV=production
```

⚠️ **Important**: Generate a strong JWT secret (at least 32 characters).

### Step 4: Configure Build Settings

1. In Railway dashboard, go to **"Settings"**
2. Set the following:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node src/index.js`
   - **Root Directory**: Leave blank (uses project root)

### Step 5: Enable Public Domain

1. In Railway dashboard, go to **"Settings"**
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. You'll get a URL like: `https://your-app.up.railway.app`

### Step 6: Test Your Deployment

1. Visit your Railway URL: `https://your-app.up.railway.app/health`
2. You should see: `{"status":"OK","message":"HRMS API is running"}`
3. Visit the main URL to see the frontend (if serving from backend)

---

## Part 3: Frontend Deployment Options

### Option A: Serve Frontend from Backend (Simplest)

Update your backend `src/index.js` to serve the built React app:

```javascript
// Add after middleware section
const path = require('path');

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../../frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
});
```

Then build frontend and redeploy:

```powershell
cd frontend
npm run build
git add .
git commit -m "Add frontend production build"
git push
```

Railway will automatically redeploy.

### Option B: Deploy Frontend Separately (Vercel)

1. Go to [Vercel](https://vercel.com/)
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
6. Add Environment Variable:
   - `REACT_APP_API_BASE_URL` = `https://your-railway-app.up.railway.app/api`
7. Deploy

Update backend CORS to allow Vercel domain:

```javascript
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app'],
  credentials: true
}));
```

---

## Part 4: Initialize Database on Railway

### Option 1: Automatic (Recommended)

The database will be created automatically when the server starts. To add sample data:

1. Add a new script to `backend/package.json`:
```json
"scripts": {
  "start": "node src/index.js",
  "init-and-start": "node src/scripts/initDb.js && node src/index.js"
}
```

2. Update Railway start command to: `cd backend && npm run init-and-start`

### Option 2: Manual using Railway CLI

```powershell
railway run node backend/src/scripts/initDb.js
```

---

## 🎯 Submission Checklist

Before submitting to the company:

- [ ] ✅ Code pushed to GitHub (public repository)
- [ ] ✅ README.md updated with live URLs
- [ ] ✅ Backend deployed on Railway
- [ ] ✅ Database initialized with sample data
- [ ] ✅ Frontend accessible (either from backend or Vercel)
- [ ] ✅ Test login works: admin@acme.com / admin123
- [ ] ✅ All features working (Dashboard, Employees, Teams, Logs)
- [ ] ✅ Environment variables properly configured
- [ ] ✅ `.env` files NOT pushed to GitHub (check .gitignore)

---

## 📝 What to Submit

Send the company:

1. **GitHub Repository URL**: 
   ```
   https://github.com/YOUR_USERNAME/hrms
   ```

2. **Live Application URL**:
   ```
   https://your-app.up.railway.app
   ```

3. **Demo Credentials** (include in README):
   ```
   Email: admin@acme.com
   Password: admin123
   ```

---

## 🐛 Troubleshooting

### Railway Build Failed
- Check Railway logs for errors
- Ensure `package.json` has correct scripts
- Verify Node.js version compatibility

### Database Not Creating
- Check Railway logs for permission errors
- Ensure SQLite file path is writable
- Try running init script manually

### CORS Errors
- Add Railway domain to CORS configuration
- Check environment variables are set correctly

### Frontend Not Loading
- Verify build completed successfully
- Check browser console for errors
- Ensure API URL is correct in frontend

### Can't Connect to API
- Verify Railway domain is generated
- Check health endpoint: `/health`
- Review Railway logs for server errors

---

## 📊 Railway Free Tier Limits

- **$5 monthly credit** for free accounts
- Project sleeps after inactivity (wakes on request)
- 500 MB disk space
- Shared CPU/RAM

**Note**: The free tier is perfect for demos and portfolio projects!

---

## 🔄 Making Updates

After deployment, to update your app:

```powershell
# Make your changes
git add .
git commit -m "Description of changes"
git push

# Railway will automatically redeploy
```

---

## 🎓 Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [GitHub Guides](https://guides.github.com/)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [React Deployment](https://create-react-app.dev/docs/deployment/)

---

**Good luck with your submission! 🚀**

For any deployment issues, check Railway logs or GitHub Issues.
