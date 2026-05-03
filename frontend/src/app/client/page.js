'use client';

import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useCurrentUser } from '@/context/UserContext';
import { escrowAPI, invoicesAPI, milestonePaymentsAPI, walletAPI } from '@/services/api';

export default function ClientDashboard() {
  const { userRole: role, userId, isLoading: ctxLoading } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [escrows, setEscrows] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    if (ctxLoading || !userId) return;
    if (role !== 'client') {
      setLoading(false);
      return;
    }
    setLoading(true);
    async function load() {
      try {
        const [w, e, inv] = await Promise.all([
          walletAPI.tryGetByUser(userId, role),
          escrowAPI.getAll(),
          invoicesAPI.getAll(userId),
        ]);
        setWallet(w);
        const scoped = (e || []).filter((x) => x.client_user_id === userId);
        setEscrows(scoped);
        setInvoices(inv || []);

        if (scoped.length > 0) {
          const ms = await Promise.all(scoped.map((esc) => milestonePaymentsAPI.getAll(esc.id)));
          setMilestones(ms.flat());
        } else {
          setMilestones([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [ctxLoading, userId, role]);

  const stats = useMemo(() => {
    const activeEscrows = escrows.filter((e) => e.escrow_status === 'active' || e.escrow_status === 'pending').length;
    const held = parseFloat(wallet?.held_balance || 0);
    const pendingApproval = milestones.filter((m) => m.approval_status === 'pending').length;
    return { activeEscrows, held, pendingApproval, invoices: invoices.length };
  }, [escrows, wallet, milestones, invoices]);

  return (
    <Layout>
      <div style={{ padding: '32px 40px' }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2ca397', fontFamily: 'Manrope, sans-serif' }}>
            Client
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif', margin: '4px 0' }}>
            Client Dashboard
          </h2>
          <p style={{ color: '#64748b', marginTop: 8, fontSize: 14 }}>
            Acting as client user #{userId}. Create and manage escrows, approve milestones, and view invoices.
          </p>
        </div>

        {ctxLoading || loading ? (
          <p>Loading...</p>
        ) : role !== 'client' ? (
          <div className="card" style={{ padding: 28 }}>
            <p style={{ fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>
              Switch role to “Client” in the top bar to use client functionality.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              <div className="stat-card dark">
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}>
                  Available Balance
                </span>
                <p style={{ fontSize: 28, fontWeight: 900, color: 'white', margin: '6px 0 2px', fontFamily: 'Manrope, sans-serif' }}>
                  ${parseFloat(wallet?.available_balance || 0).toFixed(2)}
                </p>
                <span style={{ fontSize: 10, color: '#89f5e7' }}>Wallet</span>
              </div>
              <div className="stat-card">
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#747780', fontFamily: 'Manrope, sans-serif' }}>
                  Held in Escrow
                </span>
                <p style={{ fontSize: 28, fontWeight: 900, color: '#001736', margin: '6px 0 2px', fontFamily: 'Manrope, sans-serif' }}>
                  ${stats.held.toFixed(2)}
                </p>
              </div>
              <div className="stat-card">
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#747780', fontFamily: 'Manrope, sans-serif' }}>
                  Active Escrows
                </span>
                <p style={{ fontSize: 28, fontWeight: 900, color: '#001736', margin: '6px 0 2px', fontFamily: 'Manrope, sans-serif' }}>
                  {stats.activeEscrows}
                </p>
              </div>
              <div className="stat-card">
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#747780', fontFamily: 'Manrope, sans-serif' }}>
                  Pending Approvals
                </span>
                <p style={{ fontSize: 28, fontWeight: 900, color: '#001736', margin: '6px 0 2px', fontFamily: 'Manrope, sans-serif' }}>
                  {stats.pendingApproval}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 900, color: '#001736', fontSize: 16 }}>
                    Your Escrows
                  </h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link href="/client/escrow" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 14px' }}>
                      Manage
                    </Link>
                    <Link href="/dashboard/transactions" className="btn-ghost" style={{ textDecoration: 'none', padding: '8px 14px' }}>
                      Transactions
                    </Link>
                  </div>
                </div>

                {escrows.length === 0 ? (
                  <p style={{ color: '#94a3b8' }}>No escrows yet. Create your first escrow from the Escrow page.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {escrows.slice(0, 4).map((e) => (
                      <Link key={e.id} href="/client/escrow" style={{ textDecoration: 'none' }}>
                        <div className="table-row" style={{ padding: 16, borderRadius: 12, border: '1px solid #dee8ff' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <p style={{ fontWeight: 900, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>
                              Project #{e.project_id}
                            </p>
                            <span className={`badge badge-${e.escrow_status === 'active' ? 'info' : e.escrow_status === 'completed' ? 'success' : 'pending'}`}>{e.escrow_status}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 12, color: '#747780' }}>Funded / Total</span>
                            <span style={{ fontWeight: 900, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>
                              ${parseFloat(e.funded_amount).toFixed(2)} / ${parseFloat(e.total_amount).toFixed(2)}
                            </span>
                          </div>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${Math.min((e.funded_amount / e.total_amount) * 100, 100)}%` }}></div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 900, color: '#001736', fontSize: 14, marginBottom: 16 }}>
                  Quick Actions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Link href="/client/escrow" className="btn-primary" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    Create / Fund Escrow
                  </Link>
                  <Link href="/dashboard/milestones" className="btn-secondary" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    Review Milestones
                  </Link>
                  <Link href="/dashboard/invoices" className="btn-ghost" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    View Invoices ({stats.invoices})
                  </Link>
                </div>
                <div style={{ marginTop: 16, color: '#94a3b8', fontSize: 12 }}>
                  Tip: escrow/milestone actions are restricted to the Client role.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

