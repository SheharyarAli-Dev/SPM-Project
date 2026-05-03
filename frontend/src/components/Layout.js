'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ROLES } from '@/lib/session';
import { useSession } from '@/lib/useSession';

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');
  const { role, userId, update } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const basePath =
    role === ROLES.admin ? '/admin' : role === ROLES.client ? '/client' : '/dashboard';

  const navLinks =
    role === ROLES.admin
      ? [
        { href: `${basePath}`, icon: 'dashboard', label: 'Admin Overview' },
        { href: `${basePath}/withdrawals`, icon: 'payments', label: 'Withdrawals' },
        { href: `${basePath}/refunds`, icon: 'undo', label: 'Refunds' },
        { href: `${basePath}/currency`, icon: 'currency_exchange', label: 'Currency' },
      ]
      : role === ROLES.client
        ? [
          { href: `${basePath}`, icon: 'dashboard', label: 'Client Dashboard' },
          { href: `/dashboard/wallet`, icon: 'account_balance_wallet', label: 'Wallet' },
          { href: `${basePath}/escrow`, icon: 'shield_lock', label: 'Escrow' },
          { href: `/dashboard/milestones`, icon: 'task_alt', label: 'Milestones' },
          { href: `/dashboard/invoices`, icon: 'description', label: 'Invoices' },
          { href: `/dashboard/transactions`, icon: 'receipt_long', label: 'Transactions' },
          { href: `/dashboard/notifications`, icon: 'notifications', label: 'Notifications' },
          { href: `/dashboard/refunds`, icon: 'undo', label: 'Refunds' },
        ]
        : [
          { href: `${basePath}`, icon: 'dashboard', label: 'Dashboard' },
          { href: `${basePath}/wallet`, icon: 'account_balance_wallet', label: 'Wallet' },
          { href: `${basePath}/withdrawals`, icon: 'payments', label: 'Withdrawals' },
          { href: `${basePath}/transactions`, icon: 'receipt_long', label: 'Transactions' },
          { href: `${basePath}/escrow`, icon: 'shield_lock', label: 'Escrow' },
          { href: `${basePath}/milestones`, icon: 'task_alt', label: 'Milestones' },
          { href: `${basePath}/invoices`, icon: 'description', label: 'Invoices' },
          { href: `${basePath}/notifications`, icon: 'notifications', label: 'Notifications' },
          { href: `${basePath}/refunds`, icon: 'undo', label: 'Refunds' },
        ];

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingLeft: 16, borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Manrope, sans-serif', margin: 0 }}>Alex Sterling</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 2 }}>
                <select
                  value={role}
                  onChange={(e) => update({ role: e.target.value, userId })}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 6,
                    padding: '2px 6px',
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    outline: 'none',
                  }}
                >
                  <option value={ROLES.freelancer}>Freelancer</option>
                  <option value={ROLES.client}>Client</option>
                  <option value={ROLES.admin}>Admin</option>
                </select>
                <input
                  value={String(userId ?? '')}
                  onChange={(e) => update({ role, userId: e.target.value })}
                  inputMode="numeric"
                  placeholder="User ID"
                  style={{
                    width: 76,
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 6,
                    padding: '2px 6px',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: '#002b5b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 13, fontFamily: 'Manrope, sans-serif' }}>AS</div>
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
          <nav style={{ flexGrow: 1 }}>
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