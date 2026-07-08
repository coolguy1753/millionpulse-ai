import { useEffect, useState } from 'react';
import { Icon, KindPill, Spinner } from '../ui/primitives';
import { api } from '../lib/api';

interface TemplateRow {
  id: string;
  name: string;
  kind: string;
  version: string;
  system: boolean;
  structure: string | null;
  tier: string | null;
  description: string | null;
  use: string | null;
  workspaceId: string | null;
}

export function WorkspaceTemplates({ wsId }: { wsId: string }) {
  const [items, setItems] = useState<TemplateRow[] | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    setItems(null);
    api.get(`/ws/${wsId}/templates`).then(setItems).catch((e) => setErr(e.message));
  }, [wsId]);

  if (err) return <div className="content-inner" style={{ color: 'var(--risk)', padding: 40 }}>{err}</div>;
  if (!items) return <Spinner label="Loading templates…" />;

  const system = items.filter((t) => t.system);
  const catalog = items.filter((t) => !t.system);

  const card = (t: TemplateRow) => (
    <div key={t.id} className="card card-pad vcard" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div className="row gap8" style={{ justifyContent: 'space-between' }}>
        <KindPill kind={t.kind} />
        {t.system ? (
          <span className="tag" style={{ background: 'var(--primary-wash)', color: 'var(--primary-ink)' }}>
            System
          </span>
        ) : (
          <span className="tag">{t.use}</span>
        )}
      </div>
      <h4 style={{ fontSize: 15, fontFamily: 'var(--font-display)' }}>{t.name}</h4>
      <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.45, margin: 0, flex: 1 }}>
        {t.description}
      </p>
      <div className="row gap8" style={{ paddingTop: 10, borderTop: '1px solid var(--line-2)', fontSize: 12, color: 'var(--text-2)' }}>
        <Icon name="file" size={13} />v{t.version}
        {t.tier && <span className="tag" style={{ marginLeft: 'auto' }}>{t.tier}</span>}
      </div>
    </div>
  );

  return (
    <div className="content-inner fade-up">
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Templates</h1>
        <p className="muted" style={{ fontSize: 14.5, margin: 0 }}>
          Review templates available in this workspace.
        </p>
      </div>

      {system.length > 0 && (
        <>
          <div className="nav-label" style={{ color: 'var(--text-3)', padding: '0 0 10px' }}>
            Experience.com EBR System (locked)
          </div>
          <div className="grid gap16" style={{ gridTemplateColumns: 'repeat(2,1fr)', marginBottom: 24 }}>
            {system.map(card)}
          </div>
        </>
      )}

      <div className="nav-label" style={{ color: 'var(--text-3)', padding: '0 0 10px' }}>
        Shared catalog
      </div>
      <div className="grid gap16" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        {catalog.map(card)}
      </div>
    </div>
  );
}
