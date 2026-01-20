import React from 'react';
import { NavLink } from 'react-router-dom';

const linkStyle = ({ isActive }) => ({
  display: 'block',
  padding: '10px 14px',
  color: isActive ? '#111827' : '#374151',
  fontWeight: isActive ? 700 : 500,
  textDecoration: 'none',
  background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
  borderRadius: 8,
});

export default function Sidebar() {
  return (
    <aside style={{ width: 240, padding: 16, borderRight: '1px solid #e5e7eb', background: '#fff' }}>
      <h2 style={{ margin: '6px 8px 16px', fontSize: 16, color: '#111827' }}>Navigation</h2>
      <nav style={{ display: 'grid', gap: 6 }}>
        <NavLink to="/" style={linkStyle}>Analytics</NavLink>
        <NavLink to="/profile" style={linkStyle}>Profile</NavLink>
        <NavLink to="/admin" style={linkStyle}>Admin</NavLink>
      </nav>
    </aside>
  );
}
```

Explanation: Analytics page fetches analytics summary
````write file="user-approval-system-747-758/social_media_frontend/src/pages/Analytics.js"
import React, { useEffect, useState } from 'react';
import { getAnalytics, getHealth } from '../services/api';

export default function Analytics() {
  const [health, setHealth] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const h = await getHealth();
        setHealth(h);
        const s = await getAnalytics();
        setSummary(s);
      } catch (e) {
        setError(String(e));
      }
    })();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>Analytics</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {health && <div style={{ marginTop: 8, color: '#4b5563' }}>Backend: {health.status} (db: {health.db})</div>}
      {summary ? (
        <div style={{ marginTop: 16 }}>
          <div>Total Users: <strong>{summary.total_users}</strong></div>
          <div>Total Posts: <strong>{summary.total_posts}</strong></div>
          <div>Avg Engagement/Post: <strong>{summary.avg_engagement_per_post}</strong></div>
          <div style={{ marginTop: 12 }}>
            <h3>Top Users</h3>
            <ul>
              {summary.top_users_by_posts.map((u, idx) => (
                <li key={idx}>{u.name || `User ${u.user_id}`}: {u.posts_count} posts</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>Loading analytics…</div>
      )}
    </div>
  );
}
