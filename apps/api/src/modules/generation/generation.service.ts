import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
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
    return this.prisma.template.findFirst({ where: { kind: input.kind, workspaceId: null }, orderBy: { name: 'asc' } });
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

  async deck(workspaceId: string, reviewId: string) {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, workspaceId },
      include: {
        account: true,
        template: { select: { name: true, htmlSource: true, system: true } },
        workspace: { select: { name: true, accent: true } },
        uploads: { orderBy: { uploadedAt: 'asc' } },
      },
    });
    if (!review) throw new NotFoundException('Review not found');
    // Prefer the locked template (the real Experience.com EBR HTML). Only fall
    // back to the generic data-driven deck when no locked template exists.
    const full = review.template?.htmlSource || this.buildDeck(review);
    const onePagerHtml = this.onePager() || this.buildDeck(review);
    return { html: full, onePagerHtml, name: review.templateName, account: review.account?.name ?? null };
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

  async resolveShare(token: string) {
    const link = await this.prisma.shareLink.findUnique({
      where: { token },
      include: {
        review: {
          include: {
            account: true,
            workspace: { select: { name: true, accent: true } },
            template: { select: { name: true, htmlSource: true, system: true } },
            uploads: { orderBy: { uploadedAt: 'asc' } },
          },
        },
      },
    });
    if (!link) throw new NotFoundException('Link not found');
    if (link.expiresAt && link.expiresAt < new Date()) throw new BadRequestException('This link has expired');
    const r = link.review;
    return r.template?.htmlSource || this.buildDeck(r);
  }

  // The locked 1-page summary template (read from ebr-templates, memoized).
  private _onePager: string | null | undefined;
  private onePager(): string | null {
    if (this._onePager !== undefined) return this._onePager;
    try {
      const p = join(process.cwd(), '..', '..', 'ebr-templates', 'EBR-OnePager-Summary.html');
      this._onePager = existsSync(p) ? readFileSync(p, 'utf8') : null;
    } catch {
      this._onePager = null;
    }
    return this._onePager;
  }

  // ---------- Data-driven deck builder ----------
  private buildDeck(review: any): string {
    const a = review.account;
    const accent = review.workspace?.accent || '#7C5CE6';
    const wsName = review.workspace?.name || 'Workspace';
    const money = (n: number) =>
      n >= 1_000_000 ? '$' + (n / 1_000_000).toFixed(2).replace(/\.00$/, '') + 'M' : n >= 1000 ? '$' + Math.round(n / 1000) + 'K' : '$' + (n || 0);
    const fmtDate = (d: any) => (d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—');
    const healthLabel = (h: number) => (h >= 75 ? 'Healthy' : h >= 60 ? 'Watch' : 'At risk');
    const healthColor = (h: number) => (h >= 75 ? '#12B886' : h >= 60 ? '#F5A524' : '#F0455F');

    const name = a?.name || 'Account';
    const health = a?.health ?? 0;
    const nps = a?.nps ?? 0;
    const adoption = a?.adoption != null ? Math.round(a.adoption * 100) : 0;
    const promoters = Math.max(0, Math.min(100, Math.round((nps + 100) / 2)));
    const renewalDays = a?.autoRenewalDate ? Math.ceil((new Date(a.autoRenewalDate).getTime() - Date.now()) / 86400000) : null;
    const posture = a?.posture || (health >= 75 ? 'Protect — strong footing, secure the renewal' : 'Close — recover engagement and rebuild value');

    const metric = (label: string, value: string, sub = '', color = accent) => `
      <div class="m">
        <div class="m-l">${label}</div>
        <div class="m-v" style="color:${color}">${value}</div>
        ${sub ? `<div class="m-s">${sub}</div>` : ''}
      </div>`;

    const bar = (label: string, pct: number, color: string) => `
      <div class="bar-row"><span>${label}</span><span class="bar-num">${pct}</span></div>
      <div class="bar"><i style="width:${Math.max(2, Math.min(100, pct))}%;background:${color}"></i></div>`;

    const brands = a?.brands?.length ? a.brands.join(' · ') : null;

    // Ingested reports (uploaded xlsx/csv) → summary section + NPS override.
    const uploads: any[] = review.uploads || [];
    let ingestedNps: number | null = null;
    for (const u of uploads) {
      const m = (u.parsedJson && u.parsedJson.metrics) || {};
      if (typeof m.avgNps === 'number') ingestedNps = m.avgNps;
    }
    const ingestedSlide = uploads.length
      ? `<div class="slide"><h2>Ingested reports</h2>
        <p class="lead">${uploads.length} report${uploads.length > 1 ? 's' : ''} parsed and analyzed for this review.</p>
        <div class="grid3" style="margin-top:6px">
        ${uploads
          .map((u) => {
            const p = u.parsedJson || {};
            const m = p.metrics || {};
            const bits = Object.entries(m).map(([k, v]) => `${k}: <b>${v}</b>`).join(' · ') || 'parsed';
            return `<div class="m"><div class="m-l">${(u.kind || 'report').toUpperCase()}</div><div class="m-v" style="font-size:15px">${u.filename}</div><div class="m-s">${p.rowCount ?? 0} rows · ${bits}</div></div>`;
          })
          .join('')}
        </div></div>`
      : '';

    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${review.kind} — ${name}</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box} body{margin:0;font-family:'Instrument Sans',system-ui,sans-serif;background:#F4F6FB;color:#10152A}
  .wrap{max-width:900px;margin:0 auto;padding:28px}
  .slide{background:#fff;border:1px solid #E6E9F2;border-radius:20px;box-shadow:0 4px 16px rgba(16,21,42,.06);padding:36px 40px;margin-bottom:22px}
  h1{font-family:'Space Grotesk',sans-serif;font-size:38px;letter-spacing:-.02em;margin:0}
  h2{font-family:'Space Grotesk',sans-serif;font-size:20px;letter-spacing:-.01em;margin:0 0 16px}
  .cover{background:linear-gradient(120deg,#14C6EE,${accent});color:#fff;border:none}
  .k{font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;opacity:.9}
  .cover h1{color:#fff;font-size:42px;margin-top:8px}
  .cover p{color:rgba(255,255,255,.9);font-size:16px;margin:14px 0 0}
  .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
  .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .m{background:#FAFBFE;border:1px solid #EEF1F8;border-radius:14px;padding:16px}
  .m-l{font-size:12px;font-weight:600;color:#5A6180}
  .m-v{font-family:'Space Grotesk',sans-serif;font-size:26px;font-weight:600;margin-top:6px}
  .m-s{font-size:12px;color:#8B92AC;margin-top:2px}
  .bar-row{display:flex;justify-content:space-between;font-size:13px;font-weight:600;margin:14px 0 6px}
  .bar-num{font-variant-numeric:tabular-nums}
  .bar{height:8px;border-radius:8px;background:#EEF1F8;overflow:hidden}
  .bar>i{display:block;height:100%;border-radius:8px}
  p.lead{font-size:15px;line-height:1.7;color:#3a4160}
  .pill{display:inline-block;padding:5px 12px;border-radius:20px;font-size:13px;font-weight:600}
  ul{margin:8px 0 0;padding-left:18px;line-height:1.8;color:#3a4160}
  .foot{text-align:center;color:#8B92AC;font-size:12px;padding:8px 0 20px}
  .tag{display:inline-block;background:#EEF1F8;color:#5A6180;font-size:12px;font-weight:600;padding:3px 10px;border-radius:6px;margin-right:6px}
</style></head><body><div class="wrap">

  <div class="slide cover">
    <div class="k">${review.kind} · ${review.quarter || ''}</div>
    <h1>${name}</h1>
    <p>${wsName} — Executive review generated from live account data. Template: ${review.templateName || 'Standard'}.</p>
  </div>

  <div class="slide">
    <h2>Executive summary</h2>
    <p class="lead">${name} is currently <b>${healthLabel(health)}</b> with a health score of <b>${health}</b>, an NPS of <b>${nps}</b>, and <b>${adoption}%</b> product adoption across <b>${(a?.seats || 0).toLocaleString()}</b> seats. Annual contract value stands at <b>${money(a?.arr || 0)}</b>${brands ? `, spanning ${a.brands.length} brands (${brands})` : ''}. Strategic posture: <b>${posture}</b>.</p>
    <div class="grid" style="margin-top:18px">
      ${metric('Health', String(health), healthLabel(health), healthColor(health))}
      ${metric('NPS', String(nps), `${promoters}% promoters`, accent)}
      ${metric('Adoption', adoption + '%', 'of contracted seats')}
      ${metric('ARR', money(a?.arr || 0), (a?.tier || '') + ' tier')}
    </div>
  </div>

  <div class="slide">
    <h2>Engagement &amp; adoption</h2>
    ${bar('Health score', health, healthColor(health))}
    ${bar('Product adoption', adoption, accent)}
    ${bar('Promoter share (from NPS)', promoters, '#14C6EE')}
    <p class="lead" style="margin-top:16px">Open support tickets this period: <b>${a?.tickets ?? 0}</b>. Region: <b>${a?.region || '—'}</b>. CSM: <b>${a?.csmId ? 'assigned' : '—'}</b>.</p>
  </div>

  <div class="slide">
    <h2>Contract &amp; renewal</h2>
    <div class="grid3">
      ${metric('Auto-renewal', fmtDate(a?.autoRenewalDate), renewalDays != null ? (renewalDays >= 0 ? `in ${renewalDays} days` : 'passed') : '')}
      ${metric('Term start', fmtDate(a?.termStartDate))}
      ${metric('Seats', (a?.seats || 0).toLocaleString(), a?.srpTier || '')}
    </div>
    ${renewalDays != null && renewalDays <= 90 && renewalDays >= 0 ? `<p class="lead" style="margin-top:16px"><span class="pill" style="background:#FDF1DD;color:#A56A05">EBR window open</span> &nbsp;This account is within the 90-day pre-renewal window — now is the time to align on value and secure the renewal.</p>` : ''}
  </div>

  <div class="slide">
    <h2>Recommendations</h2>
    <div style="margin-bottom:10px">${(a?.brands || []).map((b: string) => `<span class="tag">${b}</span>`).join('')}</div>
    <ul>
      ${health >= 75 ? '<li>Codify what is working into a repeatable success plan and reference story.</li>' : '<li>Launch a focused engagement plan to lift adoption and health before renewal.</li>'}
      ${nps >= 60 ? '<li>Activate promoters for references, reviews, and expansion conversations.</li>' : '<li>Close the loop with detractors; address top themes driving low NPS.</li>'}
      ${adoption < 75 ? '<li>Drive feature adoption with targeted enablement for underused seats.</li>' : '<li>Explore expansion into adjacent teams given strong adoption.</li>'}
      <li>Confirm renewal timeline and align stakeholders ahead of ${fmtDate(a?.autoRenewalDate)}.</li>
    </ul>
  </div>

  ${ingestedSlide}

  <div class="foot">Generated by MillionPulse AI · ${wsName} · Confidential${ingestedNps != null ? ` · NPS from ingested report: ${ingestedNps}` : ''}</div>
</div></body></html>`;
  }
}
