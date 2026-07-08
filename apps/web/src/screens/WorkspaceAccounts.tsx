import { useEffect, useState } from 'react';
import { HealthBar, HealthPill, fmtM, Spinner } from '../ui/primitives';
import { api } from '../lib/api';

interface AccountRow {
  id: string;
  name: string;
  logo: string | null;
  tier: string | null;
  arr: number;
  seats: number;
  health: number | null;
  nps: number | null;
  adoption: number | null;
  region: string | null;
  structure: string;
  srpTier: string | null;
  autoRenewalDate: string | null;
  csm?: { name: string } | null;
  srSpecialist?: { name: string } | null;
}

const fmtDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—');

// EBR window = 90 days before auto-renewal, through the renewal date.
function renewalState(iso: string | null): { label: string; cls: string } {
  if (!iso) return { label: '—', cls: 'pill-neutral' };
  const end = new Date(iso).getTime();
  const days = (end - Date.now()) / 86400000;
  if (days < 0) return { label: 'Renewal passed', cls: 'pill-risk' };
  if (days <= 90) return { label: `EBR window · ${Math.ceil(days)}d`, cls: 'pill-warn' };
  return { label: `in ${Math.ceil(days)}d`, cls: 'pill-neutral' };
}

export function WorkspaceAccounts({ wsId }: { wsId: string }) {
  const [rows, setRows] = useState<AccountRow[] | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    setRows(null);
    api.get(`/ws/${wsId}/accounts`).then(setRows).catch((e) => setErr(e.message));
  }, [wsId]);

  if (err) return <div className="content-inner" style={{ color: 'var(--risk)', padding: 40 }}>{err}</div>;
  if (!rows) return <Spinner label="Loading accounts…" />;

  return (
    <div className="content-inner fade-up">
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Accounts</h1>
        <p className="muted" style={{ fontSize: 14.5, margin: 0 }}>
          Every account in this workspace, with health, contract, and renewal window.
        </p>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="tbl tbl-tight">
          <thead>
            <tr>
              <th>Account</th>
              <th>Tier</th>
              <th>ARR</th>
              <th>Health</th>
              <th>NPS</th>
              <th>CSM</th>
              <th>Renewal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              const rs = renewalState(a.autoRenewalDate);
              return (
                <tr key={a.id} style={{ cursor: 'default' }}>
                  <td>
                    <div className="row gap12">
                      <div style={{ width: 32, height: 32, borderRadius: 8, flex: '0 0 32px', background: 'linear-gradient(135deg,#8B6BF0,#6A4BD8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 12 }}>
                        {a.logo}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{a.name}</div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {a.structure === 'multi' ? 'Multi-brand' : 'Single'} {a.srpTier ? `· ${a.srpTier}` : ''}
                        </div>
                      </div>
                    </div>
                  </td>
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
                  <td className="mono" style={{ fontWeight: 600 }}>
                    {a.nps ?? '—'}
                  </td>
                  <td className="muted" style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>
                    {a.csm?.name || '—'}
                  </td>
                  <td>
                    <div className="row gap8" style={{ whiteSpace: 'nowrap' }}>
                      <span className="mono" style={{ fontSize: 12.5 }}>
                        {fmtDate(a.autoRenewalDate)}
                      </span>
                      <span className={'pill ' + rs.cls}>{rs.label}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
