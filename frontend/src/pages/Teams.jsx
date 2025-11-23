import React, { useState, useEffect } from 'react';
import { teamAPI, employeeAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUsers } from 'react-icons/fi';
import Navbar from '../components/Navbar';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchTeams();
    fetchEmployees();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleOpenModal = (team = null) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name,
        description: team.description || '',
      });
    } else {
      setEditingTeam(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTeam(null);
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
      if (editingTeam) {
        await teamAPI.update(editingTeam.id, formData);
      } else {
        await teamAPI.create(formData);
      }
      fetchTeams();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save team:', error);
      alert(error.response?.data?.message || 'Failed to save team');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await teamAPI.delete(id);
        fetchTeams();
      } catch (error) {
        console.error('Failed to delete team:', error);
        alert('Failed to delete team');
      }
    }
  };

  const handleOpenMembersModal = (team) => {
    setSelectedTeam(team);
    setShowMembersModal(true);
  };

  const handleAssignEmployee = async (employeeId) => {
    try {
      await teamAPI.assignEmployee(selectedTeam.id, employeeId);
      fetchTeams();
      fetchEmployees();
      alert('Employee assigned to team successfully');
    } catch (error) {
      console.error('Failed to assign employee:', error);
      alert(error.response?.data?.message || 'Failed to assign employee');
    }
  };

  const handleUnassignEmployee = async (employeeId) => {
    try {
      await teamAPI.unassignEmployee(selectedTeam.id, employeeId);
      fetchTeams();
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
          <h1 className="page-title">Teams</h1>
          <button onClick={() => handleOpenModal()} className="btn btn-primary">
            <FiPlus /> Add Team
          </button>
        </div>

        <div className="card">
          {teams.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <h3>No teams yet</h3>
              <p>Get started by creating your first team</p>
              <button onClick={() => handleOpenModal()} className="btn btn-primary">
                <FiPlus /> Add Team
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Team Name</th>
                    <th>Description</th>
                    <th>Members</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => (
                    <tr key={team.id}>
                      <td>
                        <div style={{ fontWeight: '600' }}>{team.name}</div>
                      </td>
                      <td>{team.description || '-'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <span className="badge badge-success">
                            {team.Employees?.length || 0} members
                          </span>
                          {team.Employees && team.Employees.length > 0 && (
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              {team.Employees.slice(0, 2).map((emp) => (
                                <span key={emp.id} className="badge badge-primary" style={{ marginLeft: '4px' }}>
                                  {emp.first_name} {emp.last_name}
                                </span>
                              ))}
                              {team.Employees.length > 2 && (
                                <span style={{ marginLeft: '4px' }}>
                                  +{team.Employees.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleOpenMembersModal(team)}
                            className="icon-btn"
                            title="Manage members"
                          >
                            <FiUsers size={18} />
                          </button>
                          <button
                            onClick={() => handleOpenModal(team)}
                            className="icon-btn edit"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(team.id)}
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

      {/* Team Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingTeam ? 'Edit Team' : 'Add Team'}
              </h2>
              <button onClick={handleCloseModal} className="modal-close">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Team Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Backend Team"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe the team's purpose and responsibilities"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTeam ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Members Management Modal */}
      {showMembersModal && selectedTeam && (
        <div className="modal-overlay" onClick={() => setShowMembersModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                Manage Members - {selectedTeam.name}
              </h2>
              <button onClick={() => setShowMembersModal(false)} className="modal-close">
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              {employees.length === 0 ? (
                <p style={{ color: '#666' }}>No employees available</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {employees.map((employee) => {
                    const isAssigned = selectedTeam.Employees?.some((e) => e.id === employee.id);
                    return (
                      <div
                        key={employee.id}
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
                          <div style={{ fontWeight: '600' }}>
                            {employee.first_name} {employee.last_name}
                          </div>
                          <div style={{ fontSize: '14px', color: '#666' }}>
                            {employee.position || 'No position'} • {employee.email}
                          </div>
                        </div>
                        {isAssigned ? (
                          <button
                            onClick={() => handleUnassignEmployee(employee.id)}
                            className="btn btn-danger btn-sm"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAssignEmployee(employee.id)}
                            className="btn btn-success btn-sm"
                          >
                            Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowMembersModal(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teams;
