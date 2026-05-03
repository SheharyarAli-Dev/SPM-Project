'use client';
import { useCallback, useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { walletAPI, paymentMethodsAPI, currencyAPI } from '@/services/api';
import { useCurrentUser } from '@/context/UserContext';

export default function WalletPage() {
  const { userId, userRole: role } = useCurrentUser();
  const [wallet, setWallet] = useState(null);
  const [methods, setMethods] = useState([]);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fundAmount, setFundAmount] = useState('');
  const [fundMsg, setFundMsg] = useState('');
  const [walletError, setWalletError] = useState('');
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [newMethod, setNewMethod] = useState({ method_type: 'bank', provider_name: '', account_title: '', account_number_masked: '', iban_or_wallet_id: '', country_code: 'PK' });

  const load = useCallback(async () => {
    try {
      const [w, m, r] = await Promise.all([
        walletAPI.tryGetByUser(userId, role),
        paymentMethodsAPI.getAll(userId),
        currencyAPI.getAll(),
      ]);
      setWallet(w);
      setWalletError(!w ? `Wallet for user ${userId} not found. Try a seeded user id (e.g. 1 or 2).` : '');
      setMethods(m);
      setRates(r);
    } catch (e) {
      console.error(e);
      setWalletError(e?.message || 'Failed to load wallet.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    load();
  }, [userId, load]);

  async function handleFund() {
    if (!fundAmount || isNaN(fundAmount)) return;
    try {
      await walletAPI.fund(userId, parseFloat(fundAmount), role);
      setFundMsg('Wallet funded successfully!');
      setFundAmount('');
      load();
    } catch (e) {
      setFundMsg('Error: ' + e.message);
    }
  }

  async function handleSetDefault(id) {
    try {
      await paymentMethodsAPI.setDefault(id, userId);
      load();
    } catch (e) { console.error(e); }
  }

  async function handleDelete(id) {
    try {
      await paymentMethodsAPI.delete(id, userId);
      load();
    } catch (e) {
      alert('Failed to remove payment method: ' + (e.message || 'Unknown error'));
      console.error(e);
    }
  }

  async function handleAddMethod() {
    try {
      await paymentMethodsAPI.create(userId, newMethod);
      setShowAddMethod(false);
      setNewMethod({ method_type: 'bank', provider_name: '', account_title: '', account_number_masked: '', iban_or_wallet_id: '', country_code: 'PK' });
      load();
    } catch (e) { console.error(e); }
  }

  return (
    <Layout>
      <div style={{ padding: '32px 40px', maxWidth: 800 }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2ca397', fontFamily: 'Manrope, sans-serif' }}>Finance</p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif', margin: '4px 0' }}>Wallet & Payment Methods</h2>
        </div>

        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {walletError && (
              <div className="card" style={{ padding: 16, background: '#ffdad6', border: '1px solid #ffdad6' }}>
                <p style={{ color: '#ba1a1a', fontWeight: 800, fontFamily: 'Manrope, sans-serif', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Wallet Missing
                </p>
                <p style={{ color: '#ba1a1a', marginTop: 6 }}>{walletError}</p>
              </div>
            )}
            {/* Wallet Card */}
            <div style={{ background: '#001736', borderRadius: 16, padding: 32, position: 'relative', overflow: 'hidden' }}>
              <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}>Platform Wallet</span>
              <p style={{ fontSize: 48, fontWeight: 900, color: 'white', margin: '8px 0 4px', fontFamily: 'Manrope, sans-serif' }}>${parseFloat(wallet?.available_balance || 0).toFixed(2)}</p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>USD · Available Balance</p>
              <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
                <div>
                  <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', fontFamily: 'Manrope, sans-serif' }}>Held</p>
                  <p style={{ color: 'white', fontWeight: 700, fontFamily: 'Manrope, sans-serif' }}>${parseFloat(wallet?.held_balance || 0).toFixed(2)}</p>
                </div>
                <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }}></div>
                <div>
                  <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', fontFamily: 'Manrope, sans-serif' }}>Reserved</p>
                  <p style={{ color: 'white', fontWeight: 700, fontFamily: 'Manrope, sans-serif' }}>${parseFloat(wallet?.reserved_balance || 0).toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Fund Wallet */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: '#001736', marginBottom: 16 }}>Add Funds</h3>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 700 }}>$</span>
                  <input type="number" value={fundAmount} onChange={e => setFundAmount(e.target.value)} placeholder="0.00" className="form-input" style={{ paddingLeft: 28 }} />
                </div>
                <button className="btn-primary" onClick={handleFund} disabled={!wallet}>
                  Add Funds
                </button>
              </div>
              {fundMsg && <p style={{ marginTop: 8, fontSize: 12, color: fundMsg.includes('Error') ? '#ba1a1a' : '#15803d', fontWeight: 600 }}>{fundMsg}</p>}
            </div>

            {/* Payment Methods */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: '#001736' }}>Payment Methods</h3>
                <button className="btn-primary" style={{ padding: '8px 16px' }} onClick={() => setShowAddMethod(!showAddMethod)}>+ Add Method</button>
              </div>

              {showAddMethod && (
                <div style={{ background: '#f0f3ff', borderRadius: 10, padding: 20, marginBottom: 16 }}>
                  <h4 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, color: '#001736', marginBottom: 12, fontSize: 14 }}>Add New Payment Method</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label className="form-label">Type</label>
                      <select className="form-select" value={newMethod.method_type} onChange={e => setNewMethod({ ...newMethod, method_type: e.target.value })}>
                        <option value="bank">Bank</option>
                        <option value="digital_wallet">Digital Wallet</option>
                        <option value="card">Card</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Provider Name</label>
                      <input className="form-input" value={newMethod.provider_name} onChange={e => setNewMethod({ ...newMethod, provider_name: e.target.value })} placeholder="e.g. HBL Bank" />
                    </div>
                    <div>
                      <label className="form-label">Account Title</label>
                      <input className="form-input" value={newMethod.account_title} onChange={e => setNewMethod({ ...newMethod, account_title: e.target.value })} placeholder="Your name" />
                    </div>
                    <div>
                      <label className="form-label">Account Number (masked)</label>
                      <input className="form-input" value={newMethod.account_number_masked} onChange={e => setNewMethod({ ...newMethod, account_number_masked: e.target.value })} placeholder="****4521" />
                    </div>
                    <div>
                      <label className="form-label">IBAN / Wallet ID</label>
                      <input className="form-input" value={newMethod.iban_or_wallet_id} onChange={e => setNewMethod({ ...newMethod, iban_or_wallet_id: e.target.value })} placeholder="PK12HBL000..." />
                    </div>
                    <div>
                      <label className="form-label">Country Code</label>
                      <input className="form-input" value={newMethod.country_code} onChange={e => setNewMethod({ ...newMethod, country_code: e.target.value })} placeholder="PK" maxLength={2} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    <button className="btn-primary" onClick={handleAddMethod}>Save Method</button>
                    <button className="btn-ghost" onClick={() => setShowAddMethod(false)}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {methods.length === 0 ? <p style={{ color: '#94a3b8', fontSize: 14 }}>No payment methods added yet.</p> : methods.map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: '#f0f3ff', borderRadius: 12, border: '1px solid #dee8ff' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: '#001736', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 11, fontFamily: 'Manrope, sans-serif' }}>
                      {m.provider_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, color: '#001736', fontSize: 14, fontFamily: 'Manrope, sans-serif' }}>{m.provider_name}</p>
                      <p style={{ color: '#94a3b8', fontSize: 11 }}>{m.method_type} · {m.account_number_masked}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {m.is_default && <span className="badge badge-success">Default</span>}
                      {!m.is_default && <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 10 }} onClick={() => handleSetDefault(m.id)}>Set Default</button>}
                      <button className="btn-danger" style={{ padding: '6px 12px', fontSize: 10 }} onClick={() => handleDelete(m.id)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Currency Rates */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: '#001736', marginBottom: 16 }}>Currency Rates</h3>
              {rates.length === 0 ? <p style={{ color: '#94a3b8', fontSize: 14 }}>No rates available.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {rates.map(r => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f3ff' }}>
                      <span style={{ fontWeight: 600, color: '#001736' }}>{r.base_currency} → {r.target_currency}</span>
                      <span style={{ fontWeight: 800, color: '#2ca397', fontFamily: 'Manrope, sans-serif' }}>{r.exchange_rate}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}