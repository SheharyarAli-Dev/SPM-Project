'use client';
import { useCallback, useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { withdrawalsAPI, walletAPI, paymentMethodsAPI } from '@/services/api';
import { useCurrentUser } from '@/context/UserContext';

export default function WithdrawalsPage() {
  const { userId, userRole: role } = useCurrentUser();
  const [activeTab, setActiveTab] = useState('request');
  const [wallet, setWallet] = useState(null);
  const [methods, setMethods] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const load = useCallback(async () => {
    try {
      const [w, m, wd] = await Promise.all([
        walletAPI.tryGetByUser(userId, role),
        paymentMethodsAPI.getAll(userId),
        withdrawalsAPI.getAll(),
      ]);
      setWallet(w);
      setMethods(m);
      setWithdrawals((wd || []).filter((x) => x.user_id === userId));
      if (m.length > 0) setSelectedMethod(m[0].id);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    load();
  }, [userId, load]);

  const balance = parseFloat(wallet?.available_balance || 0);
  const num = parseFloat(amount) || 0;
  const fee = num * 0.02;
  const net = num - fee;
  const isValid = Boolean(wallet?.id) && num >= 10 && num <= balance;

  async function handleSubmit() {
    if (!isValid) return;
    try {
      await withdrawalsAPI.create(userId, {
        amount: num,
        payment_method_id: selectedMethod,
        wallet_id: wallet?.id,
      });
      setSubmitted(true);
      load();
    } catch (e) { console.error(e); }
  }

  const statusColor = { completed: '#15803d', pending: '#a16207', rejected: '#ba1a1a' };
  const statusBg = { completed: '#dcfce7', pending: '#fef9c3', rejected: '#ffdad6' };

  return (
    <Layout>
      <div style={{ padding: '32px 40px', maxWidth: 1000 }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2ca397', fontFamily: 'Manrope, sans-serif' }}>Payment Management</p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif', margin: '4px 0' }}>Withdrawals</h2>
        </div>

        {loading ? <p>Loading...</p> : (
          <>
            {role === 'admin' && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: '#d5e3fc',
                  color: '#001736',
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 20,
                }}
              >
                You are in admin mode. Use the admin withdrawals page to approve/reject requests.
              </div>
            )}
            {/* Balance Card */}
            <div style={{ background: '#001736', borderRadius: 12, padding: 28, marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}>Available Balance</p>
              <p style={{ fontSize: 36, fontWeight: 900, color: 'white', margin: '4px 0 12px', fontFamily: 'Manrope, sans-serif' }}>${balance.toFixed(2)}</p>
              <div style={{ display: 'flex', gap: 32 }}>
                <div><p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Held</p><p style={{ fontWeight: 700, color: 'white', fontFamily: 'Manrope, sans-serif' }}>${parseFloat(wallet?.held_balance || 0).toFixed(2)}</p></div>
                <div><p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>Reserved</p><p style={{ fontWeight: 700, color: 'white', fontFamily: 'Manrope, sans-serif' }}>${parseFloat(wallet?.reserved_balance || 0).toFixed(2)}</p></div>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, background: '#e7eeff', padding: 4, borderRadius: 8, width: 'fit-content', marginBottom: 28 }}>
              {['request', 'history'].map(tab => (
                <button key={tab} onClick={() => { setActiveTab(tab); setSubmitted(false); }} style={{ padding: '8px 20px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Manrope, sans-serif', background: activeTab === tab ? 'white' : 'transparent', color: activeTab === tab ? '#001736' : '#64748b' }}>
                  {tab === 'request' ? 'New Request' : 'History'}
                </button>
              ))}
            </div>

            {activeTab === 'request' && !submitted && role !== 'admin' && (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                <div>
                  {/* Amount */}
                  <div className="card" style={{ padding: 28, marginBottom: 20 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>Step 1 — Enter Amount</p>
                    <label className="form-label">Withdrawal Amount (USD)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 700 }}>$</span>
                      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="form-input" style={{ paddingLeft: 28, fontSize: 18, fontWeight: 700 }} />
                    </div>
                    {amount && !isValid && <p style={{ color: '#ba1a1a', fontSize: 12, marginTop: 6, fontWeight: 600 }}>{num < 10 ? 'Minimum $10.00' : `Exceeds balance of $${balance.toFixed(2)}`}</p>}
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      {[100, 500, 1000, 5000].map(p => (
                        <button key={p} onClick={() => setAmount(String(Math.min(p, balance)))} style={{ padding: '4px 12px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: '#f0f3ff', border: '1px solid #dee8ff', borderRadius: 6, cursor: 'pointer', color: '#64748b', fontFamily: 'Manrope, sans-serif' }}>${p}</button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="card" style={{ padding: 28, marginBottom: 20 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', fontFamily: 'Manrope, sans-serif', marginBottom: 16 }}>Step 2 — Select Payment Method</p>
                    {methods.length === 0 ? (
                      <p style={{ color: '#94a3b8', fontSize: 14 }}>No payment methods. <a href="/dashboard/wallet" style={{ color: '#2ca397' }}>Add one first.</a></p>
                    ) : methods.map(m => (
                      <div key={m.id} onClick={() => setSelectedMethod(m.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, border: selectedMethod === m.id ? '2px solid #001736' : '1px solid #e7eeff', borderRadius: 10, marginBottom: 10, cursor: 'pointer', background: selectedMethod === m.id ? '#f0f3ff' : 'white' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 8, background: selectedMethod === m.id ? '#001736' : '#f0f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: selectedMethod === m.id ? 'white' : '#94a3b8', fontWeight: 700, fontSize: 11, fontFamily: 'Manrope, sans-serif' }}>{m.provider_name.substring(0, 2).toUpperCase()}</div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 700, color: '#001736', fontSize: 14, fontFamily: 'Manrope, sans-serif' }}>{m.provider_name}</p>
                          <p style={{ fontSize: 11, color: '#94a3b8' }}>{m.account_number_masked}</p>
                        </div>
                        {m.is_default && <span className="badge badge-success">Default</span>}
                      </div>
                    ))}
                  </div>

                  <button onClick={handleSubmit} disabled={!isValid} className="btn-primary" style={{ width: '100%', padding: 14, opacity: isValid ? 1 : 0.5 }}>Submit Withdrawal Request</button>
                </div>

                {/* Summary */}
                <div style={{ background: '#f0f3ff', borderRadius: 12, padding: 24, height: 'fit-content' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', fontFamily: 'Manrope, sans-serif', marginBottom: 20 }}>Summary</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span style={{ fontSize: 14, color: '#64748b' }}>Amount</span><span style={{ fontWeight: 700, color: '#001736' }}>{num > 0 ? `$${num.toFixed(2)}` : '—'}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><span style={{ fontSize: 14, color: '#64748b' }}>Fee (2%)</span><span style={{ fontWeight: 700, color: '#ba1a1a' }}>-${fee.toFixed(2)}</span></div>
                  <div style={{ borderTop: '1px solid #dee8ff', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 700, color: '#001736' }}>You Receive</span><span style={{ fontSize: 20, fontWeight: 900, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>{net > 0 ? `$${net.toFixed(2)}` : '—'}</span></div>
                  <div style={{ background: 'white', borderRadius: 8, padding: 12, marginTop: 16 }}><p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', margin: '0 0 4px', fontFamily: 'Manrope, sans-serif' }}>Processing Time</p><p style={{ fontWeight: 600, color: '#001736' }}>1–3 Business Days</p></div>
                </div>
              </div>
            )}

            {activeTab === 'request' && submitted && role !== 'admin' && (
              <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 64, color: '#2ca397', display: 'block', marginBottom: 16 }}>check_circle</span>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: '#001736', fontSize: 20, marginBottom: 8 }}>Withdrawal Requested!</h3>
                <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Your withdrawal of <strong>${net.toFixed(2)}</strong> is pending approval.</p>
                <button className="btn-primary" onClick={() => { setSubmitted(false); setAmount(''); }}>Make Another</button>
              </div>
            )}

            {activeTab === 'history' && (
              <>
                <div style={{ position: 'relative', maxWidth: 360, marginBottom: 16 }}>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 16 }}>search</span>
                  <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by status, amount, date..." className="form-input" style={{ paddingLeft: 36 }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {withdrawals.filter(w => { if (!searchTerm.trim()) return true; const term = searchTerm.toLowerCase(); return String(w.id).includes(term) || (w.status || '').toLowerCase().includes(term) || String(w.amount).includes(term) || String(w.net_amount).includes(term) || new Date(w.requested_at).toLocaleDateString().includes(term) || (w.admin_note || '').toLowerCase().includes(term); }).length === 0 ? <p style={{ color: '#94a3b8' }}>No withdrawals found.</p> : withdrawals.filter(w => { if (!searchTerm.trim()) return true; const term = searchTerm.toLowerCase(); return String(w.id).includes(term) || (w.status || '').toLowerCase().includes(term) || String(w.amount).includes(term) || String(w.net_amount).includes(term) || new Date(w.requested_at).toLocaleDateString().includes(term) || (w.admin_note || '').toLowerCase().includes(term); }).map(w => (
                    <div key={w.id} className="card" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f0f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>W</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 700, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>Withdrawal #{w.id}</p>
                        <p style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(w.requested_at).toLocaleDateString()}</p>
                        {w.admin_note && <p style={{ fontSize: 11, color: '#ba1a1a', fontWeight: 600, marginTop: 4 }}>Note: {w.admin_note}</p>}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 20, fontWeight: 900, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>${parseFloat(w.net_amount).toFixed(2)}</p>
                        <p style={{ fontSize: 11, color: '#94a3b8' }}>Gross ${parseFloat(w.amount).toFixed(2)}</p>
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: 9999, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: statusBg[w.status] || '#f0f3ff', color: statusColor[w.status] || '#64748b', fontFamily: 'Manrope, sans-serif' }}>{w.status}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}