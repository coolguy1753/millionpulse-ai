import { useEffect, useState } from 'react';
import { Icon, Btn, Spinner } from '../ui/primitives';
import { api } from '../lib/api';

interface Deck {
  html: string;
  name: string | null;
  account: string | null;
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
  const [err, setErr] = useState('');
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    api.get(`/ws/${wsId}/reviews/${reviewId}/deck`).then(setDeck).catch((e) => setErr(e.message));
  }, [wsId, reviewId]);

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

      <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
        <iframe
          title="review-deck"
          srcDoc={deck.html}
          style={{ width: '100%', height: 'calc(100vh - 180px)', border: 'none', display: 'block', background: '#fff' }}
        />
      </div>

      {sharing && <ShareModal wsId={wsId} reviewId={reviewId} onClose={() => setSharing(false)} />}
    </div>
  );
}
