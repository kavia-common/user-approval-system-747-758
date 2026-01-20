import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import { SessionProvider, useSession } from './context/SessionContext';

/**
 * Root App component with layout, theme toggle, and routing.
 */

// Simple header component with theme toggle and session status
function Header({ theme, onToggle }) {
  return (
    <header className="topbar" style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: 'linear-gradient(90deg, rgba(59,130,246,0.08), rgba(245,158,11,0.05))',
      borderBottom: '1px solid #e5e7eb',
      padding: '10px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#111827', fontWeight: 700 }}>Dashboard</Link>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <ThemeToggle theme={theme} onToggle={onToggle} />
        <SessionBadge />
      </div>
    </header>
  );
}

function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}

function SessionBadge() {
  const { session, isAuthenticated, login, logout } = useSession();
  const [pending, setPending] = useState(false);

  const handle = async () => {
    setPending(true);
    try {
      if (isAuthenticated) {
        await logout();
      } else {
        await login('demo');
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <button className="btn" onClick={handle} disabled={pending}>
      {isAuthenticated ? `Logout (${session?.username})` : 'Login (demo)'}
    </button>
  );
}

function Layout() {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const onToggle = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <main style={{ flex: 1, background: '#f9fafb' }}>
        <Header theme={theme} onToggle={onToggle} />
        <div>
          <Routes>
            <Route path="/" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Application root with providers and router. */
  const app = useMemo(() => (
    <SessionProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </SessionProvider>
  ), []);
  return app;
}

export default App;
