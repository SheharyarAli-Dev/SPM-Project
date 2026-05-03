'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { walletAPI, transactionsAPI, escrowAPI } from '@/services/api';
import { useCurrentUser } from '@/context/UserContext';

export default function DashboardPage() {
  const { userId, userRole: role } = useCurrentUser();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletError, setWalletError] = useState('');

  useEffect(() => {
    if (!userId) return;
    async function load() {
      try {
        const [w, e] = await Promise.all([
          walletAPI.tryGetByUser(userId, role),
          escrowAPI.getAll(),
        ]);
        setWallet(w);
        setWalletError(!w ? `Wallet for user ${userId} not found.` : '');
        setEscrows(e);
        if (w?.id) {
          const t = await transactionsAPI.getAll(w.id);
          setTransactions(t);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId]);

  return (
    <Layout>
      <div style={{ padding: '32px 40px' }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2ca397', fontFamily: 'Manrope, sans-serif' }}>Overview</p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif', margin: '4px 0' }}>Payment Dashboard</h2>
        </div>

        {loading ? (
          <p style={{ color: '#94a3b8' }}>Loading...</p>
        ) : (
          <>
            {walletError && (
              <div className="card" style={{ padding: 16, background: '#ffdad6', border: '1px solid #ffdad6', marginBottom: 16 }}>
                <p style={{ color: '#ba1a1a', fontWeight: 800, fontFamily: 'Manrope, sans-serif', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Wallet Missing
                </p>
                <p style={{ color: '#ba1a1a', marginTop: 6 }}>
                  {walletError} Change the User ID in the top bar to a user that exists in your database.
                </p>
              </div>
            )}
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              <div style={{ background: '#001736', borderRadius: 12, padding: 20, position: 'relative', overflow: 'hidden' }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}>Available Balance</span>
                <p style={{ fontSize: 24, fontWeight: 800, color: 'white', margin: '4px 0', fontFamily: 'Manrope, sans-serif' }}>${parseFloat(wallet?.available_balance || 0).toFixed(2)}</p>
                <span style={{ fontSize: 10, color: '#89f5e7' }}>User #{userId}</span>
              </div>
              <div style={{ background: '#f0f3ff', borderRadius: 12, padding: 20 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#747780', fontFamily: 'Manrope, sans-serif' }}>Held in Escrow</span>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#001736', margin: '4px 0', fontFamily: 'Manrope, sans-serif' }}>${parseFloat(wallet?.held_balance || 0).toFixed(2)}</p>
              </div>
              <div style={{ background: '#f0f3ff', borderRadius: 12, padding: 20 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#747780', fontFamily: 'Manrope, sans-serif' }}>Active Escrows</span>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#001736', margin: '4px 0', fontFamily: 'Manrope, sans-serif' }}>{escrows.length}</p>
              </div>
              <div style={{ background: '#f0f3ff', borderRadius: 12, padding: 20 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#747780', fontFamily: 'Manrope, sans-serif' }}>Transactions</span>
                <p style={{ fontSize: 24, fontWeight: 800, color: '#001736', margin: '4px 0', fontFamily: 'Manrope, sans-serif' }}>{transactions.length}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
              {/* Escrows */}
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: '#001736', fontSize: 16 }}>Active Escrow Accounts</h3>
                  <Link href="/dashboard/escrow" style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#2ca397', textDecoration: 'none', fontFamily: 'Manrope, sans-serif' }}>View All →</Link>
                </div>
                {escrows.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: 14 }}>No escrow accounts yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {escrows.slice(0, 3).map(e => (
                      <Link key={e.id} href="/dashboard/escrow" style={{ textDecoration: 'none' }}>
                        <div style={{ padding: 16, borderRadius: 10, border: '1px solid #dee8ff', cursor: 'pointer' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <p style={{ fontWeight: 700, color: '#001736', fontSize: 14, fontFamily: 'Manrope, sans-serif' }}>Project #{e.project_id}</p>
                            <span className={`badge badge-${e.escrow_status === 'active' ? 'info' : e.escrow_status === 'completed' ? 'success' : 'pending'}`}>{e.escrow_status}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 11, color: '#747780' }}>Progress</span>
                            <span style={{ fontWeight: 700, color: '#001736', fontSize: 12 }}>${parseFloat(e.funded_amount).toFixed(2)} / ${parseFloat(e.total_amount).toFixed(2)}</span>
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

              {/* Recent Transactions */}
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: '#001736', fontSize: 14 }}>Recent Transactions</h3>
                  <Link href="/dashboard/transactions" style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#2ca397', textDecoration: 'none', fontFamily: 'Manrope, sans-serif' }}>View All →</Link>
                </div>
                {transactions.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: 14 }}>No transactions yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {transactions.slice(0, 5).map(t => (
                      <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 8 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#001736' }}>receipt</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 700, color: '#001736', fontSize: 12, fontFamily: 'Manrope, sans-serif' }}>{t.transaction_type}</p>
                          <p style={{ color: '#94a3b8', fontSize: 10 }}>{new Date(t.created_at).toLocaleDateString()}</p>
                        </div>
                        <span style={{ fontWeight: 700, color: '#001736', fontSize: 13, fontFamily: 'Manrope, sans-serif' }}>${parseFloat(t.amount).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}