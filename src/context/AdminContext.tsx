import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface AdminState {
  bannedUsers: Set<string>;
  bannedFields: Set<string>;
  dismissedReports: Set<string>;
  toggleUserBan: (id: string) => void;
  toggleFieldBan: (id: string) => void;
  dismissReport: (id: string) => void;
}

const AdminContext = createContext<AdminState | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [bannedUsers, setBannedUsers] = useState<Set<string>>(new Set());
  const [bannedFields, setBannedFields] = useState<Set<string>>(new Set());
  const [dismissedReports, setDismissedReports] = useState<Set<string>>(new Set());

  const toggleUserBan = (id: string) => {
    setBannedUsers(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleFieldBan = (id: string) => {
    setBannedFields(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const dismissReport = (id: string) => {
    setDismissedReports(prev => new Set([...prev, id]));
  };

  return (
    <AdminContext.Provider value={{ bannedUsers, bannedFields, dismissedReports, toggleUserBan, toggleFieldBan, dismissReport }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider');
  return ctx;
}
