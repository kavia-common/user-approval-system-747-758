import React, { createContext, useContext, useMemo, useState } from 'react';

const SessionContext = createContext(null);

// PUBLIC_INTERFACE
export function SessionProvider({ children }) {
  /** Provide a simple demo session context. */
  const [session, setSession] = useState(null);

  const value = useMemo(() => ({
    session,
    isAuthenticated: !!session,
    async login(username) {
      setSession({ username });
    },
    async logout() {
      setSession(null);
    },
  }), [session]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useSession() {
  /** Access session context */
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
