/* ============================================================
   MillionPulse AI — app root, routing, tweaks
   ============================================================ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#7C5CE6",
  "pulse": "#14C6EE",
  "radius": 14,
  "density": "regular",
  "sidebarDark": true
}/*EDITMODE-END*/;

const TITLES = {
  overview:['MillionPulse HQ', 'Million Square Solutions'],
  clients:['Clients', 'MillionPulse HQ'],
  verticals:['Verticals', 'MillionPulse HQ'],
  lib:['Template Library', 'MillionPulse HQ'],
  allreviews:['All Reviews', 'MillionPulse HQ'],
  billing:['Billing & Plans', 'MillionPulse HQ'],
  roles:['Team & Roles', 'MillionPulse HQ'],
  settings:['Settings', 'MillionPulse HQ'],
  dashboard:['Dashboard', null],
  accounts:['Accounts', 'Workspace'],
  reviews:['Reviews', 'Workspace'],
  templates:['Templates', 'Workspace'],
  sources:['Data Sources', 'Workspace'],
  generate:['Generate review', 'Reviews'],
  review:['Review', 'Reviews'],
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [user, setUser] = React.useState(null);
  const [booting, setBooting] = React.useState(true);
  const login = (u)=>{ setUser(u); try{ localStorage.setItem('mp_user', JSON.stringify(u)); }catch(e){} };
  const signOut = ()=>{ try{ window.MPAPI && window.MPAPI.logout(); }catch(e){} setUser(null); };

  // On load: if a session token exists, fetch the user + live data, then show the app.
  React.useEffect(()=>{ (async()=>{
    try {
      if (window.MPAPI && window.MPAPI.store.access) {
        const u = await window.MPAPI.me();
        await window.loadLiveData();
        setUser(u);
      }
    } catch(e) { try{ window.MPAPI && window.MPAPI.logout(); }catch(_){} }
    setBooting(false);
  })(); },[]);
  const [route, setRoute] = React.useState('overview');
  const [wsId, setWsId] = React.useState('exp');     // active workspace (tenant)
  const [gen, setGen] = React.useState(null);        // {preAccount, preTemplate}
  const [cfg, setCfg] = React.useState(null);        // generated review config
  const ws = MP.getWorkspace(wsId);

  // switching tenant clears any in-flight review/generation so data never crosses workspaces
  const switchWs = (id) => { setWsId(id); setRoute('dashboard'); setGen(null); setCfg(null); };
  const openWorkspace = (id) => { setWsId(id); setRoute('dashboard'); setGen(null); setCfg(null); };

  // apply tweaks to CSS vars
  React.useEffect(()=>{
    const r = document.documentElement.style;
    r.setProperty('--primary', t.primary);
    r.setProperty('--pulse', t.pulse);
    r.setProperty('--radius', t.radius+'px');
    const pad = t.density==='compact'?'14px':t.density==='comfy'?'28px':'20px';
    r.setProperty('--card-pad', pad);
    r.setProperty('--ink', t.sidebarDark?'#0B0F1A':'#1c2233');
  },[t]);

  const go = (r) => { setRoute(r); };
  const startGen = (acct, tpl) => { setGen({preAccount:acct||null, preTemplate:tpl||null}); setRoute('generate'); };
  const openReview = (r) => {
    // map a saved review row to a cfg (scoped to the active workspace)
    const acct = ws.accounts.find(a=>a.name===r.account) || ws.accounts[0];
    if (r.kind==='EBR' && ws.ebrSystem && r.tier) {
      const structure = r.structure || 'single';
      setCfg({ acct, reviewId:r.id, wsId:ws.id, kind:'EBR', ebr:true, structure, tier:r.tier, deckFile:MP.ebrFileFor(structure,r.tier), onePagerFile:MP.EBR_ONEPAGER,
        deckName:`${structure==='multi'?'Multi':'Single'}-Account · ${r.tier}`, slides:r.tier==='SRP550'?8:6, multiBrand:structure==='multi',
        brief:{ org:r.account, period:'June 2025 – May 2026', tier:r.tier } });
    } else {
      setCfg({ acct, reviewId:r.id, wsId:ws.id, kind:r.kind, tpl:{name:r.template} });
    }
    setRoute('review');
  };
  const previewTemplate = (t) => {
    setCfg({ ebr:true, preview:true, deckFile:t.file, onePagerFile:t.onePager, deckName:t.name, slides:t.slides, structure:t.structure, tier:t.tier, multiBrand:t.structure==='multi' });
    setRoute('review');
  };
  const openAccount = (a) => startGen(a);

  const [title, crumb] = TITLES[route] || ['', null];

  if (booting) return <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-3)',fontFamily:'var(--font-body)'}}>Loading…</div>;
  if (!user) return <Login onLogin={login}/>;

  return (
    <div className="app" style={{'--radius':t.radius+'px'}}>
      <Sidebar route={route} go={go} onGenerate={()=>startGen()} ws={ws} workspaces={MP.workspaces} onSwitch={switchWs} user={user} onSignOut={signOut}/>
      <main className="main">
        <Topbar title={route==='review'&&cfg?(cfg.acct?`${cfg.acct.name} · ${cfg.kind}`:(cfg.deckName||'Template preview')):title} crumbs={crumb} ws={['overview','clients','verticals','roles','lib','allreviews','billing','settings'].includes(route)?null:ws}/>
        <div className="content">
          {route==='overview'  && <AdminOverview go={go}/>}
          {route==='clients'   && <ClientsPage onOpenWorkspace={openWorkspace}/>}
          {route==='verticals' && <AdminConsole/>}
          {route==='lib'       && <TemplateLibrary/>}
          {route==='allreviews'&& <AllReviews/>}
          {route==='billing'   && <BillingPage/>}
          {route==='roles'     && <TeamRolesPage/>}
          {route==='settings'  && <HQSettings/>}
          {route==='dashboard' && <Dashboard key={wsId} ws={ws} go={go} openAccount={openAccount} onGenerate={startGen}/>}
          {route==='accounts'  && <Accounts key={wsId} ws={ws} openAccount={openAccount} onGenerate={startGen}/>}
          {route==='reviews'   && <Reviews key={wsId} ws={ws} openReview={openReview} onGenerate={startGen}/>}
          {route==='templates' && <Templates ws={ws} onGenerate={startGen} onPreview={previewTemplate}/>}
          {route==='sources'   && <Sources key={wsId} ws={ws}/>}
          {route==='generate'  && <GenerateWizard ws={ws} preAccount={gen?.preAccount} preTemplate={gen?.preTemplate}
                                    onCancel={()=>go('reviews')}
                                    onComplete={(c)=>{setCfg(c);setRoute('review');}}/>}
          {route==='review' && cfg && <ReviewView cfg={cfg} onBack={()=>go('reviews')}/>}
        </div>
      </main>

      <TweaksPanel>
        <TweakSection label="Brand color"/>
        <TweakColor label="Primary" value={t.primary} options={['#7C5CE6','#5B4BE6','#2A6FDB','#0E7C86','#D9534F']} onChange={v=>setTweak('primary',v)}/>
        <TweakColor label="Pulse accent" value={t.pulse} options={['#14C6EE','#12C7A6','#22C55E','#F5A524','#A855F7']} onChange={v=>setTweak('pulse',v)}/>
        <TweakSection label="Layout"/>
        <TweakSlider label="Corner radius" value={t.radius} min={4} max={22} unit="px" onChange={v=>setTweak('radius',v)}/>
        <TweakRadio label="Density" value={t.density} options={['compact','regular','comfy']} onChange={v=>setTweak('density',v)}/>
        <TweakToggle label="Dark sidebar" value={t.sidebarDark} onChange={v=>setTweak('sidebarDark',v)}/>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
