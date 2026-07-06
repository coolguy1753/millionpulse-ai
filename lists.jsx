/* ============================================================
   MillionPulse AI — list screens: Accounts / Reviews / Templates / Sources
   ============================================================ */

function FilterTabs({ tabs, active, onChange }) {
  return (
    <div className="row gap8" style={{background:'var(--surface-2)',border:'1px solid var(--line)',borderRadius:10,padding:3}}>
      {tabs.map(t=>(
        <button key={t} onClick={()=>onChange(t)} style={{
          border:'none',padding:'6px 13px',borderRadius:8,fontSize:13,fontWeight:600,fontFamily:'var(--font-body)',cursor:'pointer',
          background: active===t?'var(--surface)':'transparent', color: active===t?'var(--text)':'var(--text-2)',
          boxShadow: active===t?'var(--shadow-sm)':'none'
        }}>{t}</button>
      ))}
    </div>
  );
}

function Accounts({ ws, openAccount, onGenerate }) {
  const [tab, setTab] = React.useState('All');
  const admin = !!ws.ebrSystem; // Experience.com admin can edit contract dates
  const [ovr, setOvr] = React.useState(()=>{ try { return JSON.parse(localStorage.getItem('mp_contract_dates')||'{}'); } catch(e){ return {}; } });
  const [editing, setEditing] = React.useState(null); // {id, field}

  const effDate = (a,f)=> (ovr[a.id] && ovr[a.id][f]) || (f==='autoRenewal' ? a.ebr && a.ebr.autoRenewal : a.ebr && a.ebr.termStart);
  const toISO = (s)=>{ if(/^\d{4}-\d{2}-\d{2}$/.test(s||'')) return s; const d=s?new Date(s):null; if(!d||isNaN(d)) return ''; return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const save = (id,f,iso)=> setOvr(o=>{ const n={...o,[id]:{...(o[id]||{}),[f]:iso}}; try{localStorage.setItem('mp_contract_dates',JSON.stringify(n));}catch(e){} return n; });

  let rows = ws.accounts;
  if (tab==='At risk') rows = rows.filter(a=>a.health<60);
  else if (tab==='Watch') rows = rows.filter(a=>a.health>=60&&a.health<75);
  else if (tab==='Healthy') rows = rows.filter(a=>a.health>=75);
  // default sort: soonest auto-renewal first
  rows = [...rows].sort((a,b)=>{ const da=new Date(effDate(a,'autoRenewal')||'2999-01-01'), db=new Date(effDate(b,'autoRenewal')||'2999-01-01'); return da-db; });

  const winPill = (w) => {
    if (!w) return null;
    if (w.state==='open') return <span className="pill pill-good"><span className="dot" style={{background:'var(--good)'}}></span>Open now</span>;
    if (w.state==='closed') return <span className="pill pill-neutral">Closed</span>;
    return <span className="pill pill-warn">Opens in {w.daysToStart}d</span>;
  };
  const initials = (n)=> n.split(/[\s-]+/).map(w=>w[0]).slice(0,2).join('');

  const dateCell = (a, field, muted) => {
    const val = effDate(a, field);
    if (editing && editing.id===a.id && editing.field===field) {
      return <input type="date" className="winput" style={{width:148,padding:'5px 8px'}} defaultValue={toISO(val)} autoFocus
        onClick={e=>e.stopPropagation()}
        onKeyDown={e=>{ if(e.key==='Enter') e.target.blur(); if(e.key==='Escape') setEditing(null); }}
        onBlur={e=>{ if(e.target.value) save(a.id,field,e.target.value); setEditing(null); }} />;
    }
    return (
      <span className="row gap8" style={{cursor:admin?'pointer':'inherit',whiteSpace:'nowrap'}}
        onClick={admin?(e)=>{e.stopPropagation();setEditing({id:a.id,field});}:undefined}>
        <span className="mono" style={{color:muted?'var(--text-2)':'var(--text)'}}>{MP.fmtDate(val)}</span>
        {admin && <Icon name="edit" size={12} style={{color:'var(--text-3)'}}/>}
      </span>
    );
  };

  return (
    <div className="content-inner fade-up">
      <div className="row" style={{justifyContent:'space-between',marginBottom:18}}>
        <FilterTabs tabs={['All','At risk','Watch','Healthy']} active={tab} onChange={setTab}/>
        <div className="row gap12">
          {admin && <span className="pill pill-neutral" title="Experience.com admin — click a renewal date to edit"><Icon name="edit" size={12}/>Admin</span>}
          <Btn icon="download" size="sm">Export</Btn>
          <Btn variant="primary" icon="sparkle" onClick={()=>onGenerate()}>Generate review</Btn>
        </div>
      </div>
      <div className="card" style={{overflowX:'auto'}}>
        <table className="tbl tbl-tight">
          <thead><tr><th>Account</th><th>CSM</th><th>Search Rank Specialist</th><th>ARR</th><th>Auto-Renewal Date{admin&&' ✎'}</th><th>Renewal Date{admin&&' ✎'}</th><th>EBR Window</th><th>QBR Status</th><th></th></tr></thead>
          <tbody>
            {rows.map(a=>{
              const w = MP.ebrWindow(effDate(a,'autoRenewal'));
              const qbr = MP.qbrEligible(a.arr);
              return (
                <tr key={a.id} onClick={()=>openAccount(a)}>
                  <td><div className="row gap12"><LogoChip text={a.logo} size={34} color={a.health>=75?'pulse':'primary'}/><div><div style={{fontWeight:600}}>{a.name}</div><div className="muted" style={{fontSize:12}}>{a.tier}</div></div></div></td>
                  <td><div className="row gap8" style={{whiteSpace:'nowrap'}}><Avatar name={a.csm} size={24}/><span style={{fontSize:13}}>{a.csm}</span></div></td>
                  <td>{a.srSpecialist
                    ? <div className="row gap8" style={{whiteSpace:'nowrap'}}><span style={{width:24,height:24,borderRadius:'50%',flex:'0 0 24px',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--pulse-wash)',color:'#0879A0',fontSize:10,fontWeight:700}}>{initials(a.srSpecialist)}</span><span style={{fontSize:13}}>{a.srSpecialist}</span></div>
                    : <span className="muted">—</span>}</td>
                  <td className="mono" style={{fontWeight:600}}>{MP.fmtMoney(a.arr)}</td>
                  <td>{dateCell(a,'autoRenewal',false)}</td>
                  <td>{dateCell(a,'termStart',true)}</td>
                  <td>
                    <div style={{fontSize:12.5,fontWeight:600,marginBottom:3,whiteSpace:'nowrap'}} className="mono">{w?w.rangeStr:'—'}</div>
                    {winPill(w)}
                  </td>
                  <td>
                    {qbr
                      ? <div><span className="pill pill-good"><Icon name="check" size={11} sw={3} stroke="var(--good)"/>Eligible</span><div className="muted" style={{fontSize:11,marginTop:3}}>Quarterly cadence</div></div>
                      : <div><span className="pill pill-neutral">Not eligible</span><div className="muted" style={{fontSize:11,marginTop:3}}>Below ${MP.QBR_MIN_ARR/1000}K ARR</div></div>}
                  </td>
                  <td style={{textAlign:'right'}}><button className="btn btn-ghost btn-sm" onClick={(e)=>{e.stopPropagation();onGenerate(a);}}><Icon name="sparkle" size={14}/>Generate</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Reviews({ ws, openReview, onGenerate }) {
  const [tab, setTab] = React.useState('All');
  let rows = ws.reviews;
  if (tab==='EBR') rows = rows.filter(r=>r.kind==='EBR');
  else if (tab==='QBR') rows = rows.filter(r=>r.kind==='QBR');
  else if (tab==='Drafts') rows = rows.filter(r=>r.status!=='Published');

  return (
    <div className="content-inner fade-up">
      <div className="row" style={{justifyContent:'space-between',marginBottom:18}}>
        <FilterTabs tabs={['All','EBR','QBR','Drafts']} active={tab} onChange={setTab}/>
        <Btn variant="primary" icon="sparkle" onClick={()=>onGenerate()}>Generate review</Btn>
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr><th>Account</th><th>Type</th><th>Template</th><th>Quarter</th><th>Owner</th><th>Status</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id} onClick={()=>openReview(r)}>
                <td><div className="row gap12"><LogoChip text={r.logo} size={34} color={r.kind==='EBR'?'primary':'pulse'}/><span style={{fontWeight:600}}>{r.account}</span></div></td>
                <td><KindPill kind={r.kind}/></td>
                <td className="muted" style={{fontSize:13}}>{r.template}</td>
                <td className="mono muted" style={{fontSize:13}}>{r.quarter}</td>
                <td><div className="row gap8"><Avatar name={r.owner} size={24}/><span style={{fontSize:13}}>{r.owner}</span></div></td>
                <td><StatusPill status={r.status}/></td>
                <td className="muted" style={{fontSize:13}}>{r.date}</td>
                <td style={{textAlign:'right'}}><button className="btn btn-ghost btn-sm" onClick={(e)=>{e.stopPropagation();openReview(r);}}><Icon name="eye" size={14}/>Open</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Templates({ ws, onGenerate, onPreview }) {
  const list = ws.templates || MP.templates;
  const ebrSystem = list.filter(t=>t.system);
  const others = list.filter(t=>!t.system);

  const GenericCard = (t) => (
    <div key={t.id} className="card card-pad" style={{display:'flex',flexDirection:'column',gap:12,position:'relative'}}>
      {t.popular && <span className="pill pill-warn" style={{position:'absolute',top:16,right:16}}>Popular</span>}
      <div style={{width:44,height:44,borderRadius:12,background:`var(--${t.color}-wash)`,display:'flex',alignItems:'center',justifyContent:'center',color:`var(--${t.color})`}}><Icon name={t.kind==='EBR'?'target':'layers'} size={22}/></div>
      <div>
        <div className="row gap8" style={{marginBottom:5}}><KindPill kind={t.kind}/><span className="muted" style={{fontSize:12}}>{t.sections} sections</span></div>
        <h3 style={{fontSize:16.5,marginBottom:6}}>{t.name}</h3>
        <p className="muted" style={{fontSize:13,lineHeight:1.5,margin:0}}>{t.desc}</p>
      </div>
      <div className="row" style={{justifyContent:'space-between',marginTop:'auto',paddingTop:6}}>
        <span className="tag">{t.use}</span>
        <Btn variant="primary" size="sm" icon="sparkle" onClick={()=>onGenerate(null,t)}>Use</Btn>
      </div>
    </div>
  );

  return (
    <div className="content-inner fade-up">
      {ebrSystem.length > 0 && (
        <div style={{marginBottom:28}}>
          <div className="row" style={{justifyContent:'space-between',alignItems:'flex-end',marginBottom:14}}>
            <div>
              <div className="row gap8" style={{marginBottom:4}}>
                <div style={{width:22,height:22,borderRadius:6,background:'linear-gradient(135deg,#5BAFFF,#1c55c6)',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{width:7,height:7,borderRadius:'50%',background:'#F26430'}}></span></div>
                <h3 style={{fontSize:17}}>Experience.com EBR System</h3>
                <span className="pill pill-neutral">Locked templates</span>
              </div>
              <span className="muted" style={{fontSize:13}}>Structure is fixed — MillionPulse fills every slide from the intake brief + 4 uploaded reports.</span>
            </div>
          </div>
          <div className="grid gap16" style={{gridTemplateColumns:'repeat(2,1fr)'}}>
            {ebrSystem.map(t=>(
              <div key={t.id} className="card" style={{overflow:'hidden',position:'relative',display:'flex',flexDirection:'column'}}>
                <div style={{padding:'18px 20px',background:'linear-gradient(120deg,#1A2D5C,#233A75)',color:'#F2F5FF'}}>
                  <div className="row gap8" style={{marginBottom:10}}>
                    <span className="pill" style={{background:'rgba(91,175,255,.2)',color:'#7DC3FF'}}>{t.structure==='multi'?'Multi-brand':'Single account'}</span>
                    <span className="pill" style={{background:t.tier==='SRP850'?'rgba(245,200,66,.18)':'rgba(242,100,48,.18)',color:t.tier==='SRP850'?'#F5C842':'#FF7A45'}}>{t.tier}</span>
                    {t.popular && <span className="pill" style={{background:'rgba(255,255,255,.16)',color:'#fff'}}>Most used</span>}
                    <span style={{marginLeft:'auto',fontSize:12,color:'#9DB5D6',fontWeight:600,whiteSpace:'nowrap'}}>{t.slides} slides</span>
                  </div>
                  <h3 style={{fontSize:18,color:'#fff'}}>{t.name}</h3>
                  <p style={{fontSize:12.5,lineHeight:1.5,margin:'6px 0 0',color:'#CFE0F5'}}>{t.desc}</p>
                </div>
                <div className="row card-pad" style={{justifyContent:'space-between',alignItems:'center'}}>
                  <span className="muted" style={{fontSize:12}}>{t.upsell ? 'Includes SRP550→850 upsell' : 'No upsell slides'} · + 1-pager</span>
                  <div className="row gap8">
                    <Btn size="sm" icon="eye" onClick={()=>onPreview(t)}>Preview</Btn>
                    <Btn variant="primary" size="sm" icon="sparkle" onClick={()=>onGenerate(null,t)}>Use</Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {others.length > 0 && (
        <div>
          {ebrSystem.length > 0 && <div className="nav-label" style={{color:'var(--text-3)',padding:'0 0 12px'}}>Quarterly reviews</div>}
          <div className="grid gap16" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
            {others.map(GenericCard)}
          </div>
        </div>
      )}
    </div>
  );
}

function Sources({ ws }) {
  const [srcs, setSrcs] = React.useState(ws.sources);
  const cats = ['CRM','Product usage','Support','Health & NPS'];
  const toggle = (id) => setSrcs(s=>s.map(x=>x.id===id?{...x,status:x.status==='connected'?'available':'connected'}:x));
  const connected = srcs.filter(s=>s.status==='connected').length;
  return (
    <div className="content-inner fade-up">
      <div className="card card-pad" style={{marginBottom:16,display:'flex',alignItems:'center',gap:16}}>
        <div style={{width:44,height:44,borderRadius:12,background:'var(--good-wash)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--good)'}}><Icon name="check" size={22}/></div>
        <div style={{flex:1}}><h3 style={{fontSize:16}}>{connected} sources connected</h3><span className="muted" style={{fontSize:13}}>MillionPulse pulls live data from these to draft reviews automatically.</span></div>
        <Btn icon="upload">Upload files</Btn>
      </div>
      {cats.map(cat=>(
        <div key={cat} style={{marginBottom:20}}>
          <div className="nav-label" style={{color:'var(--text-3)',padding:'0 0 10px'}}>{cat}</div>
          <div className="grid gap16" style={{gridTemplateColumns:'repeat(2,1fr)'}}>
            {srcs.filter(s=>s.cat===cat).map(s=>(
              <div key={s.id} className="card card-pad row" style={{gap:14}}>
                <div style={{width:40,height:40,borderRadius:10,background:'var(--surface-2)',border:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-2)'}}><Icon name={s.icon} size={20}/></div>
                <div style={{flex:1}}><div style={{fontWeight:600}}>{s.name}</div><div className="muted" style={{fontSize:12.5}}>{s.detail}</div></div>
                {s.status==='connected'
                  ? <button className="pill pill-good" style={{border:'none',cursor:'pointer'}} onClick={()=>toggle(s.id)}><span className="dot" style={{background:'var(--good)'}}></span>Connected</button>
                  : <Btn size="sm" onClick={()=>toggle(s.id)}>Connect</Btn>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Accounts, Reviews, Templates, Sources });
