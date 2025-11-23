import React, { useState, useEffect } from 'react';
import { logAPI } from '../services/api';
import { FiFileText, FiClock } from 'react-icons/fi';
import Navbar from '../components/Navbar';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await logAPI.getAll({ limit: 200 });
      setLogs(response.data.logs);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatAction = (action) => {
    return action
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getActionBadgeClass = (action) => {
    if (action.includes('created')) return 'badge-success';
    if (action.includes('deleted')) return 'badge-warning';
    if (action.includes('login')) return 'badge-primary';
    return 'badge-primary';
  };

  const filteredLogs = filter
    ? logs.filter((log) => log.action.toLowerCase().includes(filter.toLowerCase()))
    : logs;

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
          <h1 className="page-title">Activity Logs</h1>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <FiFileText style={{ display: 'inline', marginRight: '8px' }} />
              Audit Trail
            </h2>
            <input
              type="text"
              placeholder="Filter by action..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: '8px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
              }}
            />
          </div>

          {filteredLogs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h3>No logs found</h3>
              <p>Activity logs will appear here</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>
                      <FiClock style={{ display: 'inline', marginRight: '8px' }} />
                      Timestamp
                    </th>
                    <th>Action</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontSize: '13px', color: '#666' }}>
                        {formatTimestamp(log.timestamp)}
                      </td>
                      <td>
                        <span className={`badge ${getActionBadgeClass(log.action)}`}>
                          {formatAction(log.action)}
                        </span>
                      </td>
                      <td style={{ fontSize: '14px', color: '#666' }}>
                        {log.meta ? (
                          <div>
                            {log.meta.employeeName && (
                              <span>Employee: {log.meta.employeeName} </span>
                            )}
                            {log.meta.teamName && (
                              <span>Team: {log.meta.teamName} </span>
                            )}
                            {log.meta.orgName && (
                              <span>Organisation: {log.meta.orgName} </span>
                            )}
                            {log.meta.email && (
                              <span>Email: {log.meta.email}</span>
                            )}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Logs;
