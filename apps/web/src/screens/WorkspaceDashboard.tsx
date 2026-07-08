import { useEffect, useState } from 'react';
import { Icon, HealthBar, HealthPill, fmtM, Spinner } from '../ui/primitives';

import { api } from '../lib/api';

interface AccountRow {
  id: string;
  name: string;
  logo: string | null;
  tier: string | null;
  arr: number;
  health: number | null;
  trend: number | null;
  csm?: { name: string } | null;
}
interface Dashboard {
  kpis: { accounts: number; totalArr: number; avgHealth: number; reviewsDue: number; publishedReviews: number };
  healthDist: { healthy: number; watch: number; atRisk: number };
  accounts: AccountRow[];
  recentReviews: { id: string; kind: string; templateName: string | null; status: string; account: { name: string } | null }[];
}

export function WorkspaceDashboard({ wsId }: { wsId: string }) {
  const [data, setData] = useState<Dashboard | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    setData(null);
    api.get(`/ws/${wsId}/dashboard`).then(setData).catch((e) => setErr(e.message));
  }, [wsId]);

  if (err) return <div className="content-inner" style={{ color: 'var(--risk)', padding: 40 }}>{err}</div>;
  if (!data) return <Spinner label="Loading workspace…" />;

  const k = data.kpis;
  const stats = [
    { label: 'Accounts', value: k.accounts, icon: 'accounts', accent: 'primary' },
    { label: 'ARR', value: fmtM(k.totalArr), icon: 'trendUp', accent: 'good' },
    { label: 'Avg health', value: k.avgHealth, icon: 'heart', accent: 'pulse' },
    { label: 'Reviews due (90d)', value: k.reviewsDue, icon: 'clock', accent: 'warn' },
  ];

  return (
    <div className="content-inner fade-up">
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Dashboard</h1>
        <p className="muted" style={{ fontSize: 14.5, margin: 0 }}>
          Portfolio health, ARR, and reviews due for this workspace.
        </p>
      </div>

      <div className="grid gap16" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 16 }}>
        {stats.map((s) => (
          <div key={s.label} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <span className="muted" style={{ fontSize: 13, fontWeight: 600 }}>
                {s.label}
              </span>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: `var(--${s.accent}-wash)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: `var(--${s.accent})`,
                }}
              >
                <Icon name={s.icon} size={17} />
              </div>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 600, letterSpacing: '-.03em' }}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="card-pad" style={{ paddingBottom: 10 }}>
          <h3 style={{ fontSize: 16 }}>Accounts</h3>
          <span className="muted" style={{ fontSize: 12.5 }}>
            {data.accounts.length} accounts in this workspace
          </span>
        </div>
        <table className="tbl tbl-tight">
          <thead>
            <tr>
              <th>Account</th>
              <th>Tier</th>
              <th>ARR</th>
              <th>Health</th>
              <th>CSM</th>
            </tr>
          </thead>
          <tbody>
            {data.accounts.map((a) => (
              <tr key={a.id}>
                <td style={{ fontWeight: 600 }}>{a.name}</td>
                <td>
                  <span className="tag">{a.tier}</span>
                </td>
                <td className="mono" style={{ fontWeight: 600 }}>
                  {fmtM(a.arr)}
                </td>
                <td>
                  <div className="row gap8">
                    <HealthBar h={a.health ?? 0} />
                    {a.health != null && <HealthPill h={a.health} />}
                  </div>
                </td>
                <td className="muted" style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>
                  {a.csm?.name || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
