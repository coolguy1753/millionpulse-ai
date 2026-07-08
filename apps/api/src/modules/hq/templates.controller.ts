import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SuperAdminOnly } from '../../common/decorators';

// GET /templates — the master template catalog (HQ Template Library).
@SuperAdminOnly()
@Controller('templates')
export class TemplatesCatalogController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list() {
    const templates = await this.prisma.template.findMany({
      orderBy: [{ system: 'desc' }, { kind: 'asc' }, { name: 'asc' }],
      include: {
        vertical: { select: { name: true } },
        workspace: { select: { name: true } },
        _count: { select: { reviews: true } },
      },
    });
    return templates.map((t) => ({
      id: t.id,
      name: t.name,
      kind: t.kind,
      version: t.version,
      status: t.status,
      system: t.system,
      structure: t.structure,
      tier: t.tier,
      description: t.description,
      use: t.use,
      vertical: t.vertical?.name ?? null,
      scope: t.workspace?.name ?? 'Shared catalog',
      usedByCount: t._count.reviews,
    }));
  }
}
