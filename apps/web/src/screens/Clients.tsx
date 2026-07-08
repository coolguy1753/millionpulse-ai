import { useEffect, useState } from 'react';
import { Icon, Btn, FilterTabs, fmtM, Spinner } from '../ui/primitives';
import { api } from '../lib/api';
import type { ClientRow } from '../lib/types';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const statusPill = (s: string) =>
  ({ active: 'pill-good', onboarding: 'pill-warn', prospect: 'pill-neutral', churned: 'pill-risk' }[s] || 'pill-neutral');

function CStatus({ s }: { s: string }) {
  return (
    <span className={'pill ' + statusPill(s)}>
      {s === 'active' && <span className="dot" style={{ background: 'var(--good)' }} />}
      {cap(s)}
    </span>
  );
}

export function Clients({ onOpenWorkspace }: { onOpenWorkspace: (wsId: string) => void }) {
  const [items, setItems] = useState<ClientRow[] | null>(null);
  const [tab, setTab] = useState('All');

  useEffect(() => {
    api.get('/clients').then(setItems).catch(() => setItems([]));
  }, []);

  if (!items) return <Spinner label="Loading clients…" />;

  const rows = tab === 'All' ? items : items.filter((c) => c.status === tab.toLowerCase());

  return (
    <div className="content-inner fade-up">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 18, alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>Clients</h1>
          <p className="muted" style={{ fontSize: 14.5, margin: 0 }}>
            Every B2B client Million Square runs Customer Success for.
          </p>
        </div>
        <Btn variant="primary" icon="plus">
          Add client
        </Btn>
      </div>

      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <FilterTabs tabs={['All', 'Active', 'Onboarding', 'Prospect']} active={tab} onChange={setTab} />
        <span className="muted" style={{ fontSize: 13 }}>
          {rows.length} client{rows.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="tbl tbl-tight">
          <thead>
            <tr>
              <th>Client</th>
              <th>Vertical</th>
              <th>Plan</th>
              <th>ARR</th>
              <th>Accounts</th>
              <th>Onboarding</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} onClick={() => c.hasWorkspace && c.workspaceId && onOpenWorkspace(c.workspaceId)}>
                <td>
                  <div className="row gap12">
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        flex: '0 0 34px',
                        background: 'linear-gradient(135deg,#8B6BF0,#6A4BD8)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                        fontSize: 13,
                      }}
                    >
                      {c.logo}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {c.domain}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="muted" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                  {c.vertical}
                </td>
                <td>
                  <span className="tag">{c.plan}</span>
                </td>
                <td className="mono" style={{ fontWeight: 600 }}>
                  {fmtM(c.arr)}
                </td>
                <td className="mono">{c.accounts || '—'}</td>
                <td style={{ minWidth: 110 }}>
                  <div className="row gap8">
                    <div className="hbar" style={{ width: 60 }}>
                      <i style={{ width: c.onboarded + '%', background: c.onboarded === 100 ? 'var(--good)' : 'var(--primary)' }} />
                    </div>
                    <span className="mono" style={{ fontSize: 12 }}>
                      {c.onboarded}%
                    </span>
                  </div>
                </td>
                <td>
                  <CStatus s={c.status} />
                </td>
                <td style={{ textAlign: 'right' }}>
                  {c.hasWorkspace ? (
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        c.workspaceId && onOpenWorkspace(c.workspaceId);
                      }}
                    >
                      <Icon name="arrowRight" size={14} />
                      Open
                    </button>
                  ) : (
                    <Icon name="chevronRight" size={16} style={{ color: 'var(--text-3)' }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
