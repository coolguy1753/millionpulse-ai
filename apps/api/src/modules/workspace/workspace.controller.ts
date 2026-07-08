import { Controller, Get, Param } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../../common/decorators';
import { AuthUser } from '../../auth/auth.types';

/** GET /workspaces — the workspaces the caller can enter (for the switcher). */
@Controller('workspaces')
export class WorkspacesListController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list(@CurrentUser() user: AuthUser) {
    const where = user.isSuperAdmin
      ? {}
      : { id: { in: user.memberships.map((m) => m.workspaceId).filter(Boolean) as string[] } };
    const workspaces = await this.prisma.workspace.findMany({
      where,
      include: { client: { select: { name: true, logo: true, plan: true } } },
      orderBy: { name: 'asc' },
    });
    return workspaces.map((w) => ({
      id: w.id,
      name: w.name,
      short: w.short,
      accent: w.accent,
      industry: w.industry,
      logo: w.client.logo,
      plan: w.client.plan,
    }));
  }
}

/** GET /ws/:wsId/* — workspace-scoped reads. The global TenantGuard enforces access. */
@Controller('ws/:wsId')
export class WorkspaceController {
  constructor(private ws: WorkspaceService) {}

  @Get('dashboard')
  dashboard(@Param('wsId') wsId: string, @CurrentUser() user: AuthUser) {
    return this.ws.dashboard(wsId, user.isSuperAdmin);
  }

  @Get('accounts')
  accounts(@Param('wsId') wsId: string, @CurrentUser() user: AuthUser) {
    return this.ws.accounts(wsId, user.isSuperAdmin);
  }

  @Get('reviews')
  reviews(@Param('wsId') wsId: string, @CurrentUser() user: AuthUser) {
    return this.ws.reviews(wsId, user.isSuperAdmin);
  }

  @Get('templates')
  templates(@Param('wsId') wsId: string, @CurrentUser() user: AuthUser) {
    return this.ws.templates(wsId, user.isSuperAdmin);
  }

  @Get('sources')
  sources(@Param('wsId') wsId: string, @CurrentUser() user: AuthUser) {
    return this.ws.sources(wsId, user.isSuperAdmin);
  }
}
