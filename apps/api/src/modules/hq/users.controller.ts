import { Body, Controller, Get, Post } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { SuperAdminOnly } from '../../common/decorators';
import { IsEmail, IsOptional, IsString } from 'class-validator';

class InviteDto {
  @IsEmail() email!: string;
  @IsString() roleId!: string;
  @IsOptional() @IsString() workspaceId?: string;
}

@SuperAdminOnly()
@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        memberships: { include: { role: true, workspace: { include: { client: true } } } },
      },
    });
    return users.map((u) => {
      const m = u.memberships[0];
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: m?.roleId ?? null,
        roleName: m?.role.name ?? null,
        client: m?.workspace?.client.name ?? (m?.roleId === 'superadmin' ? 'All clients' : '—'),
        status: u.status,
        last: u.lastActiveAt ? u.lastActiveAt.toISOString() : null,
      };
    });
  }

  @Post('invite')
  async invite(@Body() dto: InviteDto) {
    const token = randomBytes(24).toString('hex');
    const invite = await this.prisma.invite.create({
      data: {
        email: dto.email.toLowerCase(),
        roleId: dto.roleId,
        workspaceId: dto.workspaceId ?? null,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      },
    });
    // Also create a pending (invited) user record if not present.
    await this.prisma.user.upsert({
      where: { email: dto.email.toLowerCase() },
      update: {},
      create: { name: dto.email.split('@')[0], email: dto.email.toLowerCase(), status: 'invited' },
    });
    return { id: invite.id, email: invite.email, expiresAt: invite.expiresAt };
  }
}
