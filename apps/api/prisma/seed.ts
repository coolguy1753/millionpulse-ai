/* ============================================================
   MillionPulse AI — database seed
   Loads the prototype's mock data (data.js + clients.js) into
   Postgres so the app runs against real, tenant-scoped records.

   Login accounts created (password for all: "password123"):
     - priya@millionsquare.com        → Super Admin (L1 / HQ)
     - sarah.mitchell@experience.com  → Workspace Admin (L2 / Experience.com)
   ============================================================ */
import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const prisma = new PrismaClient();
const PWD = bcrypt.hashSync('password123', 10);

// ---------- Roles & permission matrix (clients.js) ----------
const CAPS = [
  'View dashboards',
  'Manage accounts',
  'Generate reviews',
  'Manage templates',
  'Connect data sources',
  'Manage users',
  'Billing & plan',
];
const LEVEL = ['none', 'partial', 'full'] as const;
const ROLES = [
  { id: 'superadmin', name: 'Super Admin', who: 'Million Square HQ', scope: 'All clients', color: '#5B4BE6', desc: 'Full platform access — clients, verticals, users, billing.', matrix: [2, 2, 2, 2, 2, 2, 2] },
  { id: 'wsadmin', name: 'Workspace Admin', who: 'Client lead', scope: 'One workspace', color: '#0E9F9A', desc: 'Runs their workspace: users, accounts, data, all reviews.', matrix: [2, 2, 2, 2, 2, 2, 0] },
  { id: 'csm', name: 'CSM', who: 'CS Manager', scope: 'Assigned accounts', color: '#2A6FDB', desc: 'Manages assigned accounts, generates EBRs & QBRs.', matrix: [2, 2, 2, 0, 2, 0, 0] },
  { id: 'srs', name: 'Search Rank Specialist', who: 'SEO / reviews', scope: 'Assigned accounts', color: '#F26430', desc: 'Owns Search Rank & review data, contributes to reviews.', matrix: [2, 1, 1, 0, 2, 0, 0] },
  { id: 'viewer', name: 'Viewer / Exec', who: 'Client executive', scope: 'Read-only', color: '#8B92AC', desc: 'Read-only access to dashboards & shared reviews.', matrix: [2, 0, 0, 0, 0, 0, 0] },
];

// ---------- Verticals ----------
const VERTICALS = [
  { key: 'mortgage', name: 'Mortgage & Lending', icon: 'home', color: '#5B4BE6', status: 'active' as const },
  { key: 'logistics', name: 'Logistics & Supply Chain', icon: 'truck', color: '#0E9F9A', status: 'active' as const },
  { key: 'healthtech', name: 'HealthTech', icon: 'heart', color: '#F0455F', status: 'planned' as const },
];

// ---------- Clients (clients.js) ----------
const CLIENTS = [
  { id: 'exp', name: 'Experience.com', domain: 'experience.com', logo: 'E', vertical: 'mortgage', plan: 'SRP550', arr: 4216000, status: 'active', region: 'NA', lead: 'Divyanshu Srivastava', onboarded: 100, hasWorkspace: true, industry: 'Reputation & CX SaaS', accent: '#5B4BE6', short: 'Experience' },
  { id: 'mil', name: 'Milltex', domain: 'milltex.io', logo: 'M', vertical: 'logistics', plan: 'Growth', arr: 3492000, status: 'active', region: 'APAC', lead: 'Aisha Khan', onboarded: 100, hasWorkspace: true, industry: 'Industrial & Supply-chain SaaS', accent: '#0E9F9A', short: 'Milltex' },
  { id: 'nfm', name: 'NFM Lending', domain: 'nfmlending.com', logo: 'NF', vertical: 'mortgage', plan: 'SRP850', arr: 540000, status: 'onboarding', region: 'NA', lead: 'Megha Upadhyay', onboarded: 60, hasWorkspace: false, industry: 'Mortgage & Lending', accent: '#5B4BE6', short: 'NFM' },
  { id: 'cedar', name: 'Cedar Health', domain: 'cedarhealth.io', logo: 'CH', vertical: 'healthtech', plan: 'Enterprise', arr: 0, status: 'prospect', region: 'NA', lead: null, onboarded: 15, hasWorkspace: false, industry: 'HealthTech', accent: '#F0455F', short: 'Cedar' },
];

// ---------- Known login users (clients.js) ----------
const KNOWN_USERS = [
  { name: 'Priya Nair', email: 'priya@millionsquare.com', role: 'superadmin', client: null, status: 'active', login: true },
  { name: 'Sarah Mitchell', email: 'sarah.mitchell@experience.com', role: 'wsadmin', client: 'exp', status: 'active', login: true },
  { name: 'Divyanshu Srivastava', email: 'divyanshu@millionsquare.com', role: 'csm', client: 'exp', status: 'active', login: true },
  { name: 'Alex Kent', email: 'alex.kent@experience.com', role: 'srs', client: 'exp', status: 'active', login: false },
  { name: 'Aisha Khan', email: 'aisha@millionsquare.com', role: 'csm', client: 'mil', status: 'active', login: true },
  { name: 'Diego Torres', email: 'diego@millionsquare.com', role: 'csm', client: 'mil', status: 'active', login: false },
  { name: 'Megha Upadhyay', email: 'megha@millionsquare.com', role: 'csm', client: 'nfm', status: 'invited', login: false },
  { name: 'Robert Lang', email: 'rlang@nfmlending.com', role: 'wsadmin', client: 'nfm', status: 'invited', login: false },
];

// ---------- Accounts ----------
type Acc = {
  name: string; logo: string; tier: string; arr: number; seats: number; health: number; trend: number;
  nps: number; tickets: number; adoption: number; region: string; csm: string; sr?: string;
  autoRenewal?: string; termStart?: string; srp?: string; structure?: 'single' | 'multi'; brands?: string[]; posture?: string;
};
const EXP_ACCOUNTS: Acc[] = [
  { name: 'TowneBank Mortgage', logo: 'TB', tier: 'Enterprise', arr: 412000, seats: 320, health: 92, trend: 3, nps: 97, tickets: 9, adoption: 0.93, region: 'NA', csm: 'Divyanshu Srivastava', sr: 'Alex Kent', autoRenewal: 'October 11, 2026', termStart: 'January 9, 2027', srp: 'SRP550', structure: 'single', brands: [], posture: 'Best-in-class · comfortable renewal' },
  { name: 'Atlantic Bay Mortgage Group', logo: 'AB', tier: 'Strategic', arr: 1120000, seats: 850, health: 90, trend: 2, nps: 96, tickets: 14, adoption: 0.9, region: 'NA', csm: 'Megha Upadhyay', sr: 'Marquis Cosby-Dorsey', autoRenewal: 'September 1, 2026', termStart: 'December 1, 2026', srp: 'SRP550', structure: 'multi', brands: ['Atlantic Bay', 'Coastal Lending', 'Summit Home Loans'], posture: 'Best-in-class multi-brand · expansion-ready' },
  { name: 'Synergy One Lending', logo: 'SO', tier: 'Strategic', arr: 960000, seats: 1240, health: 88, trend: 1, nps: 96, tickets: 18, adoption: 0.87, region: 'NA', csm: 'Niharika Vichhivora', sr: 'Travis Verner', autoRenewal: 'August 3, 2026', termStart: 'November 1, 2026', srp: 'SRP550', structure: 'single', brands: [], posture: 'Best-in-class at scale · light tuning' },
  { name: 'NOVA Home Loans', logo: 'NH', tier: 'Enterprise', arr: 688000, seats: 900, health: 85, trend: 4, nps: 95, tickets: 12, adoption: 0.86, region: 'NA', csm: 'Sumedha Dheeraj', sr: "Scott O'Hayre", autoRenewal: 'February 14, 2027', termStart: 'May 1, 2027', srp: 'SRP850', structure: 'single', brands: [], posture: 'Best-in-class at scale · codify playbooks' },
  { name: 'Fay Servicing', logo: 'FS', tier: 'Enterprise', arr: 236000, seats: 320, health: 74, trend: 9, nps: 90, tickets: 16, adoption: 0.7, region: 'NA', csm: 'Craig Pollack', sr: 'Alex Kent', autoRenewal: 'January 9, 2027', termStart: 'April 1, 2027', srp: 'SRP550', structure: 'multi', brands: ['Fay Servicing', 'Constructive Loans', 'GenStone'], posture: 'Year-1 deployment · ramping fast' },
  { name: 'Landmark Professional Mortgage', logo: 'LP', tier: 'Growth', arr: 184000, seats: 120, health: 71, trend: -2, nps: 95, tickets: 11, adoption: 0.72, region: 'NA', csm: 'Gabi Siguenza', sr: 'Marquis Cosby-Dorsey', autoRenewal: 'May 20, 2026', termStart: 'August 1, 2026', srp: 'SRP550', structure: 'single', brands: [], posture: 'External presence gap · hidden gem' },
  { name: 'Gray Fox Mortgage', logo: 'GF', tier: 'Growth', arr: 96000, seats: 40, health: 68, trend: -3, nps: 88, tickets: 8, adoption: 0.78, region: 'NA', csm: 'Lauren Gaddy', sr: 'Travis Verner', autoRenewal: 'July 15, 2026', termStart: 'October 1, 2026', srp: 'SRP550', structure: 'single', brands: [], posture: 'Boutique strength · single-LO coaching focus' },
  { name: 'Evolve Bank & Trust', logo: 'EB', tier: 'Enterprise', arr: 520000, seats: 600, health: 52, trend: -10, nps: 62, tickets: 41, adoption: 0.5, region: 'NA', csm: 'Nathan Campbell', sr: "Scott O'Hayre", autoRenewal: 'December 3, 2025', termStart: 'March 1, 2026', srp: 'SRP850', structure: 'single', brands: [], posture: 'Adoption gap · engagement crisis' },
];
const MIL_ACCOUNTS: Acc[] = [
  { name: 'Atlas Manufacturing', logo: 'AM', tier: 'Strategic', arr: 960000, seats: 1800, health: 49, trend: -8, nps: 28, tickets: 53, adoption: 0.47, region: 'APAC', csm: 'Aisha Khan', autoRenewal: 'December 15, 2025', termStart: 'March 1, 2026', structure: 'single' },
  { name: 'Northwind Logistics', logo: 'NL', tier: 'Enterprise', arr: 445000, seats: 720, health: 71, trend: 1, nps: 49, tickets: 22, adoption: 0.68, region: 'EMEA', csm: 'Diego Torres', autoRenewal: 'April 22, 2026', termStart: 'July 1, 2026', structure: 'single' },
  { name: 'Ironclad Steel', logo: 'IS', tier: 'Enterprise', arr: 602000, seats: 1100, health: 64, trend: -5, nps: 41, tickets: 34, adoption: 0.6, region: 'EMEA', csm: 'Aisha Khan', autoRenewal: 'February 18, 2026', termStart: 'May 1, 2026', structure: 'single' },
  { name: 'Loomcraft Textiles', logo: 'LT', tier: 'Growth', arr: 198000, seats: 360, health: 84, trend: 6, nps: 66, tickets: 9, adoption: 0.81, region: 'APAC', csm: 'Diego Torres', autoRenewal: 'June 30, 2026', termStart: 'September 1, 2026', structure: 'single' },
  { name: 'Vertex Industrial', logo: 'VI', tier: 'Strategic', arr: 1120000, seats: 2100, health: 88, trend: 3, nps: 69, tickets: 10, adoption: 0.86, region: 'NA', csm: 'Aisha Khan', autoRenewal: 'September 12, 2026', termStart: 'December 1, 2026', structure: 'single' },
  { name: 'Delta Components', logo: 'DC', tier: 'Growth', arr: 3900, seats: 290, health: 57, trend: -9, nps: 35, tickets: 38, adoption: 0.53, region: 'NA', csm: 'Diego Torres', autoRenewal: 'January 20, 2026', termStart: 'April 1, 2026', structure: 'single' },
];

// ---------- Reviews ----------
type Rev = { account: string; kind: 'EBR' | 'QBR'; template: string; structure?: string; tier?: string; status: string; date: string; owner: string; quarter: string };
const EXP_REVIEWS: Rev[] = [
  { account: 'TowneBank Mortgage', kind: 'EBR', template: 'Single-Account · SRP550', structure: 'single', tier: 'SRP550', status: 'published', date: 'Jun 28, 2026', owner: 'Divyanshu Srivastava', quarter: 'Q2 FY26' },
  { account: 'Atlantic Bay Mortgage Group', kind: 'EBR', template: 'Multi-Account · SRP550', structure: 'multi', tier: 'SRP550', status: 'published', date: 'Jun 24, 2026', owner: 'Megha Upadhyay', quarter: 'Q2 FY26' },
  { account: 'Fay Servicing', kind: 'EBR', template: 'Multi-Account · SRP550', structure: 'multi', tier: 'SRP550', status: 'draft', date: 'Jul 2, 2026', owner: 'Craig Pollack', quarter: 'Q2 FY26' },
  { account: 'Synergy One Lending', kind: 'EBR', template: 'Single-Account · SRP550', structure: 'single', tier: 'SRP550', status: 'in_review', date: 'Jul 1, 2026', owner: 'Niharika Vichhivora', quarter: 'Q2 FY26' },
  { account: 'NOVA Home Loans', kind: 'EBR', template: 'Single-Account · SRP850', structure: 'single', tier: 'SRP850', status: 'published', date: 'Jun 19, 2026', owner: 'Sumedha Dheeraj', quarter: 'Q2 FY26' },
];
const MIL_REVIEWS: Rev[] = [
  { account: 'Vertex Industrial', kind: 'EBR', template: 'ROI & Value EBR', status: 'published', date: 'Jun 26, 2026', owner: 'Aisha Khan', quarter: 'Q2 FY26' },
  { account: 'Loomcraft Textiles', kind: 'QBR', template: 'Standard QBR', status: 'published', date: 'Jun 22, 2026', owner: 'Diego Torres', quarter: 'Q2 FY26' },
  { account: 'Atlas Manufacturing', kind: 'EBR', template: 'Renewal EBR', status: 'draft', date: 'Jul 3, 2026', owner: 'Aisha Khan', quarter: 'Q2 FY26' },
  { account: 'Ironclad Steel', kind: 'QBR', template: 'At-Risk Recovery QBR', status: 'in_review', date: 'Jul 1, 2026', owner: 'Aisha Khan', quarter: 'Q2 FY26' },
  { account: 'Delta Components', kind: 'EBR', template: 'Renewal EBR', status: 'draft', date: 'Jul 2, 2026', owner: 'Diego Torres', quarter: 'Q2 FY26' },
];

// ---------- Data sources ----------
type Src = { name: string; cat: string; status: string; detail: string };
const EXP_SOURCES: Src[] = [
  { name: 'Salesforce', cat: 'CRM', status: 'connected', detail: '6 accounts synced · 4h ago' },
  { name: 'HubSpot', cat: 'CRM', status: 'available', detail: 'Sync deals, contacts & lifecycle' },
  { name: 'Pendo', cat: 'Product usage', status: 'connected', detail: 'Feature adoption · 2h ago' },
  { name: 'Amplitude', cat: 'Product usage', status: 'available', detail: 'Event & funnel analytics' },
  { name: 'Zendesk', cat: 'Support', status: 'connected', detail: 'Tickets & CSAT · 1h ago' },
  { name: 'Intercom', cat: 'Support', status: 'available', detail: 'Conversations & resolution' },
  { name: 'Delighted', cat: 'Health & NPS', status: 'connected', detail: 'NPS surveys · 6h ago' },
  { name: 'Gainsight', cat: 'Health & NPS', status: 'available', detail: 'Health scores & CTAs' },
];
const MIL_SOURCES: Src[] = [
  { name: 'Salesforce', cat: 'CRM', status: 'available', detail: 'Sync accounts & opportunities' },
  { name: 'HubSpot', cat: 'CRM', status: 'connected', detail: '6 accounts synced · 3h ago' },
  { name: 'Pendo', cat: 'Product usage', status: 'available', detail: 'Feature adoption tracking' },
  { name: 'Amplitude', cat: 'Product usage', status: 'connected', detail: 'Event analytics · 5h ago' },
  { name: 'Zendesk', cat: 'Support', status: 'available', detail: 'Tickets & CSAT' },
  { name: 'Intercom', cat: 'Support', status: 'connected', detail: 'Conversations · 2h ago' },
  { name: 'Delighted', cat: 'Health & NPS', status: 'available', detail: 'NPS survey delivery' },
  { name: 'Gainsight', cat: 'Health & NPS', status: 'connected', detail: 'Health scores · 4h ago' },
];

// ---------- Templates ----------
const CATALOG_TEMPLATES = [
  { name: 'Standard QBR', kind: 'QBR', use: 'Growth & Enterprise', desc: 'Balanced quarterly review — adoption, value delivered, roadmap, and next-quarter goals.' },
  { name: 'Adoption-Focused QBR', kind: 'QBR', use: 'Product-led accounts', desc: 'Deep-dive on product usage, feature adoption, and expansion opportunities.' },
  { name: 'At-Risk Recovery QBR', kind: 'QBR', use: 'Red / yellow health', desc: 'Retention-oriented review surfacing risks, blockers, and a mutual action plan.' },
  { name: 'Executive Business Review', kind: 'EBR', use: 'Strategic accounts', desc: 'Strategic C-suite review — business outcomes, ROI, strategic alignment, and vision.' },
  { name: 'ROI & Value EBR', kind: 'EBR', use: 'Renewal / expansion', desc: 'Quantified value realization with financial impact modeling for executive buyers.' },
  { name: 'Renewal EBR', kind: 'EBR', use: 'Pre-renewal (90 days)', desc: 'Pre-renewal executive alignment with multi-year partnership roadmap.' },
];
const EXP_SYSTEM_TEMPLATES = [
  { name: 'Single-Account · SRP850', kind: 'EBR', structure: 'single', tier: 'SRP850', file: 'ebr-templates/Single-Account-SRP850.html', desc: '6-slide single-account deck for clients already on SRP850. No upsell slides.', use: '1 brand · SRP850' },
  { name: 'Single-Account · SRP550', kind: 'EBR', structure: 'single', tier: 'SRP550', file: 'ebr-templates/Single-Account-SRP550.html', desc: '8-slide single-account deck. Includes SRP550→SRP850 upsell slides 7–8.', use: '1 brand · SRP550' },
  { name: 'Multi-Account · SRP850', kind: 'EBR', structure: 'multi', tier: 'SRP850', file: 'ebr-templates/Multi-Account-SRP850.html', desc: '6-slide multi-brand org deck with a Cross-Brand Scorecard on Slide 2.', use: 'Multi-brand · SRP850' },
  { name: 'Multi-Account · SRP550', kind: 'EBR', structure: 'multi', tier: 'SRP550', file: 'ebr-templates/Multi-Account-SRP550.html', desc: '8-slide multi-brand org deck with cross-brand scorecard + upsell slides.', use: 'Multi-brand · SRP550' },
];

// ---------- helpers ----------
const parseDate = (s?: string) => (s ? new Date(s) : null);
const emailFor = (name: string) =>
  name.toLowerCase().replace(/[^a-z ]/g, '').trim().split(/\s+/).join('.') + '@millionsquare.com';

async function main() {
  console.log('→ Seeding MillionPulse AI…');

  // Wipe (idempotent reseed) — order respects FKs.
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.shareLink.deleteMany(),
    prisma.upload.deleteMany(),
    prisma.review.deleteMany(),
    prisma.dataSourceConnection.deleteMany(),
    prisma.account.deleteMany(),
    prisma.membership.deleteMany(),
    prisma.invite.deleteMany(),
    prisma.subscription.deleteMany(),
    prisma.template.deleteMany(),
    prisma.templateBlueprint.deleteMany(),
    prisma.workspace.deleteMany(),
    prisma.client.deleteMany(),
    prisma.vertical.deleteMany(),
    prisma.rolePermission.deleteMany(),
    prisma.role.deleteMany(),
    prisma.user.deleteMany(),
    prisma.organization.deleteMany(),
  ]);

  // Roles + permissions
  for (const r of ROLES) {
    await prisma.role.create({
      data: {
        id: r.id, name: r.name, scope: r.scope, color: r.color, description: r.desc,
        permissions: { create: CAPS.map((c, i) => ({ capability: c, level: LEVEL[r.matrix[i]] })) },
      },
    });
  }

  // Organization
  const org = await prisma.organization.create({ data: { name: 'Million Square Solutions' } });

  // Verticals
  const verticalId: Record<string, string> = {};
  for (const v of VERTICALS) {
    const rec = await prisma.vertical.create({ data: { name: v.name, icon: v.icon, color: v.color, status: v.status } });
    verticalId[v.key] = rec.id;
  }

  // Users — start with known accounts, then fill staff referenced by accounts/reviews.
  const userIdByName: Record<string, string> = {};
  const clientKeyByUser: Record<string, string | null> = {};
  for (const u of KNOWN_USERS) {
    const rec = await prisma.user.create({
      data: {
        name: u.name, email: u.email, status: u.status as any,
        passwordHash: u.login ? PWD : null,
        lastActiveAt: u.status === 'active' ? new Date() : null,
      },
    });
    userIdByName[u.name] = rec.id;
    clientKeyByUser[u.name] = u.client;
  }
  const ensureUser = async (name?: string) => {
    if (!name) return null;
    if (userIdByName[name]) return userIdByName[name];
    const rec = await prisma.user.create({ data: { name, email: emailFor(name), status: 'active', passwordHash: null, lastActiveAt: new Date() } });
    userIdByName[name] = rec.id;
    return rec.id;
  };

  // Clients (+ workspaces for those that have one)
  const workspaceIdByClient: Record<string, string> = {};
  for (const c of CLIENTS) {
    const client = await prisma.client.create({
      data: {
        id: c.id, organizationId: org.id, name: c.name, domain: c.domain, logo: c.logo,
        verticalId: verticalId[c.vertical], plan: c.plan, region: c.region, arr: c.arr,
        status: c.status as any, onboardingProgress: c.onboarded, lead: c.lead,
        subscription: { create: { plan: c.plan, arr: c.arr, mrr: Math.round(c.arr / 12), seats: 0, billingStatus: c.status === 'active' ? 'paid' : 'trial' } },
      },
    });
    if (c.hasWorkspace) {
      const ws = await prisma.workspace.create({
        data: { clientId: client.id, name: c.name, short: c.short, accent: c.accent, industry: c.industry },
      });
      workspaceIdByClient[c.id] = ws.id;
    }
  }

  // Memberships for known users
  for (const u of KNOWN_USERS) {
    const wsId = u.client ? workspaceIdByClient[u.client] ?? null : null;
    // super-admin membership has workspaceId = null (all)
    await prisma.membership.create({
      data: { userId: userIdByName[u.name], workspaceId: u.role === 'superadmin' ? null : wsId, roleId: u.role },
    }).catch(() => { /* skip dup */ });
  }

  // Templates: shared catalog
  const templateIdByName: Record<string, string> = {};
  for (const t of CATALOG_TEMPLATES) {
    const rec = await prisma.template.create({ data: { name: t.name, kind: t.kind as any, use: t.use, description: t.desc, status: 'live' } });
    templateIdByName[t.name] = rec.id;
  }
  // Templates: Experience.com locked EBR System (workspace-scoped), load HTML source when available
  const expWs = workspaceIdByClient['exp'];
  for (const t of EXP_SYSTEM_TEMPLATES) {
    let html: string | null = null;
    try { html = readFileSync(join(process.cwd(), '..', '..', t.file), 'utf8'); } catch { html = null; }
    const rec = await prisma.template.create({
      data: {
        workspaceId: expWs, name: t.name, kind: t.kind as any, structure: t.structure, tier: t.tier,
        description: t.desc, use: t.use, system: true, status: 'live', htmlSource: html,
      },
    });
    templateIdByName[t.name] = rec.id;
  }

  // Per-workspace seeding
  const seedWorkspace = async (clientKey: string, accounts: Acc[], reviews: Rev[], sources: Src[]) => {
    const wsId = workspaceIdByClient[clientKey];
    if (!wsId) return;

    const accountIdByName: Record<string, string> = {};
    for (const a of accounts) {
      const csmId = await ensureUser(a.csm);
      const srId = await ensureUser(a.sr);
      const rec = await prisma.account.create({
        data: {
          workspaceId: wsId, name: a.name, logo: a.logo, tier: a.tier, arr: a.arr, seats: a.seats,
          health: a.health, trend: a.trend, nps: a.nps, tickets: a.tickets, adoption: a.adoption,
          region: a.region, csmId, srSpecialistId: srId,
          autoRenewalDate: parseDate(a.autoRenewal), termStartDate: parseDate(a.termStart),
          srpTier: a.srp, structure: (a.structure ?? 'single') as any, brands: a.brands ?? [], posture: a.posture,
        },
      });
      accountIdByName[a.name] = rec.id;
    }

    for (const r of reviews) {
      const ownerId = await ensureUser(r.owner);
      await prisma.review.create({
        data: {
          workspaceId: wsId, accountId: accountIdByName[r.account] ?? null, kind: r.kind as any,
          templateId: templateIdByName[r.template] ?? null, templateName: r.template,
          structure: r.structure, tier: r.tier, status: r.status as any, ownerId,
          quarter: r.quarter, createdAt: parseDate(r.date) ?? new Date(),
        },
      });
    }

    for (const s of sources) {
      await prisma.dataSourceConnection.create({
        data: {
          workspaceId: wsId, provider: s.name.toLowerCase(), category: s.cat,
          status: s.status as any, detail: s.detail,
          lastSyncAt: s.status === 'connected' ? new Date() : null,
        },
      });
    }
  };

  await seedWorkspace('exp', EXP_ACCOUNTS, EXP_REVIEWS, EXP_SOURCES);
  await seedWorkspace('mil', MIL_ACCOUNTS, MIL_REVIEWS, MIL_SOURCES);

  // Update seat counts on subscriptions from account seats
  for (const key of ['exp', 'mil']) {
    const wsId = workspaceIdByClient[key];
    const agg = await prisma.account.aggregate({ where: { workspaceId: wsId }, _sum: { seats: true } });
    const client = await prisma.client.findUnique({ where: { id: key } });
    if (client) await prisma.subscription.update({ where: { clientId: client.id }, data: { seats: agg._sum.seats ?? 0 } });
  }

  const counts = {
    users: await prisma.user.count(),
    clients: await prisma.client.count(),
    workspaces: await prisma.workspace.count(),
    accounts: await prisma.account.count(),
    reviews: await prisma.review.count(),
    templates: await prisma.template.count(),
  };
  console.log('✓ Seed complete:', counts);
  console.log('  Login: priya@millionsquare.com (HQ) / sarah.mitchell@experience.com (client) — password: password123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
