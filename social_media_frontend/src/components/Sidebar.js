import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

/**
 * Sidebar navigation for the dashboard.
 * Highlights active route and adapts for responsive layouts.
 */

// PUBLIC_INTERFACE
export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">SM</div>
        <div className="brand-name">Social Dashboard</div>
      </div>
      <nav className="nav">
        <NavLink end to="/" className="nav-item">
          <span className="icon">📊</span>
          <span>Analytics</span>
        </NavLink>
        <NavLink to="/profile" className="nav-item">
          <span className="icon">👤</span>
          <span>Profile</span>
        </NavLink>
        <NavLink to="/admin" className="nav-item">
          <span className="icon">🛠️</span>
          <span>Admin</span>
        </NavLink>
      </nav>
    </aside>
  );
}
