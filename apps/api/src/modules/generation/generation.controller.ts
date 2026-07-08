import { Body, Controller, Get, Param, Post, Res, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { IsIn, IsOptional, IsString, IsInt } from 'class-validator';
import { GenerationService } from './generation.service';
import { IngestService, UploadFile } from './ingest.service';
import { CurrentUser, Public, RequireCapability } from '../../common/decorators';
import { AuthUser } from '../../auth/auth.types';

class GenerateDto {
  @IsOptional() @IsString() accountId?: string;
  @IsIn(['EBR', 'QBR']) kind!: 'EBR' | 'QBR';
  @IsOptional() @IsString() templateId?: string;
  @IsOptional() @IsString() quarter?: string;
  @IsOptional() @IsString() period?: string;
}

class ShareDto {
  @IsOptional() @IsInt() expiresDays?: number;
}

@Controller('ws/:wsId')
export class GenerationController {
  constructor(
    private gen: GenerationService,
    private ingest: IngestService,
  ) {}

  @RequireCapability('Generate reviews')
  @Post('reviews/generate')
  generate(@Param('wsId') wsId: string, @CurrentUser() user: AuthUser, @Body() dto: GenerateDto) {
    return this.gen.generate(wsId, user.userId, dto);
  }

  @Get('reviews/:id/deck')
  deck(@Param('wsId') wsId: string, @Param('id') id: string) {
    return this.gen.deck(wsId, id);
  }

  @RequireCapability('Generate reviews')
  @Post('reviews/:id/share')
  share(@Param('wsId') wsId: string, @Param('id') id: string, @Body() dto: ShareDto) {
    return this.gen.createShare(wsId, id, dto.expiresDays);
  }

  // Ingest the Experience.com reports (up to 4 xlsx/csv) for a review.
  @RequireCapability('Generate reviews')
  @Post('reviews/:id/uploads')
  @UseInterceptors(FilesInterceptor('files', 4, { limits: { fileSize: 10 * 1024 * 1024 } }))
  uploads(@Param('wsId') wsId: string, @Param('id') id: string, @UploadedFiles() files: UploadFile[]) {
    return this.ingest.storeUploads(wsId, id, files ?? []);
  }

  @Get('reviews/:id/uploads')
  listUploads(@Param('wsId') wsId: string, @Param('id') id: string) {
    return this.ingest.listUploads(wsId, id);
  }
}

// Public L3 delivery — a shared review deck, no login required.
@Controller('share')
export class ShareController {
  constructor(private gen: GenerationService) {}

  @Public()
  @Get(':token')
  async view(@Param('token') token: string, @Res() res: Response) {
    try {
      const html = await this.gen.resolveShare(token);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(html);
    } catch (e: any) {
      res.status(410).setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(`<!doctype html><meta charset="utf-8"><body style="font-family:system-ui;padding:48px;color:#5A6180"><h2>Link unavailable</h2><p>${e?.message || 'This link is no longer valid.'}</p></body>`);
    }
  }
}
