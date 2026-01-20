import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import './pages.css';

/**
 * Admin tools page.
 * Displays platform overview info and user management table.
 */

// PUBLIC_INTERFACE
export default function Admin() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    setPending(true);
    setError('');
    try {
      const [o, u] = await Promise.all([api.getAdminOverview(), api.getUsers()]);
      setOverview(o);
      setUsers(Array.isArray(u) ? u : (u?.items || []));
    } catch (e) {
      setError(e.message || 'Failed to load admin data');
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    let alive = true;
    load().finally(() => { if (!alive) return; });
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = useMemo(() => ([
    { label: 'Total Users', value: overview?.total_users ?? '—' },
    { label: 'Active Today', value: overview?.active_today ?? '—' },
    { label: 'Reports', value: overview?.reports ?? '—' },
    { label: 'Revenue', value: overview?.revenue ? `$${overview.revenue}` : '—' },
  ]), [overview]);

  const updateUser = async (userId, field, value) => {
    setUpdatingId(userId);
    try {
      await api.updateUser(userId, { [field]: value });
      await load();
    } catch (e) {
      alert(e.message || 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  if (pending) return <div className="page"><div className="loading">Loading admin data…</div></div>;
  if (error) return <div className="page"><div className="error">{error}</div></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Admin</h1>
        <p className="subtitle">User management and platform overview</p>
      </div>

      <div className="grid grid-4">
        {totals.map(t => (
          <div className="card metric" key={t.label}>
            <div className="metric-label">{t.label}</div>
            <div className="metric-value">{t.value}</div>
          </div>
        ))}
      </div>

      <div className="card mtop">
        <div className="card-title">Users</div>
        <div className="table">
          <div className="thead">
            <div className="tr">
              <div className="th">ID</div>
              <div className="th">Username</div>
              <div className="th">Role</div>
              <div className="th">Status</div>
              <div className="th">Actions</div>
            </div>
          </div>
          <div className="tbody">
            {users.map(u => (
              <div className="tr" key={u.id}>
                <div className="td">{u.id}</div>
                <div className="td">{u.username}</div>
                <div className="td">
                  <select
                    value={u.role || 'user'}
                    onChange={(e) => updateUser(u.id, 'role', e.target.value)}
                    disabled={updatingId === u.id}
                  >
                    <option value="user">user</option>
                    <option value="moderator">moderator</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
                <div className="td">
                  <select
                    value={u.status || 'active'}
                    onChange={(e) => updateUser(u.id, 'status', e.target.value)}
                    disabled={updatingId === u.id}
                  >
                    <option value="active">active</option>
                    <option value="suspended">suspended</option>
                    <option value="pending">pending</option>
                  </select>
                </div>
                <div className="td">
                  <button
                    className="btn outline"
                    onClick={() => updateUser(u.id, 'status', u.status === 'active' ? 'suspended' : 'active')}
                    disabled={updatingId === u.id}
                  >
                    {u.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <div className="tr">
                <div className="td" colSpan="5">No users found.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
