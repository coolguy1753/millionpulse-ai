import { useEffect, useRef, useState } from 'react';
import { Icon, BrandMark, Avatar } from './primitives';
import type { CurrentUser, WorkspaceSummary } from '../lib/types';

const HQNAV: [string, string, string][] = [
  ['overview', 'Overview', 'dashboard'],
  ['clients', 'Clients', 'book'],
  ['verticals', 'Verticals', 'layers'],
  ['lib', 'Template Library', 'templates'],
  ['allreviews', 'All Reviews', 'reviews'],
  ['billing', 'Billing', 'trendUp'],
  ['roles', 'Team & Roles', 'accounts'],
  ['settings', 'Settings', 'settings'],
];

const WSNAV: [string, string, string][] = [
  ['dashboard', 'Dashboard', 'dashboard'],
  ['accounts', 'Accounts', 'accounts'],
  ['reviews', 'Reviews', 'reviews'],
  ['templates', 'Templates', 'templates'],
  ['sources', 'Data Sources', 'sources'],
];

function WorkspaceSwitcher({
  ws,
  workspaces,
  onSwitch,
}: {
  ws: WorkspaceSummary | null;
  workspaces: WorkspaceSummary[];
  onSwitch: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const h = () => setOpen(false);
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, [open]);

  if (!ws) return null;
  return (
    <div style={{ position: 'relative', margin: '0 6px 4px' }}>
      <button
        className="ws-switch"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        <div className="ws-logo" style={{ background: ws.accent || 'var(--primary)' }}>
          {ws.logo}
        </div>
        <div style={{ flex: 1, textAlign: 'left', lineHeight: 1.2, overflow: 'hidden' }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {ws.name}
          </div>
          <div style={{ fontSize: 11, color: '#6E7691' }}>{ws.plan} workspace</div>
        </div>
        <Icon name="chevronRight" size={15} style={{ transform: 'rotate(90deg)', color: '#8891AB' }} />
      </button>
      {open && (
        <div className="ws-menu" onClick={(e) => e.stopPropagation()}>
          <div className="ws-menu-label">Client workspaces</div>
          {workspaces.map((w) => (
            <button key={w.id} className="ws-menu-item" onClick={() => { onSwitch(w.id); setOpen(false); }}>
              <div className="ws-logo" style={{ background: w.accent || 'var(--primary)', width: 26, height: 26, flex: '0 0 26px', fontSize: 12 }}>
                {w.logo}
              </div>
              <div style={{ flex: 1, textAlign: 'left', lineHeight: 1.15 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{w.name}</div>
                <div style={{ fontSize: 10.5, color: '#7E86A0' }}>{w.industry}</div>
              </div>
              {w.id === ws.id && <Icon name="check" size={15} stroke="var(--pulse)" sw={3} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  route,
  go,
  ws,
  workspaces,
  onSwitch,
  user,
  onSignOut,
}: {
  route: string;
  go: (r: string) => void;
  ws: WorkspaceSummary | null;
  workspaces: WorkspaceSummary[];
  onSwitch: (id: string) => void;
  user: CurrentUser;
  onSignOut: () => void;
}) {
  return (
    <aside className="sidebar">
      <div className="brand" onClick={() => go(user.isSuperAdmin ? 'overview' : 'dashboard')} style={{ cursor: 'pointer' }}>
        <BrandMark size={38} />
        <div>
          <div className="brand-name">
            MillionPulse<span style={{ color: 'var(--pulse)' }}> AI</span>
          </div>
          <div className="brand-sub">Million Square Solutions</div>
        </div>
      </div>

      {user.isSuperAdmin && (
        <>
          <div className="nav-label" style={{ paddingTop: 6 }}>
            MillionPulse HQ
          </div>
          {HQNAV.map(([id, label, ic]) => (
            <button key={id} className={'nav-item' + (route === id ? ' active' : '')} onClick={() => go(id)}>
              <Icon name={ic} className="ic" size={18} />
              <span>{label}</span>
            </button>
          ))}
        </>
      )}

      <div className="nav-label">Client workspace</div>
      <WorkspaceSwitcher ws={ws} workspaces={workspaces} onSwitch={onSwitch} />

      {ws && (
        <button className="btn btn-primary" style={{ margin: '6px 6px 8px', justifyContent: 'center' }} onClick={() => go('generate')}>
          <Icon name="sparkle" size={16} /> Generate review
        </button>
      )}

      <div className="nav-label">Workspace</div>
      {WSNAV.map(([id, label, ic]) => (
        <button
          key={id}
          className={'nav-item' + (route === id ? ' active' : '')}
          onClick={() => go(id)}
          disabled={!ws}
          style={{ opacity: ws ? 1 : 0.4 }}
        >
          <Icon name={ic} className="ic" size={18} />
          <span>{label}</span>
        </button>
      ))}

      <div className="sidebar-foot">
        <div className="user-chip">
          <Avatar name={user.name} size={32} />
          <div style={{ lineHeight: 1.2, overflow: 'hidden', flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>{user.name}</div>
            <div style={{ fontSize: 11, color: '#6E7691', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </div>
          </div>
          <button
            onClick={onSignOut}
            title="Sign out"
            style={{ border: 'none', background: 'none', color: '#8891AB', cursor: 'pointer', padding: 6, borderRadius: 8, display: 'flex' }}
          >
            <Icon name="logout" size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export function Topbar({ title, crumbs, ws }: { title: string; crumbs?: string | null; ws?: WorkspaceSummary | null }) {
  return (
    <header className="topbar">
      <div>
        {crumbs && <div className="crumb">{crumbs}</div>}
        <div className="page-title">{title}</div>
      </div>
      {ws && (
        <div className="ws-chip" title="You are viewing this client workspace only">
          <div className="ws-logo" style={{ background: ws.accent || 'var(--primary)', width: 20, height: 20, flex: '0 0 20px', fontSize: 10 }}>
            {ws.logo}
          </div>
          <span>{ws.name}</span>
        </div>
      )}
      <div className="search">
        <Icon name="search" size={16} />
        <input placeholder="Search accounts, reviews…" />
      </div>
      <div className="row gap12" style={{ marginLeft: '16px' }}>
        <button className="btn btn-ghost btn-sm" style={{ padding: '8px' }} aria-label="Notifications">
          <Icon name="bell" size={17} />
        </button>
      </div>
    </header>
  );
}
