import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { authenticator } from 'otplib';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './auth.dto';
import { JwtPayload, MembershipClaim } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  private async buildMembershipClaims(userId: string): Promise<MembershipClaim[]> {
    const memberships = await this.prisma.membership.findMany({ where: { userId } });
    return memberships.map((m) => ({
      workspaceId: m.workspaceId,
      roleId: m.roleId,
      assignedAccountIds: m.assignedAccountIds,
    }));
  }

  private async issueTokens(user: { id: string; email: string; name: string }, memberships: MembershipClaim[]) {
    const base = { sub: user.id, email: user.email, name: user.name, memberships };
    const accessToken = await this.jwt.signAsync(
      { ...base, type: 'access' } as JwtPayload,
      { secret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me', expiresIn: process.env.JWT_ACCESS_TTL || '15m' },
    );
    const refreshToken = await this.jwt.signAsync(
      { ...base, type: 'refresh' } as JwtPayload,
      { secret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me', expiresIn: process.env.JWT_REFRESH_TTL || '30d' },
    );
    return { accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid email or password');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid email or password');

    if (user.status === 'disabled') throw new UnauthorizedException('Account disabled');

    if (user.totpEnabled) {
      if (!dto.totp) throw new UnauthorizedException('2FA code required');
      const valid = user.totpSecret && authenticator.verify({ token: dto.totp, secret: user.totpSecret });
      if (!valid) throw new UnauthorizedException('Invalid 2FA code');
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } });

    const memberships = await this.buildMembershipClaims(user.id);
    const tokens = await this.issueTokens(user, memberships);
    return { ...tokens, user: this.publicUser(user, memberships) };
  }

  async refresh(refreshToken: string) {
    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (payload.type !== 'refresh') throw new UnauthorizedException('Wrong token type');

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException('User not found');
    const memberships = await this.buildMembershipClaims(user.id);
    const tokens = await this.issueTokens(user, memberships);
    return { ...tokens, user: this.publicUser(user, memberships) };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    const memberships = await this.buildMembershipClaims(user.id);
    return this.publicUser(user, memberships);
  }

  private publicUser(
    user: { id: string; name: string; email: string; totpEnabled: boolean },
    memberships: MembershipClaim[],
  ) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      twoFactorEnabled: user.totpEnabled,
      isSuperAdmin: memberships.some((m) => m.roleId === 'superadmin'),
      memberships,
    };
  }
}
