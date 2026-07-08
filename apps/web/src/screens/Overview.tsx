import { useEffect, useState } from 'react';
import { Icon, Btn, fmtM, Spinner } from '../ui/primitives';
import { api } from '../lib/api';
import type { ClientRow } from '../lib/types';

const statusPill = (s: string) =>
  ({ active: 'pill-good', onboarding: 'pill-warn', prospect: 'pill-neutral', churned: 'pill-risk' }[s] || 'pill-neutral');
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const ACTIVITY: [string, string, string, string][] = [
  ['sparkle', 'TowneBank Mortgage EBR published', 'Divyanshu Srivastava · 2h ago', 'primary'],
  ['plus', 'NFM Lending added — onboarding 60%', 'You · 1d ago', 'warn'],
  ['accounts', 'Alex Kent invited as Search Rank Specialist', 'Sarah Mitchell · 1d ago', 'pulse'],
  ['check', 'Milltex Q2 QBR shared with client', 'Aisha Khan · 2d ago', 'good'],
];

export function Overview({ go }: { go: (r: string) => void }) {
  const [clients, setClients] = useState<ClientRow[] | null>(null);
  const [verticalCount, setVerticalCount] = useState(0);

  useEffect(() => {
    api.get('/clients').then(setClients).catch(() => setClients([]));
    api
      .get('/verticals')
      .then((v: { status: string }[]) => setVerticalCount(v.filter((x) => x.status === 'active').length))
      .catch(() => {});
  }, []);

  if (!clients) return <Spinner label="Loading HQ overview…" />;

  const active = clients.filter((c) => c.status === 'active');
  const onboarding = clients.filter((c) => c.status === 'onboarding');
  const arr = clients.reduce((s, c) => s + (c.arr || 0), 0);

  const stats = [
    { label: 'Active clients', value: active.length, sub: `${clients.length} total`, icon: 'accounts', accent: 'primary', to: 'clients' },
    { label: 'In onboarding', value: onboarding.length, sub: 'Needs attention', icon: 'clock', accent: 'warn', to: 'clients' },
    { label: 'ARR under management', value: fmtM(arr), sub: 'Combined book', icon: 'trendUp', accent: 'good', to: 'clients' },
    { label: 'Verticals served', value: verticalCount, sub: 'CS blueprints ready', icon: 'layers', accent: 'pulse', to: 'verticals' },
  ];

  return (
    <div className="content-inner fade-up">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 22, alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>MillionPulse HQ</h1>
          <p className="muted" style={{ fontSize: 14.5, margin: 0 }}>
            Your book of Customer Success business across every client and vertical.
          </p>
        </div>
        <div className="row gap8">
          <Btn icon="accounts" onClick={() => go('roles')}>
            Invite user
          </Btn>
          <Btn variant="primary" icon="plus" onClick={() => go('clients')}>
            Add client
          </Btn>
        </div>
      </div>

      <div className="grid gap16" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 16 }}>
        {stats.map((s) => (
          <button
            key={s.label}
            className="card card-pad vcard"
            onClick={() => go(s.to)}
            style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
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
            <span className="muted" style={{ fontSize: 12.5 }}>
              {s.sub}
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap16" style={{ gridTemplateColumns: '1fr 340px' }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="row card-pad" style={{ justifyContent: 'space-between', paddingBottom: 12 }}>
            <div>
              <h3 style={{ fontSize: 16 }}>Clients</h3>
              <span className="muted" style={{ fontSize: 12.5 }}>
                Across all verticals
              </span>
            </div>
            <Btn size="sm" iconRight="arrowRight" onClick={() => go('clients')}>
              View all
            </Btn>
          </div>
          <table className="tbl tbl-tight">
            <thead>
              <tr>
                <th>Client</th>
                <th>Vertical</th>
                <th>ARR</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} onClick={() => go('clients')}>
                  <td>
                    <div className="row gap10">
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 8,
                          flex: '0 0 30px',
                          background: 'linear-gradient(135deg,#8B6BF0,#6A4BD8)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontFamily: 'var(--font-display)',
                          fontSize: 12,
                        }}
                      >
                        {c.logo}
                      </div>
                      <span style={{ fontWeight: 600 }}>{c.name}</span>
                    </div>
                  </td>
                  <td className="muted" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                    {c.vertical}
                  </td>
                  <td className="mono" style={{ fontWeight: 600 }}>
                    {fmtM(c.arr)}
                  </td>
                  <td>
                    <span className={'pill ' + statusPill(c.status)}>{cap(c.status)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>Recent activity</h3>
          <div className="grid gap16">
            {ACTIVITY.map(([ic, t, m, ac], i) => (
              <div key={i} className="row gap12" style={{ alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    flex: '0 0 30px',
                    background: `var(--${ac}-wash)`,
                    color: `var(--${ac})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name={ic} size={15} />
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>{t}</div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                    {m}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
