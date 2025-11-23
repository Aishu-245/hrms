import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBriefcase, FiUsers, FiUserCheck, FiFileText, FiLogOut } from 'react-icons/fi';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <FiBriefcase />
          HRMS
        </div>

        <div className="navbar-nav">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <FiUsers /> Dashboard
          </Link>
          <Link to="/employees" className={`nav-link ${isActive('/employees')}`}>
            <FiUserCheck /> Employees
          </Link>
          <Link to="/teams" className={`nav-link ${isActive('/teams')}`}>
            <FiUsers /> Teams
          </Link>
          <Link to="/logs" className={`nav-link ${isActive('/logs')}`}>
            <FiFileText /> Logs
          </Link>
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-org">{user?.organisationName}</div>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
