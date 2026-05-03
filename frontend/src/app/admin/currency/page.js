'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { currencyAPI } from '@/services/api';
import { useCurrentUser } from '@/context/UserContext';

export default function AdminCurrencyPage() {
  const { userRole: role, userId } = useCurrentUser();
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [form, setForm] = useState({
    base_currency: 'USD',
    target_currency: 'PKR',
    exchange_rate: '',
    source_api: 'manual',
  });

  function getFriendlyErrorMessage(error) {
    const m = (error || '').toLowerCase();
    if (m.includes('admin key') || m.includes('admin_key') || m.includes('unauthorized') || m.includes('403'))
      return 'Admin authentication failed. This action requires administrator privileges. Please ensure the admin key is correctly configured in the Admin Key field above.';
    if (m.includes('already exists') || m.includes('duplicate') || m.includes('unique'))
      return 'This currency pair already exists in the system. Please check the existing rates list.';
    if (m.includes('invalid') && m.includes('currency'))
      return 'Invalid currency code. Please use a standard 3-letter currency code (e.g. USD, EUR, GBP, PKR).';
    if (m.includes('network') || m.includes('fetch') || m.includes('failed to fetch'))
      return 'Unable to connect to the server. Please check your connection and try again.';
    return error || 'An unexpected error occurred. Please try again.';
  }

  async function load() {
    try {
      const r = await currencyAPI.getAll();
      setRates(r || []);
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

  async function createRate() {
    try {
      await currencyAPI.create(userId, {
        base_currency: form.base_currency,
        target_currency: form.target_currency,
        exchange_rate: parseFloat(form.exchange_rate),
        source_api: form.source_api,
      }, adminKey);
      setMsg('Rate created successfully.');
      setForm({ base_currency: 'USD', target_currency: 'PKR', exchange_rate: '', source_api: 'manual' });
      load();
    } catch (e) {
      setMsg('Error: ' + e.message);
    }
  }

  return (
    <Layout>
      <div style={{ padding: '32px 40px', maxWidth: 1000 }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2ca397', fontFamily: 'Manrope, sans-serif' }}>
            Admin
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif', margin: '4px 0' }}>
            Currency Rates
          </h2>
        </div>

        {msg && (
          <div style={{ padding: '12px 16px', borderRadius: 8, background: msg.includes('Error') ? '#ffdad6' : '#dcfce7', color: msg.includes('Error') ? '#ba1a1a' : '#15803d', fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
            {msg.includes('Error') ? getFriendlyErrorMessage(msg.replace('Error: ', '')) : msg}
          </div>
        )}

        {role !== 'admin' ? (
          <div className="card" style={{ padding: 28 }}>
            <p style={{ fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>
              Switch role to “Admin” in the top bar to manage currency rates.
            </p>
          </div>
        ) : (
          <>
            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: '#001736', marginBottom: 14 }}>
                Create Rate (manual)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Base</label>
                  <input className="form-input" value={form.base_currency} onChange={(e) => setForm({ ...form, base_currency: e.target.value.toUpperCase() })} />
                </div>
                <div>
                  <label className="form-label">Target</label>
                  <input className="form-input" value={form.target_currency} onChange={(e) => setForm({ ...form, target_currency: e.target.value.toUpperCase() })} />
                </div>
                <div>
                  <label className="form-label">Rate</label>
                  <input className="form-input" type="number" value={form.exchange_rate} onChange={(e) => setForm({ ...form, exchange_rate: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Source</label>
                  <input className="form-input" value={form.source_api} onChange={(e) => setForm({ ...form, source_api: e.target.value })} />
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <label className="form-label">Admin Key</label>
                <input className="form-input" type="password" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} placeholder="Enter admin key" style={{ maxWidth: 360 }} />
              </div>
              <div style={{ background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#856404', marginTop: 12 }}>
                <strong>Admin access required.</strong> Adding currencies requires the admin key configured in the backend environment. If you see an error, contact your system administrator.
              </div>
              <div style={{ marginTop: 14 }}>
                <button className="btn-primary" onClick={createRate} disabled={!form.exchange_rate || !adminKey}>
                  Create Rate
                </button>
              </div>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="card" style={{ padding: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '12px 12px', borderBottom: '1px solid #e7eeff' }}>
                  {['Base', 'Target', 'Rate', 'Source'].map((h) => (
                    <span key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', fontFamily: 'Manrope, sans-serif' }}>
                      {h}
                    </span>
                  ))}
                </div>
                {rates.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center' }}>
                    <p style={{ color: '#94a3b8', fontSize: 14 }}>No currency rates found.</p>
                  </div>
                ) : (
                  rates.map((r) => (
                    <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '14px 12px', borderBottom: '1px solid #f0f3ff' }}>
                      <span style={{ fontWeight: 800, color: '#001736' }}>{r.base_currency}</span>
                      <span style={{ fontWeight: 800, color: '#001736' }}>{r.target_currency}</span>
                      <span style={{ color: '#2ca397', fontWeight: 900, fontFamily: 'Manrope, sans-serif' }}>{r.exchange_rate}</span>
                      <span style={{ color: '#64748b' }}>{r.source_api}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

