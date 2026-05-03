'use client';

import { useEffect, useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import { refundsAPI } from '@/services/api';
import { useSession } from '@/lib/useSession';
import { ROLES } from '@/lib/session';

export default function AdminRefundsPage() {
  const { role, userId } = useSession();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  async function load() {
    try {
      const r = await refundsAPI.getAll();
      setRefunds(r || []);
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

  const pending = useMemo(() => refunds.filter((x) => x.status === 'pending'), [refunds]);

  async function approve(id) {
    try {
      await refundsAPI.approve(id, userId);
      setMsg(`Refund #${id} approved.`);
      load();
    } catch (e) {
      setMsg('Error: ' + e.message);
    }
  }

  async function reject(id) {
    try {
      await refundsAPI.reject(id, userId);
      setMsg(`Refund #${id} rejected.`);
      load();
    } catch (e) {
      setMsg('Error: ' + e.message);
    }
  }

  const badge =
    /** @type {Record<string, string>} */ ({
      pending: 'warning',
      approved: 'success',
      rejected: 'error',
    });

  return (
    <Layout>
      <div style={{ padding: '32px 40px', maxWidth: 1200 }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2ca397', fontFamily: 'Manrope, sans-serif' }}>
            Admin
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif', margin: '4px 0' }}>
            Refunds Approval
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
              Switch role to “Admin” in the top bar to approve/reject refunds.
            </p>
          </div>
        ) : loading ? (
          <p>Loading...</p>
        ) : refunds.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>No refund requests found.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {refunds.map((r) => (
              <div key={r.id} className="card" style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 16, alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>
                    Refund #{r.id}
                  </p>
                  <p style={{ fontSize: 11, color: '#94a3b8' }}>
                    Escrow #{r.escrow_id} · Txn #{r.transaction_id} · Requested by #{r.requested_by}
                  </p>
                  <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>{r.reason}</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 18, fontWeight: 900, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>
                    ${parseFloat(r.refund_amount).toFixed(2)}
                  </p>
                  <span className={`badge badge-${badge[r.status] || 'pending'}`}>{r.status}</span>
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  {r.status === 'pending' ? (
                    <>
                      <button className="btn-primary" style={{ padding: '8px 14px' }} onClick={() => approve(r.id)}>
                        Approve
                      </button>
                      <button className="btn-danger" style={{ padding: '8px 14px' }} onClick={() => reject(r.id)}>
                        Reject
                      </button>
                    </>
                  ) : (
                    <span style={{ color: '#94a3b8', fontSize: 12 }}>No action</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

