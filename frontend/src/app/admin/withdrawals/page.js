'use client';

import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import { withdrawalsAPI } from '@/services/api';
import { useSession } from '@/lib/useSession';
import { ROLES } from '@/lib/session';

export default function AdminWithdrawalsPage() {
  const { role, userId } = useSession();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [rejectNote, setRejectNote] = useState({});

  async function load() {
    try {
      const w = await withdrawalsAPI.getAll();
      setWithdrawals(w || []);
    } catch (e) {
      console.error(e);
      setMsg('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const pending = useMemo(
    () => withdrawals.filter((x) => x.status === 'pending'),
    [withdrawals],
  );

  async function approve(id) {
    try {
      await withdrawalsAPI.approve(id, userId);
      setMsg(`Withdrawal #${id} approved.`);
      load();
    } catch (e) {
      setMsg('Error: ' + e.message);
    }
  }

  async function reject(id) {
    try {
      await withdrawalsAPI.reject(id, userId, rejectNote[id] || '');
      setMsg(`Withdrawal #${id} rejected.`);
      load();
    } catch (e) {
      setMsg('Error: ' + e.message);
    }
  }

  const statusColor = { completed: '#15803d', pending: '#a16207', rejected: '#ba1a1a' };
  const statusBg = { completed: '#dcfce7', pending: '#fef9c3', rejected: '#ffdad6' };

  return (
    <Layout>
      <div style={{ padding: '32px 40px', maxWidth: 1200 }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2ca397', fontFamily: 'Manrope, sans-serif' }}>
            Admin
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif', margin: '4px 0' }}>
            Withdrawals Approval
          </h2>
          <p style={{ color: '#64748b', marginTop: 8, fontSize: 14 }}>
            Pending: <strong>{pending.length}</strong>
          </p>
        </div>

        {msg && (
          <div style={{ padding: '12px 16px', borderRadius: 8, background: msg.includes('Error') ? '#ffdad6' : '#dcfce7', color: msg.includes('Error') ? '#ba1a1a' : '#15803d', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            {msg}
          </div>
        )}

        {role !== ROLES.admin ? (
          <div className="card" style={{ padding: 28 }}>
            <p style={{ fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>
              Switch role to “Admin” in the top bar to approve/reject withdrawals.
            </p>
          </div>
        ) : loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {withdrawals.length === 0 ? (
              <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                <p style={{ color: '#94a3b8', fontSize: 14 }}>No withdrawals found.</p>
              </div>
            ) : (
              withdrawals.map((w) => (
                <div key={w.id} className="card" style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: 16, alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>
                      Withdrawal #{w.id}
                    </p>
                    <p style={{ fontSize: 11, color: '#94a3b8' }}>
                      User #{w.user_id} · Wallet #{w.wallet_id} · Method #{w.payment_method_id}
                    </p>
                    {w.admin_note && (
                      <p style={{ fontSize: 11, color: '#ba1a1a', fontWeight: 600, marginTop: 6 }}>
                        Note: {w.admin_note}
                      </p>
                    )}
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 18, fontWeight: 900, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>
                      ${parseFloat(w.net_amount).toFixed(2)}
                    </p>
                    <p style={{ fontSize: 11, color: '#94a3b8' }}>
                      Gross ${parseFloat(w.amount).toFixed(2)}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ padding: '4px 12px', borderRadius: 9999, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: statusBg[w.status] || '#f0f3ff', color: statusColor[w.status] || '#64748b', fontFamily: 'Manrope, sans-serif' }}>
                      {w.status}
                    </span>
                    <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
                      {new Date(w.requested_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
                    {w.status === 'pending' ? (
                      <>
                        <button className="btn-primary" style={{ padding: '8px 14px' }} onClick={() => approve(w.id)}>
                          Approve
                        </button>
                        <input
                          className="form-input"
                          value={rejectNote[w.id] || ''}
                          onChange={(e) => setRejectNote((p) => ({ ...p, [w.id]: e.target.value }))}
                          placeholder="Reject note"
                          style={{ maxWidth: 220 }}
                        />
                        <button className="btn-danger" style={{ padding: '8px 14px' }} onClick={() => reject(w.id)}>
                          Reject
                        </button>
                      </>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: 12 }}>No action</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

