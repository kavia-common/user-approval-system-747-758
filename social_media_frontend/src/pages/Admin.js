import React, { useEffect, useState } from 'react';
import { adminSummary, grantAdmin, listUsers } from '../services/api';

export default function Admin() {
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [lastUserId, setLastUserId] = useState('');
  const [msg, setMsg] = useState('');

  async function refresh() {
    const s = await adminSummary();
    setSummary(s);
    const u = await listUsers({ page: 1, page_size: 5 });
    setUsers(u.items);
  }

  useEffect(() => {
    refresh().catch(e => setMsg(String(e)));
  }, []);

  useEffect(() => {
    if (users.length) {
      setLastUserId(String(users[users.length - 1].id));
    }
  }, [users]);

  const handleGrant = async () => {
    setMsg('');
    try {
      const id = parseInt(lastUserId, 10);
      if (!id) throw new Error('Invalid user id');
      await grantAdmin(id);
      await refresh();
      setMsg(`Granted admin to user ${id}`);
    } catch (e) {
      setMsg(String(e));
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Admin</h1>
      {summary ? (
        <div style={{ marginBottom: 12 }}>
          <div>Active users: <strong>{summary.active_users}</strong></div>
          <div>Admins: <strong>{summary.admins}</strong></div>
          <div>Posts: <strong>{summary.posts}</strong></div>
        </div>
      ) : <div>Loading summary…</div>}
      <div style={{ marginTop: 12 }}>
        <h3>Latest Users</h3>
        <ul>
          {users.map(u => <li key={u.id}>{u.id}: {u.email} ({u.name})</li>)}
        </ul>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input value={lastUserId} onChange={(e) => setLastUserId(e.target.value)} placeholder="User ID" />
        <button className="btn" onClick={handleGrant}>Grant Admin</button>
      </div>
      {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
    </div>
  );
}
