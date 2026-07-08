/* ============================================================
   MillionPulse AI — Generate wizard
   Generic flow (Account → Data → Template → Generate) for standard reviews,
   and the Experience.com EBR System flow (Account → Intake brief → Reports →
   Template → Generate) driven by the EBR Generation Knowledge Base.
   ============================================================ */

function Stepper({ step, steps }) {
  return (
    <div className="row" style={{gap:0,marginBottom:28}}>
      {steps.map((s,i)=>(
        <React.Fragment key={i}>
          <div className="row gap8" style={{opacity: i<=step?1:.45}}>
            <div style={{width:28,height:28,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,
              background: i<step?'var(--good)':i===step?'var(--primary)':'var(--line-2)',
              color: i<=step?'#fff':'var(--text-3)',fontFamily:'var(--font-display)'}}>
              {i<step ? <Icon name="check" size={15} sw={3}/> : i+1}
            </div>
            <span style={{fontSize:13,fontWeight:600,color: i===step?'var(--text)':'var(--text-2)'}}>{s}</span>
          </div>
          {i<steps.length-1 && <div style={{flex:1,height:2,background: i<step?'var(--good)':'var(--line)',margin:'0 12px',borderRadius:2}}></div>}
        </React.Fragment>
      ))}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, half }) {
  return (
    <label style={{display:'block'}}>
      <span style={{display:'block',fontSize:12,fontWeight:600,color:'var(--text-2)',marginBottom:5}}>{label}</span>
      <input className="winput" value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)}/>
    </label>
  );
}

function GenerateWizard({ ws, preAccount, preTemplate, onComplete, onCancel }) {
  const [step, setStep] = React.useState(0);
  const [acct, setAcct] = React.useState(preAccount || null);
  const [kind, setKind] = React.useState(preTemplate ? preTemplate.kind : (preAccount ? preAccount.nextReview : 'QBR'));
  const [tpl, setTpl] = React.useState(preTemplate && !preTemplate.system ? preTemplate : null);
  const [progress, setProgress] = React.useState(0);

  // generic-flow state
  const [files, setFiles] = React.useState([{name:'Q2_usage_export.xlsx', size:'2.4 MB'}]);
  const [selSources, setSelSources] = React.useState(ws.sources.filter(s=>s.status==='connected').map(s=>s.id));

  // ----- Experience.com EBR System flow -----
  const isExpEbr = !!ws.ebrSystem && kind==='EBR';
  const briefFrom = (a) => ({
    org: a?.name || '',
    brands: (a?.ebr?.brands?.length ? a.ebr.brands : ['Coastal Lending','Summit Home Loans','Harbor Mortgage']).join(', '),
    period: 'June 2025 – May 2026',
    autoRenewal: a?.ebr?.autoRenewal || 'October 11, 2026',
    termStart: a?.ebr?.termStart || 'January 9, 2027',
    contracted: String(a?.ebr?.contracted || a?.seats || 320),
    active: String(a?.ebr?.active || (a ? Math.round(a.seats*a.adoption) : 274)),
    gTotal:'60', gAvg:'4.67', gReplied:'53', gFive:'53',
  });
  const [multiBrand, setMultiBrand] = React.useState(preTemplate?.structure==='multi' || preAccount?.ebr?.structure==='multi' || false);
  const [tier, setTier] = React.useState(preTemplate?.tier || preAccount?.ebr?.srp || 'SRP550');
  const [brief, setBrief] = React.useState(briefFrom(preAccount));
  const setB = (k,v)=> setBrief(b=>({...b,[k]:v}));
  const [reports, setReports] = React.useState({}); // id -> {name,size}
  const allReportsIn = MP.ebrReports.every(r=>reports[r.id]);
  const uploadReport = (r)=> setReports(x=>({...x,[r.id]:{name:r.id.toUpperCase()+'_Report_Q2.xlsx', size:(Math.random()*2+0.6).toFixed(1)+' MB'}}));

  const structure = multiBrand ? 'multi' : 'single';
  const deckFile = MP.ebrFileFor(structure, tier);
  const deckSlides = tier==='SRP550' ? 8 : 6;
  const deckName = `${multiBrand?'Multi':'Single'}-Account · ${tier}`;

  // steps depend on flow
  const steps = isExpEbr ? ['Account','Intake brief','Reports','Template','Generate']
                         : ['Account','Data','Template','Generate'];
  const genStep = steps.length - 1;
  const genList = isExpEbr ? MP.ebrGenSteps : MP.genSteps;

  const canNext = (()=>{
    if (step===0) return !!acct;
    if (isExpEbr) {
      if (step===1) return brief.org.trim().length>0;
      if (step===2) return allReportsIn;
      if (step===3) return true;
    } else {
      if (step===2) return !!tpl;
    }
    return true;
  })();

  // Generation animation
  React.useEffect(()=>{
    if (step!==genStep) return;
    setProgress(0);
    const iv = setInterval(()=> setProgress(p=> p>=genList.length ? (clearInterval(iv),p) : p+1), 600);
    return ()=>clearInterval(iv);
  },[step]);
  React.useEffect(()=>{
    if (step===genStep && progress>=genList.length) {
      let cancelled = false;
      const cfg = isExpEbr
        ? { acct, kind:'EBR', ebr:true, structure, tier, deckFile, onePagerFile:MP.EBR_ONEPAGER, deckName, slides:deckSlides, brief:{...brief}, multiBrand }
        : { acct, kind, tpl };
      (async()=>{
        try {
          if (window.MPAPI && ws && ws.id) {
            const review = await window.MPAPI.post('/ws/'+ws.id+'/reviews/generate', {
              accountId: acct && acct.id, kind: cfg.kind, quarter: (brief && brief.period) || undefined,
            });
            cfg.reviewId = review.id; cfg.wsId = ws.id;
          }
        } catch(e) { /* fall back to local preview */ }
        if (!cancelled) setTimeout(()=>onComplete(cfg), 400);
      })();
      return ()=>{ cancelled = true; };
    }
  },[progress,step]);

  const addFile = () => setFiles(f=>[...f, {name:['NPS_responses.csv','support_summary.csv','renewal_notes.xlsx'][f.length%3], size:(Math.random()*3+0.5).toFixed(1)+' MB'}]);
  const toggleSrc = (id)=> setSelSources(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);

  const reportIcon = { nps:'heart', campaign:'chart', survey:'reviews', users:'accounts' };

  return (
    <div className="content-inner fade-up" style={{maxWidth:880}}>
      <div className="row" style={{justifyContent:'space-between',marginBottom:8}}>
        <h1 style={{fontSize:22}}>{isExpEbr ? 'Generate Experience.com EBR' : 'Generate a review'}</h1>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}><Icon name="x" size={15}/>Cancel</button>
      </div>
      <p className="muted" style={{marginTop:0,marginBottom:24,fontSize:14}}>
        {isExpEbr
          ? 'MillionPulse fills the locked EBR template from your intake brief + the 4 uploaded reports — producing the interactive deck and a 1-page summary.'
          : 'MillionPulse AI drafts a fully structured, interactive review from your connected data and uploads.'}
      </p>

      <div className="card card-pad" style={{padding:'26px 28px'}}>
        <Stepper step={step} steps={steps}/>

        {/* STEP 0 — account + type */}
        {step===0 && (
          <div className="fade-up">
            <label className="wiz-label">Choose account</label>
            <div className="grid gap12" style={{gridTemplateColumns:'repeat(2,1fr)',marginBottom:24,maxHeight:260,overflowY:'auto',padding:2}}>
              {ws.accounts.map(a=>(
                <button key={a.id} onClick={()=>{setAcct(a);setKind(a.nextReview);setBrief(briefFrom(a));if(a.ebr){setTier(a.ebr.srp);setMultiBrand(a.ebr.structure==='multi');}}} className="pick" style={{borderColor: acct?.id===a.id?'var(--primary)':'var(--line)', boxShadow: acct?.id===a.id?'0 0 0 3px var(--primary-wash)':'none'}}>
                  <LogoChip text={a.logo} size={38} color={a.health>=75?'pulse':'primary'}/>
                  <div style={{textAlign:'left',flex:1}}><div style={{fontWeight:600,fontSize:14}}>{a.name}</div><div className="muted" style={{fontSize:12}}>{a.tier} · {MP.fmtMoney(a.arr)}</div></div>
                  <HealthPill h={a.health}/>
                </button>
              ))}
            </div>
            <label className="wiz-label">Review type</label>
            <div className="grid gap12" style={{gridTemplateColumns:'1fr 1fr'}}>
              {[['QBR','Quarterly Business Review','Operational review with the CS team — cadence, adoption, and next-quarter plan.','pulse','layers'],
                ['EBR','Executive Business Review', ws.ebrSystem?'Experience.com EBR System — intake brief + 4 reports → locked deck + 1-pager.':'Strategic C-suite review — outcomes, ROI, and long-term partnership.','primary','target']].map(([k,t,d,c,ic])=>(
                <button key={k} onClick={()=>{setKind(k);setTpl(null);}} className="pick" style={{flexDirection:'column',alignItems:'flex-start',gap:8,padding:'18px', borderColor:kind===k?`var(--${c})`:'var(--line)', boxShadow:kind===k?`0 0 0 3px var(--${c}-wash)`:'none'}}>
                  <div className="row gap8" style={{width:'100%',justifyContent:'space-between'}}><div style={{width:36,height:36,borderRadius:9,background:`var(--${c}-wash)`,display:'flex',alignItems:'center',justifyContent:'center',color:`var(--${c})`}}><Icon name={ic} size={19}/></div>{kind===k&&<Icon name="check" size={18} stroke={`var(--${c})`} sw={3}/>}</div>
                  <div style={{textAlign:'left'}}><div style={{fontWeight:700,fontFamily:'var(--font-display)',fontSize:15}}>{t}</div><div className="muted" style={{fontSize:12.5,lineHeight:1.45,marginTop:3}}>{d}</div></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============ EXPERIENCE.COM EBR FLOW ============ */}
        {isExpEbr && step===1 && (
          <div className="fade-up">
            {acct?.ebr && (
              <div className="row gap8" style={{marginBottom:14,padding:'9px 13px',borderRadius:10,background:'var(--pulse-wash)',border:'1px solid rgba(20,198,238,.25)',fontSize:12.5,color:'#0879A0'}}>
                <Icon name="check" size={14} sw={3}/>
                <span>Contract facts prefilled from <b>{acct.name}</b> · {acct.ebr.posture}</span>
              </div>
            )}
            <label className="wiz-label">Intake brief <span className="muted" style={{fontWeight:400,textTransform:'none',letterSpacing:0}}>— the account facts the deck is built around</span></label>
            <div className="grid gap12" style={{gridTemplateColumns:'1fr 1fr'}}>
              <Field label="Organization name" value={brief.org} onChange={v=>setB('org',v)} placeholder="Client / org name"/>
              <Field label="Reporting period" value={brief.period} onChange={v=>setB('period',v)}/>
              <Field label="Auto-renewal date" value={brief.autoRenewal} onChange={v=>setB('autoRenewal',v)}/>
              <Field label="Renewal term start" value={brief.termStart} onChange={v=>setB('termStart',v)}/>
              <Field label="Contracted users" value={brief.contracted} onChange={v=>setB('contracted',v)}/>
              <Field label="Current users on platform" value={brief.active} onChange={v=>setB('active',v)}/>
            </div>

            <div className="row gap12" style={{margin:'18px 0 10px',padding:'12px 14px',border:'1px solid var(--line)',borderRadius:11,background:'var(--surface-2)'}}>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13.5}}>Multi-brand organization</div><div className="muted" style={{fontSize:12}}>Turn on if this org has 2+ brands — switches to the Cross-Brand Scorecard deck.</div></div>
              <button onClick={()=>setMultiBrand(m=>!m)} style={{width:44,height:26,borderRadius:20,border:'none',cursor:'pointer',background:multiBrand?'var(--primary)':'var(--line)',position:'relative',transition:'background .15s'}}>
                <span style={{position:'absolute',top:3,left:multiBrand?21:3,width:20,height:20,borderRadius:'50%',background:'#fff',transition:'left .15s',boxShadow:'0 1px 3px rgba(0,0,0,.2)'}}></span>
              </button>
            </div>
            {multiBrand && <Field label="Brand names (comma-separated)" value={brief.brands} onChange={v=>setB('brands',v)}/>}

            <label className="wiz-label" style={{marginTop:20}}>Google Reviews</label>
            <div className="grid gap12" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
              <Field label="Total reviews" value={brief.gTotal} onChange={v=>setB('gTotal',v)}/>
              <Field label="Average score" value={brief.gAvg} onChange={v=>setB('gAvg',v)}/>
              <Field label="Replied reviews" value={brief.gReplied} onChange={v=>setB('gReplied',v)}/>
              <Field label="5-star reviews" value={brief.gFive} onChange={v=>setB('gFive',v)}/>
            </div>
          </div>
        )}

        {isExpEbr && step===2 && (
          <div className="fade-up">
            <label className="wiz-label">Upload the 4 reports <span className="muted" style={{fontWeight:400,textTransform:'none',letterSpacing:0}}>— .xlsx exports from Experience.com</span></label>
            <div className="grid gap12" style={{gridTemplateColumns:'1fr 1fr'}}>
              {MP.ebrReports.map(r=>{
                const done = reports[r.id];
                return (
                  <button key={r.id} onClick={()=>uploadReport(r)} className="pick" style={{alignItems:'flex-start',padding:'14px',borderColor:done?'var(--good)':'var(--line)',background:done?'var(--good-wash)':'var(--surface)'}}>
                    <div style={{width:36,height:36,borderRadius:9,flex:'0 0 36px',display:'flex',alignItems:'center',justifyContent:'center',background:done?'var(--good)':'var(--primary-wash)',color:done?'#fff':'var(--primary)'}}>
                      <Icon name={done?'check':reportIcon[r.id]} size={18} sw={done?3:2}/>
                    </div>
                    <div style={{textAlign:'left',flex:1}}>
                      <div style={{fontWeight:600,fontSize:13.5}}>{r.name}</div>
                      {done ? <div className="muted" style={{fontSize:11.5,marginTop:2}}>{done.name} · {done.size} · parsed</div>
                            : <div className="muted" style={{fontSize:11.5,marginTop:2,lineHeight:1.4}}>{r.detail}</div>}
                    </div>
                    {!done && <span className="tag" style={{background:'var(--primary-wash)',color:'var(--primary-ink)'}}>Upload</span>}
                  </button>
                );
              })}
            </div>
            <div className="row gap8" style={{marginTop:14,fontSize:13,color:allReportsIn?'var(--good)':'var(--text-3)'}}>
              <Icon name={allReportsIn?'check':'clock'} size={15}/>{allReportsIn ? 'All 4 reports parsed — ready to build.' : `${Object.keys(reports).length} of 4 reports uploaded.`}
            </div>
          </div>
        )}

        {isExpEbr && step===3 && (
          <div className="fade-up">
            <label className="wiz-label">Product tier <span className="muted" style={{fontWeight:400,textTransform:'none',letterSpacing:0}}>— SRP550 includes the SRP850 upsell slides</span></label>
            <div className="grid gap12" style={{gridTemplateColumns:'1fr 1fr',marginBottom:22}}>
              {[['SRP550','8-slide deck','Current package + SRP850 upsell (slides 7–8)','#F26430'],
                ['SRP850','6-slide deck','Premium tier — no upsell slides','#F5C842']].map(([tv,sl,d,col])=>(
                <button key={tv} onClick={()=>setTier(tv)} className="pick" style={{flexDirection:'column',alignItems:'flex-start',gap:6,padding:'16px',borderColor:tier===tv?'var(--primary)':'var(--line)',boxShadow:tier===tv?'0 0 0 3px var(--primary-wash)':'none'}}>
                  <div className="row gap8" style={{width:'100%',justifyContent:'space-between'}}><span className="pill" style={{background:col+'22',color:col}}>{tv}</span>{tier===tv&&<Icon name="check" size={17} stroke="var(--primary)" sw={3}/>}</div>
                  <div style={{textAlign:'left'}}><div style={{fontWeight:700,fontFamily:'var(--font-display)',fontSize:15}}>{sl}</div><div className="muted" style={{fontSize:12.5,marginTop:2}}>{d}</div></div>
                </button>
              ))}
            </div>
            <label className="wiz-label">Selected template</label>
            <div className="card" style={{overflow:'hidden'}}>
              <div className="row card-pad" style={{gap:14,background:'linear-gradient(120deg,#1A2D5C,#233A75)',color:'#F2F5FF'}}>
                <div style={{width:44,height:44,borderRadius:11,background:'rgba(91,175,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',flex:'0 0 44px'}}><Icon name="target" size={22} stroke="#7DC3FF"/></div>
                <div style={{flex:1}}>
                  <div className="row gap8"><span style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:15,color:'#fff'}}>{deckName}</span><span className="pill" style={{background:'rgba(255,255,255,.14)',color:'#CFE0F5'}}>{deckSlides} slides</span></div>
                  <div style={{fontSize:12.5,color:'#CFE0F5',marginTop:3}}>{multiBrand?'Cross-brand scorecard on Slide 2 · ':''}Auto-selected from your intake brief · + 1-page summary</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============ GENERIC FLOW ============ */}
        {!isExpEbr && step===1 && (
          <div className="fade-up">
            <label className="wiz-label">Connected sources <span className="muted" style={{fontWeight:400,textTransform:'none',letterSpacing:0}}>— data pulled automatically</span></label>
            <div className="grid gap8" style={{gridTemplateColumns:'repeat(2,1fr)',marginBottom:24}}>
              {ws.sources.filter(s=>s.status==='connected').map(s=>(
                <button key={s.id} onClick={()=>toggleSrc(s.id)} className="pick" style={{padding:'11px 13px',borderColor:selSources.includes(s.id)?'var(--primary)':'var(--line)'}}>
                  <div style={{width:32,height:32,borderRadius:8,background:'var(--surface-2)',border:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-2)'}}><Icon name={s.icon} size={17}/></div>
                  <div style={{textAlign:'left',flex:1}}><div style={{fontWeight:600,fontSize:13.5}}>{s.name}</div><div className="muted" style={{fontSize:11.5}}>{s.cat}</div></div>
                  <div style={{width:20,height:20,borderRadius:6,border:`2px solid ${selSources.includes(s.id)?'var(--primary)':'var(--line)'}`,background:selSources.includes(s.id)?'var(--primary)':'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>{selSources.includes(s.id)&&<Icon name="check" size={12} stroke="#fff" sw={3.5}/>}</div>
                </button>
              ))}
            </div>
            <label className="wiz-label">Upload files <span className="muted" style={{fontWeight:400,textTransform:'none',letterSpacing:0}}>— xls, xlsx, csv</span></label>
            <div onClick={addFile} style={{border:'2px dashed var(--line)',borderRadius:12,padding:'22px',textAlign:'center',cursor:'pointer',background:'var(--surface-2)',transition:'all .15s'}}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--primary)'} onMouseLeave={e=>e.currentTarget.style.borderColor='var(--line)'}>
              <div style={{width:40,height:40,borderRadius:10,background:'var(--primary-wash)',color:'var(--primary)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 8px'}}><Icon name="upload" size={20}/></div>
              <div style={{fontWeight:600,fontSize:14}}>Drop files or click to browse</div>
              <div className="muted" style={{fontSize:12.5}}>Excel & CSV up to 25 MB</div>
            </div>
            <div className="grid gap8" style={{marginTop:12}}>
              {files.map((f,i)=>(
                <div key={i} className="row gap12" style={{padding:'9px 13px',border:'1px solid var(--line)',borderRadius:10,background:'#fff'}}>
                  <div style={{width:30,height:30,borderRadius:7,background:'var(--good-wash)',color:'var(--good)',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="file" size={16}/></div>
                  <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13.5}}>{f.name}</div><div className="muted" style={{fontSize:11.5}}>{f.size} · parsed</div></div>
                  <button onClick={(e)=>{e.stopPropagation();setFiles(files.filter((_,j)=>j!==i));}} style={{border:'none',background:'none',color:'var(--text-3)',cursor:'pointer'}}><Icon name="x" size={16}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isExpEbr && step===2 && (
          <div className="fade-up">
            <label className="wiz-label">{kind} templates <span className="muted" style={{fontWeight:400,textTransform:'none',letterSpacing:0}}>— fixed structure, AI fills the content</span></label>
            <div className="grid gap12">
              {(ws.templates||MP.templates).filter(t=>t.kind===kind && !t.system).map(t=>(
                <button key={t.id} onClick={()=>setTpl(t)} className="pick" style={{padding:'16px', borderColor:tpl?.id===t.id?`var(--${t.color})`:'var(--line)', boxShadow:tpl?.id===t.id?`0 0 0 3px var(--${t.color}-wash)`:'none'}}>
                  <div style={{width:42,height:42,borderRadius:11,background:`var(--${t.color}-wash)`,color:`var(--${t.color})`,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={t.kind==='EBR'?'target':'layers'} size={20}/></div>
                  <div style={{textAlign:'left',flex:1}}><div className="row gap8"><span style={{fontWeight:700,fontFamily:'var(--font-display)',fontSize:15}}>{t.name}</span>{t.popular&&<span className="pill pill-warn" style={{fontSize:10}}>Popular</span>}</div><div className="muted" style={{fontSize:12.5,marginTop:2,lineHeight:1.4}}>{t.desc}</div></div>
                  <div style={{textAlign:'right'}}><span className="tag">{t.sections} sections</span></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GENERATE (last step) */}
        {step===genStep && (
          <div className="fade-up" style={{textAlign:'center',padding:'8px 0 4px'}}>
            <div style={{position:'relative',width:74,height:74,margin:'0 auto 18px'}}>
              <div style={{position:'absolute',inset:0,borderRadius:'50%',border:'3px solid var(--primary-wash)'}}></div>
              <div style={{position:'absolute',inset:0,borderRadius:'50%',border:'3px solid transparent',borderTopColor:'var(--primary)',animation:'spin 0.8s linear infinite'}}></div>
              <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--primary)'}}><Icon name="sparkle" size={28}/></div>
            </div>
            <h2 style={{fontSize:19}}>{progress>=genList.length ? (isExpEbr?'EBR ready!':'Review ready!') : 'Generating your '+kind+'…'}</h2>
            <p className="muted" style={{fontSize:13.5,marginTop:4,marginBottom:20}}>{isExpEbr ? `${brief.org} · ${deckName}` : `${acct?.name} · ${tpl?.name}`}</p>
            <div style={{maxWidth:460,margin:'0 auto',textAlign:'left'}}>
              {genList.map((g,i)=>(
                <div key={i} className="row gap12" style={{padding:'7px 0',opacity: i<=progress?1:.4, transition:'opacity .3s'}}>
                  <div style={{width:22,height:22,borderRadius:'50%',flex:'0 0 22px',display:'flex',alignItems:'center',justifyContent:'center',
                    background: i<progress?'var(--good)':i===progress?'var(--primary-wash)':'var(--line-2)'}}>
                    {i<progress ? <Icon name="check" size={13} stroke="#fff" sw={3.5}/> : i===progress ? <div style={{width:8,height:8,borderRadius:'50%',background:'var(--primary)',animation:'pulse2 1s infinite'}}></div> : null}
                  </div>
                  <span style={{fontSize:13.5,fontWeight: i<=progress?600:400,color: i<=progress?'var(--text)':'var(--text-3)'}}>{g}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer nav */}
        {step<genStep && (
          <div className="row" style={{justifyContent:'space-between',marginTop:26,paddingTop:20,borderTop:'1px solid var(--line-2)'}}>
            <button className="btn btn-ghost" onClick={()=> step===0?onCancel():setStep(step-1)}><Icon name="arrowLeft" size={16}/>{step===0?'Cancel':'Back'}</button>
            <div className="row gap12">
              {acct && <div className="row gap8" style={{fontSize:13}}><LogoChip text={acct.logo} size={26} color={kind==='EBR'?'primary':'pulse'}/><span className="muted">{acct.name} · <b style={{color:'var(--text)'}}>{kind}</b></span></div>}
              <button className="btn btn-primary" disabled={!canNext} style={{opacity:canNext?1:.5}} onClick={()=>setStep(step+1)}>
                {step===genStep-1?'Generate':'Continue'}<Icon name={step===genStep-1?'sparkle':'arrowRight'} size={16}/>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { GenerateWizard });
