/* ============================================================
   MillionPulse AI — mock data (multi-tenant: workspaces)
   Each workspace = one B2B client of Million Square Solutions.
   Data is fully scoped per workspace — nothing is shared across tenants.
   ============================================================ */
window.MP = (function () {

  // ---------- WORKSPACE 1 · Experience.com ----------
  // Experience.com's own customers are mortgage / lending / banking orgs.
  // Each carries the contract facts the EBR needs (auto-renewal, term start,
  // contracted users, product tier, brand structure). The rest of the brief
  // (reporting period, Google numbers, 4 reports) is added at EBR time.
  const expAccounts = [
    { id:'e1', name:'TowneBank Mortgage', logo:'TB', tier:'Enterprise', arr:412000, seats:320, health:92, trend:+3, csm:'Divyanshu Srivastava', srSpecialist:'Alex Kent', renewal:'Oct 2026', nps:97, tickets:9, adoption:0.93, region:'NA', nextReview:'EBR', due:'in 6 days', risk:'low',
      ebr:{ autoRenewal:'October 11, 2026', termStart:'January 9, 2027', contracted:320, active:296, srp:'SRP550', structure:'single', brands:[], posture:'Best-in-class · comfortable renewal' } },
    { id:'e2', name:'Atlantic Bay Mortgage Group', logo:'AB', tier:'Strategic', arr:1120000, seats:850, health:90, trend:+2, csm:'Megha Upadhyay', srSpecialist:'Marquis Cosby-Dorsey', renewal:'Sep 2026', nps:96, tickets:14, adoption:0.9, region:'NA', nextReview:'EBR', due:'in 12 days', risk:'low',
      ebr:{ autoRenewal:'September 1, 2026', termStart:'December 1, 2026', contracted:850, active:766, srp:'SRP550', structure:'multi', brands:['Atlantic Bay','Coastal Lending','Summit Home Loans'], posture:'Best-in-class multi-brand · expansion-ready' } },
    { id:'e3', name:'Synergy One Lending', logo:'SO', tier:'Strategic', arr:960000, seats:1240, health:88, trend:+1, csm:'Niharika Vichhivora', srSpecialist:'Travis Verner', renewal:'Aug 2026', nps:96, tickets:18, adoption:0.87, region:'NA', nextReview:'EBR', due:'in 9 days', risk:'low',
      ebr:{ autoRenewal:'August 3, 2026', termStart:'November 1, 2026', contracted:1240, active:1080, srp:'SRP550', structure:'single', brands:[], posture:'Best-in-class at scale · light tuning' } },
    { id:'e4', name:'NOVA Home Loans', logo:'NH', tier:'Enterprise', arr:688000, seats:900, health:85, trend:+4, csm:'Sumedha Dheeraj', srSpecialist:'Scott O’Hayre', renewal:'Feb 2027', nps:95, tickets:12, adoption:0.86, region:'NA', nextReview:'EBR', due:'in 21 days', risk:'low',
      ebr:{ autoRenewal:'February 14, 2027', termStart:'May 1, 2027', contracted:900, active:774, srp:'SRP850', structure:'single', brands:[], posture:'Best-in-class at scale · codify playbooks' } },
    { id:'e5', name:'Fay Servicing', logo:'FS', tier:'Enterprise', arr:236000, seats:320, health:74, trend:+9, csm:'Craig Pollack', srSpecialist:'Alex Kent', renewal:'Jan 2027', nps:90, tickets:16, adoption:0.7, region:'NA', nextReview:'EBR', due:'in 3 days', risk:'medium',
      ebr:{ autoRenewal:'January 9, 2027', termStart:'April 1, 2027', contracted:320, active:249, srp:'SRP550', structure:'multi', brands:['Fay Servicing','Constructive Loans','GenStone'], posture:'Year-1 deployment · ramping fast' } },
    { id:'e6', name:'Landmark Professional Mortgage', logo:'LP', tier:'Growth', arr:184000, seats:120, health:71, trend:-2, csm:'Gabi Siguenza', srSpecialist:'Marquis Cosby-Dorsey', renewal:'May 2026', nps:95, tickets:11, adoption:0.72, region:'NA', nextReview:'EBR', due:'in 15 days', risk:'medium',
      ebr:{ autoRenewal:'May 20, 2026', termStart:'August 1, 2026', contracted:120, active:96, srp:'SRP550', structure:'single', brands:[], posture:'External presence gap · hidden gem' } },
    { id:'e7', name:'Gray Fox Mortgage', logo:'GF', tier:'Growth', arr:96000, seats:40, health:68, trend:-3, csm:'Lauren Gaddy', srSpecialist:'Travis Verner', renewal:'Jul 2026', nps:88, tickets:8, adoption:0.78, region:'NA', nextReview:'EBR', due:'in 18 days', risk:'medium',
      ebr:{ autoRenewal:'July 15, 2026', termStart:'October 1, 2026', contracted:40, active:34, srp:'SRP550', structure:'single', brands:[], posture:'Boutique strength · single-LO coaching focus' } },
    { id:'e8', name:'Evolve Bank & Trust', logo:'EB', tier:'Enterprise', arr:520000, seats:600, health:52, trend:-10, csm:'Nathan Campbell', srSpecialist:'Scott O’Hayre', renewal:'Dec 2025', nps:62, tickets:41, adoption:0.5, region:'NA', nextReview:'EBR', due:'overdue', risk:'high',
      ebr:{ autoRenewal:'December 3, 2025', termStart:'March 1, 2026', contracted:600, active:300, srp:'SRP850', structure:'single', brands:[], posture:'Adoption gap · engagement crisis' } },
  ];
  const expReviews = [
    { id:'er1', account:'TowneBank Mortgage', logo:'TB', kind:'EBR', template:'Single-Account · SRP550', structure:'single', tier:'SRP550', status:'Published', date:'Jun 28, 2026', owner:'Divyanshu Srivastava', quarter:'Q2 FY26' },
    { id:'er2', account:'Atlantic Bay Mortgage Group', logo:'AB', kind:'EBR', template:'Multi-Account · SRP550', structure:'multi', tier:'SRP550', status:'Published', date:'Jun 24, 2026', owner:'Megha Upadhyay', quarter:'Q2 FY26' },
    { id:'er3', account:'Fay Servicing', logo:'FS', kind:'EBR', template:'Multi-Account · SRP550', structure:'multi', tier:'SRP550', status:'Draft', date:'Jul 2, 2026', owner:'Craig Pollack', quarter:'Q2 FY26' },
    { id:'er4', account:'Synergy One Lending', logo:'SO', kind:'EBR', template:'Single-Account · SRP550', structure:'single', tier:'SRP550', status:'In review', date:'Jul 1, 2026', owner:'Niharika Vichhivora', quarter:'Q2 FY26' },
    { id:'er5', account:'NOVA Home Loans', logo:'NH', kind:'EBR', template:'Single-Account · SRP850', structure:'single', tier:'SRP850', status:'Published', date:'Jun 19, 2026', owner:'Sumedha Dheeraj', quarter:'Q2 FY26' },
  ];
  const expSources = [
    { id:'s1', name:'Salesforce', cat:'CRM', status:'connected', detail:'6 accounts synced · 4h ago', icon:'cloud' },
    { id:'s2', name:'HubSpot', cat:'CRM', status:'available', detail:'Sync deals, contacts & lifecycle', icon:'cloud' },
    { id:'s3', name:'Pendo', cat:'Product usage', status:'connected', detail:'Feature adoption · 2h ago', icon:'chart' },
    { id:'s4', name:'Amplitude', cat:'Product usage', status:'available', detail:'Event & funnel analytics', icon:'chart' },
    { id:'s5', name:'Zendesk', cat:'Support', status:'connected', detail:'Tickets & CSAT · 1h ago', icon:'ticket' },
    { id:'s6', name:'Intercom', cat:'Support', status:'available', detail:'Conversations & resolution', icon:'ticket' },
    { id:'s7', name:'Delighted', cat:'Health & NPS', status:'connected', detail:'NPS surveys · 6h ago', icon:'heart' },
    { id:'s8', name:'Gainsight', cat:'Health & NPS', status:'available', detail:'Health scores & CTAs', icon:'heart' },
  ];

  // ---------- WORKSPACE 2 · Milltex ----------
  const milAccounts = [
    { id:'m1', name:'Atlas Manufacturing', logo:'AM', tier:'Strategic', arr:960000, seats:1800, health:49, trend:-8, csm:'Aisha Khan', renewal:'Dec 2025', nps:28, tickets:53, adoption:0.47, region:'APAC', nextReview:'EBR', due:'overdue', risk:'high', ebr:{ autoRenewal:'December 15, 2025', termStart:'March 1, 2026' } },
    { id:'m2', name:'Northwind Logistics', logo:'NL', tier:'Enterprise', arr:445000, seats:720, health:71, trend:+1, csm:'Diego Torres', renewal:'Apr 2026', nps:49, tickets:22, adoption:0.68, region:'EMEA', nextReview:'EBR', due:'in 18 days', risk:'medium', ebr:{ autoRenewal:'April 22, 2026', termStart:'July 1, 2026' } },
    { id:'m3', name:'Ironclad Steel', logo:'IS', tier:'Enterprise', arr:602000, seats:1100, health:64, trend:-5, csm:'Aisha Khan', renewal:'Feb 2026', nps:41, tickets:34, adoption:0.6, region:'EMEA', nextReview:'QBR', due:'in 8 days', risk:'medium', ebr:{ autoRenewal:'February 18, 2026', termStart:'May 1, 2026' } },
    { id:'m4', name:'Loomcraft Textiles', logo:'LT', tier:'Growth', arr:198000, seats:360, health:84, trend:+6, csm:'Diego Torres', renewal:'Jun 2026', nps:66, tickets:9, adoption:0.81, region:'APAC', nextReview:'QBR', due:'in 14 days', risk:'low', ebr:{ autoRenewal:'June 30, 2026', termStart:'September 1, 2026' } },
    { id:'m5', name:'Vertex Industrial', logo:'VI', tier:'Strategic', arr:1120000, seats:2100, health:88, trend:+3, csm:'Aisha Khan', renewal:'Sep 2026', nps:69, tickets:10, adoption:0.86, region:'NA', nextReview:'EBR', due:'in 20 days', risk:'low', ebr:{ autoRenewal:'September 12, 2026', termStart:'December 1, 2026' } },
    { id:'m6', name:'Delta Components', logo:'DC', tier:'Growth', arr:3900, seats:290, health:57, trend:-9, csm:'Diego Torres', renewal:'Jan 2026', nps:35, tickets:38, adoption:0.53, region:'NA', nextReview:'EBR', due:'in 4 days', risk:'high', ebr:{ autoRenewal:'January 20, 2026', termStart:'April 1, 2026' } },
  ];
  const milReviews = [
    { id:'mr1', account:'Vertex Industrial', logo:'VI', kind:'EBR', template:'ROI & Value EBR', status:'Published', date:'Jun 26, 2026', owner:'Aisha Khan', quarter:'Q2 FY26' },
    { id:'mr2', account:'Loomcraft Textiles', logo:'LT', kind:'QBR', template:'Standard QBR', status:'Published', date:'Jun 22, 2026', owner:'Diego Torres', quarter:'Q2 FY26' },
    { id:'mr3', account:'Atlas Manufacturing', logo:'AM', kind:'EBR', template:'Renewal EBR', status:'Draft', date:'Jul 3, 2026', owner:'Aisha Khan', quarter:'Q2 FY26' },
    { id:'mr4', account:'Ironclad Steel', logo:'IS', kind:'QBR', template:'At-Risk Recovery QBR', status:'In review', date:'Jul 1, 2026', owner:'Aisha Khan', quarter:'Q2 FY26' },
    { id:'mr5', account:'Delta Components', logo:'DC', kind:'EBR', template:'Renewal EBR', status:'Draft', date:'Jul 2, 2026', owner:'Diego Torres', quarter:'Q2 FY26' },
  ];
  const milSources = [
    { id:'s1', name:'Salesforce', cat:'CRM', status:'available', detail:'Sync accounts & opportunities', icon:'cloud' },
    { id:'s2', name:'HubSpot', cat:'CRM', status:'connected', detail:'6 accounts synced · 3h ago', icon:'cloud' },
    { id:'s3', name:'Pendo', cat:'Product usage', status:'available', detail:'Feature adoption tracking', icon:'chart' },
    { id:'s4', name:'Amplitude', cat:'Product usage', status:'connected', detail:'Event analytics · 5h ago', icon:'chart' },
    { id:'s5', name:'Zendesk', cat:'Support', status:'available', detail:'Tickets & CSAT', icon:'ticket' },
    { id:'s6', name:'Intercom', cat:'Support', status:'connected', detail:'Conversations · 2h ago', icon:'ticket' },
    { id:'s7', name:'Delighted', cat:'Health & NPS', status:'available', detail:'NPS survey delivery', icon:'heart' },
    { id:'s8', name:'Gainsight', cat:'Health & NPS', status:'connected', detail:'Health scores · 4h ago', icon:'heart' },
  ];

  // ---------- Experience.com EBR System (the 4 locked templates + one-pager) ----------
  const EBR_ONEPAGER = 'ebr-templates/EBR-OnePager-Summary.html';
  const expTemplates = [
    { id:'ebr-s850', kind:'EBR', system:true, name:'Single-Account · SRP850', structure:'single', tier:'SRP850', slides:6, upsell:false,
      desc:'6-slide single-account deck for clients already on SRP850. No upsell slides.', use:'1 brand · SRP850', color:'primary',
      file:'ebr-templates/Single-Account-SRP850.html', onePager:EBR_ONEPAGER },
    { id:'ebr-s550', kind:'EBR', system:true, name:'Single-Account · SRP550', structure:'single', tier:'SRP550', slides:8, upsell:true, popular:true,
      desc:'8-slide single-account deck. Includes SRP550→SRP850 upsell slides 7–8.', use:'1 brand · SRP550', color:'primary',
      file:'ebr-templates/Single-Account-SRP550.html', onePager:EBR_ONEPAGER },
    { id:'ebr-m850', kind:'EBR', system:true, name:'Multi-Account · SRP850', structure:'multi', tier:'SRP850', slides:6, upsell:false,
      desc:'6-slide multi-brand org deck with a Cross-Brand Scorecard on Slide 2.', use:'Multi-brand · SRP850', color:'primary',
      file:'ebr-templates/Multi-Account-SRP850.html', onePager:EBR_ONEPAGER },
    { id:'ebr-m550', kind:'EBR', system:true, name:'Multi-Account · SRP550', structure:'multi', tier:'SRP550', slides:8, upsell:true,
      desc:'8-slide multi-brand org deck with cross-brand scorecard + upsell slides.', use:'Multi-brand · SRP550', color:'primary',
      file:'ebr-templates/Multi-Account-SRP550.html', onePager:EBR_ONEPAGER },
    // QBRs for Experience.com use the standard MillionPulse templates
    { id:'t1', kind:'QBR', name:'Standard QBR', desc:'Balanced quarterly review — adoption, value delivered, roadmap, and next-quarter goals.', sections:7, use:'Growth & Enterprise', color:'pulse' },
    { id:'t3', kind:'QBR', name:'At-Risk Recovery QBR', desc:'Retention-oriented review surfacing risks, blockers, and a mutual action plan.', sections:8, use:'Red / yellow health', color:'pulse' },
  ];

  // Experience.com EBR intake reports (the 4 required xlsx files)
  const ebrReports = [
    { id:'nps',      name:'NPS Report',                 detail:'Org NPS, Promoters/Detractors, per-LO & per-branch breakdown' },
    { id:'campaign', name:'Campaign Statistics Report', detail:'Campaign list, completion rates, weighted avg score' },
    { id:'survey',   name:'Survey Results Report',      detail:'Verbatims, sentiment themes, monthly response volume' },
    { id:'users',    name:'User Details Report',        detail:'Search Rank Score (SRS) per user, city/state, org average' },
  ];

  const workspaces = [
    { id:'exp', name:'Experience.com', short:'Experience', logo:'E', domain:'experience.com', plan:'Enterprise', industry:'Reputation & CX SaaS', accent:'#5B4BE6', accounts:expAccounts, reviews:expReviews, sources:expSources, templates:expTemplates, ebrSystem:true },
    { id:'mil', name:'Milltex',        short:'Milltex',    logo:'M', domain:'milltex.io',     plan:'Growth',     industry:'Industrial & Supply-chain SaaS', accent:'#0E9F9A', accounts:milAccounts, reviews:milReviews, sources:milSources },
  ];

  // Templates are shared across workspaces (the product catalog), but content generated is workspace-scoped.
  const templates = [
    { id:'t1', kind:'QBR', name:'Standard QBR', desc:'Balanced quarterly review — adoption, value delivered, roadmap, and next-quarter goals.', sections:7, use:'Growth & Enterprise', color:'pulse', popular:true },
    { id:'t2', kind:'QBR', name:'Adoption-Focused QBR', desc:'Deep-dive on product usage, feature adoption, and expansion opportunities.', sections:6, use:'Product-led accounts', color:'pulse' },
    { id:'t3', kind:'QBR', name:'At-Risk Recovery QBR', desc:'Retention-oriented review surfacing risks, blockers, and a mutual action plan.', sections:8, use:'Red / yellow health', color:'pulse' },
    { id:'t4', kind:'EBR', name:'Executive Business Review', desc:'Strategic C-suite review — business outcomes, ROI, strategic alignment, and vision.', sections:9, use:'Strategic accounts', color:'primary', popular:true },
    { id:'t5', kind:'EBR', name:'ROI & Value EBR', desc:'Quantified value realization with financial impact modeling for executive buyers.', sections:7, use:'Renewal / expansion', color:'primary' },
    { id:'t6', kind:'EBR', name:'Renewal EBR', desc:'Pre-renewal executive alignment with multi-year partnership roadmap.', sections:8, use:'Pre-renewal (90 days)', color:'primary' },
  ];

  // Milltex uses the standard MillionPulse catalog
  workspaces[1].templates = templates;

  const genSteps = [
    'Pulling CRM account & renewal data',
    'Aggregating product usage analytics',
    'Analyzing support tickets & resolution',
    'Scoring NPS & health signals',
    'Mapping data to template sections',
    'Drafting narrative & executive summary',
    'Composing charts & value metrics',
    'Finalizing interactive review',
  ];

  // Experience.com EBR System workflow (from the EBR Generation Knowledge Base)
  const ebrGenSteps = [
    'Reading intake brief & confirming template',
    'Auditing NPS Report — org NPS, Promoters/Detractors',
    'Ranking Loan Officers by NPS & response volume',
    'Scoring Search Rank (SRS) from User Details',
    'Extracting sentiment themes & verbatims from Survey Results',
    'Inferring strategic posture (Protect / Close)',
    'Building interactive EBR deck from template',
    'Composing 1-page summary + PDF export',
  ];

  const ebrFileFor = (structure, tier) => `ebr-templates/${structure==='multi'?'Multi':'Single'}-Account-${tier}.html`;

  const fmtMoney = (n) => n >= 1000000 ? '$' + (n/1000000).toFixed(2).replace(/\.00$/,'') + 'M' : '$' + Math.round(n/1000) + 'K';
  const healthColor = (h) => h >= 75 ? 'good' : h >= 60 ? 'warn' : 'risk';
  const getWorkspace = (id) => workspaces.find(w=>w.id===id) || workspaces[0];

  // ---- Contract / cadence helpers ----
  const MS_DAY = 86400000;
  const NOW = new Date(2026,6,6); // Jul 6, 2026 (local)
  const parseDate = (s) => {
    if (!s) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);          // ISO — parse as LOCAL to avoid off-by-one
    const d = m ? new Date(+m[1], +m[2]-1, +m[3]) : new Date(s);
    return d && !isNaN(d) ? d : null;
  };
  const fmtDate = (s) => { const d = parseDate(s); return d ? d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '\u2014'; };
  // EBR window = 90 days before auto-renewal, through auto-renewal date.
  const ebrWindow = (autoStr) => {
    const end = parseDate(autoStr); if (!end) return null;
    const start = new Date(end.getTime() - 90*MS_DAY);
    let state = 'upcoming';
    if (NOW >= start && NOW <= end) state = 'open';
    else if (NOW > end) state = 'closed';
    return { start, end, state,
      daysToStart: Math.ceil((start-NOW)/MS_DAY), daysToEnd: Math.ceil((end-NOW)/MS_DAY),
      rangeStr: `${start.toLocaleDateString('en-US',{month:'short',day:'numeric'})} \u2013 ${end.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}` };
  };
  // QBRs run every quarter, but only for accounts at or above the $5K ARR threshold.
  const QBR_MIN_ARR = 5000;
  const qbrEligible = (arr) => arr >= QBR_MIN_ARR;

  return { workspaces, getWorkspace, templates, genSteps, ebrGenSteps, ebrReports, ebrFileFor, EBR_ONEPAGER, fmtMoney, healthColor, fmtDate, ebrWindow, qbrEligible, QBR_MIN_ARR, NOW };
})();
