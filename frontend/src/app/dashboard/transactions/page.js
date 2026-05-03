'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { transactionsAPI, walletAPI } from '@/services/api';
import { useCurrentUser } from '@/context/UserContext';

export default function TransactionsPage() {
  const { userId, userRole: role } = useCurrentUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    if (!userId) return;
    async function load() {
      try {
        const wallet = await walletAPI.tryGetByUser(userId, role);
        if (!wallet?.id) {
          setTransactions([]);
          return;
        }
        const t = await transactionsAPI.getAll(wallet.id);
        setTransactions(t);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, [userId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedTransaction(null);
    };
    if (selectedTransaction) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedTransaction]);

  const filtered = (filter === 'all' ? transactions : transactions.filter(t => t.status === filter))
    .filter(t => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        (t.transaction_type || '').toLowerCase().includes(term) ||
        (t.status || '').toLowerCase().includes(term) ||
        String(t.amount).includes(term) ||
        (t.currency_code || '').toLowerCase().includes(term) ||
        String(t.id).includes(term) ||
        (t.description || '').toLowerCase().includes(term) ||
        new Date(t.created_at).toLocaleDateString().includes(term)
      );
    });

  return (
    <Layout>
      <div style={{ padding: '32px 40px' }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2ca397', fontFamily: 'Manrope, sans-serif' }}>Finance</p>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif', margin: '4px 0' }}>Transaction History</h2>
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 360 }}>
            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 16 }}>search</span>
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by type, amount, status, date..."
              className="form-input"
              style={{ paddingLeft: 36 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 4, background: '#e7eeff', padding: 4, borderRadius: 8, width: 'fit-content' }}>
            {['all', 'completed', 'pending', 'failed'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Manrope, sans-serif', background: filter === f ? 'white' : 'transparent', color: filter === f ? '#001736' : '#64748b' }}>{f}</button>
            ))}
          </div>
        </div>

        {loading ? <p>Loading...</p> : (
          <div className="card">
            {/* Table Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '0.7fr 2fr 1fr 1fr 1fr 1fr', padding: '12px 20px', borderBottom: '1px solid #e7eeff' }}>
              {['ID', 'Type', 'Amount', 'Currency', 'Status', 'Date'].map(h => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', fontFamily: 'Manrope, sans-serif' }}>{h}</span>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#dee8ff', display: 'block', marginBottom: 8 }}>receipt_long</span>
                <p style={{ color: '#94a3b8', fontSize: 14 }}>No transactions found.</p>
              </div>
            ) : filtered.map(t => (
              <div key={t.id} onClick={() => setSelectedTransaction(t)} style={{ display: 'grid', gridTemplateColumns: '0.7fr 2fr 1fr 1fr 1fr 1fr', padding: '16px 20px', borderBottom: '1px solid #f0f3ff', cursor: 'pointer', transition: 'background 0.1s' }} onMouseEnter={e => e.currentTarget.style.background = '#f9f9ff'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                <span style={{ fontWeight: 700, color: '#64748b', fontSize: 12, fontFamily: 'Manrope, sans-serif', alignSelf: 'center' }}>#{t.id}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f0f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#001736' }}>receipt</span>
                  </div>
                  <span style={{ fontWeight: 600, color: '#001736', fontSize: 14 }}>{t.transaction_type}</span>
                </div>
                <span style={{ fontWeight: 700, color: '#001736', fontFamily: 'Manrope, sans-serif', alignSelf: 'center' }}>${parseFloat(t.amount).toFixed(2)}</span>
                <span style={{ color: '#64748b', alignSelf: 'center', fontSize: 14 }}>{t.currency_code}</span>
                <span style={{ alignSelf: 'center' }}>
                  <span className={`badge badge-${t.status === 'completed' ? 'success' : t.status === 'pending' ? 'warning' : 'error'}`}>{t.status}</span>
                </span>
                <span style={{ color: '#94a3b8', fontSize: 12, alignSelf: 'center' }}>{new Date(t.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div onClick={() => setSelectedTransaction(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: 'white', borderRadius: 12, padding: 24, width: '100%', maxWidth: 520, margin: '0 16px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #e7eeff' }}>
                <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: '#001736', fontSize: 18 }}>Transaction Details</h3>
                <button onClick={() => setSelectedTransaction(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 20 }}>✕</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  ['Transaction ID', `#${selectedTransaction.id}`],
                  ['UUID', selectedTransaction.uuid || '—'],
                  ['Type', selectedTransaction.transaction_type],
                  ['Amount', `${parseFloat(selectedTransaction.amount).toFixed(2)} ${selectedTransaction.currency_code}`],
                  ['Status', selectedTransaction.status],
                  ['Date', new Date(selectedTransaction.transaction_date || selectedTransaction.created_at).toLocaleString()],
                  ['Description', selectedTransaction.description || '—'],
                  ['Sender ID', selectedTransaction.sender_id != null ? `#${selectedTransaction.sender_id}` : '—'],
                  ['Receiver ID', selectedTransaction.receiver_id != null ? `#${selectedTransaction.receiver_id}` : '—'],
                  ['Wallet ID', selectedTransaction.wallet_id != null ? `#${selectedTransaction.wallet_id}` : '—'],
                  ['Escrow ID', selectedTransaction.escrow_id != null ? `#${selectedTransaction.escrow_id}` : '—'],
                  ['Milestone Payment ID', selectedTransaction.milestone_payment_id != null ? `#${selectedTransaction.milestone_payment_id}` : '—'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f5f5' }}>
                    <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: 13, color: label === 'Status' ? undefined : '#001736', fontFamily: 'monospace' }}>
                      {label === 'Status' ? (
                        <span className={`badge badge-${value === 'completed' ? 'success' : value === 'pending' ? 'warning' : 'error'}`}>{value}</span>
                      ) : value}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-ghost" onClick={() => setSelectedTransaction(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}