import React, { useState, useEffect } from 'react';
import { employeeAPI, teamAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUsers } from 'react-icons/fi';
import Navbar from '../components/Navbar';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
  });

  useEffect(() => {
    fetchEmployees();
    fetchTeams();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    }
  };

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone || '',
        position: employee.position || '',
        department: employee.department || '',
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        position: '',
        department: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await employeeAPI.update(editingEmployee.id, formData);
      } else {
        await employeeAPI.create(formData);
      }
      fetchEmployees();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save employee:', error);
      alert(error.response?.data?.message || 'Failed to save employee');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id);
        fetchEmployees();
      } catch (error) {
        console.error('Failed to delete employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const handleOpenAssignModal = (employee) => {
    setSelectedEmployee(employee);
    setShowAssignModal(true);
  };

  const handleAssignTeam = async (teamId) => {
    try {
      await teamAPI.assignEmployee(teamId, selectedEmployee.id);
      fetchEmployees();
      alert('Employee assigned to team successfully');
    } catch (error) {
      console.error('Failed to assign employee:', error);
      alert(error.response?.data?.message || 'Failed to assign employee');
    }
  };

  const handleUnassignTeam = async (teamId) => {
    try {
      await teamAPI.unassignEmployee(teamId, selectedEmployee.id);
      fetchEmployees();
      alert('Employee unassigned from team successfully');
    } catch (error) {
      console.error('Failed to unassign employee:', error);
      alert('Failed to unassign employee');
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
          <h1 className="page-title">Employees</h1>
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            <FiPlus /> Add Employee
          </button>
        </div>

        <div className="card">
          {employees.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h3>No employees yet</h3>
              <p>Get started by adding your first employee</p>
              <button onClick={() => handleOpenModal()} className="btn btn-primary">
                <FiPlus /> Add Employee
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Teams</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{`${employee.first_name} ${employee.last_name}`}</td>
                      <td>{employee.email}</td>
                      <td>{employee.phone || '-'}</td>
                      <td>{employee.position || '-'}</td>
                      <td>{employee.department || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {employee.Teams && employee.Teams.length > 0 ? (
                            employee.Teams.map((team) => (
                              <span key={team.id} className="badge badge-primary">
                                {team.name}
                              </span>
                            ))
                          ) : (
                            <span style={{ color: '#999' }}>No teams</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleOpenAssignModal(employee)}
                            className="icon-btn"
                            title="Manage teams"
                          >
                            <FiUsers size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenModal(employee)}
                            className="icon-btn edit"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="icon-btn delete"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Employee Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingEmployee ? 'Edit Employee' : 'Add Employee'}
              </h2>
              <button onClick={handleCloseModal} className="modal-close">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEmployee ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Assignment Modal */}
      {showAssignModal && selectedEmployee && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                Manage Teams - {selectedEmployee.first_name} {selectedEmployee.last_name}
              </h2>
              <button onClick={() => setShowAssignModal(false)} className="modal-close">
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              {teams.length === 0 ? (
                <p style={{ color: '#666' }}>No teams available</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {teams.map((team) => {
                    const isAssigned = selectedEmployee.Teams?.some((t) => t.id === team.id);
                    return (
                      <div
                        key={team.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '12px',
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '600' }}>{team.name}</div>
                          <div style={{ fontSize: '14px', color: '#666' }}>
                            {team.description || 'No description'}
                          </div>
                        </div>
                        {isAssigned ? (
                          <button
                            onClick={() => handleUnassignTeam(team.id)}
                            className="btn btn-danger btn-sm"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAssignTeam(team.id)}
                            className="btn btn-success btn-sm"
                          >
                            Assign
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowAssignModal(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
