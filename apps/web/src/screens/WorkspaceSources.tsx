import { useEffect, useState } from 'react';
import { Icon, Spinner } from '../ui/primitives';
import { api } from '../lib/api';

interface SourceRow {
  id: string;
  provider: string;
  category: string | null;
  status: string;
  detail: string | null;
  lastSyncAt: string | null;
}

const catIcon = (c: string | null) =>
  ({ CRM: 'cloud', 'Product usage': 'chart', Support: 'ticket', 'Health & NPS': 'heart' }[c || ''] || 'sources');
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function WorkspaceSources({ wsId }: { wsId: string }) {
  const [rows, setRows] = useState<SourceRow[] | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    setRows(null);
    api.get(`/ws/${wsId}/sources`).then(setRows).catch((e) => setErr(e.message));
  }, [wsId]);

  if (err) return <div className="content-inner" style={{ color: 'var(--risk)', padding: 40 }}>{err}</div>;
  if (!rows) return <Spinner label="Loading data sources…" />;

  const connected = rows.filter((r) => r.status === 'connected').length;

  return (
    <div className="content-inner fade-up">
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Data Sources</h1>
        <p className="muted" style={{ fontSize: 14.5, margin: 0 }}>
          {connected} of {rows.length} connectors active — accounts &amp; signals sync from here.
        </p>
      </div>

      <div className="grid gap16" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
        {rows.map((s) => {
          const on = s.status === 'connected';
          return (
            <div key={s.id} className="card card-pad vcard" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, flex: '0 0 42px', background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: on ? 'var(--primary)' : 'var(--text-3)' }}>
                <Icon name={catIcon(s.category)} size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="row gap8">
                  <span style={{ fontWeight: 600, fontSize: 14.5 }}>{cap(s.provider)}</span>
                  <span className="tag">{s.category}</span>
                </div>
                <div className="muted" style={{ fontSize: 12.5, marginTop: 3 }}>
                  {s.detail}
                </div>
              </div>
              {on ? (
                <span className="pill pill-good">
                  <span className="dot" style={{ background: 'var(--good)' }} />
                  Connected
                </span>
              ) : (
                <button className="btn btn-ghost btn-sm">
                  <Icon name="plus" size={14} />
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
