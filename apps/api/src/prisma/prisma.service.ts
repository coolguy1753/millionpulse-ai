import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Tenant context bound to a request. workspaceId null + isSuperAdmin true
 * means "HQ / see everything".
 */
export interface TenantContext {
  workspaceId: string | null;
  isSuperAdmin: boolean;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Run a set of queries inside a transaction that has the Postgres RLS
   * session variables set (see prisma/rls.sql). This is the DB-level
   * enforcement layer; the app-level TenantGuard is the first line.
   *
   * Usage:
   *   return this.prisma.withTenant(ctx, (tx) => tx.account.findMany());
   */
  async withTenant<T>(
    ctx: TenantContext,
    fn: (tx: Omit<PrismaClient, '$transaction' | '$connect' | '$disconnect' | '$on' | '$use' | '$extends'>) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(async (tx) => {
      const ws = ctx.workspaceId ?? '';
      const su = ctx.isSuperAdmin ? 'on' : 'off';
      // set_config(name, value, is_local=true) → scoped to this transaction.
      await tx.$executeRawUnsafe(`SELECT set_config('app.workspace_id', $1, true)`, ws);
      await tx.$executeRawUnsafe(`SELECT set_config('app.is_superadmin', $1, true)`, su);
      return fn(tx);
    });
  }
}
