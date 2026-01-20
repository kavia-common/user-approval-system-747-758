import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './pages.css';

/**
 * Analytics dashboard page.
 * Fetches analytics overview and displays metric cards and chart placeholders.
 */

// PUBLIC_INTERFACE
export default function Analytics() {
  const [data, setData] = useState(null);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    api.getAnalytics()
      .then((res) => { if (alive) { setData(res); } })
      .catch((e) => { if (alive) { setError(e.message || 'Failed to load analytics'); } })
      .finally(() => { if (alive) { setPending(false); } });
    return () => { alive = false; };
  }, []);

  if (pending) return <div className="page"><div className="loading">Loading analytics…</div></div>;
  if (error) return <div className="page"><div className="error">{error}</div></div>;

  const metrics = [
    { label: 'Total Posts', value: data?.total_posts ?? '—' },
    { label: 'Followers', value: data?.followers ?? '—' },
    { label: 'Engagement Rate', value: data?.engagement_rate ? `${data.engagement_rate}%` : '—' },
    { label: 'Impressions', value: data?.impressions ?? '—' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1>Analytics</h1>
        <p className="subtitle">Overview of your recent performance</p>
      </div>

      <div className="grid grid-4">
        {metrics.map((m) => (
          <div key={m.label} className="card metric">
            <div className="metric-label">{m.label}</div>
            <div className="metric-value">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-2 mtop">
        <div className="card">
          <div className="card-title">Engagement Over Time</div>
          <div className="chart-placeholder">Chart Placeholder</div>
        </div>
        <div className="card">
          <div className="card-title">Top Posts</div>
          <ul className="list">
            {(data?.top_posts || []).map((p, idx) => (
              <li key={idx} className="list-item">
                <span className="badge">#{idx + 1}</span>
                <span className="grow">{p.title || `Post ${idx + 1}`}</span>
                <span className="muted">{p.engagement} engagement</span>
              </li>
            ))}
            {(!data?.top_posts || data.top_posts.length === 0) && (
              <li className="list-item muted">No top posts found.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
