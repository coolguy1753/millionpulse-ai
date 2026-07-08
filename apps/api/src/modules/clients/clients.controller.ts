import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SuperAdminOnly } from '../../common/decorators';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

class CreateClientDto {
  @IsString() name!: string;
  @IsString() domain!: string;
  @IsOptional() @IsString() logo?: string;
  @IsOptional() @IsString() verticalId?: string;
  @IsOptional() @IsString() plan?: string;
  @IsOptional() @IsString() region?: string;
  @IsOptional() @IsInt() @Min(0) arr?: number;
  @IsOptional() @IsString() lead?: string;
}

class UpdateClientDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() plan?: string;
  @IsOptional() @IsString() region?: string;
  @IsOptional() @IsInt() @Min(0) arr?: number;
  @IsOptional() @IsString() status?: string;
  @IsOptional() @IsString() lead?: string;
  @IsOptional() @IsInt() onboardingProgress?: number;
}

// All HQ (L1) — super-admin only.
@SuperAdminOnly()
@Controller('clients')
export class ClientsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async list() {
    const clients = await this.prisma.client.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        vertical: true,
        workspace: { include: { _count: { select: { accounts: true } } } },
      },
    });
    // Shape to match the prototype's clients list.
    return clients.map((c) => ({
      id: c.id,
      name: c.name,
      domain: c.domain,
      logo: c.logo,
      vertical: c.vertical?.name ?? null,
      plan: c.plan,
      arr: c.arr,
      status: c.status,
      region: c.region,
      lead: c.lead,
      onboarded: c.onboardingProgress,
      hasWorkspace: !!c.workspace,
      workspaceId: c.workspace?.id ?? null,
      accounts: c.workspace?._count.accounts ?? 0,
    }));
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const c = await this.prisma.client.findUnique({
      where: { id },
      include: { vertical: true, subscription: true, workspace: { include: { _count: { select: { accounts: true, reviews: true, memberships: true } } } } },
    });
    return c;
  }

  @Post()
  async create(@Body() dto: CreateClientDto) {
    const org = await this.prisma.organization.findFirst();
    return this.prisma.client.create({
      data: {
        name: dto.name,
        domain: dto.domain.toLowerCase(),
        logo: dto.logo,
        verticalId: dto.verticalId,
        plan: dto.plan,
        region: dto.region,
        arr: dto.arr ?? 0,
        lead: dto.lead,
        status: 'onboarding',
        organizationId: org!.id,
      },
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.prisma.client.update({ where: { id }, data: { ...dto, status: dto.status as any } });
  }
}
