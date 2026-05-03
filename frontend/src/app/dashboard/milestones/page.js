'use client';
import { useCallback, useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { milestonePaymentsAPI, escrowAPI } from '@/services/api';
import { useCurrentUser } from '@/context/UserContext';

export default function MilestonesPage() {
  const { userId, userRole: role } = useCurrentUser();
  const [milestones, setMilestones] = useState([]);
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ escrow_id: '', milestone_id: '', title: '', amount: '', due_date: '' });
  const [msg, setMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const load = useCallback(async () => {
    try {
      const e = await escrowAPI.getAll();
      const scoped =
        role === 'admin'
          ? e
          : (e || []).filter(
            (x) => x.client_user_id === userId || x.freelancer_user_id === userId,
          );
      setEscrows(scoped);
      if (e.length > 0) {
        const all = await Promise.all(scoped.map((esc) => milestonePaymentsAPI.getAll(esc.id)));
        setMilestones(all.flat());
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [role, userId]);

  useEffect(() => {
    if (!userId) return;
    load();
  }, [userId, role, load]);

  async function handleCreate() {
    try {
      if (role !== 'client') {
        setMsg('Error: Only clients can create milestones.');
        return;
      }
      await milestonePaymentsAPI.create(userId, {
        ...form,
        escrow_id: parseInt(form.escrow_id),
        milestone_id: parseInt(form.milestone_id),
        amount: parseFloat(form.amount),
      });
      setShowCreate(false);
      setMsg('Milestone created!');
      load();
    } catch (e) { setMsg('Error: ' + e.message); }
  }

  async function handleApprove(id) {
    try {
      if (role !== 'client') {
        setMsg('Error: Only clients can approve milestones.');
        return;
      }
      await milestonePaymentsAPI.approve(id, userId);
      setMsg('Milestone approved!');
      load();
    } catch (e) {
      setMsg('Error: ' + e.message);
    }
  }

  async function handleReject(id) {
    try {
      if (role !== 'client') {
        setMsg('Error: Only clients can reject milestones.');
        return;
      }
      await milestonePaymentsAPI.reject(id, userId);
      setMsg('Milestone rejected.');
      load();
    } catch (e) {
      setMsg('Error: ' + e.message);
    }
  }

  async function handleRelease(id) {
    try {
      if (role !== 'client') {
        setMsg('Error: Only clients can release payments.');
        return;
      }
      await milestonePaymentsAPI.release(id, userId);
      setMsg('Payment released!');
      load();
    } catch (e) {
      setMsg('Error: ' + e.message);
    }
  }

  return (
    <Layout>
      <div style={{ padding: '32px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2ca397', fontFamily: 'Manrope, sans-serif' }}>Finance</p>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif', margin: '4px 0' }}>Milestone Payments</h2>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowCreate(!showCreate)}
            disabled={role !== 'client'}
            title={role !== 'client' ? 'Only clients can add milestones' : ''}
          >
            + Add Milestone
          </button>
        </div>

        {msg && <div style={{ padding: '12px 16px', borderRadius: 8, background: msg.includes('Error') ? '#ffdad6' : '#dcfce7', color: msg.includes('Error') ? '#ba1a1a' : '#15803d', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>{msg}</div>}

        {showCreate && (
          <div className="card" style={{ padding: 28, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: '#001736', marginBottom: 20 }}>Create Milestone Payment</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="form-label">Escrow Account</label>
                <select className="form-select" value={form.escrow_id} onChange={e => setForm({ ...form, escrow_id: e.target.value })}>
                  <option value="">Select Escrow</option>
                  {escrows.map(e => <option key={e.id} value={e.id}>Escrow #{e.id} — Project #{e.project_id}</option>)}
                </select>
              </div>
              <div><label className="form-label">Milestone ID</label><input className="form-input" value={form.milestone_id} onChange={e => setForm({ ...form, milestone_id: e.target.value })} placeholder="1" /></div>
              <div><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Milestone title" /></div>
              <div><label className="form-label">Amount</label><input type="number" className="form-input" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="1000" /></div>
              <div><label className="form-label">Due Date</label><input type="date" className="form-input" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} /></div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button className="btn-primary" onClick={handleCreate}>Create</button>
              <button className="btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </div>
        )}

        {loading ? <p>Loading...</p> : (
          <>
            <div style={{ position: 'relative', maxWidth: 360, marginBottom: 16 }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 16 }}>search</span>
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by title, amount, status..." className="form-input" style={{ paddingLeft: 36 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {milestones.filter(m => { if (!searchTerm.trim()) return true; const term = searchTerm.toLowerCase(); return (m.title || '').toLowerCase().includes(term) || String(m.amount).includes(term) || (m.approval_status || '').toLowerCase().includes(term) || (m.release_status || '').toLowerCase().includes(term) || String(m.escrow_id).includes(term); }).length === 0 ? <p style={{ color: '#94a3b8' }}>No milestone payments found.</p> : milestones.filter(m => { if (!searchTerm.trim()) return true; const term = searchTerm.toLowerCase(); return (m.title || '').toLowerCase().includes(term) || String(m.amount).includes(term) || (m.approval_status || '').toLowerCase().includes(term) || (m.release_status || '').toLowerCase().includes(term) || String(m.escrow_id).includes(term); }).map(m => (
                <div key={m.id} className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f0f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ color: '#001736' }}>task_alt</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>{m.title}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8' }}>Escrow #{m.escrow_id} · Due: {m.due_date ? new Date(m.due_date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div style={{ textAlign: 'right', marginRight: 16 }}>
                    <p style={{ fontSize: 20, fontWeight: 900, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>${parseFloat(m.amount).toFixed(2)}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span className={`badge badge-${m.approval_status === 'approved' ? 'success' : m.approval_status === 'rejected' ? 'error' : 'warning'}`}>{m.approval_status}</span>
                      <span className={`badge badge-${m.release_status === 'released' ? 'success' : 'pending'}`}>{m.release_status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {role === 'client' && m.approval_status === 'pending' && (
                        <button className="btn-primary" style={{ padding: '6px 12px', fontSize: 10 }} onClick={() => handleApprove(m.id)}>Approve</button>
                      )}
                      {role === 'client' && m.approval_status === 'pending' && (
                        <button className="btn-danger" style={{ padding: '6px 12px', fontSize: 10 }} onClick={() => handleReject(m.id)}>Reject</button>
                      )}
                      {role === 'client' && m.approval_status === 'approved' && m.release_status === 'not_released' && (
                        <button className="btn-primary" style={{ padding: '6px 12px', fontSize: 10, background: '#2ca397' }} onClick={() => handleRelease(m.id)}>Release</button>
                      )}
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