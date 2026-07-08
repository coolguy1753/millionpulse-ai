-- ============================================================
-- MillionPulse AI — Row-Level Security (defense-in-depth)
-- ============================================================
-- Tenant isolation is enforced first in the app (TenantGuard +
-- workspace-scoped queries). RLS is a second, database-level net so
-- that even a query that forgets its WHERE clause cannot leak another
-- tenant's rows.
--
-- How it works: each request opens a transaction and sets two
-- session variables (see PrismaService.withTenant):
--   SET LOCAL app.workspace_id = '<the caller's workspace>';
--   SET LOCAL app.is_superadmin = 'on' | 'off';
-- The policies below read those variables via current_setting().
--
-- Apply after migrations:  psql "$DATABASE_URL" -f prisma/rls.sql
-- (also run automatically by the seed script's applyRls step).
-- ============================================================

-- Helper: current workspace from session, NULL if unset.
CREATE OR REPLACE FUNCTION app_current_workspace() RETURNS text AS $$
  SELECT nullif(current_setting('app.workspace_id', true), '');
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION app_is_superadmin() RETURNS boolean AS $$
  SELECT coalesce(current_setting('app.is_superadmin', true), 'off') = 'on';
$$ LANGUAGE sql STABLE;

-- Apply an identical workspace policy to every workspace-scoped table.
DO $$
DECLARE
  t text;
  scoped_tables text[] := ARRAY[
    'Account', 'Review', 'DataSourceConnection', 'Upload'
  ];
BEGIN
  FOREACH t IN ARRAY scoped_tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY;', t);
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation ON %I;', t);
    EXECUTE format($p$
      CREATE POLICY tenant_isolation ON %I
      USING (
        app_is_superadmin()
        OR "workspaceId" = app_current_workspace()
      )
      WITH CHECK (
        app_is_superadmin()
        OR "workspaceId" = app_current_workspace()
      );
    $p$, t);
  END LOOP;
END $$;
