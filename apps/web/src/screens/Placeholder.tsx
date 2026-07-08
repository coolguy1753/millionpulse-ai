import { Icon } from '../ui/primitives';

export function Placeholder({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="content-inner fade-up">
      <h1 style={{ fontSize: 26, marginBottom: 6 }}>{title}</h1>
      <div
        className="card card-pad"
        style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '48px 24px', gap: 12 }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'var(--primary-wash)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="sparkle" size={24} />
        </div>
        <div style={{ fontWeight: 600, fontSize: 15 }}>Coming in {phase}</div>
        <p className="muted" style={{ fontSize: 13, maxWidth: 420, margin: 0 }}>
          This screen is designed in the prototype and scheduled for {phase} of the build. Phase 1 delivers auth, multi-tenancy, the data model,
          and the HQ read screens (Overview, Clients, Team &amp; Roles) plus the workspace dashboard.
        </p>
      </div>
    </div>
  );
}
