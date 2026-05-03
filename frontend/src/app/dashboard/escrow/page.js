'use client';
import { useCallback, useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { escrowAPI } from '@/services/api';
import { useCurrentUser } from '@/context/UserContext';

export default function EscrowPage() {
  const { userId, userRole: role } = useCurrentUser();
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    project_id: '',
    client_user_id: userId,
    freelancer_user_id: '',
    currency_code: 'USD',
    total_amount: '',
  });
  const [fundId, setFundId] = useState(null);
  const [fundAmount, setFundAmount] = useState('');
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
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [role, userId]);

  useEffect(() => {
    if (!userId) return;
    setForm((prev) => ({ ...prev, client_user_id: userId }));
    load();
  }, [userId, role, load]);

  async function handleCreate() {
    try {
      if (role !== 'client') {
        setMsg('Error: Only clients can create escrows.');
        return;
      }
      await escrowAPI.create(userId, {
        ...form,
        client_user_id: userId,
        project_id: parseInt(form.project_id),
        freelancer_user_id: parseInt(form.freelancer_user_id),
        total_amount: parseFloat(form.total_amount),
      });
      setShowCreate(false);
      setMsg('Escrow created!');
      load();
    } catch (e) { setMsg('Error: ' + e.message); }
  }

  async function handleFund(id) {
    try {
      if (role !== 'client') {
        setMsg('Error: Only clients can fund escrows.');
        return;
      }
      await escrowAPI.fund(id, userId, parseFloat(fundAmount));
      setFundId(null);
      setFundAmount('');
      setMsg('Escrow funded!');
      load();
    } catch (e) { setMsg('Error: ' + e.message); }
  }

  async function handleFreeze(id) {
    try {
      if (role !== 'client') {
        setMsg('Error: Only clients can freeze escrows.');
        return;
      }
      await escrowAPI.freeze(id, userId);
      load();
    } catch (e) {
      setMsg('Error: ' + e.message);
    }
  }

  async function handleClose(id) {
    try {
      if (role !== 'client') {
        setMsg('Error: Only clients can close escrows.');
        return;
      }
      await escrowAPI.close(id, userId);
      load();
    } catch (e) {
      setMsg('Error: ' + e.message);
    }
  }

  const statusBadge = { pending: 'pending', active: 'info', completed: 'success', frozen: 'warning', cancelled: 'error' };

  return (
    <Layout>
      <div style={{ padding: '32px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2ca397', fontFamily: 'Manrope, sans-serif' }}>Finance</p>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif', margin: '4px 0' }}>Escrow Accounts</h2>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowCreate(!showCreate)}
            disabled={role !== 'client'}
            title={role !== 'client' ? 'Only clients can create escrows' : ''}
          >
            + Create Escrow
          </button>
        </div>

        {msg && <div style={{ padding: '12px 16px', borderRadius: 8, background: msg.includes('Error') ? '#ffdad6' : '#dcfce7', color: msg.includes('Error') ? '#ba1a1a' : '#15803d', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>{msg}</div>}

        {showCreate && (
          <div className="card" style={{ padding: 28, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: '#001736', marginBottom: 20 }}>Create New Escrow</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label className="form-label">Project ID</label><input className="form-input" value={form.project_id} onChange={e => setForm({ ...form, project_id: e.target.value })} placeholder="1" /></div>
              <div><label className="form-label">Freelancer User ID</label><input className="form-input" value={form.freelancer_user_id} onChange={e => setForm({ ...form, freelancer_user_id: e.target.value })} placeholder="2" /></div>
              <div><label className="form-label">Total Amount</label><input type="number" className="form-input" value={form.total_amount} onChange={e => setForm({ ...form, total_amount: e.target.value })} placeholder="5000" /></div>
              <div><label className="form-label">Currency</label><select className="form-select" value={form.currency_code} onChange={e => setForm({ ...form, currency_code: e.target.value })}><option value="USD">USD</option><option value="PKR">PKR</option></select></div>
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
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by project, status, amount..." className="form-input" style={{ paddingLeft: 36 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {escrows.filter(e => { if (!searchTerm.trim()) return true; const term = searchTerm.toLowerCase(); return String(e.project_id).includes(term) || (e.escrow_status || '').toLowerCase().includes(term) || String(e.total_amount).includes(term) || String(e.funded_amount).includes(term) || (e.currency_code || '').toLowerCase().includes(term) || String(e.client_user_id).includes(term) || String(e.freelancer_user_id).includes(term); }).length === 0 ? <p style={{ color: '#94a3b8' }}>No escrow accounts found.</p> : escrows.filter(e => { if (!searchTerm.trim()) return true; const term = searchTerm.toLowerCase(); return String(e.project_id).includes(term) || (e.escrow_status || '').toLowerCase().includes(term) || String(e.total_amount).includes(term) || String(e.funded_amount).includes(term) || (e.currency_code || '').toLowerCase().includes(term) || String(e.client_user_id).includes(term) || String(e.freelancer_user_id).includes(term); }).map(e => (
                <div key={e.id} className="card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <p style={{ fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif', fontSize: 16 }}>Project #{e.project_id}</p>
                      <p style={{ fontSize: 12, color: '#94a3b8' }}>Client: #{e.client_user_id} · Freelancer: #{e.freelancer_user_id}</p>
                    </div>
                    <span className={`badge badge-${statusBadge[e.escrow_status] || 'pending'}`}>{e.escrow_status}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: '#747780' }}>Funded / Total</span>
                    <span style={{ fontWeight: 700, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>${parseFloat(e.funded_amount).toFixed(2)} / ${parseFloat(e.total_amount).toFixed(2)}</span>
                  </div>
                  <div className="progress-bar" style={{ marginBottom: 16 }}>
                    <div className="progress-fill" style={{ width: `${Math.min((e.funded_amount / e.total_amount) * 100, 100)}%` }}></div>
                  </div>

                  {fundId === e.id && (
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                      <input type="number" value={fundAmount} onChange={ev => setFundAmount(ev.target.value)} placeholder="Amount to fund" className="form-input" style={{ maxWidth: 200 }} />
                      <button className="btn-primary" style={{ padding: '8px 16px' }} onClick={() => handleFund(e.id)}>Confirm Fund</button>
                      <button className="btn-ghost" style={{ padding: '8px 16px' }} onClick={() => setFundId(null)}>Cancel</button>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 8 }}>
                    {e.escrow_status === 'pending' && <button className="btn-primary" style={{ padding: '8px 16px', fontSize: 10 }} onClick={() => setFundId(e.id)}>Fund Escrow</button>}
                    {e.escrow_status === 'active' && <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: 10 }} onClick={() => handleFreeze(e.id)}>Freeze</button>}
                    {(e.escrow_status === 'active' || e.escrow_status === 'frozen') && <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: 10 }} onClick={() => handleClose(e.id)}>Close</button>}
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