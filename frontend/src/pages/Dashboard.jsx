import React, { useState, useEffect } from 'react';
import { employeeAPI, teamAPI } from '../services/api';
import { FiUsers, FiUserCheck, FiBriefcase } from 'react-icons/fi';
import Navbar from '../components/Navbar';

function Dashboard() {
  const [stats, setStats] = useState({
    employees: 0,
    teams: 0,
    assignments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [employeesRes, teamsRes] = await Promise.all([
        employeeAPI.getAll(),
        teamAPI.getAll(),
      ]);

      const employees = employeesRes.data;
      const teams = teamsRes.data;

      const totalAssignments = employees.reduce((sum, emp) => sum + (emp.Teams?.length || 0), 0);

      setStats({
        employees: employees.length,
        teams: teams.length,
        assignments: totalAssignments,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">
              <FiUserCheck />
            </div>
            <div className="stat-content">
              <h3>{stats.employees}</h3>
              <p>Total Employees</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <FiUsers />
            </div>
            <div className="stat-content">
              <h3>{stats.teams}</h3>
              <p>Total Teams</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">
              <FiBriefcase />
            </div>
            <div className="stat-content">
              <h3>{stats.assignments}</h3>
              <p>Team Assignments</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Welcome to HRMS</h2>
          </div>
          <p style={{ color: '#666', lineHeight: '1.6' }}>
            Manage your employees, teams, and assignments all in one place. Use the navigation menu above to get started.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
