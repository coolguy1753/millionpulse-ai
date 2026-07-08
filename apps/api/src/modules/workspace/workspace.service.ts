import { Injectable } from '@nestjs/common';
import { PrismaService, TenantContext } from '../../prisma/prisma.service';

@Injectable()
export class WorkspaceService {
  constructor(private prisma: PrismaService) {}

  private ctxFor(wsId: string, isSuperAdmin: boolean): TenantContext {
    return { workspaceId: wsId, isSuperAdmin };
  }

  async accounts(wsId: string, isSuperAdmin: boolean) {
    return this.prisma.withTenant(this.ctxFor(wsId, isSuperAdmin), (tx) =>
      tx.account.findMany({
        where: { workspaceId: wsId },
        orderBy: { arr: 'desc' },
        include: { csm: { select: { name: true } }, srSpecialist: { select: { name: true } } },
      }),
    );
  }

  async reviews(wsId: string, isSuperAdmin: boolean) {
    return this.prisma.withTenant(this.ctxFor(wsId, isSuperAdmin), (tx) =>
      tx.review.findMany({
        where: { workspaceId: wsId },
        orderBy: { createdAt: 'desc' },
        include: { account: { select: { name: true, logo: true } }, owner: { select: { name: true } } },
      }),
    );
  }

  async templates(wsId: string, isSuperAdmin: boolean) {
    // Workspace-scoped templates + the shared catalog (workspaceId null).
    return this.prisma.withTenant(this.ctxFor(wsId, isSuperAdmin), () =>
      this.prisma.template.findMany({
        where: { OR: [{ workspaceId: wsId }, { workspaceId: null }] },
        orderBy: [{ system: 'desc' }, { kind: 'asc' }, { name: 'asc' }],
      }),
    );
  }

  async sources(wsId: string, isSuperAdmin: boolean) {
    return this.prisma.withTenant(this.ctxFor(wsId, isSuperAdmin), (tx) =>
      tx.dataSourceConnection.findMany({ where: { workspaceId: wsId }, orderBy: { category: 'asc' } }),
    );
  }

  async dashboard(wsId: string, isSuperAdmin: boolean) {
    const accounts = await this.accounts(wsId, isSuperAdmin);
    const reviews = await this.reviews(wsId, isSuperAdmin);

    const totalArr = accounts.reduce((s, a) => s + a.arr, 0);
    const avgHealth = accounts.length
      ? Math.round(accounts.reduce((s, a) => s + (a.health ?? 0), 0) / accounts.length)
      : 0;
    const healthDist = {
      healthy: accounts.filter((a) => (a.health ?? 0) >= 75).length,
      watch: accounts.filter((a) => (a.health ?? 0) >= 60 && (a.health ?? 0) < 75).length,
      atRisk: accounts.filter((a) => (a.health ?? 0) < 60).length,
    };
    const reviewsDue = accounts.filter((a) => {
      if (!a.autoRenewalDate) return false;
      const days = (a.autoRenewalDate.getTime() - Date.now()) / 86400000;
      return days <= 90; // inside the 90-day EBR window
    }).length;

    return {
      kpis: {
        accounts: accounts.length,
        totalArr,
        avgHealth,
        reviewsDue,
        publishedReviews: reviews.filter((r) => r.status === 'published').length,
      },
      healthDist,
      accounts,
      recentReviews: reviews.slice(0, 5),
    };
  }
}
