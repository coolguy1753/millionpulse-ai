import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { HqModule } from './modules/hq/hq.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { JwtAuthGuard, TenantGuard, CapabilityGuard } from './common/guards';

@Module({
  imports: [PrismaModule, AuthModule, ClientsModule, HqModule, WorkspaceModule],
  providers: [
    // Order matters: authenticate → resolve/authorize tenant → check capability.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: TenantGuard },
    { provide: APP_GUARD, useClass: CapabilityGuard },
  ],
})
export class AppModule {}
