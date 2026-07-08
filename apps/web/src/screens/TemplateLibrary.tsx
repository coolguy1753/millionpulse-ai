import { useEffect, useState } from 'react';
import { Icon, KindPill, Spinner } from '../ui/primitives';
import { api } from '../lib/api';

interface TemplateRow {
  id: string;
  name: string;
  kind: string;
  version: string;
  status: string;
  system: boolean;
  structure: string | null;
  tier: string | null;
  description: string | null;
  use: string | null;
  vertical: string | null;
  scope: string;
  usedByCount: number;
}

export function TemplateLibrary() {
  const [items, setItems] = useState<TemplateRow[] | null>(null);

  useEffect(() => {
    api.get('/templates').then(setItems).catch(() => setItems([]));
  }, []);

  if (!items) return <Spinner label="Loading templates…" />;

  return (
    <div className="content-inner fade-up">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Template Library</h1>
        <p className="muted" style={{ fontSize: 14.5, margin: 0 }}>
          The master catalog of EBR & QBR templates — including the locked Experience.com EBR System.
        </p>
      </div>

      <div className="grid gap16" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        {items.map((t) => (
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
            <div className="row gap12" style={{ paddingTop: 10, borderTop: '1px solid var(--line-2)', fontSize: 12, color: 'var(--text-2)' }}>
              <span className="row gap8">
                <Icon name="layers" size={13} />
                {t.scope}
              </span>
              <span className="row gap8" style={{ marginLeft: 'auto' }}>
                <Icon name="file" size={13} />v{t.version}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
