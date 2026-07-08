export interface Membership {
  workspaceId: string | null;
  roleId: string;
  assignedAccountIds: string[];
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  twoFactorEnabled: boolean;
  isSuperAdmin: boolean;
  memberships: Membership[];
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  short: string | null;
  accent: string | null;
  industry: string | null;
  logo: string | null;
  plan: string | null;
}

export interface ClientRow {
  id: string;
  name: string;
  domain: string;
  logo: string | null;
  vertical: string | null;
  plan: string | null;
  arr: number;
  status: string;
  region: string | null;
  lead: string | null;
  onboarded: number;
  hasWorkspace: boolean;
  workspaceId: string | null;
  accounts: number;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string | null;
  roleName: string | null;
  client: string;
  status: string;
  last: string | null;
}

export interface RoleDef {
  id: string;
  name: string;
  scope: string;
  color: string | null;
  description: string | null;
  matrix: number[];
}

export interface RolesResponse {
  caps: string[];
  roles: RoleDef[];
}
