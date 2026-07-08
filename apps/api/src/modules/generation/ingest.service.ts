import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { PrismaService } from '../../prisma/prisma.service';

export interface UploadFile {
  originalname: string;
  buffer: Buffer;
}

export interface ParsedSummary {
  kind: string;
  sheet: string;
  headers: string[];
  rowCount: number;
  metrics: Record<string, number>;
  sample: Record<string, unknown>[];
}

@Injectable()
export class IngestService {
  constructor(private prisma: PrismaService) {}

  private detectKind(filename: string): string {
    const n = filename.toLowerCase();
    if (n.includes('nps')) return 'nps';
    if (n.includes('campaign')) return 'campaign';
    if (n.includes('survey')) return 'survey';
    if (n.includes('user')) return 'users';
    return 'generic';
  }

  private avgOf(rows: Record<string, any>[], match: RegExp): number | null {
    if (!rows.length) return null;
    const header = Object.keys(rows[0]).find((h) => match.test(h));
    if (!header) return null;
    const nums = rows.map((r) => Number(r[header])).filter((v) => Number.isFinite(v));
    if (!nums.length) return null;
    return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
  }

  // Tolerant parse: read the first sheet, detect a few useful aggregates.
  parse(filename: string, buffer: Buffer): ParsedSummary {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const sheet = wb.SheetNames[0] || 'Sheet1';
    const rows = (XLSX.utils.sheet_to_json(wb.Sheets[sheet] || {}, { defval: null }) as Record<string, any>[]) || [];
    const headers = rows.length ? Object.keys(rows[0]) : [];
    const kind = this.detectKind(filename);

    const metrics: Record<string, number> = {};
    const nps = this.avgOf(rows, /nps/i);
    if (nps != null) metrics.avgNps = nps;
    const score = this.avgOf(rows, /score|rating|csat/i);
    if (score != null) metrics.avgScore = score;
    const srs = this.avgOf(rows, /srs|search\s*rank/i);
    if (srs != null) metrics.avgSearchRank = srs;
    const completion = this.avgOf(rows, /complet|response\s*rate/i);
    if (completion != null) metrics.avgCompletion = completion;

    return { kind, sheet, headers, rowCount: rows.length, metrics, sample: rows.slice(0, 3) };
  }

  async storeUploads(workspaceId: string, reviewId: string, files: UploadFile[]) {
    const summaries: (ParsedSummary & { id: string; filename: string })[] = [];
    for (const f of files) {
      let parsed: ParsedSummary;
      try {
        parsed = this.parse(f.originalname, f.buffer);
      } catch {
        parsed = { kind: this.detectKind(f.originalname), sheet: '', headers: [], rowCount: 0, metrics: {}, sample: [] };
      }
      const rec = await this.prisma.upload.create({
        data: {
          workspaceId,
          reviewId,
          filename: f.originalname,
          kind: parsed.kind,
          parsedJson: parsed as any,
        },
      });
      summaries.push({ ...parsed, id: rec.id, filename: f.originalname });
    }
    await this.prisma.auditLog.create({
      data: { workspaceId, action: 'review.ingest', entity: `review:${reviewId}`, meta: { files: files.length } },
    });
    return summaries;
  }

  async listUploads(workspaceId: string, reviewId: string) {
    const uploads = await this.prisma.upload.findMany({
      where: { workspaceId, reviewId },
      orderBy: { uploadedAt: 'asc' },
    });
    return uploads.map((u) => ({ id: u.id, filename: u.filename, kind: u.kind, parsed: u.parsedJson }));
  }
}
