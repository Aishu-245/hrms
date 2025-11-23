# 🏢 HRMS - Human Resource Management System

A modern, full-stack Human Resource Management System built with React, Node.js, Express, and SQLite.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

## 🌐 Live Demo

- **Application URL**: [https://hrms-production-875d.up.railway.app](https://hrms-production-875d.up.railway.app)
- **GitHub Repository**: [View Source Code](https://github.com/Aishu-245/hrms)

**Demo Credentials:**
- Email: `admin@acme.com`
- Password: `admin123`

## 🚀 Features

- **Authentication & Authorization**: Secure JWT-based authentication with organization isolation
- **Employee Management**: Full CRUD operations for managing employees
- **Team Management**: Create and manage teams with ease
- **Team Assignments**: Assign employees to multiple teams (many-to-many relationship)
- **Activity Logging**: Complete audit trail of all operations
- **Modern UI**: Beautiful, responsive interface with gradient design

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## 🛠️ Technology Stack

### Backend
- Node.js
- Express.js
- SQLite (with Sequelize ORM)
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- React Icons for UI icons

## 📁 Project Structure

```
hrms/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── middlewares/      # Auth & error handling
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── scripts/          # Database initialization
│   │   ├── db.js             # Database configuration
│   │   └── index.js          # Server entry point
│   ├── package.json
│   ├── .env                  # Environment variables
│   └── database.sqlite       # SQLite database (created on first run)
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React context (Auth)
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   ├── App.js            # Main app component
│   │   ├── App.css           # Global styles
│   │   └── index.js          # React entry point
│   ├── package.json
│   └── .env                  # Frontend config
│
└── README.md
```

## 🚀 Getting Started

### Step 1: Clone or Extract the Project

If you're copying this to another machine, ensure you have the entire `hrms` folder.

### Step 2: Backend Setup

1. **Navigate to the backend folder:**
   ```bash
   cd hrms/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Check the `.env` file** (already created):
   ```
   PORT=5000
   JWT_SECRET=hrms_secret_key_2025_change_me_in_production
   NODE_ENV=development
   ```

4. **Initialize the database with sample data:**
   ```bash
   npm run init-db
   ```

   This will create:
   - A sample organization "Acme Corporation"
   - An admin user (email: admin@acme.com, password: admin123)
   - 4 sample employees
   - 3 sample teams
   - Team assignments

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

   The backend will run on **http://localhost:5000**

   You should see:
   ```
   🚀 HRMS Backend Server is running
   📍 Port: 5000
   🌐 API: http://localhost:5000
   💚 Health: http://localhost:5000/health
   ```

### Step 3: Frontend Setup

1. **Open a new terminal** and navigate to the frontend folder:
   ```bash
   cd hrms/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm start
   ```

   The frontend will run on **http://localhost:3000** and automatically open in your browser.

### Step 4: Login and Explore

1. The browser should automatically open to `http://localhost:3000`
2. Login with the demo credentials:
   - **Email:** admin@acme.com
   - **Password:** admin123

3. Explore the features:
   - View dashboard with statistics
   - Manage employees (Create, Read, Update, Delete)
   - Manage teams (Create, Read, Update, Delete)
   - Assign/unassign employees to teams
   - View activity logs

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new organization
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get team by ID
- `POST /api/teams` - Create team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:teamId/assign` - Assign employee to team
- `POST /api/teams/:teamId/unassign` - Unassign employee from team

### Logs
- `GET /api/logs` - Get activity logs

## 🗄️ Database Schema

### Tables

**organisations**
- id, name, created_at

**users**
- id, organisation_id, email, password_hash, name, created_at

**employees**
- id, organisation_id, first_name, last_name, email, phone, position, department, created_at, updated_at

**teams**
- id, organisation_id, name, description, created_at, updated_at

**employee_teams** (junction table)
- id, employee_id, team_id, assigned_at

**logs**
- id, organisation_id, user_id, action, meta (JSON), timestamp

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Organization-level data isolation
- Protected API routes
- CORS enabled for frontend communication

## 📝 Activity Logging

All major operations are logged:
- User login/logout
- Employee creation/update/deletion
- Team creation/update/deletion
- Employee-team assignment changes
- Organization creation

## 🎨 UI Features

- Modern gradient design
- Responsive layout
- Modal-based forms
- Real-time updates
- Icon-based actions
- Badge displays for teams
- Empty state messages
- Loading indicators

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Ensure all dependencies are installed: `npm install`
- Check the `.env` file exists

### Frontend won't start
- Check if port 3000 is available
- Ensure all dependencies are installed: `npm install`
- Make sure backend is running first

### Can't login
- Ensure you ran `npm run init-db` in the backend
- Check backend console for errors
- Verify backend is running on port 5000

### Database errors
- Delete `database.sqlite` and run `npm run init-db` again
- Check file permissions

## 📦 Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

The build folder will contain the optimized production build.

## 🔄 Starting Fresh

If you want to reset the database:

1. Stop the backend server
2. Delete `backend/database.sqlite`
3. Run `npm run init-db` in the backend folder
4. Restart the backend server

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Support

For issues or questions, please check the code comments or console logs for debugging information.

---

**Built with ❤️ using React, Node.js, and SQLite**
