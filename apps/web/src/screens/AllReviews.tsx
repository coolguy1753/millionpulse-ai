import { useEffect, useState } from 'react';
import { KindPill, Spinner } from '../ui/primitives';
import { api } from '../lib/api';

interface ReviewRow {
  id: string;
  kind: string;
  templateName: string | null;
  tier: string | null;
  status: string;
  quarter: string | null;
  createdAt: string;
  account: string | null;
  workspace: string | null;
  workspaceAccent: string | null;
  owner: string | null;
}

const statusPill = (s: string) =>
  ({ published: 'pill-good', draft: 'pill-neutral', in_review: 'pill-warn' }[s] || 'pill-neutral');
const statusLabel = (s: string) => ({ published: 'Published', draft: 'Draft', in_review: 'In review' }[s] || s);
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function AllReviews() {
  const [rows, setRows] = useState<ReviewRow[] | null>(null);

  useEffect(() => {
    api.get('/reviews').then(setRows).catch(() => setRows([]));
  }, []);

  if (!rows) return <Spinner label="Loading reviews…" />;

  return (
    <div className="content-inner fade-up">
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>All Reviews</h1>
        <p className="muted" style={{ fontSize: 14.5, margin: 0 }}>
          Every EBR and QBR generated across all client workspaces.
        </p>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="tbl tbl-tight">
          <thead>
            <tr>
              <th>Account</th>
              <th>Workspace</th>
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
                <td style={{ fontWeight: 600 }}>{r.account || '—'}</td>
                <td>
                  <span className="row gap8" style={{ fontSize: 13 }}>
                    <span className="ws-logo" style={{ background: r.workspaceAccent || 'var(--primary)', width: 18, height: 18, flex: '0 0 18px', fontSize: 9 }}>
                      {r.workspace?.[0]}
                    </span>
                    {r.workspace}
                  </span>
                </td>
                <td>
                  <KindPill kind={r.kind} />
                </td>
                <td className="muted" style={{ fontSize: 13 }}>
                  {r.templateName || '—'}
                </td>
                <td className="muted" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                  {r.owner || '—'}
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
