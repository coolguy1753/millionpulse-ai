import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// The permission matrix is reference data — any authenticated user may read it
// (it powers the Team & Roles "Roles & permissions" screen at both L1 and L2).
@Controller('roles')
export class RolesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list() {
    const roles = await this.prisma.role.findMany({ include: { permissions: true } });
    // Stable capability order (matches clients.js `caps`).
    const caps = [
      'View dashboards',
      'Manage accounts',
      'Generate reviews',
      'Manage templates',
      'Connect data sources',
      'Manage users',
      'Billing & plan',
    ];
    const order = ['superadmin', 'wsadmin', 'csm', 'srs', 'viewer'];
    const levelToNum = { none: 0, partial: 1, full: 2 } as const;
    const sorted = roles.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

    return {
      caps,
      roles: sorted.map((r) => ({
        id: r.id,
        name: r.name,
        scope: r.scope,
        color: r.color,
        description: r.description,
        matrix: caps.map((c) => {
          const p = r.permissions.find((x) => x.capability === c);
          return levelToNum[(p?.level ?? 'none') as keyof typeof levelToNum];
        }),
      })),
    };
  }
}
