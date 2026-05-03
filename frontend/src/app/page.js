'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearSession, getSession, hasSession, ROLES, setSession } from '@/lib/session';

export default function Home() {
  const router = useRouter();
  const [previous, setPrevious] = useState(null);

  useEffect(() => {
    if (hasSession()) {
      setPrevious(getSession());
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f9f9ff' }}>
      <div
        className="animate-in"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 32px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div
            style={{
              display: 'inline-block',
              background: '#001736',
              color: '#6bd8cb',
              borderRadius: 16,
              padding: '12px 24px',
              marginBottom: 24,
              fontFamily: 'Manrope, sans-serif',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            NATIONAL FREELANCE & SKILL VERIFICATION PLATFORM
          </div>
          <h2
            style={{
              fontSize: 40,
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#001736',
              fontFamily: 'Manrope, sans-serif',
              marginBottom: 10,
            }}
          >
            Select Your Role
          </h2>
          <p style={{ color: '#43474f', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
            Choose how you&apos;d like to access the Payment & Escrow Management module of the National Freelance & Skill Verification Platform.
          </p>
          {previous && (
            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  const next =
                    previous.role === ROLES.admin ? '/admin' : previous.role === ROLES.client ? '/client' : '/dashboard';
                  router.push(next);
                }}
              >
                Continue as {previous.role} (User #{previous.userId})
              </button>
              <button
                className="btn-ghost"
                onClick={() => {
                  clearSession();
                  setPrevious(null);
                }}
              >
                Clear saved selection
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            width: '100%',
            maxWidth: 960,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}
        >
          {[
            {
              role: ROLES.client,
              title: 'Client',
              icon: 'business_center',
              desc: 'Fund escrow accounts, approve milestones, and release payments.',
            },
            {
              role: ROLES.freelancer,
              title: 'Freelancer',
              icon: 'person',
              desc: 'Manage wallet, request withdrawals, and track transactions.',
              featured: true,
            },
            {
              role: ROLES.admin,
              title: 'Admin',
              icon: 'admin_panel_settings',
              desc: 'Approve withdrawals/refunds and manage currency rates.',
            },
          ].map((r) => (
            <div
              key={r.role}
              className="card"
              style={{
                padding: 32,
                cursor: 'pointer',
                transition: 'all 0.15s',
                border: r.featured ? '2px solid rgba(107,216,203,0.3)' : undefined,
              }}
              onClick={() => {
                const userId = r.role === ROLES.admin ? 3 : r.role === ROLES.client ? 2 : 1;
                setSession({ role: r.role, userId });
                localStorage.setItem('platform_user_id', String(userId));
                localStorage.setItem('platform_user_role', r.role);
                router.push(
                  r.role === ROLES.admin ? '/admin' : r.role === ROLES.client ? '/client' : '/dashboard',
                );
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0px)')}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: '#dee8ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#001736' }}>
                  {r.icon}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <h3 style={{ fontWeight: 900, color: '#001736', fontSize: 20, fontFamily: 'Manrope, sans-serif' }}>
                  {r.title}
                </h3>
                {r.featured && <span className="badge badge-teal" style={{ fontSize: 9 }}>Most Common</span>}
              </div>
              <p style={{ color: '#43474f', fontSize: 14, marginTop: 8, lineHeight: 1.55 }}>
                {r.desc}
              </p>

              <div
                style={{
                  marginTop: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#2ca397',
                  fontWeight: 800,
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                <span>Enter as {r.title}</span>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}