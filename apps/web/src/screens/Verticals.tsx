import { useEffect, useState } from 'react';
import { Icon, Spinner } from '../ui/primitives';
import { api } from '../lib/api';

interface Vertical {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  status: string;
  clients: number;
  blueprints: number;
}

export function Verticals() {
  const [items, setItems] = useState<Vertical[] | null>(null);

  useEffect(() => {
    api.get('/verticals').then(setItems).catch(() => setItems([]));
  }, []);

  if (!items) return <Spinner label="Loading verticals…" />;

  const active = items.filter((v) => v.status === 'active');
  const totalClients = items.reduce((s, v) => s + v.clients, 0);
  const stats = [
    { label: 'Verticals served', value: active.length, sub: `${items.length - active.length} in pipeline`, icon: 'layers', accent: 'primary' },
    { label: 'Client companies', value: totalClients, sub: 'Across active verticals', icon: 'accounts', accent: 'pulse' },
    { label: 'Active verticals', value: active.length, sub: 'Live CS motions', icon: 'target', accent: 'good' },
    { label: 'Pipeline', value: items.length - active.length, sub: 'Blueprint ready', icon: 'sparkle', accent: 'warn' },
  ];

  return (
    <div className="content-inner fade-up">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Customer Success verticals</h1>
        <p className="muted" style={{ fontSize: 14.5, margin: 0 }}>
          The B2B industries where Million Square runs Customer Success — each with a dashboard and QBR/EBR blueprint.
        </p>
      </div>

      <div className="grid gap16" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 24 }}>
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
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 600, letterSpacing: '-.03em' }}>{s.value}</span>
            <span className="muted" style={{ fontSize: 12.5 }}>
              {s.sub}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap16" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        {items.map((v) => {
          const planned = v.status !== 'active';
          const color = v.color || 'var(--primary)';
          return (
            <div key={v.id} className="card card-pad vcard" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: color + '1a', color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={v.icon || 'layers'} size={23} />
                </div>
                <span className={'pill ' + (planned ? 'pill-neutral' : 'pill-good')}>
                  {planned ? 'Pipeline' : (<><span className="dot" style={{ background: 'var(--good)' }} />Active</>)}
                </span>
              </div>
              <div>
                <h3 style={{ fontSize: 17, marginBottom: 5 }}>{v.name}</h3>
                <p className="muted" style={{ fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                  {planned ? 'Blueprint ready — approach prospects in this vertical.' : 'Active Customer Success motion with live clients.'}
                </p>
              </div>
              <div className="row gap16" style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--line-2)', fontSize: 12.5 }}>
                <span>
                  <b style={{ fontFamily: 'var(--font-display)' }}>{v.clients}</b> <span className="muted">clients</span>
                </span>
                <span>
                  <b style={{ fontFamily: 'var(--font-display)' }}>{v.blueprints}</b> <span className="muted">blueprints</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
