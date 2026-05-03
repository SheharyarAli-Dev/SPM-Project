'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCurrentUser } from '@/context/UserContext';

// ─── Role display config ────────────────────────────────────────────────────────
const ROLE_COLORS = {
  freelancer: { bg: '#e8f5e9', text: '#2e7d32', label: 'Freelancer' },
  client:     { bg: '#e3f2fd', text: '#1565c0', label: 'Client'     },
  admin:      { bg: '#fce4ec', text: '#880e4f', label: 'Admin'      },
  moderator:  { bg: '#fff3e0', text: '#e65100', label: 'Moderator'  },
};

// ─── Avatar component ───────────────────────────────────────────────────────────
function UserAvatar({ user, size = 36 }) {
  const [imgError, setImgError] = useState(false);
  const colors = ROLE_COLORS[user.role] || ROLE_COLORS.client;
  const initials = (user.displayName || '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (user.profileImageUrl && !imgError) {
    return (
      <img
        src={user.profileImageUrl}
        alt={user.displayName}
        onError={() => setImgError(true)}
        data-cy="user-avatar-image"
        style={{
          width: size, height: size, borderRadius: '50%', objectFit: 'cover',
          border: `2px solid ${colors.text}`, flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      data-cy="user-avatar-initials"
      style={{
        width: size, height: size, borderRadius: '50%', background: colors.bg,
        border: `2px solid ${colors.text}`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: size * 0.35, fontWeight: 700,
        color: colors.text, flexShrink: 0, userSelect: 'none',
      }}
    >
      {initials}
    </div>
  );
}

// ─── Header User Section ────────────────────────────────────────────────────────
function HeaderUserSection() {
  const { user, userId, userRole, isLoading, error } = useCurrentUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  if (isLoading) {
    return (
      <div data-cy="user-section-loading" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', animation: 'pulse 1.5s infinite' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ width: 100, height: 12, background: 'rgba(255,255,255,0.15)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
          <div style={{ width: 70, height: 10, background: 'rgba(255,255,255,0.15)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div data-cy="user-section-error" style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
        background: 'rgba(255,243,205,0.15)', borderRadius: 8, border: '1px solid rgba(255,193,7,0.3)',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ffc107' }}>warning</span>
        <div style={{ fontSize: 11, color: '#ffc107' }}>
          <div style={{ fontWeight: 600 }}>User not identified</div>
          <div style={{ fontSize: 10, opacity: 0.8 }}>{error || 'No user ID provided'}</div>
          {userId && <div style={{ fontSize: 10, opacity: 0.8 }}>Attempted ID: #{userId}</div>}
        </div>
      </div>
    );
  }

  const colors = ROLE_COLORS[user.role] || ROLE_COLORS.client;

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }} data-cy="user-section-container">
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        data-cy="user-section-trigger"
        aria-label="User menu"
        aria-expanded={dropdownOpen}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px',
          background: 'transparent', border: '1px solid transparent', borderRadius: 10,
          cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
      >
        <UserAvatar user={user} size={36} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
          <span data-cy="user-display-name" style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.2, fontFamily: 'Manrope, sans-serif' }}>
            {user.displayName}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span data-cy="user-id-display" style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>ID: #{user.id}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>•</span>
            <span data-cy="user-role-badge" style={{
              fontSize: 9, fontWeight: 700, color: colors.text, background: colors.bg,
              padding: '1px 7px', borderRadius: 20, textTransform: 'capitalize', letterSpacing: '0.3px',
            }}>
              {colors.label}
            </span>
          </div>
        </div>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginLeft: 2, transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▼</span>
      </button>

      {dropdownOpen && (
        <div data-cy="user-dropdown-panel" style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 280,
          background: 'white', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
          border: '1px solid #eee', zIndex: 2000, overflow: 'hidden',
        }}>
          <div style={{ background: colors.bg, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #f0f0f0' }}>
            <UserAvatar user={user} size={48} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>{user.displayName}</div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 2 }}>{user.email}</div>
            </div>
          </div>
          <div style={{ padding: '12px 0' }}>
            {[
              { label: 'User ID',        value: `#${user.id}`,       cy: 'dropdown-user-id' },
              { label: 'Role',           value: colors.label,         cy: 'dropdown-role' },
              { label: 'Account Status', value: user.accountStatus,   cy: 'dropdown-status' },
              { label: 'Country',        value: user.country || '—',  cy: 'dropdown-country' },
            ].map(({ label, value, cy }) => (
              <div key={label} data-cy={cy} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 20px', fontSize: 13, borderBottom: '1px solid #fafafa' }}>
                <span style={{ color: '#888', fontWeight: 500 }}>{label}</span>
                <span style={{ color: '#111', fontWeight: 600, textTransform: 'capitalize' }}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '10px 20px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>
            <div data-cy="dropdown-module-info" style={{ fontSize: 11, color: '#aaa', textAlign: 'center' }}>Payment & Escrow Module — Module 7</div>
            <div style={{ fontSize: 10, color: '#ccc', textAlign: 'center', marginTop: 2 }}>User authenticated by calling module</div>
          </div>
          <div style={{ padding: '8px 20px 14px' }}>
            <button
              data-cy="dropdown-copy-id"
              onClick={() => { navigator.clipboard.writeText(String(user.id)).then(() => alert(`User ID #${user.id} copied to clipboard`)).catch(() => {}); }}
              style={{ width: '100%', padding: '7px', fontSize: 12, color: colors.text, background: colors.bg, border: `1px solid ${colors.text}30`, borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
            >
              Copy User ID #{user.id}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Layout ────────────────────────────────────────────────────────────────
export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');
  const { userId, userRole, isLoading } = useCurrentUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const role = userRole || 'freelancer';
  const basePath = role === 'admin' ? '/admin' : role === 'client' ? '/client' : '/dashboard';

  const navLinks = (() => {
    // 1. ADMIN Navigation
    if (role === 'admin') {
      return [
        { href: '/admin', icon: 'dashboard', label: 'Admin Overview' },
        { href: '/admin/withdrawals', icon: 'payments', label: 'Withdrawals' },
        { href: '/admin/refunds', icon: 'undo', label: 'Refunds' },
        { href: '/admin/currency', icon: 'currency_exchange', label: 'Currency' },
        { href: '/dashboard/notifications', icon: 'notifications', label: 'Notifications' },
      ];
    }

    // 2. CLIENT Navigation
    if (role === 'client') {
      return [
        { href: '/client', icon: 'dashboard', label: 'Client Dashboard' },
        { href: '/client/escrow', icon: 'shield_lock', label: 'Escrow' },
        { href: '/dashboard/wallet', icon: 'account_balance_wallet', label: 'Wallet' },
        { href: '/dashboard/transactions', icon: 'receipt_long', label: 'Transactions' },
        { href: '/dashboard/invoices', icon: 'description', label: 'Invoices' },
        { href: '/dashboard/milestones', icon: 'task_alt', label: 'Milestones' },
        { href: '/dashboard/refunds', icon: 'undo', label: 'Refunds' },
        { href: '/dashboard/notifications', icon: 'notifications', label: 'Notifications' },
      ];
    }

    // 3. FREELANCER Navigation (Default)
    return [
      { href: '/dashboard', icon: 'dashboard', label: 'Freelancer Dashboard' },
      { href: '/dashboard/wallet', icon: 'account_balance_wallet', label: 'Wallet' },
      { href: '/dashboard/escrow', icon: 'shield_lock', label: 'Escrow' },
      { href: '/dashboard/transactions', icon: 'receipt_long', label: 'Transactions' },
      { href: '/dashboard/invoices', icon: 'description', label: 'Invoices' },
      { href: '/dashboard/milestones', icon: 'task_alt', label: 'Milestones' },
      { href: '/dashboard/withdrawals', icon: 'payments', label: 'Withdrawals' },
      { href: '/dashboard/refunds', icon: 'undo', label: 'Refunds' },
      { href: '/dashboard/notifications', icon: 'notifications', label: 'Notifications' },
    ];
  })();

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Top Nav */}
      <header
        id="topnav"
        style={{
          height: 64,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: '#001736',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <div>
              <h1 style={{ fontSize: 11, fontWeight: 900, color: 'white', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.2, fontFamily: 'Manrope, sans-serif', margin: 0 }}>NATIONAL FREELANCE & SKILL VERIFICATION PLATFORM</h1>
              <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', margin: 0 }}>Payment & Escrow Module</p>
            </div>
          </Link>
        </div>
        <div style={{ flexGrow: 1, maxWidth: 400, padding: '0 40px' }}>
          <div style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 16 }}>search</span>
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && searchVal.trim()) {
                  router.push(`/dashboard/search?q=${encodeURIComponent(searchVal.trim())}`);
                  setSearchVal('');
                }
              }}
              placeholder="Search transactions, invoices… (Enter)"
              style={{ width: '100%', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: 14, padding: '8px 16px 8px 40px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link
            href="/dashboard/notifications"
            style={{ position: 'relative', color: '#cbd5e1', textDecoration: 'none' }}
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="notification-dot"></span>
          </Link>
          <div style={{ paddingLeft: 16, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
            <HeaderUserSection />
          </div>
        </div>
      </header>

      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
        <aside style={{
          position: 'fixed', left: 0, top: 64, height: 'calc(100vh - 64px)',
          width: 256, zIndex: 40, display: 'flex', flexDirection: 'column',
          padding: 16, background: 'linear-gradient(180deg, #f0f3ff 0%, #f9f9ff 100%)'
        }}>
          <nav data-cy="sidebar-nav" style={{ flexGrow: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'Manrope, sans-serif', color: '#94a3b8', padding: '0 12px', marginBottom: 16 }}>Navigation</p>
            {mounted && navLinks.map(link => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`sidebar-link${isActive ? ' active' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    marginBottom: 2,
                    textDecoration: 'none',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: isActive ? '#001736' : '#64748b',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main key={userId} style={{ marginLeft: 256, width: '100%', minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}