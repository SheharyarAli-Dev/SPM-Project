'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { transactionsAPI, walletAPI, invoicesAPI, escrowAPI, refundsAPI, withdrawalsAPI } from '@/services/api';
import { useCurrentUser } from '@/context/UserContext';

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get('q') || '';
  const { userId, userRole: role } = useCurrentUser();
  const [query, setQuery] = useState(q);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ transactions: [], invoices: [], escrows: [], refunds: [], withdrawals: [] });

  useEffect(() => { setQuery(q); }, [q]);

  useEffect(() => {
    if (!userId || !q.trim()) {
      setResults({ transactions: [], invoices: [], escrows: [], refunds: [], withdrawals: [] });
      return;
    }
    async function fetchAll() {
      setLoading(true);
      try {
        const [invoices, escrows, refunds, withdrawals] = await Promise.all([
          invoicesAPI.getAll(userId).catch(() => []),
          escrowAPI.getAll().catch(() => []),
          refundsAPI.getAll().catch(() => []),
          withdrawalsAPI.getAll().catch(() => []),
        ]);
        let transactions = [];
        const wallet = await walletAPI.tryGetByUser(userId, role).catch(() => null);
        if (wallet?.id) transactions = await transactionsAPI.getAll(wallet.id).catch(() => []);
        const term = q.toLowerCase().trim();
        const f = (arr, fns) => (arr || []).filter(item => fns.some(fn => fn(item).toLowerCase().includes(term)));
        setResults({
          transactions: f(transactions, [t => t.transaction_type || '', t => t.status || '', t => String(t.amount), t => t.currency_code || '', t => String(t.id), t => t.description || '']),
          invoices: f(invoices, [i => i.invoice_number || '', i => String(i.project_id), i => String(i.net_amount), i => i.currency_code || '']),
          escrows: f(escrows, [e => String(e.id), e => String(e.project_id), e => e.escrow_status || '', e => String(e.total_amount)]),
          refunds: f(refunds, [r => String(r.id), r => r.status || '', r => String(r.refund_amount), r => r.reason || '']),
          withdrawals: f(withdrawals, [w => String(w.id), w => w.status || '', w => String(w.amount), w => String(w.net_amount || '')]),
        });
      } catch (e) { console.error('Search error:', e); }
      finally { setLoading(false); }
    }
    fetchAll();
  }, [userId, q, role]);

  const total = Object.values(results).reduce((s, a) => s + a.length, 0);
  const badge = (status) => ({ completed: 'success', active: 'info', pending: 'warning', approved: 'success', rejected: 'error', failed: 'error' }[status] || 'pending');

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) router.push(`/dashboard/search?q=${encodeURIComponent(query.trim())}`);
  }

  function Section({ title, icon, href, items, renderItem }) {
    if (!items.length) return null;
    return (
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#001736' }}>{icon}</span>
            <h3 style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 800, color: '#001736', fontSize: 15 }}>{title}</h3>
            <span className="badge badge-info">{items.length}</span>
          </div>
          <Link href={href} style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: '#2ca397', textDecoration: 'none', fontFamily: 'Manrope, sans-serif' }}>View All →</Link>
        </div>
        <div className="card">{items.slice(0, 5).map(renderItem)}</div>
        {items.length > 5 && <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 8, textAlign: 'center' }}>+ {items.length - 5} more results in <Link href={href} style={{ color: '#2ca397' }}>{title}</Link></p>}
      </div>
    );
  }

  const row = { display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '1px solid #f0f3ff' };

  return (
    <div style={{ padding: '32px 40px' }}>
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#2ca397', fontFamily: 'Manrope, sans-serif' }}>Global Search</p>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#001736', fontFamily: 'Manrope, sans-serif', margin: '4px 0' }}>Search Results</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
        <div style={{ position: 'relative', flex: '1 1 400px', maxWidth: 500 }}>
          <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 16 }}>search</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search transactions, invoices, escrows, refunds…" className="form-input" style={{ paddingLeft: 36 }} />
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {!q.trim() && (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#dee8ff', display: 'block', marginBottom: 8 }}>manage_search</span>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>Enter a search term to find transactions, invoices, escrows, refunds, and withdrawals.</p>
        </div>
      )}

      {q.trim() && loading && <p style={{ color: '#94a3b8' }}>Searching…</p>}

      {q.trim() && !loading && total === 0 && (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#dee8ff', display: 'block', marginBottom: 8 }}>search_off</span>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>No results found for &ldquo;{q}&rdquo;</p>
        </div>
      )}

      {q.trim() && !loading && total > 0 && (
        <>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>{total} result{total !== 1 ? 's' : ''} for &ldquo;<strong>{q}</strong>&rdquo;</p>

          <Section title="Transactions" icon="receipt_long" href="/dashboard/transactions" items={results.transactions} renderItem={t => (
            <div key={`t-${t.id}`} style={row}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#001736' }}>receipt</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: '#001736', fontSize: 13, fontFamily: 'Manrope, sans-serif' }}>#{t.id} — {t.transaction_type}</p>
                <p style={{ fontSize: 11, color: '#94a3b8' }}>{t.description || '—'} · {new Date(t.created_at).toLocaleDateString()}</p>
              </div>
              <span style={{ fontWeight: 700, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>${parseFloat(t.amount).toFixed(2)}</span>
              <span className={`badge badge-${badge(t.status)}`}>{t.status}</span>
            </div>
          )} />

          <Section title="Invoices" icon="description" href="/dashboard/invoices" items={results.invoices} renderItem={inv => (
            <div key={`i-${inv.id}`} style={row}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#001736' }}>description</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: '#001736', fontSize: 13, fontFamily: 'Manrope, sans-serif' }}>{inv.invoice_number}</p>
                <p style={{ fontSize: 11, color: '#94a3b8' }}>Project #{inv.project_id} · {new Date(inv.generated_at).toLocaleDateString()}</p>
              </div>
              <span style={{ fontWeight: 700, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>${parseFloat(inv.net_amount).toFixed(2)} {inv.currency_code}</span>
            </div>
          )} />

          <Section title="Escrow Accounts" icon="shield_lock" href="/dashboard/escrow" items={results.escrows} renderItem={e => (
            <div key={`e-${e.id}`} style={row}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#001736' }}>shield_lock</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: '#001736', fontSize: 13, fontFamily: 'Manrope, sans-serif' }}>Escrow #{e.id} — Project #{e.project_id}</p>
                <p style={{ fontSize: 11, color: '#94a3b8' }}>${parseFloat(e.funded_amount).toFixed(2)} / ${parseFloat(e.total_amount).toFixed(2)}</p>
              </div>
              <span className={`badge badge-${badge(e.escrow_status)}`}>{e.escrow_status}</span>
            </div>
          )} />

          <Section title="Refunds" icon="undo" href="/dashboard/refunds" items={results.refunds} renderItem={r => (
            <div key={`r-${r.id}`} style={row}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#001736' }}>undo</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: '#001736', fontSize: 13, fontFamily: 'Manrope, sans-serif' }}>Refund #{r.id}</p>
                <p style={{ fontSize: 11, color: '#94a3b8' }}>{r.reason || '—'}</p>
              </div>
              <span style={{ fontWeight: 700, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>${parseFloat(r.refund_amount).toFixed(2)}</span>
              <span className={`badge badge-${badge(r.status)}`}>{r.status}</span>
            </div>
          )} />

          <Section title="Withdrawals" icon="payments" href="/dashboard/withdrawals" items={results.withdrawals} renderItem={w => (
            <div key={`w-${w.id}`} style={row}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f0f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#001736' }}>payments</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: '#001736', fontSize: 13, fontFamily: 'Manrope, sans-serif' }}>Withdrawal #{w.id}</p>
                <p style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(w.requested_at).toLocaleDateString()}</p>
              </div>
              <span style={{ fontWeight: 700, color: '#001736', fontFamily: 'Manrope, sans-serif' }}>${parseFloat(w.amount).toFixed(2)}</span>
              <span className={`badge badge-${badge(w.status)}`}>{w.status}</span>
            </div>
          )} />
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Layout>
      <Suspense fallback={<div style={{ padding: '32px 40px' }}><p style={{ color: '#94a3b8' }}>Loading…</p></div>}>
        <SearchResults />
      </Suspense>
    </Layout>
  );
}
