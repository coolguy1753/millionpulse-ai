/* ============================================================
   MillionPulse AI — Super-admin console (Customer Success verticals)
   Million Square's internal control center: manage the B2B verticals
   we serve, each with a dummy dashboard + EBR/QBR blueprint.
   ============================================================ */

function VOverview({ items }) {
  const active = items.filter(v=>v.status==='active');
  const clients = active.reduce((s,v)=>s+v.clients,0);
  const arr = active.reduce((s,v)=>s+v.arr,0);
  const csTeam = active.reduce((s,v)=>s+v.csTeam,0);
  const stats = [
    { label:'Verticals served', value:active.length, sub:`${items.length-active.length} in pipeline`, icon:'layers', accent:'primary' },
    { label:'Client companies', value:clients, sub:'Across active verticals', icon:'accounts', accent:'pulse' },
    { label:'ARR under management', value:VERTICALS.fmtM(arr), sub:'Combined book', icon:'trendUp', accent:'good' },
    { label:'CS team', value:csTeam, sub:'CSMs + specialists', icon:'heart', accent:'warn' },
  ];
  return (
    <div className="grid gap16" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:24}}>
      {stats.map(s=>(
        <div key={s.label} className="card card-pad" style={{display:'flex',flexDirection:'column',gap:10}}>
          <div className="row" style={{justifyContent:'space-between'}}>
            <span className="muted" style={{fontSize:13,fontWeight:600}}>{s.label}</span>
            <div style={{width:32,height:32,borderRadius:9,background:`var(--${s.accent}-wash)`,display:'flex',alignItems:'center',justifyContent:'center',color:`var(--${s.accent})`}}><Icon name={s.icon} size={17}/></div>
          </div>
          <span style={{fontFamily:'var(--font-display)',fontSize:30,fontWeight:600,letterSpacing:'-.03em'}}>{s.value}</span>
          <span className="muted" style={{fontSize:12.5}}>{s.sub}</span>
        </div>
      ))}
    </div>
  );
}

function VerticalCard({ v, onOpen }) {
  const planned = v.status==='planned';
  return (
    <button className="card card-pad vcard" onClick={()=>onOpen(v)} style={{textAlign:'left',cursor:'pointer',display:'flex',flexDirection:'column',gap:14,border:'1px solid var(--line)',background:'var(--surface)',fontFamily:'var(--font-body)'}}>
      <div className="row" style={{justifyContent:'space-between',alignItems:'flex-start'}}>
        <div style={{width:46,height:46,borderRadius:12,background:v.color+'1a',color:v.color,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={v.icon} size={23}/></div>
        <span className={'pill '+(planned?'pill-neutral':'pill-good')}>{planned ? 'Pipeline' : <><span className="dot" style={{background:'var(--good)'}}></span>Active</>}</span>
      </div>
      <div>
        <h3 style={{fontSize:17,marginBottom:5}}>{v.name}</h3>
        <p className="muted" style={{fontSize:13,lineHeight:1.5,margin:0}}>{v.desc}</p>
      </div>
      <div className="row gap16" style={{marginTop:'auto',paddingTop:12,borderTop:'1px solid var(--line-2)',fontSize:12.5}}>
        {planned
          ? <><span className="muted">Blueprint ready</span><span style={{marginLeft:'auto',color:v.color,fontWeight:600}}>Plan GTM →</span></>
          : <>
              <span><b style={{fontFamily:'var(--font-display)'}}>{v.clients}</b> <span className="muted">clients</span></span>
              <span><b style={{fontFamily:'var(--font-display)'}}>{VERTICALS.fmtM(v.arr)}</b> <span className="muted">ARR</span></span>
              <span><b style={{fontFamily:'var(--font-display)'}}>{v.avgHealth}</b> <span className="muted">health</span></span>
            </>}
      </div>
    </button>
  );
}

function AddVerticalModal({ onClose, onAdd }) {
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [icon, setIcon] = React.useState('target');
  const [color, setColor] = React.useState('#5B4BE6');
  const icons = ['target','layers','chart','book','heart','sources','accounts','sparkle','flag','cloud','ticket','templates'];
  const colors = ['#5B4BE6','#0E9F9A','#F26430','#E11D48','#2A6FDB','#D4A93E','#10B981','#7A5AE0'];
  const canAdd = name.trim().length>1;
  return ReactDOM.createPortal((
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="row" style={{justifyContent:'space-between',marginBottom:4}}>
          <h2 style={{fontSize:19}}>New vertical</h2>
          <button className="btn btn-ghost btn-sm" style={{padding:8}} onClick={onClose}><Icon name="x" size={16}/></button>
        </div>
        <p className="muted" style={{fontSize:13,marginTop:0,marginBottom:18}}>Add a Customer Success vertical to plan its dashboard and QBR/EBR blueprint.</p>
        <label style={{display:'block',marginBottom:14}}>
          <span style={{display:'block',fontSize:12,fontWeight:600,color:'var(--text-2)',marginBottom:5}}>Vertical name</span>
          <input className="winput" value={name} placeholder="e.g. EdTech, InsurTech, Telecom" onChange={e=>setName(e.target.value)} autoFocus/>
        </label>
        <label style={{display:'block',marginBottom:16}}>
          <span style={{display:'block',fontSize:12,fontWeight:600,color:'var(--text-2)',marginBottom:5}}>What CS does here</span>
          <input className="winput" value={desc} placeholder="One line on the CS motion in this vertical" onChange={e=>setDesc(e.target.value)}/>
        </label>
        <div className="row gap24" style={{marginBottom:22}}>
          <div>
            <span style={{display:'block',fontSize:12,fontWeight:600,color:'var(--text-2)',marginBottom:8}}>Icon</span>
            <div className="row" style={{flexWrap:'wrap',gap:6,maxWidth:230}}>
              {icons.map(ic=>(
                <button key={ic} onClick={()=>setIcon(ic)} style={{width:34,height:34,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',border:`1px solid ${icon===ic?color:'var(--line)'}`,background:icon===ic?color+'1a':'var(--surface)',color:icon===ic?color:'var(--text-2)'}}><Icon name={ic} size={17}/></button>
              ))}
            </div>
          </div>
          <div>
            <span style={{display:'block',fontSize:12,fontWeight:600,color:'var(--text-2)',marginBottom:8}}>Color</span>
            <div className="row" style={{flexWrap:'wrap',gap:8,maxWidth:170}}>
              {colors.map(c=>(
                <button key={c} onClick={()=>setColor(c)} style={{width:26,height:26,borderRadius:'50%',cursor:'pointer',background:c,border:color===c?'2px solid var(--text)':'2px solid transparent',boxShadow:color===c?'0 0 0 2px #fff inset':'none'}}></button>
              ))}
            </div>
          </div>
        </div>
        <div className="row" style={{justifyContent:'flex-end',gap:10}}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!canAdd} style={{opacity:canAdd?1:.5}}
            onClick={()=>onAdd({ id:'v'+Date.now(), name:name.trim(), desc:desc.trim()||'Customer Success motion to be defined.', icon, color, status:'planned',
              clients:0, arr:0, avgHealth:null, csTeam:0, cadence:'EBR + QBR', clientNames:[],
              metrics:[{label:'Target NRR',value:'110%+',sub:'Benchmark'},{label:'Pipeline',value:'New',sub:'GTM stage'},{label:'Est. TAM',value:'TBD',sub:'Serviceable ARR'},{label:'Status',value:'Planning',sub:'Blueprint stage'}],
              accounts:[],
              ebr:['Executive summary','Business outcomes & ROI','Adoption & value','Strategic alignment','Risks & mitigation','Roadmap & renewal'],
              qbr:['Quarter snapshot','Adoption & usage','Value delivered','Support & health','Open risks','Next-quarter plan'] })}>
            <Icon name="check" size={16}/>Add vertical
          </button>
        </div>
      </div>
    </div>
  ), document.body);
}

function StructurePanel({ title, tag, sections, color }) {
  return (
    <div className="card" style={{overflow:'hidden'}}>
      <div className="row card-pad" style={{justifyContent:'space-between',paddingBottom:12,borderBottom:'1px solid var(--line-2)'}}>
        <div className="row gap8"><Icon name={tag==='EBR'?'target':'layers'} size={17} stroke={color}/><h3 style={{fontSize:16}}>{title}</h3></div>
        <span className={'pill '+(tag==='EBR'?'pill-ebr':'pill-qbr')}>{tag}</span>
      </div>
      <div style={{padding:'6px 8px'}}>
        {sections.map((s,i)=>(
          <div key={i} className="row gap12" style={{padding:'9px 12px',borderRadius:8}}>
            <span style={{fontFamily:'var(--font-display)',fontSize:12.5,fontWeight:700,color,fontVariantNumeric:'tabular-nums',minWidth:20}}>{String(i+1).padStart(2,'0')}</span>
            <span style={{fontSize:14}}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VerticalDetail({ v, onBack }) {
  const planned = v.status==='planned';
  return (
    <div className="content-inner fade-up">
      <div className="row" style={{justifyContent:'space-between',marginBottom:18}}>
        <button className="btn btn-ghost btn-sm" onClick={onBack}><Icon name="arrowLeft" size={15}/>All verticals</button>
        <div className="row gap8">
          <Btn size="sm" icon="edit">Edit blueprint</Btn>
          <Btn variant="primary" size="sm" icon={planned?'sparkle':'arrowRight'}>{planned?'Plan go-to-market':'Open client workspaces'}</Btn>
        </div>
      </div>

      <div className="row gap16" style={{marginBottom:22,alignItems:'center'}}>
        <div style={{width:60,height:60,borderRadius:15,background:v.color+'1a',color:v.color,display:'flex',alignItems:'center',justifyContent:'center',flex:'0 0 60px'}}><Icon name={v.icon} size={30}/></div>
        <div style={{flex:1}}>
          <div className="row gap12"><h1 style={{fontSize:24}}>{v.name}</h1><span className={'pill '+(planned?'pill-neutral':'pill-good')}>{planned?'Pipeline':'Active'}</span></div>
          <p className="muted" style={{fontSize:14,margin:'4px 0 0'}}>{v.desc}</p>
        </div>
        <div style={{textAlign:'right'}}><div className="muted" style={{fontSize:12}}>Review cadence</div><div style={{fontWeight:600,fontFamily:'var(--font-display)'}}>{v.cadence}</div></div>
      </div>

      {/* Dummy dashboard */}
      <div className="nav-label" style={{color:'var(--text-3)',padding:'4px 0 12px'}}>{planned?'Target metrics':'Vertical dashboard'}</div>
      <div className="grid gap16" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:16}}>
        {v.metrics.map(m=>(
          <div key={m.label} className="card card-pad">
            <div className="muted" style={{fontSize:12.5,fontWeight:600,marginBottom:8}}>{m.label}</div>
            <div style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:600,letterSpacing:'-.02em'}}>{m.value}</div>
            <div className="muted" style={{fontSize:12,marginTop:4}}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* clients + structures */}
      <div className="grid gap16" style={{gridTemplateColumns:'1fr 1fr',alignItems:'start',marginBottom:16}}>
        <div className="card" style={{overflow:'hidden'}}>
          <div className="card-pad" style={{paddingBottom:10}}><h3 style={{fontSize:16}}>Client companies</h3><span className="muted" style={{fontSize:12.5}}>{planned?'No active clients yet — blueprint ready to approach prospects.':`${v.clients} clients in this vertical`}</span></div>
          {v.accounts.length>0 ? (
            <table className="tbl tbl-tight">
              <thead><tr><th>Company</th><th>Health</th><th>ARR</th><th>CSM</th></tr></thead>
              <tbody>
                {v.accounts.map(a=>(
                  <tr key={a.name}>
                    <td><div className="row gap12"><LogoChip text={a.logo} size={30} color={a.health>=75?'pulse':'primary'}/><span style={{fontWeight:600,fontSize:13.5}}>{a.name}</span></div></td>
                    <td><div className="row gap8"><HealthBar h={a.health}/><span className="mono" style={{fontWeight:600,fontSize:13}}>{a.health}</span></div></td>
                    <td className="mono" style={{fontWeight:600,fontSize:13}}>{a.arr}</td>
                    <td className="muted" style={{fontSize:12.5,whiteSpace:'nowrap'}}>{a.csm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{padding:'26px 20px',textAlign:'center'}}>
              <div style={{width:40,height:40,borderRadius:10,background:v.color+'1a',color:v.color,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px'}}><Icon name="accounts" size={20}/></div>
              <div style={{fontWeight:600,fontSize:14}}>No clients onboarded yet</div>
              <div className="muted" style={{fontSize:12.5,marginTop:2}}>The dashboard & review blueprint below are ready for your first {v.name} client.</div>
            </div>
          )}
        </div>
        <StructurePanel title={v.name+' EBR'} tag="EBR" sections={v.ebr} color={v.color}/>
      </div>
      <StructurePanel title={v.name+' QBR'} tag="QBR" sections={v.qbr} color={v.color}/>
    </div>
  );
}

function AdminConsole() {
  const [items, setItems] = React.useState(VERTICALS.verticals);
  const [sel, setSel] = React.useState(null);
  const [adding, setAdding] = React.useState(false);

  if (sel) {
    const v = items.find(x=>x.id===sel);
    return <VerticalDetail v={v} onBack={()=>setSel(null)}/>;
  }

  return (
    <div className="content-inner fade-up">
      <div className="row" style={{justifyContent:'space-between',marginBottom:20,alignItems:'flex-start'}}>
        <div>
          <h1 style={{fontSize:26,marginBottom:6}}>Customer Success verticals</h1>
          <p className="muted" style={{fontSize:14.5,margin:0}}>The B2B industries where Million Square runs Customer Success — each with a dashboard and QBR/EBR blueprint.</p>
        </div>
        <Btn variant="primary" icon="plus" onClick={()=>setAdding(true)}>New vertical</Btn>
      </div>

      <VOverview items={items}/>

      <div className="grid gap16" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
        {items.map(v=> <VerticalCard key={v.id} v={v} onOpen={x=>setSel(x.id)}/>)}
        <button className="card vcard-add" onClick={()=>setAdding(true)}>
          <div style={{width:44,height:44,borderRadius:12,background:'var(--primary-wash)',color:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10}}><Icon name="plus" size={22}/></div>
          <div style={{fontWeight:600,fontSize:14.5}}>Add a vertical</div>
          <div className="muted" style={{fontSize:12.5,marginTop:2}}>Define its dashboard & review blueprint</div>
        </button>
      </div>

      {adding && <AddVerticalModal onClose={()=>setAdding(false)} onAdd={(v)=>{setItems(list=>[...list,v]);setAdding(false);setSel(v.id);}}/>}
    </div>
  );
}

Object.assign(window, { AdminConsole });
