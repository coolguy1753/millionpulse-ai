import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SuperAdminOnly } from '../../common/decorators';

@SuperAdminOnly()
@Controller('verticals')
export class VerticalsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list() {
    const verticals = await this.prisma.vertical.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { clients: true, blueprints: true } } },
    });
    return verticals.map((v) => ({
      id: v.id,
      name: v.name,
      icon: v.icon,
      color: v.color,
      status: v.status,
      clients: v._count.clients,
      blueprints: v._count.blueprints,
    }));
  }
}
