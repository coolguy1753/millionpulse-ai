/* ============================================================
   MillionPulse AI — EBR & QBR template blueprints per vertical
   3 EBR + 3 QBR for every vertical EXCEPT Mortgage & Lending
   (finalized as the Experience.com EBR System).
   Each blueprint: name · use · sentiment/signal focus · sections[].
   ============================================================ */
window.BLUEPRINTS = (function () {
  const B = {
    /* ---------------- SaaS & Software ---------------- */
    saas: {
      ebr: [
        { name:'Executive Business Review', use:'Strategic accounts', focus:'Executive sponsor sentiment, product-value perception, competitive risk.',
          sections:['Executive summary','Business outcomes & ROI','Adoption & value realization','Expansion & whitespace','Strategic roadmap alignment','Risks & mitigation','Renewal recommendation'] },
        { name:'Renewal & Expansion EBR', use:'Pre-renewal (90 days)', focus:'Buying-committee sentiment, champion strength, willingness-to-pay signals.',
          sections:['Partnership recap','Value delivered vs. goals','Usage & seat growth','Expansion business case','Multi-year roadmap','Commercial proposal','Mutual action plan'] },
        { name:'Platform Adoption EBR', use:'Large / technical deployments', focus:'Admin & power-user sentiment, support-ticket themes, integration friction.',
          sections:['Deployment health','Adoption by team & module','Integration & API usage','Admin enablement','Security & compliance','Scale roadmap','Success plan'] },
      ],
      qbr: [
        { name:'Standard QBR', use:'Growth & Enterprise', focus:'CSAT and feature-request sentiment from tickets & surveys.',
          sections:['Quarter snapshot','Adoption & usage','Value delivered','Support & health','Feature requests & feedback','Next-quarter plan'] },
        { name:'Adoption-Focused QBR', use:'Product-led accounts', focus:'In-app behavior signals, NPS drivers, onboarding friction.',
          sections:['Usage trends','Feature adoption funnel','Onboarding progress','Low-adoption risks','Enablement plan','Expansion signals'] },
        { name:'At-Risk / Retention QBR', use:'Red / yellow health', focus:'Detractor verbatims, escalation tone, sentiment trajectory.',
          sections:['Health diagnosis','Churn signals','Support & sentiment deep-dive','Blockers & root cause','Mutual recovery plan','Executive alignment'] },
      ],
    },
    /* ---------------- FinTech & RegTech ---------------- */
    fintech: {
      ebr: [
        { name:'Executive Business Review', use:'Strategic accounts', focus:'Executive trust sentiment, compliance confidence, reliability perception.',
          sections:['Executive summary','Reliability & trust scorecard','Compliance & audit posture','Value & ROI','Regulatory roadmap','Risk register','Renewal & partnership'] },
        { name:'ROI & Value EBR', use:'Renewal / expansion', focus:'CFO / CRO sentiment on quantified value & risk reduction.',
          sections:['Business impact model','Cost-avoidance & efficiency','Fraud & risk reduction','Adoption','Expansion case','Commercials'] },
        { name:'Risk & Compliance EBR', use:'Regulated buyers', focus:'Compliance-officer sentiment, audit friction, control gaps.',
          sections:['Regulatory alignment','Incident & response review','Audit readiness','Data governance','Controls roadmap','Renewal'] },
      ],
      qbr: [
        { name:'Standard QBR', use:'All accounts', focus:'Reliability perception & incident sentiment.',
          sections:['Quarter snapshot','Reliability & incidents','Compliance status','Adoption','Risks & escalations','Next-quarter plan'] },
        { name:'Reliability & Ops QBR', use:'High-volume platforms', focus:'Ops-team sentiment, incident CSAT, SLA satisfaction.',
          sections:['Uptime & SLA','Incident trends','Response metrics','Support themes','Reliability roadmap'] },
        { name:'Compliance Check-in QBR', use:'Regulated accounts', focus:'Compliance sentiment & audit-readiness confidence.',
          sections:['Regulatory changes','Control coverage','Audit prep','Policy adoption','Action items'] },
      ],
    },
    /* ---------------- HealthTech ---------------- */
    healthtech: {
      ebr: [
        { name:'Executive Business Review', use:'Health systems', focus:'Clinician & executive sentiment, care-team confidence.',
          sections:['Executive summary','Clinical & patient outcomes','Adoption by role','Integration & reliability','HIPAA & compliance','Risks & mitigation','Renewal'] },
        { name:'Clinical Outcomes EBR', use:'Outcome-led accounts', focus:'Clinician sentiment, patient CSAT, workflow frustration.',
          sections:['Outcome metrics','Workflow adoption','Value & ROI','Care-team feedback','Roadmap','Renewal'] },
        { name:'Value & ROI EBR', use:'Renewal / expansion', focus:'CFO / CMO sentiment on reimbursement & efficiency impact.',
          sections:['Cost savings','Efficiency gains','Reimbursement impact','Adoption','Expansion','Commercials'] },
      ],
      qbr: [
        { name:'Standard QBR', use:'All accounts', focus:'Care-team sentiment & adoption signals.',
          sections:['Quarter snapshot','Clinician adoption','Outcomes','Integration health','Risks','Next-quarter plan'] },
        { name:'Adoption & Enablement QBR', use:'Ramping deployments', focus:'Clinician frustration signals, training gaps.',
          sections:['Role-based adoption','Training gaps','Workflow friction','Enablement plan','Expansion signals'] },
        { name:'Patient Experience QBR', use:'Patient-facing modules', focus:'Patient sentiment from surveys & reviews.',
          sections:['Patient satisfaction','Survey themes','Access & engagement','Experience roadmap','Action items'] },
      ],
    },
    /* ---------------- Logistics & Supply Chain ---------------- */
    logistics: {
      ebr: [
        { name:'Executive Business Review', use:'Strategic accounts', focus:'Operations-executive sentiment, reliability confidence.',
          sections:['Executive summary','Operational performance','Adoption across sites','Value & efficiency','Reliability & support','Risks & mitigation','Renewal'] },
        { name:'Efficiency & ROI EBR', use:'Renewal / expansion', focus:'Ops-exec sentiment on cost & time savings.',
          sections:['Throughput gains','Cost & time savings','Site rollout ROI','Adoption','Expansion','Commercials'] },
        { name:'Network Expansion EBR', use:'Multi-site orgs', focus:'Regional-manager sentiment, standardization readiness.',
          sections:['Multi-site scorecard','New-site onboarding','Standardization','Roadmap','Renewal'] },
      ],
      qbr: [
        { name:'Standard QBR', use:'All accounts', focus:'Ops-team sentiment & SLA satisfaction.',
          sections:['Quarter snapshot','Throughput & SLAs','Site adoption','Support & incidents','Risks','Next-quarter plan'] },
        { name:'Operations QBR', use:'High-volume networks', focus:'Ops-team sentiment, exception/incident tone.',
          sections:['SLA performance','Exception & incident trends','Site-level adoption','Ops feedback','Improvement plan'] },
        { name:'At-Risk Site QBR', use:'Underperforming sites', focus:'Site-manager detractor signals, root-cause sentiment.',
          sections:['Underperforming sites','Adoption gaps','Root cause','Recovery plan','Alignment'] },
      ],
    },
    /* ---------------- HR Tech & WorkTech ---------------- */
    hrtech: {
      ebr: [
        { name:'Executive Business Review', use:'Strategic accounts', focus:'HR-executive sentiment, workforce-outcome confidence.',
          sections:['Executive summary','Workforce outcomes','Module adoption','Value & ROI','Compliance','Roadmap','Renewal'] },
        { name:'Employee Experience EBR', use:'Engagement-led accounts', focus:'Employee sentiment & eNPS themes.',
          sections:['Engagement & eNPS','Adoption by department','Sentiment themes','Value delivered','Roadmap'] },
        { name:'ROI & Efficiency EBR', use:'Renewal / expansion', focus:'HR-exec sentiment on cost & time-to-hire savings.',
          sections:['Time-to-hire & cost savings','Automation impact','Adoption','Expansion','Commercials'] },
      ],
      qbr: [
        { name:'Standard QBR', use:'All accounts', focus:'Admin & manager sentiment.',
          sections:['Quarter snapshot','Activation & adoption','Value delivered','Support','Risks','Next-quarter plan'] },
        { name:'Adoption & Activation QBR', use:'Ramping deployments', focus:'Manager adoption & activation friction.',
          sections:['User activation funnel','Manager adoption','Enablement','Expansion signals'] },
        { name:'Engagement QBR', use:'Engagement modules', focus:'Employee sentiment analysis from surveys.',
          sections:['eNPS trends','Survey themes','Participation','Action plan'] },
      ],
    },
    /* ---------------- MarTech & AdTech ---------------- */
    martech: {
      ebr: [
        { name:'Executive Business Review', use:'Strategic accounts', focus:'CMO sentiment, marketing-value perception.',
          sections:['Executive summary','Campaign performance & ROI','Feature adoption','Attributed value','Strategic alignment','Roadmap','Renewal'] },
        { name:'Performance & ROI EBR', use:'Renewal / expansion', focus:'CMO sentiment on attributed revenue & efficiency.',
          sections:['Attributed revenue','Channel ROI','Efficiency','Adoption','Expansion','Commercials'] },
        { name:'Growth & Expansion EBR', use:'Multi-team rollout', focus:'Marketing-leader sentiment, whitespace appetite.',
          sections:['Whitespace analysis','New-channel opportunity','Multi-team rollout','Roadmap','Renewal'] },
      ],
      qbr: [
        { name:'Standard QBR', use:'All accounts', focus:'Marketer sentiment & feature requests.',
          sections:['Quarter snapshot','Campaign results','Adoption','Support','Risks','Next-quarter plan'] },
        { name:'Campaign Performance QBR', use:'Performance teams', focus:'Marketer sentiment, attribution confidence.',
          sections:['Campaign outcomes','Funnel & attribution','Optimization opportunities','Plan'] },
        { name:'Adoption & Enablement QBR', use:'Underused deployments', focus:'User sentiment on unused capabilities.',
          sections:['Feature adoption','Team enablement','Underused capabilities','Plan'] },
      ],
    },
    /* ---------------- Cybersecurity ---------------- */
    cyber: {
      ebr: [
        { name:'Executive Business Review', use:'Strategic accounts', focus:'CISO sentiment, security-posture confidence.',
          sections:['Executive summary','Security posture & coverage','Incident-response value','Adoption & maturity','Compliance alignment','Risk register','Renewal'] },
        { name:'Threat & ROI EBR', use:'Renewal / expansion', focus:'CISO sentiment on risk reduction & cost-avoidance.',
          sections:['Threats detected & blocked','Risk reduction','Cost-avoidance','Adoption','Expansion','Commercials'] },
        { name:'Security Maturity EBR', use:'Maturity programs', focus:'Security-leader confidence in roadmap to next tier.',
          sections:['Maturity model','Coverage gaps','Roadmap to next tier','Compliance','Renewal'] },
      ],
      qbr: [
        { name:'Standard QBR', use:'All accounts', focus:'SOC-team sentiment & coverage confidence.',
          sections:['Quarter snapshot','Coverage & detections','Response metrics','Adoption','Risks','Next-quarter plan'] },
        { name:'Threat & Response QBR', use:'Active SOCs', focus:'SOC-team sentiment, MTTR satisfaction.',
          sections:['Detection trends','Mean-time-to-respond','Incident review','Tuning plan'] },
        { name:'Posture & Coverage QBR', use:'Coverage programs', focus:'Security-admin sentiment on gaps & hardening.',
          sections:['Coverage by vector','Config & hardening','Gaps','Remediation plan'] },
      ],
    },
  };
  const forVertical = (id) => B[id] || null;
  return { data:B, forVertical };
})();
