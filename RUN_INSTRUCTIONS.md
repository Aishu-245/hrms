# How to Run the HRMS Application

## ✅ Code Review Summary
All code has been reviewed and is working correctly. No bugs found in the codebase!

## 📝 Step-by-Step Instructions

### Step 1: Install Backend Dependencies

Open a terminal in the `backend` folder and run:

```bash
cd c:\hrms\backend
npm install
```

**Expected outcome:** All dependencies installed successfully.

### Step 2: Initialize the Database with Sample Data

While still in the `backend` folder, run:

```bash
npm run init-db
```

**Expected outcome:** You should see:
```
🌱 Starting database seed...
✓ Created organisation: Acme Corporation
✓ Created admin user: admin@acme.com (password: admin123)
✓ Created 4 sample employees
✓ Created 3 sample teams
✓ Assigned employees to teams
✅ Database seeded successfully!
```

This creates:
- Database file: `backend/database.sqlite`
- Organization: "Acme Corporation"
- Admin login: admin@acme.com / admin123
- 4 sample employees
- 3 sample teams

### Step 3: Start the Backend Server

```bash
npm run dev
```

**Expected outcome:**
```
🚀 HRMS Backend Server is running
📍 Port: 5000
🌐 API: http://localhost:5000
💚 Health: http://localhost:5000/health
```

**Leave this terminal running!**

### Step 4: Install Frontend Dependencies

Open a **NEW terminal** window and run:

```bash
cd c:\hrms\frontend
npm install
```

**Expected outcome:** All React dependencies installed successfully.

### Step 5: Start the Frontend Application

While still in the `frontend` folder, run:

```bash
npm start
```

**Expected outcome:**
- Compiled successfully message
- Browser automatically opens to `http://localhost:3000`
- You see the HRMS login page

**Leave this terminal running too!**

### Step 6: Test the Application

1. **Login:**
   - Email: `admin@acme.com`
   - Password: `admin123`
   - Click "Login"

2. **Dashboard:**
   - Should show statistics:
     - Total Employees: 4
     - Total Teams: 3
     - Active Users: 1
     - Total Activity Logs: (varies)

3. **Test Employees Page:**
   - Click "Employees" in the navigation
   - You should see 4 employees listed
   - Try creating a new employee
   - Try editing an employee
   - Try deleting an employee

4. **Test Teams Page:**
   - Click "Teams" in the navigation
   - You should see 3 teams listed
   - Try creating a new team
   - Try editing a team
   - Try assigning/unassigning employees to teams
   - Try deleting a team

5. **Test Logs Page:**
   - Click "Logs" in the navigation
   - You should see all activity logs
   - Filter by different actions
   - Search by keywords

6. **Test Logout:**
   - Click "Logout" in the navigation
   - You should be redirected to the login page

## 🐛 Common Issues and Solutions

### Issue 1: Port 5000 is already in use
**Solution:** Either:
- Stop the process using port 5000
- Or edit `backend/.env` and change `PORT=5000` to another port like `PORT=5001`
- Then update `frontend/.env` to match: `REACT_APP_API_BASE_URL=http://localhost:5001/api`

### Issue 2: Port 3000 is already in use
**Solution:** 
- Press `Y` when prompted to run on another port
- Or stop the process using port 3000

### Issue 3: "Cannot find module" errors
**Solution:**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### Issue 4: Database errors
**Solution:**
- Stop the backend server
- Delete `backend/database.sqlite`
- Run `npm run init-db` again
- Restart the backend server

### Issue 5: Login not working
**Solution:**
- Check backend terminal for errors
- Verify backend is running on port 5000
- Clear browser localStorage (F12 → Application → Local Storage → Clear)
- Try again

### Issue 6: CORS errors in browser console
**Solution:**
- Verify backend is running
- Check that frontend `.env` has correct API URL
- Restart both servers

## 🧪 API Testing (Optional)

You can also test the API directly using a tool like Postman or curl:

### Health Check:
```bash
curl http://localhost:5000/health
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@acme.com\",\"password\":\"admin123\"}"
```

### Get Employees (requires token from login):
```bash
curl http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## ✅ Success Criteria

The application is working correctly if:

✓ Backend starts without errors on port 5000
✓ Frontend starts without errors on port 3000
✓ Login page loads correctly
✓ Can login with admin@acme.com / admin123
✓ Dashboard shows correct statistics
✓ Can view, create, edit, and delete employees
✓ Can view, create, edit, and delete teams
✓ Can assign/unassign employees to teams
✓ Activity logs show all actions
✓ Logout redirects to login page

## 🎉 What to Try

Once everything is working:

1. **Create a new employee**
2. **Create a new team**
3. **Assign the new employee to the new team**
4. **Check the logs to see all actions recorded**
5. **Edit some details**
6. **Try the search/filter features**

## 📊 Expected Database State After Init

- **Organization:** 1 (Acme Corporation)
- **Users:** 1 (admin@acme.com)
- **Employees:** 4 (John, Jane, Bob, Alice)
- **Teams:** 3 (Backend Team, Frontend Team, DevOps Team)
- **Employee-Team Assignments:** 5 relationships

Enjoy your HRMS application! 🚀
