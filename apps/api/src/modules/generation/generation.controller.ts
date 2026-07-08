import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { IsIn, IsOptional, IsString, IsInt } from 'class-validator';
import { GenerationService } from './generation.service';
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

// Workspace-scoped generation. The global TenantGuard enforces membership.
@Controller('ws/:wsId')
export class GenerationController {
  constructor(private gen: GenerationService) {}

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
