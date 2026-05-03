const STORAGE_KEY = 'nfsvs_session_v1';

export const ROLES = /** @type {const} */ ({
  admin: 'admin',
  freelancer: 'freelancer',
  client: 'client',
});

export function getSession() {
  if (typeof window === 'undefined') return { role: ROLES.freelancer, userId: 1 };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { role: ROLES.freelancer, userId: 1 };
    const parsed = JSON.parse(raw);
    const role =
      parsed?.role === ROLES.admin ||
      parsed?.role === ROLES.client ||
      parsed?.role === ROLES.freelancer
        ? parsed.role
        : ROLES.freelancer;
    const userId = Number.parseInt(String(parsed?.userId ?? '1'), 10);
    return { role, userId: Number.isFinite(userId) ? userId : 1 };
  } catch {
    return { role: ROLES.freelancer, userId: 1 };
  }
}

export function hasSession() {
  if (typeof window === 'undefined') return true;
  return Boolean(window.localStorage.getItem(STORAGE_KEY));
}

export function setSession(next) {
  if (typeof window === 'undefined') return;
  const role =
    next?.role === ROLES.admin ||
    next?.role === ROLES.client ||
    next?.role === ROLES.freelancer
      ? next.role
      : ROLES.freelancer;
  const userId = Number.parseInt(String(next?.userId ?? '1'), 10);
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ role, userId: Number.isFinite(userId) ? userId : 1 }),
  );
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

