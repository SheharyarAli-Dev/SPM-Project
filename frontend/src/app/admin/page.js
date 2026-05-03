'use client';

import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import { refundsAPI, withdrawalsAPI } from '@/services/api';
import { useSession } from '@/lib/useSession';
import { ROLES } from '@/lib/session';
import Link from 'next/link';

export default function AdminDashboard() {
  const { role, userId } = useSession();
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [refunds, setRefunds] = useState([]);
  useEffect(() => {
    async function load() {
      try {
        const [w, r] = await Promise.all([withdrawalsAPI.getAll(), refundsAPI.getAll()]);
        setWithdrawals(w || []);
        setRefunds(r || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = useMemo(() => {
    const pendingWithdrawals = withdrawals.filter((x) => x.status === 'pending').length;
    const pendingRefunds = refunds.filter((x) => x.status === 'pending').length;
    const totalWithdrawals = withdrawals.length;
    const totalRefunds = refunds.length;
    return { pendingWithdrawals, pendingRefunds, totalWithdrawals, totalRefunds };
  }, [withdrawals, refunds]);

  return (
    <Layout>
      <div style={{ padding: '32px 40px' }}>
        <div style={{ marginBottom: 28 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#2ca397',
              fontFamily: 'Manrope, sans-serif',
            }}
          >
            Admin
          </p>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: '#001736',
              fontFamily: 'Manrope, sans-serif',
              margin: '4px 0',
            }}
          >
            Admin Dashboard
          </h2>
          <p style={{ color: '#64748b', marginTop: 8, fontSize: 14 }}>
            Acting as admin user #{userId}. (Backend admin checks are minimal; this UI enforces the role.)
          </p>
        </div>

        {role !== ROLES.admin ? (
          <div className="card" style={{ padding: 28 }}>
            <p style={{ fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>
              Switch role to “Admin” in the top bar to use admin functionality.
            </p>
          </div>
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              <div className="stat-card dark">
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}>
                  Pending Withdrawals
                </span>
                <p style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: '6px 0 2px', fontFamily: 'Manrope, sans-serif' }}>
                  {stats.pendingWithdrawals}
                </p>
                <span style={{ fontSize: 10, color: '#89f5e7' }}>Requires action</span>
              </div>
              <div className="stat-card">
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#747780', fontFamily: 'Manrope, sans-serif' }}>
                  Total Withdrawals
                </span>
                <p style={{ fontSize: 28, fontWeight: 900, color: '#001736', margin: '6px 0 2px', fontFamily: 'Manrope, sans-serif' }}>
                  {stats.totalWithdrawals}
                </p>
                <span className="badge badge-info" style={{ marginTop: 6 }}>Requests</span>
              </div>
              <div className="stat-card">
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#747780', fontFamily: 'Manrope, sans-serif' }}>
                  Pending Refunds
                </span>
                <p style={{ fontSize: 28, fontWeight: 900, color: '#001736', margin: '6px 0 2px', fontFamily: 'Manrope, sans-serif' }}>
                  {stats.pendingRefunds}
                </p>
                <span className="badge badge-warning" style={{ marginTop: 6 }}>Disputes</span>
              </div>
              <div className="stat-card">
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#747780', fontFamily: 'Manrope, sans-serif' }}>
                  Total Refunds
                </span>
                <p style={{ fontSize: 28, fontWeight: 900, color: '#001736', margin: '6px 0 2px', fontFamily: 'Manrope, sans-serif' }}>
                  {stats.totalRefunds}
                </p>
                <span className="badge badge-pending" style={{ marginTop: 6 }}>Requests</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 900, color: '#001736', fontSize: 16 }}>
                    Queue
                  </h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link href="/admin/withdrawals" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 14px' }}>
                      Withdrawals
                    </Link>
                    <Link href="/admin/refunds" className="btn-secondary" style={{ textDecoration: 'none', padding: '8px 14px' }}>
                      Refunds
                    </Link>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="card-tonal" style={{ padding: 16 }}>
                    <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#747780', fontFamily: 'Manrope, sans-serif' }}>
                      Next withdrawal approvals
                    </p>
                    {withdrawals.filter((x) => x.status === 'pending').slice(0, 3).length === 0 ? (
                      <p style={{ color: '#94a3b8', marginTop: 10 }}>No pending withdrawals.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                        {withdrawals.filter((x) => x.status === 'pending').slice(0, 3).map((w) => (
                          <div key={w.id} className="table-row" style={{ padding: 12, borderRadius: 10, background: '#fff', border: '1px solid #dee8ff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                              <div>
                                <p style={{ fontWeight: 900, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>Withdrawal #{w.id}</p>
                                <p style={{ fontSize: 11, color: '#94a3b8' }}>User #{w.user_id}</p>
                              </div>
                              <p style={{ fontWeight: 900, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>${parseFloat(w.net_amount).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="card-tonal" style={{ padding: 16 }}>
                    <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#747780', fontFamily: 'Manrope, sans-serif' }}>
                      Next refund decisions
                    </p>
                    {refunds.filter((x) => x.status === 'pending').slice(0, 3).length === 0 ? (
                      <p style={{ color: '#94a3b8', marginTop: 10 }}>No pending refunds.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                        {refunds.filter((x) => x.status === 'pending').slice(0, 3).map((r) => (
                          <div key={r.id} className="table-row" style={{ padding: 12, borderRadius: 10, background: '#fff', border: '1px solid #dee8ff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                              <div>
                                <p style={{ fontWeight: 900, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>Refund #{r.id}</p>
                                <p style={{ fontSize: 11, color: '#94a3b8' }}>Requested by #{r.requested_by}</p>
                              </div>
                              <p style={{ fontWeight: 900, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>${parseFloat(r.refund_amount).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 900, color: '#001736', fontSize: 14, marginBottom: 16 }}>
                  Tools
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Link href="/admin/currency" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    Manage Currency
                  </Link>
                  <Link href="/admin/withdrawals" className="btn-secondary" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    Withdrawals
                  </Link>
                  <Link href="/admin/refunds" className="btn-ghost" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    Refunds
                  </Link>
                </div>
                <div style={{ marginTop: 16, color: '#94a3b8', fontSize: 12 }}>
                  Note: backend doesn’t enforce admin auth yet; UI restricts actions by role.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

