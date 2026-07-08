import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SuperAdminOnly } from '../../common/decorators';

// GET /reviews — global review log across ALL workspaces (HQ only).
@SuperAdminOnly()
@Controller('reviews')
export class GlobalReviewsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list() {
    const reviews = await this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        account: { select: { name: true, logo: true } },
        owner: { select: { name: true } },
        workspace: { select: { name: true, accent: true } },
      },
    });
    return reviews.map((r) => ({
      id: r.id,
      kind: r.kind,
      templateName: r.templateName,
      tier: r.tier,
      structure: r.structure,
      status: r.status,
      quarter: r.quarter,
      createdAt: r.createdAt,
      account: r.account?.name ?? null,
      accountLogo: r.account?.logo ?? null,
      owner: r.owner?.name ?? null,
      workspace: r.workspace?.name ?? null,
      workspaceAccent: r.workspace?.accent ?? null,
    }));
  }
}
