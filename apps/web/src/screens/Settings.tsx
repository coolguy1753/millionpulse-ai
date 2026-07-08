import { Icon } from '../ui/primitives';
import { useAuth } from '../lib/auth';

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      style={{
        width: 38,
        height: 22,
        borderRadius: 20,
        background: on ? 'var(--primary)' : 'var(--line)',
        display: 'inline-flex',
        alignItems: 'center',
        padding: 2,
        justifyContent: on ? 'flex-end' : 'flex-start',
      }}
    >
      <span style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff' }} />
    </span>
  );
}

export function Settings() {
  const { user } = useAuth();

  return (
    <div className="content-inner fade-up">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, marginBottom: 6 }}>Settings</h1>
        <p className="muted" style={{ fontSize: 14.5, margin: 0 }}>
          Organization profile, security, and API access.
        </p>
      </div>

      <div className="grid gap16" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>Organization</h3>
          {[
            ['Organization', 'Million Square Solutions'],
            ['Product', 'MillionPulse AI'],
            ['Signed in as', user?.name ?? '—'],
            ['Email', user?.email ?? '—'],
            ['Role', user?.isSuperAdmin ? 'Super Admin (HQ)' : 'Workspace member'],
          ].map(([k, v]) => (
            <div key={k} className="row" style={{ justifyContent: 'space-between', fontSize: 13.5, padding: '10px 0', borderBottom: '1px solid var(--line-2)' }}>
              <span className="muted">{k}</span>
              <b>{v}</b>
            </div>
          ))}
        </div>

        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>Security</h3>
          {[
            ['Two-factor authentication (2FA)', user?.twoFactorEnabled ?? false, 'TOTP-based, ready to enable per user'],
            ['SAML / OIDC Single Sign-On', false, 'Enterprise SSO — configurable'],
            ['Short-lived sessions + refresh', true, 'JWT access + refresh tokens'],
            ['Audit logging', true, 'Every mutating action recorded'],
          ].map(([label, on, sub]) => (
            <div key={label as string} className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start', padding: '11px 0', borderBottom: '1px solid var(--line-2)' }}>
              <div style={{ paddingRight: 12 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{label as string}</div>
                <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                  {sub as string}
                </div>
              </div>
              <Toggle on={on as boolean} />
            </div>
          ))}
        </div>

        <div className="card card-pad" style={{ gridColumn: '1 / -1' }}>
          <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <h3 style={{ fontSize: 16 }}>API access</h3>
            <span className="tag">Phase 4</span>
          </div>
          <div className="row gap8" style={{ fontSize: 13, color: 'var(--text-2)' }}>
            <Icon name="flag" size={14} />
            Per-organization API keys for programmatic EBR/QBR generation arrive in the business layer (Phase 4).
          </div>
        </div>
      </div>
    </div>
  );
}
