import { useEffect, useMemo, useState } from 'react';
import { useAuth } from './lib/auth';
import { api } from './lib/api';
import type { WorkspaceSummary } from './lib/types';
import { Sidebar, Topbar } from './ui/shell';
import { Spinner } from './ui/primitives';
import { Login } from './screens/Login';
import { Overview } from './screens/Overview';
import { Clients } from './screens/Clients';
import { TeamRoles } from './screens/TeamRoles';
import { Verticals } from './screens/Verticals';
import { TemplateLibrary } from './screens/TemplateLibrary';
import { AllReviews } from './screens/AllReviews';
import { Billing } from './screens/Billing';
import { Settings } from './screens/Settings';
import { WorkspaceDashboard } from './screens/WorkspaceDashboard';
import { Placeholder } from './screens/Placeholder';

const TITLES: Record<string, [string, string | null]> = {
  overview: ['MillionPulse HQ', 'Million Square Solutions'],
  clients: ['Clients', 'MillionPulse HQ'],
  verticals: ['Verticals', 'MillionPulse HQ'],
  lib: ['Template Library', 'MillionPulse HQ'],
  allreviews: ['All Reviews', 'MillionPulse HQ'],
  billing: ['Billing & Plans', 'MillionPulse HQ'],
  roles: ['Team & Roles', 'MillionPulse HQ'],
  settings: ['Settings', 'MillionPulse HQ'],
  dashboard: ['Dashboard', 'Workspace'],
  accounts: ['Accounts', 'Workspace'],
  reviews: ['Reviews', 'Workspace'],
  templates: ['Templates', 'Workspace'],
  sources: ['Data Sources', 'Workspace'],
};

const HQ_ROUTES = ['overview', 'clients', 'verticals', 'lib', 'allreviews', 'billing', 'roles', 'settings'];

export default function App() {
  const { user, loading, logout } = useAuth();
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
  const [wsId, setWsId] = useState<string | null>(null);
  const [route, setRoute] = useState('overview');

  useEffect(() => {
    if (!user) return;
    api
      .get('/workspaces')
      .then((ws: WorkspaceSummary[]) => {
        setWorkspaces(ws);
        setWsId(ws[0]?.id ?? null);
        // Non-super-admins land in their workspace.
        if (!user.isSuperAdmin) setRoute('dashboard');
      })
      .catch(() => setWorkspaces([]));
  }, [user]);

  const ws = useMemo(() => workspaces.find((w) => w.id === wsId) ?? null, [workspaces, wsId]);

  if (loading) return <Spinner label="Starting MillionPulse AI…" />;
  if (!user) return <Login />;

  const go = (r: string) => setRoute(r);
  const switchWs = (id: string) => {
    setWsId(id);
    setRoute('dashboard');
  };
  const openWorkspace = (id: string) => {
    setWsId(id);
    setRoute('dashboard');
  };

  const [title, crumb] = TITLES[route] || ['', null];
  const isHqRoute = HQ_ROUTES.includes(route);

  return (
    <div className="app">
      <Sidebar route={route} go={go} ws={ws} workspaces={workspaces} onSwitch={switchWs} user={user} onSignOut={logout} />
      <main className="main">
        <Topbar title={title} crumbs={crumb} ws={isHqRoute ? null : ws} />
        <div className="content">
          {route === 'overview' && <Overview go={go} />}
          {route === 'clients' && <Clients onOpenWorkspace={openWorkspace} />}
          {route === 'roles' && <TeamRoles />}
          {route === 'verticals' && <Verticals />}
          {route === 'lib' && <TemplateLibrary />}
          {route === 'allreviews' && <AllReviews />}
          {route === 'billing' && <Billing />}
          {route === 'settings' && <Settings />}

          {route === 'dashboard' && (ws ? <WorkspaceDashboard key={ws.id} wsId={ws.id} /> : <Placeholder title="Dashboard" phase="a connected workspace" />)}
          {route === 'accounts' && <Placeholder title="Accounts" phase="Phase 2" />}
          {route === 'reviews' && <Placeholder title="Reviews" phase="Phase 3" />}
          {route === 'templates' && <Placeholder title="Templates" phase="Phase 3" />}
          {route === 'sources' && <Placeholder title="Data Sources" phase="Phase 2" />}
        </div>
      </main>
    </div>
  );
}
