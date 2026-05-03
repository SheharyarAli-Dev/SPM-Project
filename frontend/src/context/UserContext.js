'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

// ─── Role constants ────────────────────────────────────────────────────────────
export const USER_ROLES = { freelancer: 'freelancer', client: 'client', admin: 'admin', moderator: 'moderator' };

// ─── Context ───────────────────────────────────────────────────────────────────
const UserContext = createContext({
  user: null,
  userId: null,
  userRole: null,
  isLoading: true,
  error: null,
  refetch: () => {},
});

// ─── Provider ──────────────────────────────────────────────────────────────────
export function UserProvider({ children }) {
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Resolve user ID from all possible sources
  // Priority: URL query param → localStorage → sessionStorage
  const resolveUserId = useCallback(() => {
    const paramUserId = searchParams?.get('userId') || searchParams?.get('user_id');
    if (paramUserId && !isNaN(+paramUserId)) return +paramUserId;

    if (typeof window !== 'undefined') {
      const lsId =
        localStorage.getItem('platform_user_id') ||
        localStorage.getItem('userId') ||
        localStorage.getItem('user_id');
      if (lsId && !isNaN(+lsId)) return +lsId;

      // Also check the existing session key used by the old session system
      try {
        const raw = localStorage.getItem('nfsvs_session_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.userId && !isNaN(+parsed.userId)) return +parsed.userId;
        }
      } catch { /* ignore */ }

      const ssId =
        sessionStorage.getItem('platform_user_id') ||
        sessionStorage.getItem('userId');
      if (ssId && !isNaN(+ssId)) return +ssId;
    }

    return null;
  }, [searchParams]);

  const resolveUserRole = useCallback(() => {
    const paramRole = searchParams?.get('role') || searchParams?.get('userRole');
    if (paramRole) return paramRole;

    if (typeof window !== 'undefined') {
      const lsRole =
        localStorage.getItem('platform_user_role') ||
        localStorage.getItem('userRole');
      if (lsRole) return lsRole;

      try {
        const raw = localStorage.getItem('nfsvs_session_v1');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.role) return parsed.role;
        }
      } catch { /* ignore */ }
    }

    return null;
  }, [searchParams]);

  // Fetch user from centralised DB via backend
  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const userId = resolveUserId();

    if (!userId) {
      setError('No user ID provided. This module must be called with ?userId=X');
      setIsLoading(false);
      return;
    }

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const response = await fetch(`${API_BASE}/users/identity/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': String(userId),
          'x-user-role': resolveUserRole() || '',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`User with ID ${userId} not found in the platform database.`);
        }
        throw new Error(`Failed to load user identity: HTTP ${response.status}`);
      }

      const data = await response.json();
      setUser(data);

      // Persist to localStorage so other pages don't need the query param
      if (typeof window !== 'undefined') {
        localStorage.setItem('platform_user_id', String(data.id));
        localStorage.setItem('platform_user_role', data.role);
      }
    } catch (err) {
      setError(err.message || 'Failed to load user data');
      console.error('[UserContext] Error fetching user:', err);
    } finally {
      setIsLoading(false);
    }
  }, [resolveUserId, resolveUserRole]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        userId: user?.id ?? resolveUserId(),
        userRole: user?.role ?? resolveUserRole(),
        isLoading,
        error,
        refetch: fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useCurrentUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useCurrentUser must be used inside <UserProvider>');
  }
  return ctx;
}
