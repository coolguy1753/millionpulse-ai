import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser, JwtPayload } from './auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me',
    });
  }

  // Return value becomes req.user.
  async validate(payload: JwtPayload): Promise<AuthUser> {
    const isSuperAdmin = payload.memberships.some((m) => m.roleId === 'superadmin');
    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
      isSuperAdmin,
      memberships: payload.memberships,
    };
  }
}
