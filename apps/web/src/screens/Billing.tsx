import { useEffect, useState } from 'react';
import { Icon, fmtM, Spinner } from '../ui/primitives';
import { api } from '../lib/api';

interface BillingRow {
  id: string;
  client: string;
  logo: string | null;
  plan: string;
  seats: number;
  mrr: number;
  arr: number;
  billingStatus: string;
  renewalDate: string | null;
  clientStatus: string;
}
interface BillingData {
  totals: { mrr: number; arr: number; seats: number; clients: number };
  rows: BillingRow[];
}

const billingPill = (s: string) => ({ paid: 'pill-good', trial: 'pill-warn', due: 'pill-risk' }[s] || 'pill-neutral');
const fmtDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—');

export function Billing() {
  const [data, setData] = useState<BillingData | null>(null);

  useEffect(() => {
    api.get('/billing/subscriptions').then(setData).catch(() => setData({ totals: { mrr: 0, arr: 0, seats: 0, clients: 0 }, rows: [] }));
  }, []);

  if (!data) return <Spinner label="Loading billing…" />;

  const t = data.totals;
  const stats = [
    { label: 'MRR', value: fmtM(t.mrr), sub: 'Monthly recurring', icon: 'trendUp', accent: 'good' },
    { label: 'ARR', value: fmtM(t.arr), sub: 'Annual recurring', icon: 'chart', accent: 'primary' },
    { label: 'Seats', value: t.seats.toLocaleString(), sub: 'Contracted', icon: 'accounts', accent: 'pulse' },
    { label: 'Paying clients', value: t.clients, sub: 'Active subscriptions', icon: 'heart', accent: 'warn' },
  ];

  return (
    <div className="content-inner fade-up">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Billing &amp; Plans</h1>
        <p className="muted" style={{ fontSize: 14.5, margin: 0 }}>
          Revenue and plan details across every client.
        </p>
      </div>

      <div className="grid gap16" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 16 }}>
        {stats.map((s) => (
          <div key={s.label} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
                {s.label}
              </span>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: `var(--${s.accent}-wash)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `var(--${s.accent})` }}>
                <Icon name={s.icon} size={17} />
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, letterSpacing: '-.03em' }}>{s.value}</span>
            <span className="muted" style={{ fontSize: 12.5 }}>
              {s.sub}
            </span>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="tbl tbl-tight">
          <thead>
            <tr>
              <th>Client</th>
              <th>Plan</th>
              <th>Seats</th>
              <th>MRR</th>
              <th>ARR</th>
              <th>Renewal</th>
              <th>Billing</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.id} style={{ cursor: 'default' }}>
                <td>
                  <div className="row gap10">
                    <div style={{ width: 30, height: 30, borderRadius: 8, flex: '0 0 30px', background: 'linear-gradient(135deg,#8B6BF0,#6A4BD8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 12 }}>
                      {r.logo}
                    </div>
                    <span style={{ fontWeight: 600 }}>{r.client}</span>
                  </div>
                </td>
                <td>
                  <span className="tag">{r.plan}</span>
                </td>
                <td className="mono">{r.seats.toLocaleString()}</td>
                <td className="mono" style={{ fontWeight: 600 }}>
                  {fmtM(r.mrr)}
                </td>
                <td className="mono" style={{ fontWeight: 600 }}>
                  {fmtM(r.arr)}
                </td>
                <td className="muted mono" style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>
                  {fmtDate(r.renewalDate)}
                </td>
                <td>
                  <span className={'pill ' + billingPill(r.billingStatus)}>{r.billingStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
