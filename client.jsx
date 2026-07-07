/* ============================================================
   MillionPulse AI — Client Portal (Level 2)
   The B2B client's own scoped login → their working workspace:
   Dashboard, Accounts, Reviews, Templates, Data Sources, Generate.
   NO admin console, NO cross-client switcher. Fixed to one workspace.
   Reuses the app screens (Dashboard/Accounts/Reviews/Templates/Sources/
   GenerateWizard/ReviewView) which are already workspace-scoped.
   ============================================================ */

const CLIENT_USER = { name:'Sarah Mitchell', role:'VP, Customer Experience' };
const CLIENT_WS_ID = 'exp'; // this client's workspace

const CNAV = [
  ['dashboard','Dashboard','dashboard'],
  ['accounts','Accounts','accounts'],
  ['reviews','Reviews','reviews'],
  ['templates','Templates','templates'],
  ['sources','Data Sources','sources'],
];

function ClientSidebar({ ws, route, go, onGenerate, onSignOut }) {
  const counts = { accounts: ws.accounts.length, reviews: ws.reviews.length };
  const at = (id) => route===id || (id==='reviews' && (route==='review'||route==='generate'));
  return (
    <aside className="sidebar">
      <div className="brand" style={{cursor:'pointer'}} onClick={()=>go('dashboard')}>
        <BrandMark size={38}/>
        <div><div className="brand-name">MillionPulse<span style={{color:'var(--pulse)'}}> AI</span></div><div className="brand-sub">Client Portal</div></div>
      </div>

      <div className="nav-label" style={{paddingTop:6}}>Your organization</div>
      <div className="ws-switch" style={{margin:'0 6px 10px',cursor:'default'}}>
        <div className="ws-logo" style={{background:'linear-gradient(135deg,#8B6BF0,#6A4BD8)'}}>{ws.logo}</div>
        <div style={{flex:1,textAlign:'left',lineHeight:1.2}}><div style={{fontSize:13.5,fontWeight:600,color:'#fff'}}>{ws.name}</div><div style={{fontSize:11,color:'#6E7691'}}>{ws.plan} workspace</div></div>
      </div>

      <button className="btn btn-primary" style={{margin:'0 6px 8px',justifyContent:'center'}} onClick={onGenerate}>
        <Icon name="sparkle" size={16}/> Generate review
      </button>

      <div className="nav-label">Workspace</div>
      {CNAV.map(([id,label,ic])=>(
        <button key={id} className={'nav-item'+(at(id)?' active':'')} onClick={()=>go(id)}>
          <Icon name={ic} className="ic" size={18}/><span>{label}</span>
          {counts[id]!=null && <span className="nav-badge">{counts[id]}</span>}
        </button>
      ))}

      <div className="sidebar-foot">
        <div className="user-chip">
          <Avatar name={CLIENT_USER.name} size={32}/>
          <div style={{lineHeight:1.2,overflow:'hidden',flex:1}}><div style={{fontSize:13,fontWeight:600,color:'#fff',whiteSpace:'nowrap'}}>{CLIENT_USER.name}</div><div style={{fontSize:11,color:'#6E7691',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{CLIENT_USER.role}</div></div>
          <button onClick={onSignOut} title="Sign out" style={{border:'none',background:'none',color:'#8891AB',cursor:'pointer',padding:6,borderRadius:8,display:'flex'}}><Icon name="logout" size={17}/></button>
        </div>
      </div>
    </aside>
  );
}

const CTITLES = { dashboard:'Dashboard', accounts:'Accounts', reviews:'Reviews', templates:'Templates', sources:'Data Sources', generate:'Generate review', review:'Review' };

function ClientPortal({ onSignOut }) {
  const ws = MP.getWorkspace(CLIENT_WS_ID);
  const [route,setRoute]=React.useState('dashboard');
  const [gen,setGen]=React.useState(null);
  const [cfg,setCfg]=React.useState(null);

  const go=(r)=>setRoute(r);
  const startGen=(acct,tpl)=>{ setGen({preAccount:acct||null, preTemplate:tpl||null}); setRoute('generate'); };
  const openAccount=(a)=>startGen(a);
  const openReview=(r)=>{
    const acct = ws.accounts.find(a=>a.name===r.account) || ws.accounts[0];
    if (r.kind==='EBR' && ws.ebrSystem && r.tier) {
      const structure = r.structure || 'single';
      setCfg({ acct, kind:'EBR', ebr:true, structure, tier:r.tier, deckFile:MP.ebrFileFor(structure,r.tier), onePagerFile:MP.EBR_ONEPAGER,
        deckName:`${structure==='multi'?'Multi':'Single'}-Account · ${r.tier}`, slides:r.tier==='SRP550'?8:6, multiBrand:structure==='multi',
        brief:{ org:r.account, period:'June 2025 – May 2026', tier:r.tier } });
    } else setCfg({ acct, kind:r.kind, tpl:{name:r.template} });
    setRoute('review');
  };
  const previewTemplate=(t)=> { setCfg({ ebr:true, preview:true, deckFile:t.file, onePagerFile:t.onePager, deckName:t.name, slides:t.slides, structure:t.structure, tier:t.tier, multiBrand:t.structure==='multi' }); setRoute('review'); };

  const title = route==='review'&&cfg ? (cfg.acct?`${cfg.acct.name} · ${cfg.kind}`:(cfg.deckName||'Review')) : CTITLES[route];

  return (
    <div className="app">
      <ClientSidebar ws={ws} route={route} go={go} onGenerate={()=>startGen()} onSignOut={onSignOut}/>
      <main className="main">
        <header className="topbar">
          {route==='review'||route==='generate' ? <div className="crumb">Reviews</div> : null}
          <div className="page-title">{title}</div>
          <div className="ws-chip" style={{marginLeft:'auto'}}><div className="ws-logo" style={{background:'linear-gradient(135deg,#8B6BF0,#6A4BD8)',width:20,height:20,flex:'0 0 20px',fontSize:10}}>{ws.logo}</div><span>{ws.name}</span></div>
          <button className="btn btn-ghost btn-sm" style={{padding:'8px'}} aria-label="Notifications"><Icon name="bell" size={17}/></button>
        </header>
        <div className="content">
          {route==='dashboard' && <Dashboard ws={ws} go={go} openAccount={openAccount} onGenerate={startGen} userName={CLIENT_USER.name.split(' ')[0]}/>}
          {route==='accounts'  && <Accounts ws={ws} openAccount={openAccount} onGenerate={startGen}/>}
          {route==='reviews'   && <Reviews ws={ws} openReview={openReview} onGenerate={startGen}/>}
          {route==='templates' && <Templates ws={ws} onGenerate={startGen} onPreview={previewTemplate}/>}
          {route==='sources'   && <Sources ws={ws}/>}
          {route==='generate'  && <GenerateWizard ws={ws} preAccount={gen?.preAccount} preTemplate={gen?.preTemplate} onCancel={()=>go('reviews')} onComplete={(c)=>{setCfg(c);setRoute('review');}}/>}
          {route==='review' && cfg && <ReviewView cfg={cfg} onBack={()=>go('reviews')}/>}
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { ClientPortal });
