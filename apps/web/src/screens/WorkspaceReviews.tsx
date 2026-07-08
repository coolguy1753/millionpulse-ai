import { useEffect, useState } from 'react';
import { KindPill, Spinner } from '../ui/primitives';
import { api } from '../lib/api';

interface ReviewRow {
  id: string;
  kind: string;
  templateName: string | null;
  tier: string | null;
  structure: string | null;
  status: string;
  quarter: string | null;
  createdAt: string;
  account?: { name: string; logo: string | null } | null;
  owner?: { name: string } | null;
}

const statusPill = (s: string) => ({ published: 'pill-good', draft: 'pill-neutral', in_review: 'pill-warn' }[s] || 'pill-neutral');
const statusLabel = (s: string) => ({ published: 'Published', draft: 'Draft', in_review: 'In review' }[s] || s);
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function WorkspaceReviews({ wsId }: { wsId: string }) {
  const [rows, setRows] = useState<ReviewRow[] | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    setRows(null);
    api.get(`/ws/${wsId}/reviews`).then(setRows).catch((e) => setErr(e.message));
  }, [wsId]);

  if (err) return <div className="content-inner" style={{ color: 'var(--risk)', padding: 40 }}>{err}</div>;
  if (!rows) return <Spinner label="Loading reviews…" />;

  return (
    <div className="content-inner fade-up">
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Reviews</h1>
        <p className="muted" style={{ fontSize: 14.5, margin: 0 }}>
          EBRs and QBRs generated for this workspace.
        </p>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="tbl tbl-tight">
          <thead>
            <tr>
              <th>Account</th>
              <th>Type</th>
              <th>Template</th>
              <th>Owner</th>
              <th>Quarter</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ cursor: 'default' }}>
                <td>
                  <div className="row gap10">
                    <div style={{ width: 28, height: 28, borderRadius: 7, flex: '0 0 28px', background: 'linear-gradient(135deg,#8B6BF0,#6A4BD8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 11 }}>
                      {r.account?.logo}
                    </div>
                    <span style={{ fontWeight: 600 }}>{r.account?.name || '—'}</span>
                  </div>
                </td>
                <td>
                  <KindPill kind={r.kind} />
                </td>
                <td className="muted" style={{ fontSize: 13 }}>
                  {r.templateName || '—'}
                </td>
                <td className="muted" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                  {r.owner?.name || '—'}
                </td>
                <td className="muted mono" style={{ fontSize: 12.5 }}>
                  {r.quarter || '—'}
                </td>
                <td className="muted mono" style={{ fontSize: 12.5, whiteSpace: 'nowrap' }}>
                  {fmtDate(r.createdAt)}
                </td>
                <td>
                  <span className={'pill ' + statusPill(r.status)}>{statusLabel(r.status)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
