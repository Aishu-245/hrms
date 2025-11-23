# 📐 HRMS Application - Architecture & Design Documentation

## Overview

This document explains **how the HRMS application was created**, the design decisions made, and the architectural patterns used.

---

## 🏗️ Architecture Pattern

The application follows a **3-tier architecture**:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│         (React Frontend)                │
│  - UI Components                        │
│  - State Management                     │
│  - Routing                              │
└────────────┬────────────────────────────┘
             │ HTTP/REST API
             │ (JSON)
┌────────────▼────────────────────────────┐
│         Application Layer               │
│         (Node.js/Express Backend)       │
│  - Controllers (Business Logic)         │
│  - Middleware (Auth, Error Handling)    │
│  - Routes (API Endpoints)               │
└────────────┬────────────────────────────┘
             │ ORM (Sequelize)
             │
┌────────────▼────────────────────────────┐
│         Data Layer                      │
│         (SQLite Database)               │
│  - Organizations, Users                 │
│  - Employees, Teams                     │
│  - Logs                                 │
└─────────────────────────────────────────┘
```

---

## 🎨 Design Decisions

### 1. **Technology Choices**

#### Backend
- **Node.js + Express**: Lightweight, fast, JavaScript ecosystem
- **SQLite**: No external database server needed, perfect for development and small deployments
- **Sequelize ORM**: Type-safe database operations, migrations, relationships
- **JWT Authentication**: Stateless, scalable authentication
- **bcrypt**: Industry-standard password hashing

#### Frontend
- **React**: Component-based, reusable UI
- **React Router**: Client-side routing
- **Context API**: Simple state management for auth
- **Axios**: Promise-based HTTP client with interceptors
- **CSS**: Custom styling for full design control

### 2. **Database Design**

#### Multi-tenancy with Organization Isolation
```sql
Every table (except logs) has an organisation_id field
This ensures:
- Data isolation between organizations
- Scalability for multiple companies
- Security (one org can't access another's data)
```

#### Many-to-Many Relationship
```
Employee ←→ EmployeeTeam ←→ Team
(Employee can belong to multiple teams)
```

#### Schema Design Principles
- **Normalization**: Avoid data duplication
- **Referential Integrity**: Foreign key constraints
- **Timestamps**: Track creation/update times
- **Soft Deletes**: Could be added (not implemented)

### 3. **Security Features**

#### Authentication Flow
```
1. User registers → Password hashed with bcrypt (10 rounds)
2. User logs in → Credentials verified → JWT token issued
3. Token includes: userId, orgId, email, name
4. Token expires in 8 hours
5. Every protected route validates token via middleware
```

#### Authorization
```
- All data queries filtered by organisation_id
- Users can only access their organization's data
- JWT payload contains orgId for verification
```

#### Best Practices Implemented
- ✅ Password hashing (bcrypt)
- ✅ JWT expiration
- ✅ CORS configuration
- ✅ Input validation
- ✅ SQL injection prevention (Sequelize parameterized queries)
- ✅ XSS prevention (React automatically escapes)

---

## 📂 Backend Architecture

### Controller Pattern

Each controller handles business logic for a resource:

```javascript
// Example: employeeController.js
exports.createEmployee = async (req, res) => {
  // 1. Extract data from request
  // 2. Validate input
  // 3. Perform business logic
  // 4. Log the action
  // 5. Return response
};
```

### Middleware Pipeline

```
Request → CORS → JSON Parser → Auth Middleware → Route Handler → Error Handler → Response
```

#### Auth Middleware
- Extracts JWT from Authorization header
- Verifies token validity
- Attaches user info to request object
- Rejects unauthorized requests

### Logging System

Every action is logged with:
- **Who**: user_id
- **What**: action type (created, updated, deleted, assigned)
- **When**: timestamp
- **Where**: organisation_id
- **Details**: metadata (employee name, team name, etc.)

Example log entry:
```json
{
  "id": 42,
  "organisation_id": 1,
  "user_id": 5,
  "action": "employee_assigned_to_team",
  "meta": {
    "employeeId": 10,
    "employeeName": "John Doe",
    "teamId": 3,
    "teamName": "Backend Team"
  },
  "timestamp": "2025-11-23T10:30:00Z"
}
```

---

## 🎨 Frontend Architecture

### Component Hierarchy

```
App (Router + Auth Provider)
├── Login/Register (Public)
└── PrivateRoute
    ├── Navbar
    └── Pages
        ├── Dashboard
        ├── Employees
        ├── Teams
        └── Logs
```

### State Management

#### Global State (Context API)
- **AuthContext**: User authentication state
  - `user`: Current user object
  - `login()`: Login function
  - `logout()`: Logout function
  - `register()`: Registration function

#### Local State (useState)
- Each page manages its own data
- Form inputs
- Modals (open/close)
- Loading states

### API Service Layer

Centralized API calls in `services/api.js`:

```javascript
// Axios interceptors handle:
1. Adding JWT token to every request
2. Handling 401 (unauthorized) responses
3. Error formatting
```

Benefits:
- ✅ DRY (Don't Repeat Yourself)
- ✅ Easy to modify API base URL
- ✅ Consistent error handling
- ✅ Token refresh could be added here

### Routing Strategy

```javascript
Public Routes:    /login, /register
Protected Routes: /, /employees, /teams, /logs

PrivateRoute component:
- Checks if user is authenticated
- Redirects to /login if not
- Renders protected component if authenticated
```

---

## 🎨 UI/UX Design

### Design System

#### Colors
- **Primary**: Purple gradient (#667eea → #764ba2)
- **Success**: Green (#10b981)
- **Danger**: Red (#ef4444)
- **Neutral**: Grays for text and borders

#### Typography
- **Font**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)
- **Sizes**: Hierarchical (32px titles, 20px headings, 15px body)

#### Components
- **Cards**: White background, subtle shadows
- **Buttons**: Rounded, gradient hover effects
- **Modals**: Overlay with centered content
- **Tables**: Striped rows, hover effects
- **Badges**: Colored pills for status indicators

### Responsive Design
- Mobile-first approach
- Flexbox and Grid layouts
- Breakpoint at 768px
- Navigation collapses on mobile

### User Experience Features
- ✅ Loading states
- ✅ Empty states with helpful messages
- ✅ Confirmation dialogs for destructive actions
- ✅ Real-time updates after mutations
- ✅ Error messages
- ✅ Success feedback
- ✅ Keyboard navigation support

---

## 🔄 Data Flow

### Creating an Employee

```
1. User clicks "Add Employee" button
   └→ Opens modal with form

2. User fills form and clicks "Create"
   └→ handleSubmit() called

3. Frontend sends POST request
   └→ axios.post('/api/employees', data)
   └→ JWT token attached by interceptor

4. Backend receives request
   └→ authMiddleware validates token
   └→ employeeController.createEmployee()
   └→ Validates input
   └→ Creates employee in database
   └→ Creates log entry
   └→ Returns new employee

5. Frontend receives response
   └→ Closes modal
   └→ Refetches employee list
   └→ Updates UI
```

### Assigning Employee to Team

```
1. User clicks "Manage Teams" on employee row
   └→ Opens modal showing all teams

2. User clicks "Assign" on a team
   └→ handleAssignTeam(teamId) called

3. Frontend sends POST request
   └→ axios.post('/api/teams/:teamId/assign', { employeeId })

4. Backend receives request
   └→ Validates team belongs to organization
   └→ Validates employee belongs to organization
   └→ Checks for existing assignment (prevents duplicates)
   └→ Creates EmployeeTeam record
   └→ Creates log entry

5. Frontend receives response
   └→ Refetches employees (now includes new team)
   └→ Updates UI
```

---

## 📊 Database Schema Design

### Relationships

```
Organisation (1) ──< (many) User
Organisation (1) ──< (many) Employee
Organisation (1) ──< (many) Team

Employee (many) ──< EmployeeTeam >── (many) Team
                    (join table)
```

### Indexes

Sequelize automatically creates indexes on:
- Primary keys (id)
- Foreign keys (organisation_id, user_id, etc.)
- Unique constraints (email)

### Data Integrity

- **NOT NULL** constraints on required fields
- **Foreign key** constraints with CASCADE delete
- **Unique** constraint on user email
- **Default values** for timestamps

---

## 🧪 Testing Strategy (Not Implemented, but Recommended)

### Backend Tests
```javascript
// Unit tests for controllers
- Create employee with valid data
- Create employee with invalid data
- Update employee that doesn't exist
- Delete employee removes team assignments

// Integration tests
- Full auth flow (register → login → access protected route)
- CRUD operations for each resource
```

### Frontend Tests
```javascript
// Component tests
- Render employee list
- Show empty state when no employees
- Open modal when clicking "Add Employee"

// E2E tests
- User can register and login
- User can create, edit, delete employee
- User can assign employee to team
```

---

## 🚀 Deployment Considerations

### Environment Variables

**Backend (.env):**
```
PORT=5000
JWT_SECRET=<random-string>  # Change in production!
NODE_ENV=production
```

**Frontend (.env):**
```
REACT_APP_API_BASE_URL=https://api.yourhrms.com/api
```

### Production Checklist

#### Backend
- [ ] Use production database (PostgreSQL/MySQL)
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS only
- [ ] Add rate limiting
- [ ] Add request logging (Morgan, Winston)
- [ ] Add helmet.js for security headers
- [ ] Configure CORS for specific origin
- [ ] Use PM2 or similar for process management

#### Frontend
- [ ] Run `npm run build`
- [ ] Serve static files via CDN
- [ ] Enable Gzip compression
- [ ] Set cache headers
- [ ] Use environment-specific API URLs

### Hosting Options

**Backend:**
- Heroku (free tier available)
- Railway
- Render
- DigitalOcean
- AWS EC2

**Frontend:**
- Vercel (recommended, auto-deploys)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

---

## 🔧 Code Organization Principles

### Backend
- **Separation of Concerns**: Routes → Controllers → Models
- **DRY**: Reusable middleware
- **Error Handling**: Centralized error handler
- **Async/Await**: Consistent promise handling
- **Validation**: Input validation at controller level

### Frontend
- **Component Composition**: Small, reusable components
- **Single Responsibility**: Each component does one thing
- **Props vs State**: Props for data down, callbacks for events up
- **Custom Hooks**: Could extract useEmployees, useTeams
- **CSS Modules**: Could improve with scoped styles

---

## 📈 Scalability Considerations

### Current Limitations
- SQLite is single-file (not suitable for high concurrency)
- No caching layer
- No background job processing
- No email notifications
- No file uploads

### Future Enhancements
1. **Migrate to PostgreSQL** for production
2. **Add Redis** for caching and sessions
3. **Add Bull Queue** for background jobs (email sending, report generation)
4. **Add S3** for file storage (profile pictures, documents)
5. **Add WebSockets** for real-time updates
6. **Add Search** (Elasticsearch) for large employee lists
7. **Add Pagination** for lists
8. **Add Roles** (Admin, Manager, Employee roles)

---

## 🎓 Learning Takeaways

### Key Concepts Demonstrated

1. **Full-stack Development**: Frontend + Backend + Database
2. **RESTful API Design**: Resource-based URLs, HTTP methods
3. **Authentication**: JWT, password hashing
4. **Database Relationships**: One-to-many, many-to-many
5. **React Patterns**: Hooks, Context, Component composition
6. **Async JavaScript**: Promises, async/await
7. **State Management**: Local and global state
8. **Routing**: Client-side and server-side routing
9. **Form Handling**: Controlled components
10. **Error Handling**: Try-catch, error boundaries

---

## 🛠️ Development Workflow

### How This Was Built

1. **Planning Phase**
   - Defined requirements
   - Designed database schema
   - Sketched UI mockups

2. **Backend First**
   - Setup Express server
   - Created database models
   - Built authentication
   - Implemented CRUD controllers
   - Added logging

3. **Frontend Second**
   - Created React app
   - Built authentication pages
   - Created dashboard
   - Built CRUD interfaces
   - Styled components

4. **Integration**
   - Connected frontend to backend
   - Tested API endpoints
   - Fixed CORS issues
   - Added error handling

5. **Polish**
   - Improved UI/UX
   - Added loading states
   - Added empty states
   - Wrote documentation

---

## 📚 Code Style Guide

### JavaScript/Node.js
- Use `const` and `let`, avoid `var`
- Use arrow functions for callbacks
- Use async/await instead of callbacks
- Use destructuring for objects
- Use template literals for strings

### React
- Functional components with Hooks
- Use `useState` for local state
- Use `useEffect` for side effects
- Use `useContext` for global state
- Use JSX for rendering

### Naming Conventions
- **Files**: camelCase.js (authController.js)
- **Components**: PascalCase.jsx (EmployeeForm.jsx)
- **Variables**: camelCase (firstName, totalCount)
- **Constants**: UPPER_SNAKE_CASE (API_BASE_URL)
- **Functions**: camelCase verbs (createEmployee, handleSubmit)

---

## 🎯 Assignment Requirements Coverage

✅ **Employee List**: Implemented with table view
✅ **Teams List**: Implemented with table view
✅ **Team Assignment**: Modal-based interface
✅ **Forms**: Create and edit modals for employees and teams
✅ **CRUD Operations**: Full create, read, update, delete
✅ **Logging**: Complete audit trail of all operations
✅ **Authentication**: JWT-based with organization isolation
✅ **Many-to-Many**: Employees can belong to multiple teams
✅ **Organization Account**: Users create organization on registration
✅ **Good UI**: Modern, responsive, gradient design

### Bonus Points Achieved
✅ Simple but effective UI
✅ ORM for database (Sequelize)
✅ Authentication middleware
✅ Clear documentation with setup instructions

---

**End of Documentation**

This HRMS application demonstrates a complete full-stack implementation with modern best practices, security considerations, and scalable architecture.
