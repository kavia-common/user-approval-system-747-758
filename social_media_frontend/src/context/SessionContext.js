import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

/**
 * SessionContext provides basic session management for the app.
 * This is a lightweight placeholder; integrate with real auth endpoints as needed.
 */

const SessionContext = createContext(undefined);

// PUBLIC_INTERFACE
export function useSession() {
  /** Access the current session and actions. */
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}

// PUBLIC_INTERFACE
export function SessionProvider({ children }) {
  /** Provider that stores session info and exposes login/logout actions. */
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sm_session');
    if (saved) {
      try {
        setSession(JSON.parse(saved));
      } catch {
        // ignore parse errors
      }
    }
    setLoading(false);
  }, []);

  // Persist session changes
  useEffect(() => {
    if (session) {
      localStorage.setItem('sm_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('sm_session');
    }
  }, [session]);

  const value = useMemo(() => ({
    session,
    isAuthenticated: !!session?.token,
    async login(username) {
      const data = await api.login(username);
      setSession(data);
      return data;
    },
    async logout() {
      await api.logout();
      setSession(null);
    },
  }), [session]);

  return (
    <SessionContext.Provider value={value}>
      {!loading && children}
    </SessionContext.Provider>
  );
}
