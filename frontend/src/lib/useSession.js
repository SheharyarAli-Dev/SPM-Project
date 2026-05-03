'use client';

import { useEffect, useMemo, useState } from 'react';
import { ROLES, getSession, setSession } from './session';

/** Matches `getSession()` when `window` is undefined — never read localStorage during initial state (fixes hydration vs stored session). */
const SSR_SAFE_SESSION = { role: ROLES.freelancer, userId: 1 };

export function useSession() {
  const [session, setSessionState] = useState(SSR_SAFE_SESSION);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    setSessionState(getSession());
    setSessionReady(true);
  }, []);

  const actions = useMemo(
    () => ({
      update(next) {
        setSession(next);
        setSessionState(getSession());
      },
    }),
    [],
  );

  return { ...session, sessionReady, ...actions };
}

