/* ============================================================
   MillionPulse AI — Level 1 (HQ) clients registry, roles, users
   ============================================================ */
window.CLIENTS = (function () {

  // ---- Roles & access ----
  const roles = [
    { id:'superadmin', name:'Super Admin',            who:'Million Square HQ', scope:'All clients',       color:'#5B4BE6', desc:'Full platform access — clients, verticals, users, billing.' },
    { id:'wsadmin',    name:'Workspace Admin',         who:'Client lead',       scope:'One workspace',     color:'#0E9F9A', desc:'Runs their workspace: users, accounts, data, all reviews.' },
    { id:'csm',        name:'CSM',                     who:'CS Manager',        scope:'Assigned accounts', color:'#2A6FDB', desc:'Manages assigned accounts, generates EBRs & QBRs.' },
    { id:'srs',        name:'Search Rank Specialist',  who:'SEO / reviews',     scope:'Assigned accounts', color:'#F26430', desc:'Owns Search Rank & review data, contributes to reviews.' },
    { id:'viewer',     name:'Viewer / Exec',           who:'Client executive',  scope:'Read-only',         color:'#8B92AC', desc:'Read-only access to dashboards & shared reviews.' },
  ];
  const caps = ['View dashboards','Manage accounts','Generate reviews','Manage templates','Connect data sources','Manage users','Billing & plan'];
  // 2 = full, 1 = partial/contribute, 0 = none
  const matrix = {
    superadmin:[2,2,2,2,2,2,2],
    wsadmin:   [2,2,2,2,2,2,0],
    csm:       [2,2,2,0,2,0,0],
    srs:       [2,1,1,0,2,0,0],
    viewer:    [2,0,0,0,0,0,0],
  };

  // ---- Clients (B2B customers of Million Square) ----
  const clients = [
    { id:'exp', name:'Experience.com', domain:'experience.com', logo:'E', vertical:'Mortgage & Lending', plan:'SRP550', arr:4216000, accounts:8, health:78, status:'Active', region:'NA', lead:'Divyanshu Srivastava', users:8, renewal:'Oct 2026', onboarded:100, sources:4, hasWorkspace:true },
    { id:'mil', name:'Milltex', domain:'milltex.io', logo:'M', vertical:'Logistics & Supply Chain', plan:'Growth', arr:3492000, accounts:6, health:69, status:'Active', region:'APAC', lead:'Aisha Khan', users:2, renewal:'Sep 2026', onboarded:100, sources:4, hasWorkspace:true },
    { id:'nfm', name:'NFM Lending', domain:'nfmlending.com', logo:'NF', vertical:'Mortgage & Lending', plan:'SRP850', arr:540000, accounts:0, health:null, status:'Onboarding', region:'NA', lead:'Megha Upadhyay', users:3, renewal:'—', onboarded:60, sources:2, hasWorkspace:false },
    { id:'cedar', name:'Cedar Health', domain:'cedarhealth.io', logo:'CH', vertical:'HealthTech', plan:'Enterprise', arr:0, accounts:0, health:null, status:'Prospect', region:'NA', lead:'—', users:0, renewal:'—', onboarded:15, sources:0, hasWorkspace:false },
  ];

  // ---- Users across clients ----
  const users = [
    { name:'Priya Nair', email:'priya@millionsquare.com', role:'superadmin', client:'All clients', status:'Active', last:'now' },
    { name:'Sarah Mitchell', email:'sarah.mitchell@experience.com', role:'wsadmin', client:'Experience.com', status:'Active', last:'1d ago' },
    { name:'Divyanshu Srivastava', email:'divyanshu@millionsquare.com', role:'csm', client:'Experience.com', status:'Active', last:'2h ago' },
    { name:'Alex Kent', email:'alex.kent@experience.com', role:'srs', client:'Experience.com', status:'Active', last:'3h ago' },
    { name:'Aisha Khan', email:'aisha@millionsquare.com', role:'csm', client:'Milltex', status:'Active', last:'5h ago' },
    { name:'Diego Torres', email:'diego@millionsquare.com', role:'csm', client:'Milltex', status:'Active', last:'1d ago' },
    { name:'Megha Upadhyay', email:'megha@millionsquare.com', role:'csm', client:'NFM Lending', status:'Invited', last:'—' },
    { name:'Robert Lang', email:'rlang@nfmlending.com', role:'wsadmin', client:'NFM Lending', status:'Invited', last:'—' },
  ];

  // Onboarding checklist template
  const onboardSteps = [
    { id:'profile',  label:'Company profile & contract', icon:'accounts' },
    { id:'sources',  label:'Connect a data source',      icon:'sources' },
    { id:'accounts', label:'Import accounts',            icon:'upload' },
    { id:'team',     label:'Invite the team',            icon:'accounts' },
    { id:'review',   label:'Generate first review',      icon:'sparkle' },
  ];

  const roleById = (id) => roles.find(r=>r.id===id) || roles[4];
  const fmtM = (n) => n>=1000000 ? '$'+(n/1000000).toFixed(2).replace(/\.00$/,'')+'M' : n>=1000 ? '$'+Math.round(n/1000)+'K' : (n?('$'+n):'—');

  return { roles, caps, matrix, clients, users, onboardSteps, roleById, fmtM };
})();
