/* ============================================================
   MillionPulse AI — Level 1 (HQ) · Template Library, All Reviews,
   Billing & Plans, Settings
   ============================================================ */

const HQTEMPLATES = [
  { name:'Single-Account · SRP850', kind:'EBR', vertical:'Mortgage & Lending', ver:'v2.1', status:'Live', clients:6, updated:'Jun 2026' },
  { name:'Single-Account · SRP550', kind:'EBR', vertical:'Mortgage & Lending', ver:'v2.1', status:'Live', clients:8, updated:'Jun 2026' },
  { name:'Multi-Account · SRP850', kind:'EBR', vertical:'Mortgage & Lending', ver:'v2.0', status:'Live', clients:3, updated:'May 2026' },
  { name:'Multi-Account · SRP550', kind:'EBR', vertical:'Mortgage & Lending', ver:'v2.0', status:'Live', clients:4, updated:'May 2026' },
  { name:'EBR One-Pager Summary', kind:'EBR', vertical:'Mortgage & Lending', ver:'v1.4', status:'Live', clients:8, updated:'Jun 2026' },
  { name:'Executive Business Review', kind:'EBR', vertical:'SaaS & Software', ver:'v2.2', status:'Live', clients:4, updated:'Jun 2026' },
  { name:'Standard QBR', kind:'QBR', vertical:'Cross-vertical', ver:'v3.0', status:'Live', clients:5, updated:'Jun 2026' },
  { name:'Adoption-Focused QBR', kind:'QBR', vertical:'SaaS & Software', ver:'v1.2', status:'Live', clients:2, updated:'Apr 2026' },
  { name:'At-Risk Recovery QBR', kind:'QBR', vertical:'Cross-vertical', ver:'v1.1', status:'Live', clients:3, updated:'Mar 2026' },
  { name:'ROI & Value EBR', kind:'EBR', vertical:'FinTech & RegTech', ver:'v1.0', status:'Draft', clients:0, updated:'Jul 2026' },
  { name:'Clinical Outcomes EBR', kind:'EBR', vertical:'HealthTech', ver:'v0.9', status:'Draft', clients:0, updated:'Jul 2026' },
];

function HQStat({ label, value, sub, icon, accent }) {
  return (
    <div className="card card-pad" style={{display:'flex',flexDirection:'column',gap:10}}>
      <div className="row" style={{justifyContent:'space-between'}}>
        <span className="muted" style={{fontSize:13,fontWeight:600}}>{label}</span>
        <div style={{width:32,height:32,borderRadius:9,background:`var(--${accent}-wash)`,display:'flex',alignItems:'center',justifyContent:'center',color:`var(--${accent})`}}><Icon name={icon} size={17}/></div>
      </div>
      <span style={{fontFamily:'var(--font-display)',fontSize:28,fontWeight:600,letterSpacing:'-.03em'}}>{value}</span>
      <span className="muted" style={{fontSize:12.5}}>{sub}</span>
    </div>
  );
}

/* ---------- Template Library ---------- */
function TemplateLibrary() {
  const [tab,setTab]=React.useState('All');
  let rows=HQTEMPLATES;
  if(tab==='EBR') rows=rows.filter(t=>t.kind==='EBR');
  else if(tab==='QBR') rows=rows.filter(t=>t.kind==='QBR');
  else if(tab==='Drafts') rows=rows.filter(t=>t.status==='Draft');
  const live=HQTEMPLATES.filter(t=>t.status==='Live').length;
  const verts=new Set(HQTEMPLATES.map(t=>t.vertical)).size;
  return (
    <div className="content-inner fade-up">
      <div className="row" style={{justifyContent:'space-between',marginBottom:18,alignItems:'flex-start'}}>
        <div><h1 style={{fontSize:26,marginBottom:6}}>Template Library</h1><p className="muted" style={{fontSize:14.5,margin:0}}>The master catalog of EBR & QBR blueprints across every vertical.</p></div>
        <Btn variant="primary" icon="plus">New template</Btn>
      </div>
      <div className="grid gap16" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:16}}>
        <HQStat label="Templates" value={HQTEMPLATES.length} sub="In library" icon="templates" accent="primary"/>
        <HQStat label="Live" value={live} sub="In production" icon="check" accent="good"/>
        <HQStat label="Drafts" value={HQTEMPLATES.length-live} sub="In development" icon="edit" accent="warn"/>
        <HQStat label="Verticals covered" value={verts} sub="Across the catalog" icon="layers" accent="pulse"/>
      </div>
      <div style={{marginBottom:14}}><FilterTabs tabs={['All','EBR','QBR','Drafts']} active={tab} onChange={setTab}/></div>
      <div className="card" style={{overflowX:'auto'}}>
        <table className="tbl tbl-tight">
          <thead><tr><th>Template</th><th>Type</th><th>Vertical</th><th>Version</th><th>Used by</th><th>Status</th><th>Updated</th><th></th></tr></thead>
          <tbody>
            {rows.map((t,i)=>(
              <tr key={i}>
                <td><div className="row gap12"><div style={{width:32,height:32,borderRadius:8,flex:'0 0 32px',background:t.kind==='EBR'?'var(--primary-wash)':'var(--pulse-wash)',color:t.kind==='EBR'?'var(--primary)':'#0879A0',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={t.kind==='EBR'?'target':'layers'} size={16}/></div><span style={{fontWeight:600}}>{t.name}</span></div></td>
                <td><KindPill kind={t.kind}/></td>
                <td className="muted" style={{fontSize:13,whiteSpace:'nowrap'}}>{t.vertical}</td>
                <td className="mono" style={{fontSize:13}}>{t.ver}</td>
                <td className="mono">{t.clients||'—'}</td>
                <td><span className={'pill '+(t.status==='Live'?'pill-good':'pill-neutral')}>{t.status==='Live'&&<span className="dot" style={{background:'var(--good)'}}></span>}{t.status}</span></td>
                <td className="muted" style={{fontSize:13,whiteSpace:'nowrap'}}>{t.updated}</td>
                <td style={{textAlign:'right'}}><button className="btn btn-ghost btn-sm" style={{padding:8}}><Icon name="edit" size={15}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- All Reviews (global) ---------- */
function AllReviews() {
  const [tab,setTab]=React.useState('All');
  const all=[];
  (window.MP?MP.workspaces:[]).forEach(w=>(w.reviews||[]).forEach(r=>all.push({client:w.name,logo:w.logo,account:r.account,kind:r.kind,template:r.template,status:r.status,owner:r.owner,date:r.date})));
  let rows=all;
  if(tab==='EBR') rows=rows.filter(r=>r.kind==='EBR');
  else if(tab==='QBR') rows=rows.filter(r=>r.kind==='QBR');
  else if(tab==='Drafts') rows=rows.filter(r=>r.status!=='Published');
  const pub=all.filter(r=>r.status==='Published').length;
  return (
    <div className="content-inner fade-up">
      <div style={{marginBottom:18}}><h1 style={{fontSize:26,marginBottom:6}}>All reviews</h1><p className="muted" style={{fontSize:14.5,margin:0}}>Every EBR & QBR generated across all client workspaces.</p></div>
      <div className="grid gap16" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:16}}>
        <HQStat label="Total reviews" value={all.length} sub="All time" icon="reviews" accent="primary"/>
        <HQStat label="Published" value={pub} sub="Shared with clients" icon="check" accent="good"/>
        <HQStat label="In progress" value={all.length-pub} sub="Draft / in review" icon="clock" accent="warn"/>
        <HQStat label="This quarter" value={all.length} sub="Q2 FY26" icon="sparkle" accent="pulse"/>
      </div>
      <div style={{marginBottom:14}}><FilterTabs tabs={['All','EBR','QBR','Drafts']} active={tab} onChange={setTab}/></div>
      <div className="card" style={{overflowX:'auto'}}>
        <table className="tbl tbl-tight">
          <thead><tr><th>Client</th><th>Account</th><th>Type</th><th>Template</th><th>Owner</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i}>
                <td><div className="row gap10"><div style={{width:28,height:28,borderRadius:7,flex:'0 0 28px',background:'linear-gradient(135deg,#8B6BF0,#6A4BD8)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontFamily:'var(--font-display)',fontSize:11}}>{r.logo}</div><span style={{fontWeight:600,fontSize:13.5}}>{r.client}</span></div></td>
                <td style={{fontSize:13.5}}>{r.account}</td>
                <td><KindPill kind={r.kind}/></td>
                <td className="muted" style={{fontSize:13,whiteSpace:'nowrap'}}>{r.template}</td>
                <td><div className="row gap8"><Avatar name={r.owner} size={22}/><span style={{fontSize:13}}>{r.owner}</span></div></td>
                <td><StatusPill status={r.status}/></td>
                <td className="muted" style={{fontSize:13,whiteSpace:'nowrap'}}>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Billing & Plans ---------- */
function BillingPage() {
  const cl=window.CLIENTS?CLIENTS.clients:[];
  const arr=cl.reduce((s,c)=>s+(c.arr||0),0);
  const mrr=Math.round(arr/12);
  const activeSubs=cl.filter(c=>c.status==='Active').length;
  const billStatus=(c)=> c.status==='Active'?'Paid':c.status==='Onboarding'?'Trial':'—';
  return (
    <div className="content-inner fade-up">
      <div className="row" style={{justifyContent:'space-between',marginBottom:18,alignItems:'flex-start'}}>
        <div><h1 style={{fontSize:26,marginBottom:6}}>Billing & Plans</h1><p className="muted" style={{fontSize:14.5,margin:0}}>Subscriptions and revenue across your client book.</p></div>
        <Btn icon="download">Export invoices</Btn>
      </div>
      <div className="grid gap16" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:16}}>
        <HQStat label="MRR" value={CLIENTS.fmtM(mrr)} sub="Monthly recurring" icon="trendUp" accent="good"/>
        <HQStat label="ARR" value={CLIENTS.fmtM(arr)} sub="Annual recurring" icon="chart" accent="primary"/>
        <HQStat label="Active subscriptions" value={activeSubs} sub={`${cl.length} accounts total`} icon="check" accent="pulse"/>
        <HQStat label="Net revenue retention" value="108%" sub="Trailing 12 mo" icon="heart" accent="good"/>
      </div>
      <div className="card" style={{overflowX:'auto'}}>
        <table className="tbl tbl-tight">
          <thead><tr><th>Client</th><th>Plan</th><th>MRR</th><th>ARR</th><th>Billing</th><th>Renewal</th><th></th></tr></thead>
          <tbody>
            {cl.map(c=>(
              <tr key={c.id}>
                <td><div className="row gap12"><div style={{width:32,height:32,borderRadius:8,flex:'0 0 32px',background:'linear-gradient(135deg,#8B6BF0,#6A4BD8)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontFamily:'var(--font-display)',fontSize:12}}>{c.logo}</div><div><div style={{fontWeight:600}}>{c.name}</div><div className="muted" style={{fontSize:12}}>{c.vertical}</div></div></div></td>
                <td><span className="tag">{c.plan}</span></td>
                <td className="mono" style={{fontWeight:600}}>{c.arr?CLIENTS.fmtM(Math.round(c.arr/12)):'—'}</td>
                <td className="mono">{CLIENTS.fmtM(c.arr)}</td>
                <td><span className={'pill '+(billStatus(c)==='Paid'?'pill-good':billStatus(c)==='Trial'?'pill-warn':'pill-neutral')}>{billStatus(c)}</span></td>
                <td className="muted" style={{fontSize:13}}>{c.renewal}</td>
                <td style={{textAlign:'right'}}><button className="btn btn-ghost btn-sm">Invoice</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Settings ---------- */
function Toggle({ on, onToggle }) {
  return <button onClick={onToggle} style={{width:44,height:26,borderRadius:20,border:'none',cursor:'pointer',background:on?'var(--primary)':'var(--line)',position:'relative',transition:'background .15s'}}><span style={{position:'absolute',top:3,left:on?21:3,width:20,height:20,borderRadius:'50%',background:'#fff',transition:'left .15s',boxShadow:'0 1px 3px rgba(0,0,0,.2)'}}></span></button>;
}
function SettingRow({ title, desc, control }) {
  return <div className="row gap16" style={{padding:'14px 0',borderBottom:'1px solid var(--line-2)'}}><div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{title}</div><div className="muted" style={{fontSize:12.5,marginTop:2}}>{desc}</div></div>{control}</div>;
}
function HQSettings() {
  const [t,setT]=React.useState({sso:true, twofa:true, notif:true, digest:false});
  const set=(k)=>setT(x=>({...x,[k]:!x[k]}));
  return (
    <div className="content-inner fade-up" style={{maxWidth:820}}>
      <div style={{marginBottom:20}}><h1 style={{fontSize:26,marginBottom:6}}>Settings</h1><p className="muted" style={{fontSize:14.5,margin:0}}>Organization, security, and platform configuration.</p></div>

      <div className="card card-pad" style={{marginBottom:16}}>
        <h3 style={{fontSize:16,marginBottom:6}}>Organization</h3>
        <SettingRow title="Organization name" desc="Shown across the platform" control={<input className="winput" style={{width:220}} defaultValue="Million Square Solutions"/>}/>
        <SettingRow title="Primary domain" desc="Used for team email invites" control={<input className="winput" style={{width:220}} defaultValue="millionsquare.com"/>}/>
        <SettingRow title="Brand color" desc="Accent across dashboards & reviews" control={<div className="row gap8">{['#5B4BE6','#14C6EE','#0E9F9A','#F26430'].map((c,i)=><span key={c} style={{width:24,height:24,borderRadius:'50%',background:c,border:i===0?'2px solid var(--text)':'2px solid transparent',cursor:'pointer'}}></span>)}</div>}/>
      </div>

      <div className="card card-pad" style={{marginBottom:16}}>
        <h3 style={{fontSize:16,marginBottom:6}}>Security</h3>
        <SettingRow title="Single Sign-On (SSO)" desc="Allow SAML / Google SSO for all users" control={<Toggle on={t.sso} onToggle={()=>set('sso')}/>}/>
        <SettingRow title="Enforce two-factor" desc="Require 2FA for every login" control={<Toggle on={t.twofa} onToggle={()=>set('twofa')}/>}/>
        <SettingRow title="Session timeout" desc="Auto sign-out after inactivity" control={<select className="winput" style={{width:140}} defaultValue="8 hours"><option>1 hour</option><option>8 hours</option><option>24 hours</option></select>}/>
      </div>

      <div className="card card-pad" style={{marginBottom:16}}>
        <h3 style={{fontSize:16,marginBottom:6}}>API access</h3>
        <SettingRow title="Production API key" desc="For programmatic review generation" control={<div className="row gap8"><code style={{fontFamily:'var(--font-body)',fontSize:12.5,background:'var(--surface-2)',border:'1px solid var(--line)',borderRadius:8,padding:'7px 11px',letterSpacing:'.05em'}}>mpk_live_••••••7f3a</code><button className="btn btn-ghost btn-sm">Regenerate</button></div>}/>
      </div>

      <div className="card card-pad">
        <h3 style={{fontSize:16,marginBottom:6}}>Notifications</h3>
        <SettingRow title="Review status alerts" desc="Notify when a review is published or needs review" control={<Toggle on={t.notif} onToggle={()=>set('notif')}/>}/>
        <SettingRow title="Weekly digest" desc="Portfolio summary email every Monday" control={<Toggle on={t.digest} onToggle={()=>set('digest')}/>}/>
      </div>
    </div>
  );
}

Object.assign(window, { TemplateLibrary, AllReviews, BillingPage, HQSettings });
