import { useEffect, useState } from 'react';
import { Icon, Btn, Avatar, FilterTabs, Spinner } from '../ui/primitives';
import { api } from '../lib/api';
import type { RolesResponse, UserRow } from '../lib/types';

function RolePill({ id, roles }: { id: string | null; roles: RolesResponse['roles'] }) {
  const r = roles.find((x) => x.id === id);
  if (!r) return <span className="pill pill-neutral">—</span>;
  return (
    <span className="pill" style={{ background: (r.color || '#8B92AC') + '1a', color: r.color || '#8B92AC' }}>
      {r.name}
    </span>
  );
}

const relTime = (iso: string | null) => {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export function TeamRoles() {
  const [tab, setTab] = useState('Users');
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [rolesData, setRolesData] = useState<RolesResponse | null>(null);

  useEffect(() => {
    api.get('/users').then(setUsers).catch(() => setUsers([]));
    api.get('/roles').then(setRolesData).catch(() => setRolesData({ caps: [], roles: [] }));
  }, []);

  if (!users || !rolesData) return <Spinner label="Loading team…" />;
  const { caps, roles } = rolesData;

  return (
    <div className="content-inner fade-up">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 18, alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: 26, marginBottom: 6 }}>Team & Roles</h1>
          <p className="muted" style={{ fontSize: 14.5, margin: 0 }}>
            Who has access, and what each role can do across the platform.
          </p>
        </div>
        {tab === 'Users' && (
          <Btn variant="primary" icon="plus">
            Invite user
          </Btn>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <FilterTabs tabs={['Users', 'Roles & permissions']} active={tab} onChange={setTab} />
      </div>

      {tab === 'Users' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="tbl tbl-tight">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Scope / workspace</th>
                <th>Status</th>
                <th>Last active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="row gap10">
                      <Avatar name={u.name} size={30} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <RolePill id={u.role} roles={roles} />
                  </td>
                  <td className="muted" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                    {u.client}
                  </td>
                  <td>
                    <span className={'pill ' + (u.status === 'active' ? 'pill-good' : 'pill-warn')}>
                      {u.status === 'active' && <span className="dot" style={{ background: 'var(--good)' }} />}
                      {u.status}
                    </span>
                  </td>
                  <td className="muted mono" style={{ fontSize: 12.5 }}>
                    {relTime(u.last)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-ghost btn-sm" style={{ padding: 8 }}>
                      <Icon name="settings" size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Roles & permissions' && (
        <div>
          <div className="grid gap12" style={{ gridTemplateColumns: 'repeat(5,1fr)', marginBottom: 18 }}>
            {roles.map((r) => (
              <div key={r.id} className="card card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: (r.color || '#8B92AC') + '1a',
                    color: r.color || '#8B92AC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name="accounts" size={17} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: 14 }}>{r.name}</div>
                </div>
                <span className="tag" style={{ alignSelf: 'flex-start' }}>
                  {r.scope}
                </span>
                <p className="muted" style={{ fontSize: 12, lineHeight: 1.45, margin: '2px 0 0' }}>
                  {r.description}
                </p>
              </div>
            ))}
          </div>

          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="tbl tbl-tight">
              <thead>
                <tr>
                  <th>Capability</th>
                  {roles.map((r) => (
                    <th key={r.id} style={{ textAlign: 'center' }}>
                      {r.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {caps.map((cap, ci) => (
                  <tr key={cap} style={{ cursor: 'default' }}>
                    <td style={{ fontWeight: 600, fontSize: 13.5 }}>{cap}</td>
                    {roles.map((r) => {
                      const v = r.matrix[ci];
                      return (
                        <td key={r.id} style={{ textAlign: 'center' }}>
                          {v === 2 ? (
                            <Icon name="check" size={16} stroke="var(--good)" sw={3} />
                          ) : v === 1 ? (
                            <span title="Partial" style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--warn)' }} />
                          ) : (
                            <span style={{ color: 'var(--line)' }}>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="row gap16 card-pad" style={{ paddingTop: 12, fontSize: 12, color: 'var(--text-2)' }}>
              <span className="row gap8">
                <Icon name="check" size={13} stroke="var(--good)" sw={3} />
                Full access
              </span>
              <span className="row gap8">
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warn)' }} />
                Partial / contribute
              </span>
              <span className="row gap8">
                <span style={{ color: 'var(--text-3)' }}>—</span>
                No access
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
