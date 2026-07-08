import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../auth/auth.types';
import { CAPABILITY_KEY, IS_PUBLIC_KEY, SUPERADMIN_KEY } from './decorators';

/** JWT auth guard that respects @Public(). Applied globally. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}

/**
 * TenantGuard — the heart of multi-tenancy enforcement.
 *
 * For any route with a :wsId param, the caller must either be a super-admin
 * or hold a membership in that workspace. It also stamps req.tenant with the
 * resolved { workspaceId, isSuperAdmin } for downstream services / RLS.
 *
 * @SuperAdminOnly() routes require an HQ membership.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const user: AuthUser | undefined = req.user;
    if (!user) throw new ForbiddenException('Not authenticated');

    const requireSuper = this.reflector.getAllAndOverride<boolean>(SUPERADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (requireSuper && !user.isSuperAdmin) {
      throw new ForbiddenException('HQ super-admin only');
    }

    const wsId: string | undefined = req.params?.wsId ?? req.params?.workspaceId;

    if (wsId) {
      const member = user.memberships.find((m) => m.workspaceId === wsId);
      if (!user.isSuperAdmin && !member) {
        // Never confirm the workspace exists to a non-member.
        throw new ForbiddenException('No access to this workspace');
      }
      req.tenant = { workspaceId: wsId, isSuperAdmin: user.isSuperAdmin };
    } else {
      req.tenant = { workspaceId: null, isSuperAdmin: user.isSuperAdmin };
    }
    return true;
  }
}

/**
 * CapabilityGuard — enforces the permission matrix (ARCHITECTURE.md §2)
 * for routes annotated with @RequireCapability('...'). Looks up the caller's
 * role in the target workspace and checks the capability level is not 'none'.
 */
@Injectable()
export class CapabilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const capability = this.reflector.getAllAndOverride<string>(CAPABILITY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!capability) return true;

    const req = context.switchToHttp().getRequest();
    const user: AuthUser | undefined = req.user;
    if (!user) throw new ForbiddenException('Not authenticated');
    if (user.isSuperAdmin) return true;

    const wsId: string | undefined = req.params?.wsId ?? req.params?.workspaceId;
    const membership = wsId
      ? user.memberships.find((m) => m.workspaceId === wsId)
      : user.memberships[0];
    if (!membership) throw new ForbiddenException('No role in this workspace');

    const perm = await this.prisma.rolePermission.findUnique({
      where: { roleId_capability: { roleId: membership.roleId, capability } },
    });
    if (!perm || perm.level === 'none') {
      throw new ForbiddenException(`Your role cannot: ${capability}`);
    }
    return true;
  }
}
