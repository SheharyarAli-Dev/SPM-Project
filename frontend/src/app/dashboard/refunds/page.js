'use client';

import { useCallback, useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { refundsAPI } from '@/services/api';
import { useCurrentUser } from '@/context/UserContext';
import Link from 'next/link';

export default function RefundsPage() {
  const { userId, userRole: role } = useCurrentUser();
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    transaction_id: '',
    escrow_id: '',
    milestone_payment_id: '',
    refund_amount: '',
    reason: '',
  });

  const load = useCallback(async () => {
    try {
      const all = await refundsAPI.getAll();
      const scoped =
        role === 'admin' ? all : (all || []).filter((r) => r.requested_by === userId);
      setRefunds(scoped);
    } catch (e) {
      console.error(e);
      setMsg('Error: ' + e.message);
    } finally {
      setLoading(false);
    }
  }, [role, userId]);

  useEffect(() => {
    if (!userId) return;
    load();
  }, [userId, role, load]);

  async function handleCreate() {
    try {
      if (role === 'admin') {
        setMsg('Error: Admin cannot create refunds from this page.');
        return;
      }
      await refundsAPI.create(userId, {
        transaction_id: parseInt(form.transaction_id),
        escrow_id: parseInt(form.escrow_id),
        milestone_payment_id: form.milestone_payment_id
          ? parseInt(form.milestone_payment_id)
          : undefined,
        requested_by: userId,
        reason: form.reason,
        refund_amount: parseFloat(form.refund_amount),
      });
      setMsg('Refund request submitted!');
      setShowCreate(false);
      setForm({
        transaction_id: '',
        escrow_id: '',
        milestone_payment_id: '',
        refund_amount: '',
        reason: '',
      });
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
      <div style={{ padding: '32px 40px', maxWidth: 1100 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: 28,
          }}
        >
          <div>
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
              Disputes
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
              Refund Requests
            </h2>
          </div>

          {role === 'admin' ? (
            <Link className="btn-primary" href="/admin/refunds" style={{ textDecoration: 'none' }}>
              Manage as Admin
            </Link>
          ) : (
            <button className="btn-primary" onClick={() => setShowCreate((s) => !s)}>
              + Request Refund
            </button>
          )}
        </div>

        {msg && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              background: msg.includes('Error') ? '#ffdad6' : '#dcfce7',
              color: msg.includes('Error') ? '#ba1a1a' : '#15803d',
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            {msg}
          </div>
        )}

        {showCreate && role !== 'admin' && (
          <div className="card" style={{ padding: 28, marginBottom: 16 }}>
            <h3
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 800,
                color: '#001736',
                marginBottom: 18,
              }}
            >
              Create Refund Request
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="form-label">Transaction ID</label>
                <input
                  className="form-input"
                  value={form.transaction_id}
                  onChange={(e) => setForm({ ...form, transaction_id: e.target.value })}
                  placeholder="1"
                />
              </div>
              <div>
                <label className="form-label">Escrow ID</label>
                <input
                  className="form-input"
                  value={form.escrow_id}
                  onChange={(e) => setForm({ ...form, escrow_id: e.target.value })}
                  placeholder="1"
                />
              </div>
              <div>
                <label className="form-label">Milestone Payment ID (optional)</label>
                <input
                  className="form-input"
                  value={form.milestone_payment_id}
                  onChange={(e) => setForm({ ...form, milestone_payment_id: e.target.value })}
                  placeholder="3"
                />
              </div>
              <div>
                <label className="form-label">Refund Amount</label>
                <input
                  type="number"
                  className="form-input"
                  value={form.refund_amount}
                  onChange={(e) => setForm({ ...form, refund_amount: e.target.value })}
                  placeholder="25.00"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Reason</label>
                <input
                  className="form-input"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Describe the issue"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn-primary" onClick={handleCreate}>
                Submit Request
              </button>
              <button className="btn-ghost" onClick={() => setShowCreate(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : refunds.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 48, color: '#dee8ff', display: 'block', marginBottom: 8 }}
            >
              undo
            </span>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>No refund requests yet.</p>
          </div>
        ) : (
          <>
            <div style={{ position: 'relative', maxWidth: 360, marginBottom: 16 }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 16 }}>search</span>
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by ID, reason, status, amount..." className="form-input" style={{ paddingLeft: 36 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {refunds.filter(r => { if (!searchTerm.trim()) return true; const term = searchTerm.toLowerCase(); return String(r.id).includes(term) || (r.status || '').toLowerCase().includes(term) || (r.reason || '').toLowerCase().includes(term) || String(r.refund_amount).includes(term) || String(r.escrow_id).includes(term) || String(r.transaction_id).includes(term); }).map((r) => (
                <div key={r.id} className="card" style={{ padding: '18px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
                    <div>
                      <p style={{ fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>
                        Refund #{r.id}
                      </p>
                      <p style={{ fontSize: 12, color: '#94a3b8' }}>
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
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

