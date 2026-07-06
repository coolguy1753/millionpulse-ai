/* ============================================================
   MillionPulse AI — Generated review output + summary one-pager
   ============================================================ */

// --- little building blocks ---
function Bars({ data, color='primary', h=120 }) {
  const max = Math.max(...data.map(d=>d.v));
  return (
    <div className="row" style={{alignItems:'flex-end',gap:14,height:h,padding:'0 4px'}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
          <div style={{width:'100%',maxWidth:44,height:(d.v/max)*(h-28),background: d.hl?`var(--${color})`:'var(--line)',borderRadius:'7px 7px 3px 3px',transition:'height .5s',position:'relative'}}>
            <span style={{position:'absolute',top:-20,left:0,right:0,textAlign:'center',fontSize:12,fontWeight:700,color:d.hl?`var(--${color})`:'var(--text-2)'}}>{d.lbl||d.v}</span>
          </div>
          <span className="muted" style={{fontSize:11.5}}>{d.k}</span>
        </div>
      ))}
    </div>
  );
}
function Metric({ label, value, sub, tone='text' }) {
  return (
    <div style={{padding:'14px 16px',border:'1px solid var(--line)',borderRadius:12,background:'#fff'}}>
      <div className="muted" style={{fontSize:12,fontWeight:600,marginBottom:6}}>{label}</div>
      <div className="row gap8" style={{alignItems:'flex-end'}}>
        <span style={{fontFamily:'var(--font-display)',fontSize:24,fontWeight:600,color:tone==='text'?'var(--text)':`var(--${tone})`,letterSpacing:'-.02em'}}>{value}</span>
      </div>
      {sub && <div className="muted" style={{fontSize:12,marginTop:4}}>{sub}</div>}
    </div>
  );
}
function RevSection({ n, title, tag, children }) {
  return (
    <section style={{marginBottom:34,scrollMarginTop:20}} data-screen-label={title}>
      <div className="row gap12" style={{marginBottom:16,alignItems:'baseline'}}>
        <span style={{fontFamily:'var(--font-display)',fontSize:13,fontWeight:700,color:'var(--primary)',fontVariantNumeric:'tabular-nums'}}>{String(n).padStart(2,'0')}</span>
        <h2 style={{fontSize:21,flex:1}}>{title}</h2>
        {tag && <span className="tag">{tag}</span>}
      </div>
      {children}
    </section>
  );
}

// derive quarter-over-quarter figures from an account
function derive(a) {
  const adopt = Math.round(a.adoption*100);
  return {
    adopt,
    adoptTrend: [{k:'Q3',v:adopt-14},{k:'Q4',v:adopt-9},{k:'Q1',v:adopt-4},{k:'Q2',v:adopt,hl:true}].map(d=>({...d,lbl:d.v+'%'})),
    tickets: [{k:'Q3',v:Math.round(a.tickets*0.6)},{k:'Q4',v:Math.round(a.tickets*0.8)},{k:'Q1',v:Math.round(a.tickets*0.9)},{k:'Q2',v:a.tickets,hl:true}],
    mau: Math.round(a.seats*a.adoption),
    csat: Math.round(70+a.nps*0.3),
    roi: (a.arr/1000*(a.adoption*3.4)).toFixed(0),
    valueHours: Math.round(a.seats*a.adoption*1.8),
  };
}

// ============ FULL REVIEW ============
function FullReview({ cfg }) {
  const a = cfg.acct, d = derive(a), isEBR = cfg.kind==='EBR';
  const c = MP.healthColor(a.health);
  const nav = ['Executive summary','Health & sentiment','Product adoption','Value delivered','Support & risk', isEBR?'Strategic roadmap':'Next-quarter plan'];
  return (
    <div className="row" style={{gap:28,alignItems:'flex-start'}}>
      {/* section rail */}
      <nav style={{position:'sticky',top:0,width:190,flex:'0 0 190px',paddingTop:4}}>
        <div className="wiz-label" style={{marginBottom:10}}>Contents</div>
        {nav.map((s,i)=><a key={i} href={'#sec'+i} className="rail-link"><span style={{color:'var(--text-3)',fontVariantNumeric:'tabular-nums',marginRight:8}}>{String(i+1).padStart(2,'0')}</span>{s}</a>)}
      </nav>

      <article style={{flex:1,minWidth:0,maxWidth:820}}>
        {/* Cover */}
        <div style={{borderRadius:18,overflow:'hidden',marginBottom:32,background:'var(--ink)',color:'#fff',position:'relative'}}>
          <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:.5}} preserveAspectRatio="none" viewBox="0 0 800 260">
            <path d="M0 170 L120 170 L150 90 L200 210 L240 60 L275 150 L800 150" fill="none" stroke="url(#pl)" strokeWidth="2.5"/>
            <defs><linearGradient id="pl" x1="0" x2="800" gradientUnits="userSpaceOnUse"><stop stopColor="#14C6EE"/><stop offset="1" stopColor="#7C5CE6"/></linearGradient></defs>
          </svg>
          <div style={{padding:'32px 36px',position:'relative'}}>
            <div className="row gap12" style={{marginBottom:22}}>
              <BrandMark size={30}/><span style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:14}}>MillionPulse AI</span>
              <span style={{marginLeft:'auto'}} className={'pill '+(isEBR?'pill-ebr':'pill-qbr')}>{isEBR?'Executive Business Review':'Quarterly Business Review'}</span>
            </div>
            <div className="row gap16">
              <LogoChip text={a.logo} size={54} color={isEBR?'primary':'pulse'}/>
              <div><h1 style={{fontSize:30,color:'#fff'}}>{a.name}</h1><div style={{color:'#AEB4C9',fontSize:14,marginTop:4}}>Q2 FY26 · {a.tier} · Prepared by {a.csm}</div></div>
            </div>
          </div>
        </div>

        <div id="sec0"><RevSection n={1} title="Executive summary" tag="AI drafted">
          <p style={{fontSize:15.5,lineHeight:1.7,color:'var(--text)',margin:'0 0 14px'}}>
            {a.name} is a <b>{a.tier.toLowerCase()}</b> account generating <b>{MP.fmtMoney(a.arr)}</b> in ARR across {a.seats.toLocaleString()} seats. This quarter the account is <b style={{color:`var(--${c})`}}>{c==='good'?'healthy and expanding':c==='warn'?'stable but showing watch signals':'at elevated churn risk'}</b>, with a health score of {a.health} ({a.trend>=0?'+':''}{a.trend} QoQ).
          </p>
          <p style={{fontSize:15,lineHeight:1.7,color:'var(--text-2)',margin:0}}>
            {c==='risk'
              ? `Adoption has stalled at ${d.adopt}% and support volume climbed to ${a.tickets} tickets, driving NPS down to ${a.nps}. Immediate intervention is recommended ahead of the ${a.renewal} renewal.`
              : `Adoption reached ${d.adopt}% with ${d.mau.toLocaleString()} monthly active users and an NPS of ${a.nps}. The partnership is well-positioned heading into the ${a.renewal} renewal, with clear expansion upside.`}
          </p>
        </RevSection></div>

        <div id="sec1"><RevSection n={2} title="Health & sentiment">
          <div className="grid gap12" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:16}}>
            <Metric label="Health score" value={a.health} sub={`${a.trend>=0?'+':''}${a.trend} vs last quarter`} tone={c}/>
            <Metric label="NPS" value={a.nps} sub={a.nps>=50?'Promoter-leaning':'Needs attention'} tone={a.nps>=50?'good':'warn'}/>
            <Metric label="Monthly active" value={d.mau.toLocaleString()} sub={`of ${a.seats.toLocaleString()} seats`}/>
            <Metric label="CSAT" value={d.csat+'%'} sub="Support satisfaction"/>
          </div>
          <div style={{padding:'14px 16px',borderLeft:`3px solid var(--${c})`,background:`var(--${c}-wash)`,borderRadius:'0 10px 10px 0',fontSize:14,lineHeight:1.55}}>
            <b>Signal:</b> {c==='risk'?'A double-digit health decline concentrated in the last 60 days — the leading indicator is a drop in weekly active usage among power users.':c==='warn'?'Health is holding but engagement is plateauing. Executive sponsorship is the biggest lever this quarter.':'Consistent upward trend across every leading indicator. This account is a strong reference candidate.'}
          </div>
        </RevSection></div>

        <div id="sec2"><RevSection n={3} title="Product adoption" tag="Pendo">
          <div className="grid gap20" style={{gridTemplateColumns:'1.3fr 1fr',alignItems:'center'}}>
            <div className="card" style={{padding:'26px 20px 16px'}}><Bars data={d.adoptTrend} color="pulse"/></div>
            <div>
              <p style={{fontSize:14.5,lineHeight:1.65,margin:'0 0 14px',color:'var(--text-2)'}}>Feature adoption {a.trend>=0?'grew':'declined'} to <b style={{color:'var(--text)'}}>{d.adopt}%</b> this quarter. Core workflows are well-embedded; the largest untapped opportunity is in advanced analytics and automation modules.</p>
              <div className="grid gap8">
                {[['Core platform',Math.min(96,d.adopt+18)],['Collaboration',d.adopt+4],['Advanced analytics',Math.max(18,d.adopt-26)],['Automations',Math.max(12,d.adopt-34)]].map(([f,v])=>(
                  <div key={f}><div className="row" style={{justifyContent:'space-between',fontSize:12.5,marginBottom:3}}><span>{f}</span><b>{v}%</b></div><div className="hbar" style={{width:'100%'}}><i style={{width:v+'%',background:v>=60?'var(--pulse)':v>=35?'var(--warn)':'var(--risk)'}}></i></div></div>
                ))}
              </div>
            </div>
          </div>
        </RevSection></div>

        <div id="sec3"><RevSection n={4} title="Value delivered" tag={isEBR?'ROI model':'Outcomes'}>
          <div className="grid gap12" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:16}}>
            <Metric label={isEBR?'Estimated ROI':'Time saved'} value={isEBR?`${(d.adopt*2.8/100+1.4).toFixed(1)}×`:`${d.valueHours.toLocaleString()} hrs`} sub={isEBR?'Return on subscription':'Per month, across team'} tone="good"/>
            <Metric label="Workflows automated" value={Math.round(a.seats*0.4).toLocaleString()} sub="This quarter"/>
            <Metric label="Value realized" value={MP.fmtMoney(a.arr*(1+a.adoption))} sub="Modeled business impact" tone="primary"/>
          </div>
          <div className="card card-pad" style={{background:'var(--surface-2)'}}>
            <div className="row gap12" style={{marginBottom:8}}><Icon name="sparkle" size={16} stroke="var(--primary)"/><b style={{fontFamily:'var(--font-display)'}}>Outcome highlight</b></div>
            <p style={{margin:0,fontSize:14.5,lineHeight:1.6,color:'var(--text-2)'}}>The team {c==='risk'?'has begun realizing value in core reporting, though broader ROI is gated on re-engaging inactive seats':`saved an estimated ${d.valueHours.toLocaleString()} hours this quarter through automation, directly supporting ${a.name}'s operational efficiency goals`}.</p>
          </div>
        </RevSection></div>

        <div id="sec4"><RevSection n={5} title="Support & risk" tag="Zendesk">
          <div className="grid gap20" style={{gridTemplateColumns:'1fr 1.3fr',alignItems:'center'}}>
            <div>
              <div className="grid gap12" style={{gridTemplateColumns:'1fr 1fr',marginBottom:8}}>
                <Metric label="Tickets (Q2)" value={a.tickets} sub={a.tickets>30?'Elevated':'Within range'} tone={a.tickets>30?'risk':'text'}/>
                <Metric label="Avg. resolution" value={(a.tickets>30?2.4:1.1)+'d'} sub="First response 4h"/>
              </div>
            </div>
            <div className="card" style={{padding:'26px 20px 16px'}}><Bars data={d.tickets} color="risk"/></div>
          </div>
          <div style={{marginTop:16}}>
            <div className="wiz-label">Open risks & mitigation</div>
            {(c==='risk'
              ? [['high','Adoption stall among power users','Launch a re-onboarding sprint with the champion team by end of month'],['high','Executive sponsor disengaged','Secure a 30-min alignment with the VP ahead of renewal'],['medium','Rising ticket volume on integrations','Dedicated solutions engineer assigned for 4 weeks']]
              : [['medium','Advanced modules under-adopted','Enablement session scheduled for the analytics team'],['low','Single-threaded champion','Identify and onboard a second internal advocate']]
            ).map(([sev,t,m],i)=>(
              <div key={i} className="row gap12" style={{padding:'12px 0',borderBottom:'1px solid var(--line-2)'}}>
                <span className={'pill pill-'+(sev==='high'?'risk':sev==='medium'?'warn':'neutral')} style={{textTransform:'capitalize',flex:'0 0 auto'}}>{sev}</span>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{t}</div><div className="muted" style={{fontSize:13,marginTop:2}}>{m}</div></div>
              </div>
            ))}
          </div>
        </RevSection></div>

        <div id="sec5"><RevSection n={6} title={isEBR?'Strategic roadmap':'Next-quarter plan'} tag="Mutual action plan">
          <div className="grid gap12">
            {(isEBR
              ? [['Q3 FY26','Executive alignment on 3-year value roadmap',a.csm],['Q3 FY26','Expand to 2 additional business units','Account team'],['Q4 FY26','Co-develop success plan tied to renewal',a.csm+' + Exec sponsor']]
              : [['This month','Re-onboarding sprint for inactive seats',a.csm],['Next 30 days','Enable advanced analytics module','CS + Solutions'],['Before renewal','Quarterly value check-in cadence',a.csm]]
            ).map(([when,what,who],i)=>(
              <div key={i} className="row gap16" style={{padding:'14px 16px',border:'1px solid var(--line)',borderRadius:12}}>
                <div style={{flex:'0 0 96px'}}><span className="tag" style={{background:'var(--primary-wash)',color:'var(--primary-ink)'}}>{when}</span></div>
                <div style={{flex:1,fontWeight:600,fontSize:14.5}}>{what}</div>
                <div className="row gap8"><Avatar name={who.includes('+')?who.split(' + ')[0]:who} size={24}/><span className="muted" style={{fontSize:13}}>{who}</span></div>
              </div>
            ))}
          </div>
        </RevSection></div>
      </article>
    </div>
  );
}

// ============ ONE / TWO PAGER SUMMARY ============
function SummaryPager({ cfg }) {
  const a = cfg.acct, d = derive(a), isEBR = cfg.kind==='EBR';
  const c = MP.healthColor(a.health);
  return (
    <div style={{maxWidth:760,margin:'0 auto'}}>
      <div className="card" style={{padding:'40px 44px',boxShadow:'var(--shadow-lg)'}}>
        {/* header */}
        <div className="row" style={{justifyContent:'space-between',alignItems:'flex-start',paddingBottom:20,borderBottom:'2px solid var(--ink)',marginBottom:22}}>
          <div className="row gap12"><LogoChip text={a.logo} size={44} color={isEBR?'primary':'pulse'}/>
            <div><h1 style={{fontSize:23}}>{a.name}</h1><div className="muted" style={{fontSize:13,marginTop:2}}>{cfg.kind} Summary · Q2 FY26</div></div>
          </div>
          <div style={{textAlign:'right'}}><div className="row gap8" style={{justifyContent:'flex-end'}}><BrandMark size={22}/><span style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:13}}>MillionPulse AI</span></div><HealthPill h={a.health}/></div>
        </div>

        {/* metric strip */}
        <div className="grid gap12" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:24}}>
          {[['Health',a.health+'', `${a.trend>=0?'+':''}${a.trend} QoQ`,c],['ARR',MP.fmtMoney(a.arr),'Renews '+a.renewal,'text'],['Adoption',d.adopt+'%',d.mau.toLocaleString()+' MAU','text'],['NPS',a.nps+'',a.nps>=50?'Promoter':'Watch',a.nps>=50?'good':'warn']].map(([l,v,s,t])=>(
            <div key={l}><div className="muted" style={{fontSize:11.5,fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em'}}>{l}</div><div style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:600,color:t==='text'?'var(--text)':`var(--${t})`,margin:'2px 0'}}>{v}</div><div className="muted" style={{fontSize:11.5}}>{s}</div></div>
          ))}
        </div>

        <div className="grid gap24" style={{gridTemplateColumns:'1fr 1fr'}}>
          <div>
            <h3 style={{fontSize:14,marginBottom:10,color:'var(--primary)'}}>The story this quarter</h3>
            <p style={{fontSize:13.5,lineHeight:1.6,margin:0,color:'var(--text-2)'}}>{c==='risk'
              ? `Health fell ${Math.abs(a.trend)} points as adoption stalled at ${d.adopt}% and tickets rose to ${a.tickets}. Renewal (${a.renewal}) is at risk without intervention.`
              : `A ${a.trend>=0?'strong':'steady'} quarter — adoption at ${d.adopt}%, NPS ${a.nps}, and ${MP.fmtMoney(a.arr*(1+a.adoption))} in modeled value delivered. Well-positioned for ${a.renewal} renewal and expansion.`}</p>
            <h3 style={{fontSize:14,margin:'18px 0 10px',color:'var(--primary)'}}>Wins</h3>
            <ul style={{margin:0,paddingLeft:18,fontSize:13.5,lineHeight:1.7,color:'var(--text-2)'}}>
              <li>{d.adopt}% feature adoption across {a.seats.toLocaleString()} seats</li>
              <li>{d.valueHours.toLocaleString()} hours saved via automation</li>
              <li>CSAT holding at {d.csat}%</li>
            </ul>
          </div>
          <div>
            <h3 style={{fontSize:14,marginBottom:10,color:c==='risk'?'var(--risk)':'var(--warn)'}}>{c==='risk'?'Risks':'Watch items'}</h3>
            <ul style={{margin:0,paddingLeft:18,fontSize:13.5,lineHeight:1.7,color:'var(--text-2)'}}>
              {(c==='risk'?['Power-user adoption stall','Executive sponsor disengaged','Integration ticket spike']:['Advanced modules under-adopted','Single-threaded champion']).map((r,i)=><li key={i}>{r}</li>)}
            </ul>
            <h3 style={{fontSize:14,margin:'18px 0 10px',color:'var(--pulse)'}}>Asks & next steps</h3>
            <ul style={{margin:0,paddingLeft:18,fontSize:13.5,lineHeight:1.7,color:'var(--text-2)'}}>
              {(isEBR?['Executive alignment on 3-yr roadmap','Expansion to 2 business units']:['Re-onboarding sprint','Enable analytics module','Set value check-in cadence']).map((r,i)=><li key={i}>{r}</li>)}
            </ul>
          </div>
        </div>
        <div className="row" style={{justifyContent:'space-between',marginTop:24,paddingTop:16,borderTop:'1px solid var(--line)',fontSize:12}}>
          <span className="muted">Prepared by {a.csm} · {a.csm==='Priya Nair'?'Sr. CS Manager':'CS Manager'}</span>
          <span className="muted">Generated by MillionPulse AI · Confidential</span>
        </div>
      </div>
    </div>
  );
}

function ReviewView({ cfg, onBack }) {
  const [view, setView] = React.useState('full');
  const isEBR = cfg.kind==='EBR';

  // Experience.com EBR System output — render the real generated deck + one-pager
  if (cfg.ebr) {
    const src = view==='full' ? cfg.deckFile : cfg.onePagerFile;
    return (
      <div className="fade-up">
        <div className="row" style={{justifyContent:'space-between',marginBottom:16,flexWrap:'wrap',gap:12}}>
          <div className="row gap12">
            <button className="btn btn-ghost btn-sm" onClick={onBack}><Icon name="arrowLeft" size={15}/>Back</button>
            <div style={{display:'flex',background:'var(--surface-2)',border:'1px solid var(--line)',borderRadius:10,padding:3}}>
              {[['full', (cfg.deckName||'EBR deck')+' · '+(cfg.slides||6)+' slides','reviews'],['summary','1-page summary','file']].map(([v,l,ic])=>(
                <button key={v} onClick={()=>setView(v)} className="row gap8" style={{border:'none',padding:'7px 14px',borderRadius:8,fontSize:13,fontWeight:600,fontFamily:'var(--font-body)',cursor:'pointer',background:view===v?'var(--surface)':'transparent',color:view===v?'var(--text)':'var(--text-2)',boxShadow:view===v?'var(--shadow-sm)':'none'}}><Icon name={ic} size={15}/>{l}</button>
              ))}
            </div>
          </div>
          <div className="row gap8">
            <span className="pill pill-neutral" style={{marginRight:4}}><span style={{width:7,height:7,borderRadius:'50%',background:'#F26430'}}></span>Experience.com EBR System</span>
            <Btn size="sm" icon="edit">Edit</Btn>
            <Btn size="sm" icon="share">Share</Btn>
            <Btn variant="primary" size="sm" icon="download">Export {view==='full'?'HTML':'PDF'}</Btn>
          </div>
        </div>
        {cfg.brief && <div className="muted" style={{fontSize:12.5,marginBottom:10}}>Generated for <b style={{color:'var(--text)'}}>{cfg.brief.org}</b> · {cfg.brief.period} · {cfg.tier}{cfg.multiBrand?' · Multi-brand':''} — <span style={{color:'var(--text-3)'}}>preview shows the locked template; live data is swapped from the 4 uploaded reports.</span></div>}
        <div className="card" style={{overflow:'hidden',padding:0,height:'calc(100vh - 210px)',minHeight:520}}>
          <iframe key={view} src={src} title="Generated EBR" style={{width:'100%',height:'100%',border:'none',display:'block',background:'#F8FBFE'}}></iframe>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div className="row" style={{justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:12}}>
        <div className="row gap12">
          <button className="btn btn-ghost btn-sm" onClick={onBack}><Icon name="arrowLeft" size={15}/>Back</button>
          <div style={{display:'flex',background:'var(--surface-2)',border:'1px solid var(--line)',borderRadius:10,padding:3}}>
            {[['full','Full review','reviews'],['summary', (isEBR?'1-pager':'1-2 pager')+' summary','file']].map(([v,l,ic])=>(
              <button key={v} onClick={()=>setView(v)} className="row gap8" style={{border:'none',padding:'7px 14px',borderRadius:8,fontSize:13,fontWeight:600,fontFamily:'var(--font-body)',cursor:'pointer',background:view===v?'var(--surface)':'transparent',color:view===v?'var(--text)':'var(--text-2)',boxShadow:view===v?'var(--shadow-sm)':'none'}}><Icon name={ic} size={15}/>{l}</button>
            ))}
          </div>
        </div>
        <div className="row gap8">
          <span className="pill pill-neutral" style={{marginRight:4}}><Icon name="check" size={12} sw={3} stroke="var(--good)"/>Draft saved</span>
          <Btn size="sm" icon="edit">Edit</Btn>
          <Btn size="sm" icon="share">Share</Btn>
          <Btn variant="primary" size="sm" icon="download">Export HTML</Btn>
        </div>
      </div>
      {view==='full' ? <FullReview cfg={cfg}/> : <SummaryPager cfg={cfg}/>}
    </div>
  );
}

Object.assign(window, { ReviewView });
