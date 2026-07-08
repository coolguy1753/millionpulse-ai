import { useEffect, useRef, useState } from 'react';
import { Icon, Btn, Spinner } from '../ui/primitives';
import { api } from '../lib/api';

interface Deck {
  html: string;
  name: string | null;
  account: string | null;
}

interface UploadRow {
  id: string;
  filename: string;
  kind: string;
  parsed?: { rowCount?: number; metrics?: Record<string, number> } | null;
}

function ShareModal({ wsId, reviewId, onClose }: { wsId: string; reviewId: string; onClose: () => void }) {
  const [url, setUrl] = useState('');
  const [expires, setExpires] = useState('30');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const create = async () => {
    setBusy(true);
    try {
      const res = await api.post(`/ws/${wsId}/reviews/${reviewId}/share`, {
        expiresDays: expires === 'never' ? undefined : Number(expires),
      });
      setUrl(res.url);
    } finally {
      setBusy(false);
    }
  };

  const copy = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
          <h2 style={{ fontSize: 19 }}>Share review</h2>
          <button className="btn btn-ghost btn-sm" style={{ padding: 8 }} onClick={onClose}>
            <Icon name="x" size={16} />
          </button>
        </div>
        <p className="muted" style={{ fontSize: 13, marginTop: 0, marginBottom: 18 }}>
          Create a secure, view-only link. No login needed — anyone with the link can view this deck.
        </p>

        {!url ? (
          <>
            <label className="wiz-label">Link expires</label>
            <select className="winput" value={expires} onChange={(e) => setExpires(e.target.value)} style={{ marginBottom: 18 }}>
              <option value="7">In 7 days</option>
              <option value="30">In 30 days</option>
              <option value="90">In 90 days</option>
              <option value="never">Never</option>
            </select>
            <div className="row" style={{ justifyContent: 'flex-end' }}>
              <Btn variant="primary" icon="share" onClick={create} disabled={busy}>
                {busy ? 'Creating…' : 'Create link'}
              </Btn>
            </div>
          </>
        ) : (
          <>
            <label className="wiz-label">Secure link</label>
            <div className="row gap8" style={{ marginBottom: 16 }}>
              <input className="winput" readOnly value={url} onFocus={(e) => e.target.select()} />
              <Btn variant={copied ? 'primary' : 'ghost'} icon={copied ? 'check' : 'file'} onClick={copy}>
                {copied ? 'Copied' : 'Copy'}
              </Btn>
            </div>
            <div className="row gap8" style={{ fontSize: 12.5, color: 'var(--text-3)' }}>
              <Icon name="flag" size={13} />
              Open this link in any browser (even signed out) to preview the L3 experience.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ReviewViewer({ wsId, reviewId, onBack }: { wsId: string; reviewId: string; onBack: () => void }) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [uploads, setUploads] = useState<UploadRow[]>([]);
  const [err, setErr] = useState('');
  const [sharing, setSharing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadDeck = () => api.get(`/ws/${wsId}/reviews/${reviewId}/deck`).then(setDeck);
  const loadUploads = () => api.get(`/ws/${wsId}/reviews/${reviewId}/uploads`).then(setUploads).catch(() => setUploads([]));

  useEffect(() => {
    loadDeck().catch((e) => setErr(e.message));
    loadUploads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsId, reviewId]);

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      await api.uploadFiles(`/ws/${wsId}/reviews/${reviewId}/uploads`, files);
      await loadUploads();
      await loadDeck(); // deck now includes the ingested data
    } catch (ex: any) {
      setErr(ex.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  if (err) return <div className="content-inner" style={{ color: 'var(--risk)', padding: 40 }}>{err}</div>;
  if (!deck) return <Spinner label="Loading review…" />;

  return (
    <div className="content-inner fade-up">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 16 }}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}>
          <Icon name="arrowLeft" size={15} />
          Back
        </button>
        <div className="row gap8">
          <span className="muted" style={{ fontSize: 13, alignSelf: 'center' }}>
            {deck.account} · {deck.name}
          </span>
          <Btn variant="primary" size="sm" icon="share" onClick={() => setSharing(true)}>
            Share
          </Btn>
        </div>
      </div>

      {/* Ingest reports */}
      <div className="card card-pad" style={{ marginBottom: 16 }}>
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: 15 }}>Ingest reports</h3>
            <p className="muted" style={{ fontSize: 12.5, margin: '4px 0 0' }}>
              Upload the Experience.com reports (NPS, Campaign, Survey, User Details) — .xlsx or .csv. Parsed data is added to the deck.
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Icon name="upload" size={15} />
            {uploading ? 'Parsing…' : 'Upload files'}
          </button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" multiple onChange={onFiles} style={{ display: 'none' }} />
        </div>

        {uploads.length > 0 && (
          <div className="row gap8" style={{ flexWrap: 'wrap', marginTop: 14 }}>
            {uploads.map((u) => {
              const m = u.parsed?.metrics || {};
              const bits = Object.entries(m)
                .map(([k, v]) => `${k}: ${v}`)
                .join(' · ');
              return (
                <div key={u.id} className="row gap8" style={{ border: '1px solid var(--line)', borderRadius: 10, padding: '8px 12px', background: 'var(--surface-2)' }}>
                  <Icon name="file" size={15} stroke="var(--primary)" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {u.filename} <span className="tag" style={{ marginLeft: 4 }}>{u.kind}</span>
                    </div>
                    <div className="muted" style={{ fontSize: 11.5 }}>
                      {u.parsed?.rowCount ?? 0} rows{bits ? ` · ${bits}` : ''}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        <iframe
          title="review-deck"
          srcDoc={deck.html}
          style={{ width: '100%', height: 'calc(100vh - 300px)', minHeight: 480, border: 'none', display: 'block', background: '#fff' }}
        />
      </div>

      {sharing && <ShareModal wsId={wsId} reviewId={reviewId} onClose={() => setSharing(false)} />}
    </div>
  );
}
