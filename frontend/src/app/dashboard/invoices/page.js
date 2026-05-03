'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { invoicesAPI } from '@/services/api';
import { useCurrentUser } from '@/context/UserContext';

export default function InvoicesPage() {
  const { userId } = useCurrentUser();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!userId) return;
    async function load() {
      try {
        const data = await invoicesAPI.getAll(userId);
        setInvoices(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [userId]);

  return (
    <Layout>
      <div style={{ padding: '32px 40px' }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2ca397', fontFamily: 'Manrope, sans-serif' }}>Finance</p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif', margin: '4px 0' }}>Invoices</h2>
        </div>

        {loading ? <p>Loading...</p> : (
          <>
            <div style={{ position: 'relative', maxWidth: 360, marginBottom: 16 }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 16 }}>search</span>
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by invoice #, project, amount..." className="form-input" style={{ paddingLeft: 36 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {invoices.filter(inv => { if (!searchTerm.trim()) return true; const term = searchTerm.toLowerCase(); return (inv.invoice_number || '').toLowerCase().includes(term) || String(inv.project_id).includes(term) || String(inv.net_amount).includes(term) || String(inv.gross_amount).includes(term) || (inv.currency_code || '').toLowerCase().includes(term) || String(inv.client_user_id).includes(term) || String(inv.freelancer_user_id).includes(term); }).length === 0 ? (
                  <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#dee8ff', display: 'block', marginBottom: 8 }}>description</span>
                    <p style={{ color: '#94a3b8', fontSize: 14 }}>No invoices yet.</p>
                  </div>
                ) : invoices.filter(inv => { if (!searchTerm.trim()) return true; const term = searchTerm.toLowerCase(); return (inv.invoice_number || '').toLowerCase().includes(term) || String(inv.project_id).includes(term) || String(inv.net_amount).includes(term) || String(inv.gross_amount).includes(term) || (inv.currency_code || '').toLowerCase().includes(term) || String(inv.client_user_id).includes(term) || String(inv.freelancer_user_id).includes(term); }).map(inv => (
                  <div key={inv.id} className="card" style={{ padding: 20, cursor: 'pointer', border: selected?.id === inv.id ? '2px solid #001736' : '1px solid #e7eeff' }} onClick={() => setSelected(inv)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: 700, color: '#001736', fontFamily: 'Manrope, sans-serif', fontSize: 14 }}>{inv.invoice_number}</p>
                        <p style={{ fontSize: 11, color: '#94a3b8' }}>Project #{inv.project_id} · {new Date(inv.generated_at).toLocaleDateString()}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 900, color: '#001736', fontFamily: 'Manrope, sans-serif', fontSize: 18 }}>${parseFloat(inv.net_amount).toFixed(2)}</p>
                        <p style={{ fontSize: 11, color: '#94a3b8' }}>{inv.currency_code}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selected && (
                <div className="card" style={{ padding: 28, height: 'fit-content', position: 'sticky', top: 80 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: '#001736' }}>Invoice Detail</h3>
                    <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {[
                      ['Invoice #', selected.invoice_number],
                      ['Project ID', `#${selected.project_id}`],
                      ['Client', `User #${selected.client_user_id}`],
                      ['Freelancer', `User #${selected.freelancer_user_id}`],
                      ['Gross Amount', `$${parseFloat(selected.gross_amount).toFixed(2)}`],
                      ['Platform Fee', `$${parseFloat(selected.platform_fee).toFixed(2)}`],
                      ['Tax', `$${parseFloat(selected.tax_amount).toFixed(2)}`],
                      ['Net Amount', `$${parseFloat(selected.net_amount).toFixed(2)}`],
                      ['Currency', selected.currency_code],
                      ['Generated', new Date(selected.generated_at).toLocaleDateString()],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f3ff' }}>
                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{label}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}