/* ============================================================
   MillionPulse AI — Level 1 · Clients (list + Add Client wizard + detail)
   ============================================================ */

function CStatus({ s }) {
  const map = { Active:'pill-good', Onboarding:'pill-warn', Prospect:'pill-neutral', Churned:'pill-risk' };
  return <span className={'pill '+(map[s]||'pill-neutral')}>{s==='Active'&&<span className="dot" style={{background:'var(--good)'}}></span>}{s}</span>;
}

function MiniStepper({ step, steps }) {
  return (
    <div className="row" style={{gap:0,marginBottom:26}}>
      {steps.map((s,i)=>(
        <React.Fragment key={i}>
          <div className="row gap8" style={{opacity:i<=step?1:.45}}>
            <div style={{width:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,background:i<step?'var(--good)':i===step?'var(--primary)':'var(--line-2)',color:i<=step?'#fff':'var(--text-3)',fontFamily:'var(--font-display)'}}>{i<step?<Icon name="check" size={14} sw={3}/>:i+1}</div>
            <span style={{fontSize:12.5,fontWeight:600,color:i===step?'var(--text)':'var(--text-2)'}}>{s}</span>
          </div>
          {i<steps.length-1 && <div style={{flex:1,height:2,background:i<step?'var(--good)':'var(--line)',margin:'0 12px',borderRadius:2}}></div>}
        </React.Fragment>
      ))}
    </div>
  );
}

function LField({ label, children }) {
  return <label style={{display:'block'}}><span style={{display:'block',fontSize:12,fontWeight:600,color:'var(--text-2)',marginBottom:5}}>{label}</span>{children}</label>;
}

/* ---------- Add Client wizard ---------- */
function AddClient({ onCancel, onCreate }) {
  const [step,setStep]=React.useState(0);
  const steps=['Profile','Contract','Data','Team','Review'];
  const [f,setF]=React.useState({
    name:'', domain:'', vertical:(window.VERTICALS?VERTICALS.verticals[0].name:'SaaS & Software'), region:'NA', plan:'Enterprise',
    contractStart:'', autoRenewal:'', termStart:'', seats:'', arr:'', cadence:'Both',
    sources:{CRM:true,'Product usage':false,Support:true,'Health & NPS':true},
  });
  const [team,setTeam]=React.useState([{email:'',role:'wsadmin'}]);
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  const toggleSrc=(k)=>setF(x=>({...x,sources:{...x.sources,[k]:!x.sources[k]}}));
  const logo=(f.name||'?').split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
  const canNext = step===0 ? (f.name.trim().length>1 && /\S+\.\S+/.test(f.domain)) : step===3 ? team.some(t=>/\S+@\S+/.test(t.email)) : true;

  const verticalsList = window.VERTICALS ? VERTICALS.verticals : [];
  const roleName = (id)=> CLIENTS.roleById(id).name;

  const finish=()=> onCreate({
    id:'c'+Date.now(), name:f.name.trim(), domain:f.domain.trim(), logo, vertical:f.vertical, plan:f.plan,
    arr: f.arr? Number(String(f.arr).replace(/[^0-9]/g,'')) : 0, accounts:0, health:null, status:'Onboarding',
    region:f.region, lead: team.find(t=>t.role==='csm')?.email || '—', users: team.filter(t=>/\S+@\S+/.test(t.email)).length,
    renewal: f.autoRenewal||'—', onboarded:45, sources:Object.values(f.sources).filter(Boolean).length, hasWorkspace:false,
  });

  return (
    <div className="content-inner fade-up" style={{maxWidth:820}}>
      <div className="row" style={{justifyContent:'space-between',marginBottom:6}}>
        <h1 style={{fontSize:22}}>Add a client</h1>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}><Icon name="x" size={15}/>Cancel</button>
      </div>
      <p className="muted" style={{marginTop:0,marginBottom:22,fontSize:14}}>Onboard a new B2B client and spin up their Customer Success workspace.</p>

      <div className="card card-pad" style={{padding:'26px 28px'}}>
        <MiniStepper step={step} steps={steps}/>

        {step===0 && (
          <div className="fade-up grid gap16" style={{gridTemplateColumns:'1fr 1fr'}}>
            <LField label="Company name"><input className="winput" value={f.name} placeholder="e.g. NFM Lending" onChange={e=>set('name',e.target.value)} autoFocus/></LField>
            <LField label="Domain"><input className="winput" value={f.domain} placeholder="company.com" onChange={e=>set('domain',e.target.value)}/></LField>
            <LField label="Vertical"><select className="winput" value={f.vertical} onChange={e=>set('vertical',e.target.value)}>{verticalsList.map(v=><option key={v.id}>{v.name}</option>)}</select></LField>
            <LField label="Region"><select className="winput" value={f.region} onChange={e=>set('region',e.target.value)}>{['NA','EMEA','APAC','LATAM'].map(r=><option key={r}>{r}</option>)}</select></LField>
            <LField label="Plan / tier"><input className="winput" value={f.plan} placeholder="e.g. Enterprise, SRP550" onChange={e=>set('plan',e.target.value)}/></LField>
            <div className="row gap12" style={{alignItems:'center',paddingTop:22}}><div style={{width:40,height:40,borderRadius:10,background:'linear-gradient(135deg,#8B6BF0,#6A4BD8)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontFamily:'var(--font-display)'}}>{logo}</div><span className="muted" style={{fontSize:12.5}}>Workspace logo (auto)</span></div>
          </div>
        )}

        {step===1 && (
          <div className="fade-up">
            <div className="grid gap16" style={{gridTemplateColumns:'1fr 1fr 1fr'}}>
              <LField label="Contract start"><input type="date" className="winput" value={f.contractStart} onChange={e=>set('contractStart',e.target.value)}/></LField>
              <LField label="Auto-renewal date"><input type="date" className="winput" value={f.autoRenewal} onChange={e=>set('autoRenewal',e.target.value)}/></LField>
              <LField label="Renewal term start"><input type="date" className="winput" value={f.termStart} onChange={e=>set('termStart',e.target.value)}/></LField>
              <LField label="Contracted seats"><input className="winput" value={f.seats} placeholder="e.g. 320" onChange={e=>set('seats',e.target.value)}/></LField>
              <LField label="Annual value (ARR)"><input className="winput" value={f.arr} placeholder="e.g. 540000" onChange={e=>set('arr',e.target.value)}/></LField>
              <LField label="Review cadence"><select className="winput" value={f.cadence} onChange={e=>set('cadence',e.target.value)}>{['Both (EBR + QBR)','EBR only','QBR only'].map(c=><option key={c}>{c}</option>)}</select></LField>
            </div>
            <div className="row gap12" style={{marginTop:16,padding:'12px 14px',border:'1px solid var(--line)',borderRadius:11,background:'var(--surface-2)'}}>
              <Icon name="layers" size={18} stroke="var(--primary)"/>
              <span style={{fontSize:13}}>Review blueprint will follow the <b>{f.vertical}</b> vertical templates. QBR eligibility applies at ≥ $5K ARR.</span>
            </div>
          </div>
        )}

        {step===2 && (
          <div className="fade-up">
            <label className="wiz-label">Connect data sources <span className="muted" style={{fontWeight:400,textTransform:'none',letterSpacing:0}}>— accounts & signals sync from here</span></label>
            <div className="grid gap12" style={{gridTemplateColumns:'1fr 1fr'}}>
              {[['CRM','cloud','Salesforce / HubSpot'],['Product usage','chart','Pendo / Amplitude'],['Support','ticket','Zendesk / Intercom'],['Health & NPS','heart','Delighted / Gainsight']].map(([k,ic,ex])=>(
                <button key={k} onClick={()=>toggleSrc(k)} className="pick" style={{borderColor:f.sources[k]?'var(--primary)':'var(--line)'}}>
                  <div style={{width:34,height:34,borderRadius:8,background:'var(--surface-2)',border:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-2)'}}><Icon name={ic} size={17}/></div>
                  <div style={{textAlign:'left',flex:1}}><div style={{fontWeight:600,fontSize:13.5}}>{k}</div><div className="muted" style={{fontSize:11.5}}>{ex}</div></div>
                  <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${f.sources[k]?'var(--primary)':'var(--line)'}`,background:f.sources[k]?'var(--primary)':'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>{f.sources[k]&&<Icon name="check" size={12} stroke="#fff" sw={3.5}/>}</div>
                </button>
              ))}
            </div>
            <div className="row gap8" style={{marginTop:14,fontSize:12.5,color:'var(--text-3)'}}><Icon name="upload" size={14}/>You can also import accounts via CSV after the workspace is created.</div>
          </div>
        )}

        {step===3 && (
          <div className="fade-up">
            <label className="wiz-label">Invite the team <span className="muted" style={{fontWeight:400,textTransform:'none',letterSpacing:0}}>— assign a role to each person</span></label>
            <div className="grid gap8">
              {team.map((t,i)=>(
                <div key={i} className="row gap8">
                  <input className="winput" style={{flex:2}} type="email" value={t.email} placeholder="name@company.com" onChange={e=>setTeam(a=>a.map((x,j)=>j===i?{...x,email:e.target.value}:x))}/>
                  <select className="winput" style={{flex:1}} value={t.role} onChange={e=>setTeam(a=>a.map((x,j)=>j===i?{...x,role:e.target.value}:x))}>
                    {CLIENTS.roles.filter(r=>r.id!=='superadmin').map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                  <button className="btn btn-ghost btn-sm" style={{padding:8}} onClick={()=>setTeam(a=>a.filter((_,j)=>j!==i))}><Icon name="x" size={15}/></button>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm" style={{marginTop:10}} onClick={()=>setTeam(a=>[...a,{email:'',role:'csm'}])}><Icon name="plus" size={14}/>Add another</button>
          </div>
        )}

        {step===4 && (
          <div className="fade-up">
            <label className="wiz-label">Review & create</label>
            <div className="card" style={{overflow:'hidden'}}>
              <div className="row card-pad" style={{gap:14,background:'linear-gradient(120deg,#1A2D5C,#233A75)',color:'#fff'}}>
                <div style={{width:44,height:44,borderRadius:11,background:'rgba(255,255,255,.14)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontFamily:'var(--font-display)',flex:'0 0 44px'}}>{logo}</div>
                <div style={{flex:1}}><div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:16,color:'#fff'}}>{f.name||'New client'}</div><div style={{fontSize:12.5,color:'#CFE0F5'}}>{f.domain} · {f.vertical} · {f.plan}</div></div>
                <span className="pill pill-warn">Onboarding</span>
              </div>
              <div className="grid gap12" style={{gridTemplateColumns:'1fr 1fr',padding:'16px 20px'}}>
                {[['Region',f.region],['ARR',f.arr?CLIENTS.fmtM(Number(String(f.arr).replace(/[^0-9]/g,''))):'—'],['Seats',f.seats||'—'],['Cadence',f.cadence],['Auto-renewal',f.autoRenewal||'—'],['Data sources',Object.values(f.sources).filter(Boolean).length+' connected']].map(([k,v])=>(
                  <div key={k} className="row" style={{justifyContent:'space-between',fontSize:13.5,paddingBottom:6,borderBottom:'1px solid var(--line-2)'}}><span className="muted">{k}</span><b>{v}</b></div>
                ))}
              </div>
              <div style={{padding:'0 20px 18px'}}>
                <div className="muted" style={{fontSize:12,fontWeight:600,marginBottom:8}}>TEAM ({team.filter(t=>/\S+@\S+/.test(t.email)).length})</div>
                <div className="grid gap8">{team.filter(t=>/\S+@\S+/.test(t.email)).map((t,i)=>(<div key={i} className="row gap8" style={{fontSize:13}}><Avatar name={t.email.split('@')[0].replace(/\./g,' ')} size={22}/><span>{t.email}</span><span className="tag" style={{marginLeft:'auto'}}>{roleName(t.role)}</span></div>))}</div>
              </div>
            </div>
          </div>
        )}

        <div className="row" style={{justifyContent:'space-between',marginTop:26,paddingTop:20,borderTop:'1px solid var(--line-2)'}}>
          <button className="btn btn-ghost" onClick={()=>step===0?onCancel():setStep(step-1)}><Icon name="arrowLeft" size={16}/>{step===0?'Cancel':'Back'}</button>
          <button className="btn btn-primary" disabled={!canNext} style={{opacity:canNext?1:.5}} onClick={()=>step===4?finish():setStep(step+1)}>{step===4?'Create client workspace':'Continue'}<Icon name={step===4?'check':'arrowRight'} size={16}/></button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Client detail (onboarding) ---------- */
function ClientDetail({ client, onBack, onOpenWorkspace }) {
  const [done,setDone]=React.useState(()=>{
    const base={profile:true, sources:client.sources>0, accounts:client.accounts>0, team:client.users>0, review:client.status==='Active'};
    return base;
  });
  const steps=CLIENTS.onboardSteps;
  const pct = Math.round(Object.values(done).filter(Boolean).length/steps.length*100);
  const cUsers = CLIENTS.users.filter(u=>u.client===client.name);
  const toggle=(id)=>setDone(d=>({...d,[id]:!d[id]}));

  return (
    <div className="content-inner fade-up">
      <div className="row" style={{justifyContent:'space-between',marginBottom:18}}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}><Icon name="arrowLeft" size={15}/>All clients</button>
        <div className="row gap8">
          <Btn size="sm" icon="edit">Edit</Btn>
          {client.hasWorkspace
            ? <Btn variant="primary" size="sm" icon="arrowRight" onClick={()=>onOpenWorkspace(client.id)}>Open workspace</Btn>
            : <Btn variant="primary" size="sm" icon="sparkle">Continue onboarding</Btn>}
        </div>
      </div>

      <div className="row gap16" style={{marginBottom:22,alignItems:'center'}}>
        <div style={{width:58,height:58,borderRadius:15,background:'linear-gradient(135deg,#8B6BF0,#6A4BD8)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontFamily:'var(--font-display)',fontSize:22,flex:'0 0 58px'}}>{client.logo}</div>
        <div style={{flex:1}}><div className="row gap12"><h1 style={{fontSize:24}}>{client.name}</h1><CStatus s={client.status}/></div><p className="muted" style={{fontSize:14,margin:'4px 0 0'}}>{client.domain} · {client.vertical} · {client.plan} · {client.region}</p></div>
      </div>

      <div className="grid gap16" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:16}}>
        {[['ARR',CLIENTS.fmtM(client.arr)],['Accounts',client.accounts],['Users',client.users],['Renewal',client.renewal]].map(([k,v])=>(
          <div key={k} className="card card-pad"><div className="muted" style={{fontSize:12.5,fontWeight:600,marginBottom:6}}>{k}</div><div style={{fontFamily:'var(--font-display)',fontSize:24,fontWeight:600}}>{v}</div></div>
        ))}
      </div>

      <div className="grid gap16" style={{gridTemplateColumns:'1.1fr 1fr',alignItems:'start'}}>
        {/* Onboarding checklist */}
        <div className="card card-pad">
          <div className="row" style={{justifyContent:'space-between',marginBottom:6}}><h3 style={{fontSize:16}}>Onboarding</h3><span style={{fontFamily:'var(--font-display)',fontWeight:600,color: pct===100?'var(--good)':'var(--primary)'}}>{pct}%</span></div>
          <div className="hbar" style={{width:'100%',marginBottom:16}}><i style={{width:pct+'%',background:pct===100?'var(--good)':'var(--primary)'}}></i></div>
          <div className="grid gap8">
            {steps.map(s=>(
              <button key={s.id} onClick={()=>toggle(s.id)} className="row gap12" style={{padding:'11px 12px',border:'1px solid var(--line)',borderRadius:10,background:done[s.id]?'var(--good-wash)':'var(--surface)',cursor:'pointer',textAlign:'left',fontFamily:'var(--font-body)'}}>
                <div style={{width:24,height:24,borderRadius:'50%',flex:'0 0 24px',display:'flex',alignItems:'center',justifyContent:'center',background:done[s.id]?'var(--good)':'var(--line-2)',color:done[s.id]?'#fff':'var(--text-3)'}}>{done[s.id]?<Icon name="check" size={13} sw={3}/>:<Icon name={s.icon} size={13}/>}</div>
                <span style={{flex:1,fontSize:13.5,fontWeight:600,textDecoration:done[s.id]?'none':'none',color:done[s.id]?'var(--text)':'var(--text-2)'}}>{s.label}</span>
                {!done[s.id] && <span className="tag" style={{background:'var(--primary-wash)',color:'var(--primary-ink)'}}>Do</span>}
              </button>
            ))}
          </div>
          {client.accounts===0 && <button className="btn btn-ghost" style={{width:'100%',justifyContent:'center',marginTop:14}}><Icon name="upload" size={15}/>Import accounts (CSV)</button>}
        </div>

        {/* Team on this client */}
        <div className="card" style={{overflow:'hidden'}}>
          <div className="row card-pad" style={{justifyContent:'space-between',paddingBottom:10}}><h3 style={{fontSize:16}}>Team & access</h3><Btn size="sm" icon="plus">Invite</Btn></div>
          {cUsers.length? (
            <table className="tbl tbl-tight"><tbody>
              {cUsers.map(u=>{const r=CLIENTS.roleById(u.role);return (
                <tr key={u.email}><td><div className="row gap10"><Avatar name={u.name} size={28}/><div><div style={{fontWeight:600,fontSize:13.5}}>{u.name}</div><div className="muted" style={{fontSize:11.5}}>{u.email}</div></div></div></td>
                <td><span className="pill" style={{background:r.color+'1a',color:r.color}}>{r.name}</span></td>
                <td style={{textAlign:'right'}}><span className={'pill '+(u.status==='Active'?'pill-good':'pill-warn')}>{u.status}</span></td></tr>
              );})}
            </tbody></table>
          ) : <div style={{padding:'26px 20px',textAlign:'center'}}><div className="muted" style={{fontSize:13}}>No users yet — invite the client's team to get started.</div></div>}
        </div>
      </div>
    </div>
  );
}

/* ---------- Clients list ---------- */
function ClientsPage({ onOpenWorkspace }) {
  const [items,setItems]=React.useState(CLIENTS.clients);
  const [view,setView]=React.useState('list'); // list | add | <clientId>
  const [tab,setTab]=React.useState('All');

  if (view==='add') return <AddClient onCancel={()=>setView('list')} onCreate={(c)=>{setItems(l=>[...l,c]);setView(c.id);}}/>;
  if (view!=='list') { const c=items.find(x=>x.id===view); if(c) return <ClientDetail client={c} onBack={()=>setView('list')} onOpenWorkspace={onOpenWorkspace}/>; }

  let rows=items;
  if (tab!=='All') rows=items.filter(c=>c.status===tab);

  return (
    <div className="content-inner fade-up">
      <div className="row" style={{justifyContent:'space-between',marginBottom:18,alignItems:'flex-start'}}>
        <div><h1 style={{fontSize:26,marginBottom:6}}>Clients</h1><p className="muted" style={{fontSize:14.5,margin:0}}>Every B2B client Million Square runs Customer Success for.</p></div>
        <Btn variant="primary" icon="plus" onClick={()=>setView('add')}>Add client</Btn>
      </div>
      <div className="row" style={{justifyContent:'space-between',marginBottom:16}}>
        <FilterTabs tabs={['All','Active','Onboarding','Prospect']} active={tab} onChange={setTab}/>
        <span className="muted" style={{fontSize:13}}>{rows.length} client{rows.length!==1?'s':''}</span>
      </div>
      <div className="card" style={{overflowX:'auto'}}>
        <table className="tbl tbl-tight">
          <thead><tr><th>Client</th><th>Vertical</th><th>Plan</th><th>ARR</th><th>Accounts</th><th>Users</th><th>Onboarding</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map(c=>(
              <tr key={c.id} onClick={()=>setView(c.id)}>
                <td><div className="row gap12"><div style={{width:34,height:34,borderRadius:9,flex:'0 0 34px',background:'linear-gradient(135deg,#8B6BF0,#6A4BD8)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontFamily:'var(--font-display)',fontSize:13}}>{c.logo}</div><div><div style={{fontWeight:600}}>{c.name}</div><div className="muted" style={{fontSize:12}}>{c.domain}</div></div></div></td>
                <td className="muted" style={{fontSize:13,whiteSpace:'nowrap'}}>{c.vertical}</td>
                <td><span className="tag">{c.plan}</span></td>
                <td className="mono" style={{fontWeight:600}}>{CLIENTS.fmtM(c.arr)}</td>
                <td className="mono">{c.accounts||'—'}</td>
                <td className="mono">{c.users||'—'}</td>
                <td style={{minWidth:110}}><div className="row gap8"><div className="hbar" style={{width:60}}><i style={{width:c.onboarded+'%',background:c.onboarded===100?'var(--good)':'var(--primary)'}}></i></div><span className="mono" style={{fontSize:12}}>{c.onboarded}%</span></div></td>
                <td><CStatus s={c.status}/></td>
                <td style={{textAlign:'right'}}>{c.hasWorkspace?<button className="btn btn-ghost btn-sm" onClick={(e)=>{e.stopPropagation();onOpenWorkspace(c.id);}}><Icon name="arrowRight" size={14}/>Open</button>:<Icon name="chevronRight" size={16} style={{color:'var(--text-3)'}}/>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { ClientsPage, LField });
