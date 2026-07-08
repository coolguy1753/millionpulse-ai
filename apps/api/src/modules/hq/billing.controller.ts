import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SuperAdminOnly } from '../../common/decorators';

// GET /billing/subscriptions — per-client billing (HQ Billing & Plans).
@SuperAdminOnly()
@Controller('billing')
export class BillingController {
  constructor(private prisma: PrismaService) {}

  @Get('subscriptions')
  async subscriptions() {
    const subs = await this.prisma.subscription.findMany({
      include: { client: { select: { name: true, logo: true, plan: true, status: true } } },
      orderBy: { arr: 'desc' },
    });
    const rows = subs.map((s) => ({
      id: s.id,
      client: s.client.name,
      logo: s.client.logo,
      plan: s.plan,
      seats: s.seats,
      mrr: s.mrr,
      arr: s.arr,
      billingStatus: s.billingStatus,
      renewalDate: s.renewalDate,
      clientStatus: s.client.status,
    }));
    const totals = {
      mrr: rows.reduce((a, r) => a + r.mrr, 0),
      arr: rows.reduce((a, r) => a + r.arr, 0),
      seats: rows.reduce((a, r) => a + r.seats, 0),
      clients: rows.length,
    };
    return { totals, rows };
  }
}
