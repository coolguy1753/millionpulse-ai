/**
 * A membership as carried inside the JWT. workspaceId null == HQ / all.
 */
export interface MembershipClaim {
  workspaceId: string | null;
  roleId: string;
  assignedAccountIds: string[];
}

/**
 * The authenticated principal attached to every request (req.user).
 */
export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  isSuperAdmin: boolean;
  memberships: MembershipClaim[];
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  memberships: MembershipClaim[];
  type: 'access' | 'refresh';
}
