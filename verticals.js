/* ============================================================
   MillionPulse AI — Customer Success verticals (super-admin)
   The industries where Million Square offers CS-as-a-service and runs
   QBRs/EBRs. Each vertical carries a dummy dashboard, metrics, sample
   clients, and its EBR + QBR blueprint.
   ============================================================ */
window.VERTICALS = (function () {

  const verticals = [
    {
      id:'saas', name:'SaaS & Software', icon:'layers', color:'#5B4BE6', status:'active',
      desc:'Product-led B2B software. CS drives adoption, seat expansion, and NRR.',
      clients:6, arr:3280000, avgHealth:77, csTeam:4, cadence:'EBR + QBR',
      clientNames:['Experience.com','Brightwave','Lumen','Sable & Co.'],
      metrics:[
        {label:'Net Revenue Retention', value:'112%', sub:'Trailing 12 mo'},
        {label:'Avg. seat adoption', value:'78%', sub:'Across portfolio'},
        {label:'Gross churn', value:'4.1%', sub:'Annualized'},
        {label:'Time-to-value', value:'34 days', sub:'Median onboarding'},
      ],
      accounts:[
        {name:'Experience.com', logo:'E', health:88, arr:'$1.2M', csm:'Priya Nair'},
        {name:'Brightwave SaaS', logo:'BW', health:82, arr:'$236K', csm:'Marcus Lee'},
        {name:'Lumen Media', logo:'LM', health:74, arr:'$184K', csm:'Priya Nair'},
      ],
      ebr:['Executive summary','Business outcomes & ROI','Product adoption & value','Expansion & whitespace','Strategic alignment','Risks & mitigation','Roadmap & renewal'],
      qbr:['Quarter snapshot','Adoption & usage','Value delivered','Support & health','Open risks','Next-quarter plan'],
    },
    {
      id:'fintech', name:'FinTech & RegTech', icon:'chart', color:'#0E9F9A', status:'active',
      desc:'High-trust financial platforms. CS balances compliance, reliability, and growth.',
      clients:3, arr:1740000, avgHealth:81, csTeam:2, cadence:'EBR + QBR',
      clientNames:['Vertex Financial','Harbor Credit Union'],
      metrics:[
        {label:'Platform uptime', value:'99.98%', sub:'SLA adherence'},
        {label:'Compliance score', value:'A', sub:'Audit readiness'},
        {label:'NRR', value:'119%', sub:'Trailing 12 mo'},
        {label:'Exec engagement', value:'High', sub:'QBR attendance'},
      ],
      accounts:[
        {name:'Vertex Financial', logo:'VF', health:91, arr:'$1.24M', csm:'Marcus Lee'},
        {name:'Harbor Credit Union', logo:'HC', health:82, arr:'$236K', csm:'Priya Nair'},
      ],
      ebr:['Executive summary','Trust & reliability scorecard','Compliance & risk posture','Value & ROI realized','Regulatory roadmap alignment','Renewal & partnership'],
      qbr:['Quarter snapshot','Reliability & incidents','Compliance status','Adoption & usage','Risks & escalations','Next-quarter plan'],
    },
    {
      id:'mortgage', name:'Mortgage & Lending', icon:'book', color:'#F26430', status:'active',
      desc:'Lenders & mortgage brands. CS ties agent performance, reviews & Search Rank to renewal.',
      clients:8, arr:4216000, avgHealth:78, csTeam:8, cadence:'EBR (Experience.com system)',
      clientNames:['TowneBank Mortgage','Atlantic Bay','Synergy One','NOVA Home Loans'],
      metrics:[
        {label:'Org NPS', value:'94', sub:'Weighted avg'},
        {label:'Avg. Search Rank Score', value:'241', sub:'vs platform 250'},
        {label:'Review reply rate', value:'88%', sub:'Google reviews'},
        {label:'Seat utilization', value:'86%', sub:'Active / contracted'},
      ],
      accounts:[
        {name:'TowneBank Mortgage', logo:'TB', health:92, arr:'$412K', csm:'Divyanshu Srivastava'},
        {name:'Atlantic Bay Mortgage Group', logo:'AB', health:90, arr:'$1.12M', csm:'Megha Upadhyay'},
        {name:'Synergy One Lending', logo:'SO', health:88, arr:'$960K', csm:'Niharika Vichhivora'},
      ],
      // Experience.com EBR System structure
      ebr:['Cover & story in three acts','Performance scorecard','Performance panorama','Verdict & action timeline','Team ranking (LO & SRS)','Renewal information','SRP550 current package','SRP850 premium upgrade'],
      qbr:['Quarter snapshot','LO performance & NPS','Search Rank movement','Review generation & replies','Risks & coaching focus','Next-quarter plan'],
    },
    {
      id:'healthtech', name:'HealthTech', icon:'heart', color:'#E11D48', status:'active',
      desc:'Clinical & patient platforms. CS protects outcomes, integrations, and satisfaction.',
      clients:2, arr:820000, avgHealth:68, csTeam:2, cadence:'EBR + QBR',
      clientNames:['Cedar Health','Evergreen Health'],
      metrics:[
        {label:'Patient satisfaction', value:'4.6', sub:'Out of 5'},
        {label:'Integration uptime', value:'99.9%', sub:'EHR connections'},
        {label:'Adoption', value:'64%', sub:'Clinician active use'},
        {label:'Time-to-value', value:'58 days', sub:'Go-live to value'},
      ],
      accounts:[
        {name:'Cedar Health Systems', logo:'CH', health:68, arr:'$520K', csm:'Marcus Lee'},
        {name:'Evergreen Health', logo:'EH', health:66, arr:'$300K', csm:'Priya Nair'},
      ],
      ebr:['Executive summary','Clinical outcomes & value','Adoption by role','Integration & reliability','Compliance (HIPAA) posture','Risks & mitigation','Roadmap & renewal'],
      qbr:['Quarter snapshot','Clinician adoption','Outcomes delivered','Integration health','Open risks','Next-quarter plan'],
    },
    {
      id:'logistics', name:'Logistics & Supply Chain', icon:'sources', color:'#2A6FDB', status:'active',
      desc:'Industrial & supply-chain platforms. CS ties throughput and reliability to renewal.',
      clients:6, arr:3492000, avgHealth:69, csTeam:2, cadence:'EBR + QBR',
      clientNames:['Milltex','Atlas Manufacturing','Vertex Industrial'],
      metrics:[
        {label:'On-time throughput', value:'94%', sub:'SLA target 95%'},
        {label:'Platform adoption', value:'66%', sub:'Across sites'},
        {label:'NRR', value:'104%', sub:'Trailing 12 mo'},
        {label:'At-risk ARR', value:'$1.0M', sub:'2 accounts'},
      ],
      accounts:[
        {name:'Vertex Industrial', logo:'VI', health:88, arr:'$1.12M', csm:'Aisha Khan'},
        {name:'Northwind Logistics', logo:'NL', health:71, arr:'$445K', csm:'Diego Torres'},
        {name:'Atlas Manufacturing', logo:'AM', health:49, arr:'$960K', csm:'Aisha Khan'},
      ],
      ebr:['Executive summary','Operational performance','Adoption across sites','Value & efficiency gains','Reliability & support','Risks & mitigation','Roadmap & renewal'],
      qbr:['Quarter snapshot','Throughput & SLAs','Site adoption','Support & incidents','Open risks','Next-quarter plan'],
    },
    {
      id:'hrtech', name:'HR Tech & WorkTech', icon:'accounts', color:'#7A5AE0', status:'planned',
      desc:'Talent, payroll & workforce platforms. CS drives activation and executive QBRs.',
      clients:0, arr:0, avgHealth:null, csTeam:0, cadence:'EBR + QBR',
      clientNames:[],
      metrics:[
        {label:'Target NRR', value:'110%+', sub:'Benchmark'},
        {label:'Activation', value:'—', sub:'User activation'},
        {label:'Pipeline', value:'4 prospects', sub:'GTM stage'},
        {label:'Est. TAM', value:'$2.1M', sub:'Serviceable ARR'},
      ],
      accounts:[],
      ebr:['Executive summary','Workforce outcomes','Module adoption','Value & ROI','Compliance posture','Roadmap & renewal'],
      qbr:['Quarter snapshot','User activation','Adoption by module','Support & health','Risks','Next-quarter plan'],
    },
    {
      id:'martech', name:'MarTech & AdTech', icon:'sparkle', color:'#D4A93E', status:'planned',
      desc:'Marketing & advertising platforms. CS ties campaign ROI to expansion.',
      clients:0, arr:0, avgHealth:null, csTeam:0, cadence:'EBR + QBR',
      clientNames:[],
      metrics:[
        {label:'Target NRR', value:'115%+', sub:'Benchmark'},
        {label:'Campaign ROI', value:'—', sub:'Attributed'},
        {label:'Pipeline', value:'3 prospects', sub:'GTM stage'},
        {label:'Est. TAM', value:'$1.6M', sub:'Serviceable ARR'},
      ],
      accounts:[],
      ebr:['Executive summary','Campaign performance & ROI','Feature adoption','Attributed value','Strategic alignment','Roadmap & renewal'],
      qbr:['Quarter snapshot','Campaign results','Adoption & usage','Support & health','Risks','Next-quarter plan'],
    },
    {
      id:'cyber', name:'Cybersecurity', icon:'flag', color:'#10B981', status:'planned',
      desc:'Security platforms. CS protects trust, response time, and multi-year renewals.',
      clients:0, arr:0, avgHealth:null, csTeam:0, cadence:'EBR + QBR',
      clientNames:[],
      metrics:[
        {label:'Target NRR', value:'120%+', sub:'Benchmark'},
        {label:'Threat coverage', value:'—', sub:'Deployed modules'},
        {label:'Pipeline', value:'5 prospects', sub:'GTM stage'},
        {label:'Est. TAM', value:'$2.8M', sub:'Serviceable ARR'},
      ],
      accounts:[],
      ebr:['Executive summary','Security posture & coverage','Incident response value','Adoption & maturity','Compliance alignment','Roadmap & renewal'],
      qbr:['Quarter snapshot','Coverage & detections','Response metrics','Adoption','Risks','Next-quarter plan'],
    },
  ];

  const fmtM = (n) => n >= 1000000 ? '$'+(n/1000000).toFixed(2).replace(/\.00$/,'')+'M' : n>=1000 ? '$'+Math.round(n/1000)+'K' : '$'+n;
  return { verticals, fmtM };
})();
