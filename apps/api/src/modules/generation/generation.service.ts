import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../../prisma/prisma.service';

export interface GenerateInput {
  accountId?: string;
  kind: 'EBR' | 'QBR';
  templateId?: string;
  quarter?: string;
  period?: string;
}

@Injectable()
export class GenerationService {
  constructor(private prisma: PrismaService) {}

  // Pick the locked template for a review. For Experience.com EBRs we choose
  // Single/Multi × SRP550/SRP850 from the account's contract; otherwise fall
  // back to an explicit templateId or the first catalog template of that kind.
  private async pickTemplate(workspaceId: string, input: GenerateInput, account: any | null) {
    if (input.templateId) {
      const t = await this.prisma.template.findUnique({ where: { id: input.templateId } });
      if (t) return t;
    }
    if (input.kind === 'EBR' && account?.srpTier) {
      const structure = account.structure === 'multi' ? 'multi' : 'single';
      const sys = await this.prisma.template.findFirst({
        where: { workspaceId, system: true, kind: 'EBR', structure, tier: account.srpTier },
      });
      if (sys) return sys;
    }
    // Fallback: a catalog template of the requested kind.
    return this.prisma.template.findFirst({
      where: { kind: input.kind, workspaceId: null },
      orderBy: { name: 'asc' },
    });
  }

  async generate(workspaceId: string, ownerId: string, input: GenerateInput) {
    if (input.kind !== 'EBR' && input.kind !== 'QBR') throw new BadRequestException('kind must be EBR or QBR');

    const account = input.accountId
      ? await this.prisma.account.findFirst({ where: { id: input.accountId, workspaceId } })
      : null;
    if (input.accountId && !account) throw new NotFoundException('Account not found in this workspace');

    const template = await this.pickTemplate(workspaceId, input, account);

    const review = await this.prisma.review.create({
      data: {
        workspaceId,
        accountId: account?.id ?? null,
        kind: input.kind,
        templateId: template?.id ?? null,
        templateName: template?.name ?? null,
        structure: account?.structure ?? template?.structure ?? null,
        tier: account?.srpTier ?? template?.tier ?? null,
        status: 'published',
        ownerId,
        quarter: input.quarter ?? null,
      },
      include: { account: { select: { name: true, logo: true } }, template: { select: { name: true } } },
    });

    await this.prisma.auditLog.create({
      data: { actorId: ownerId, workspaceId, action: 'review.generate', entity: `review:${review.id}`, meta: { kind: input.kind } },
    });

    return review;
  }

  // The interactive deck HTML for a review (from the locked template).
  async deck(workspaceId: string, reviewId: string) {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, workspaceId },
      include: { template: true, account: { select: { name: true } } },
    });
    if (!review) throw new NotFoundException('Review not found');

    const html = review.template?.htmlSource || this.fallbackDeck(review.account?.name ?? 'Account', review.kind);
    return { html, name: review.templateName, account: review.account?.name ?? null };
  }

  async createShare(workspaceId: string, reviewId: string, expiresDays?: number) {
    const review = await this.prisma.review.findFirst({ where: { id: reviewId, workspaceId } });
    if (!review) throw new NotFoundException('Review not found');
    const token = randomBytes(18).toString('hex');
    const expiresAt = expiresDays ? new Date(Date.now() + expiresDays * 86400000) : null;
    await this.prisma.shareLink.create({ data: { reviewId, token, expiresAt } });
    const base = process.env.PUBLIC_API_URL || `http://localhost:${process.env.API_PORT || 4000}`;
    return { url: `${base}/api/share/${token}`, token, expiresAt };
  }

  // Public (L3) — resolve a share token to the deck HTML.
  async resolveShare(token: string) {
    const link = await this.prisma.shareLink.findUnique({
      where: { token },
      include: { review: { include: { template: true, account: { select: { name: true } } } } },
    });
    if (!link) throw new NotFoundException('Link not found');
    if (link.expiresAt && link.expiresAt < new Date()) throw new BadRequestException('This link has expired');
    const r = link.review;
    return r.template?.htmlSource || this.fallbackDeck(r.account?.name ?? 'Account', r.kind);
  }

  private fallbackDeck(account: string, kind: string) {
    return `<!doctype html><html><head><meta charset="utf-8"><title>${kind} — ${account}</title>
<style>body{font-family:'Instrument Sans',system-ui,sans-serif;background:#F4F6FB;color:#10152A;margin:0;padding:48px;}
.card{max-width:820px;margin:0 auto;background:#fff;border:1px solid #E6E9F2;border-radius:20px;padding:44px;box-shadow:0 24px 60px rgba(16,21,42,.10);}
h1{font-family:'Space Grotesk',sans-serif;font-size:30px;margin:0 0 6px;} .k{color:#7C5CE6;font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:12px;}
p{color:#5A6180;line-height:1.6;}</style></head>
<body><div class="card"><div class="k">${kind}</div><h1>${account}</h1>
<p>This is a generated ${kind} summary. The full data-driven, template-filled deck (with charts, NPS, Search Rank scoring and sentiment themes) is produced by the analysis engine — wired next as the pipeline is completed.</p>
</div></body></html>`;
  }
}
