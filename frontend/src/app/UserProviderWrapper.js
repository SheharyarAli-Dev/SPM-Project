'use client';

import { Suspense } from 'react';
import { UserProvider, useCurrentUser } from '@/context/UserContext';

function NoUserWarning() {
  const { user, isLoading, error } = useCurrentUser();
  if (isLoading || user) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: 20, right: 20,
      background: '#fff3cd',
      border: '1px solid #ffc107',
      borderRadius: 10,
      padding: '12px 20px',
      zIndex: 9999,
      fontSize: 13,
      color: '#856404',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <strong>Developer Notice:</strong> No user ID detected.
      This module requires a calling module to pass <code>?userId=X&role=Y</code> in the URL.
      Example: <code>http://localhost:3000?userId=1&role=client</code>
    </div>
  );
}

export function UserProviderWrapper({ children }) {
  return (
    <Suspense fallback={null}>
      <UserProvider>
        {children}
        <NoUserWarning />
      </UserProvider>
    </Suspense>
  );
}
