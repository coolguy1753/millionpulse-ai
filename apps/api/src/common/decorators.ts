import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { AuthUser } from '../auth/auth.types';

/** Inject the authenticated principal: `@CurrentUser() user: AuthUser`. */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): AuthUser => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});

/** Mark a route as public (skips JwtAuthGuard). */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/** Require the caller to be an HQ super-admin. */
export const SUPERADMIN_KEY = 'requireSuperAdmin';
export const SuperAdminOnly = () => SetMetadata(SUPERADMIN_KEY, true);

/**
 * Require a capability from the permission matrix for the target workspace,
 * e.g. @RequireCapability('Generate reviews'). Enforced by CapabilityGuard.
 */
export const CAPABILITY_KEY = 'requireCapability';
export const RequireCapability = (capability: string) => SetMetadata(CAPABILITY_KEY, capability);
