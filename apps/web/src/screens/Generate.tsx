import { useEffect, useState } from 'react';
import { Icon, Btn, Spinner } from '../ui/primitives';
import { api } from '../lib/api';

interface AccountOpt {
  id: string;
  name: string;
  structure: string;
  srpTier: string | null;
}

const STEPS = [
  'Reading intake brief & confirming template',
  'Auditing NPS — org NPS, Promoters/Detractors',
  'Ranking accounts by NPS & response volume',
  'Scoring Search Rank (SRS)',
  'Extracting sentiment themes & verbatims',
  'Inferring strategic posture (Protect / Close)',
  'Building interactive deck from template',
  'Composing 1-page summary',
];

export function Generate({ wsId, onDone, onCancel }: { wsId: string; onDone: (reviewId: string) => void; onCancel: () => void }) {
  const [accounts, setAccounts] = useState<AccountOpt[] | null>(null);
  const [accountId, setAccountId] = useState('');
  const [kind, setKind] = useState<'EBR' | 'QBR'>('EBR');
  const [quarter, setQuarter] = useState('Q3 FY26');
  const [busy, setBusy] = useState(false);
  const [stepIdx, setStepIdx] = useState(-1);
  const [err, setErr] = useState('');

  useEffect(() => {
    api
      .get(`/ws/${wsId}/accounts`)
      .then((rows: AccountOpt[]) => {
        setAccounts(rows);
        if (rows[0]) setAccountId(rows[0].id);
      })
      .catch((e) => setErr(e.message));
  }, [wsId]);

  if (!accounts) return <Spinner label="Loading accounts…" />;

  const account = accounts.find((a) => a.id === accountId);
  const suggested =
    kind === 'EBR' && account?.srpTier
      ? `${account.structure === 'multi' ? 'Multi' : 'Single'}-Account · ${account.srpTier}`
      : kind === 'EBR'
        ? 'Executive Business Review'
        : 'Standard QBR';

  const run = async () => {
    setBusy(true);
    setErr('');
    // Animate the pipeline steps while the request runs.
    let i = 0;
    setStepIdx(0);
    const timer = setInterval(() => {
      i += 1;
      if (i < STEPS.length) setStepIdx(i);
    }, 420);
    try {
      const review = await api.post(`/ws/${wsId}/reviews/generate`, { accountId, kind, quarter });
      // Let the animation finish for a beat.
      await new Promise((r) => setTimeout(r, Math.max(0, STEPS.length * 420 - 800)));
      clearInterval(timer);
      setStepIdx(STEPS.length);
      setTimeout(() => onDone(review.id), 500);
    } catch (e: any) {
      clearInterval(timer);
      setBusy(false);
      setStepIdx(-1);
      setErr(e.message || 'Generation failed');
    }
  };

  return (
    <div className="content-inner fade-up" style={{ maxWidth: 780 }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
        <h1 style={{ fontSize: 22 }}>Generate review</h1>
        {!busy && (
          <button className="btn btn-ghost btn-sm" onClick={onCancel}>
            <Icon name="x" size={15} />
            Cancel
          </button>
        )}
      </div>
      <p className="muted" style={{ marginTop: 0, marginBottom: 22, fontSize: 14 }}>
        Pick an account and review type — the engine selects the locked template and builds the deck.
      </p>

      {!busy && stepIdx < 0 ? (
        <div className="card card-pad" style={{ padding: '26px 28px' }}>
          <label className="wiz-label">Account</label>
          <select className="winput" value={accountId} onChange={(e) => setAccountId(e.target.value)} style={{ marginBottom: 18 }}>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>

          <label className="wiz-label">Review type</label>
          <div className="row gap8" style={{ marginBottom: 18 }}>
            {(['EBR', 'QBR'] as const).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className="pick"
                style={{ flex: 1, borderColor: kind === k ? 'var(--primary)' : 'var(--line)', justifyContent: 'center' }}
              >
                <span className={'pill ' + (k === 'EBR' ? 'pill-ebr' : 'pill-qbr')}>{k}</span>
              </button>
            ))}
          </div>

          <label className="wiz-label">Quarter</label>
          <input className="winput" value={quarter} onChange={(e) => setQuarter(e.target.value)} style={{ marginBottom: 18 }} />

          <div className="row gap12" style={{ padding: '12px 14px', border: '1px solid var(--line)', borderRadius: 11, background: 'var(--surface-2)', marginBottom: 20 }}>
            <Icon name="layers" size={18} stroke="var(--primary)" />
            <span style={{ fontSize: 13 }}>
              Selected template: <b>{suggested}</b>
            </span>
          </div>

          {err && (
            <div className="login-err" style={{ marginBottom: 14 }}>
              <Icon name="flag" size={13} />
              {err}
            </div>
          )}

          <div className="row" style={{ justifyContent: 'flex-end' }}>
            <Btn variant="primary" icon="sparkle" onClick={run}>
              Generate {kind}
            </Btn>
          </div>
        </div>
      ) : (
        <div className="card card-pad" style={{ padding: '26px 28px' }}>
          <div className="grid gap8">
            {STEPS.map((s, i) => {
              const done = i < stepIdx;
              const active = i === stepIdx;
              return (
                <div key={i} className="row gap12" style={{ padding: '9px 4px', opacity: i <= stepIdx ? 1 : 0.4 }}>
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      flex: '0 0 22px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: done ? 'var(--good)' : active ? 'var(--primary)' : 'var(--line-2)',
                      color: '#fff',
                    }}
                  >
                    {done ? (
                      <Icon name="check" size={12} sw={3} />
                    ) : active ? (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse2 1s infinite' }} />
                    ) : null}
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: active ? 600 : 500 }}>{s}</span>
                </div>
              );
            })}
          </div>
          {stepIdx >= STEPS.length && (
            <div className="row gap8" style={{ marginTop: 16, color: 'var(--good)', fontWeight: 600 }}>
              <Icon name="check" size={16} stroke="var(--good)" sw={3} />
              Done — opening your review…
            </div>
          )}
        </div>
      )}
    </div>
  );
}
