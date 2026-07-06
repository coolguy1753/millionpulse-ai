/* ============================================================
   MillionPulse AI — Dashboard
   ============================================================ */

function Stat({ label, value, sub, trend, icon, accent }) {
  return (
    <div className="card card-pad" style={{display:'flex',flexDirection:'column',gap:10}}>
      <div className="row" style={{justifyContent:'space-between'}}>
        <span className="muted" style={{fontSize:13,fontWeight:600}}>{label}</span>
        <div style={{width:32,height:32,borderRadius:9,background:`var(--${accent}-wash)`,display:'flex',alignItems:'center',justifyContent:'center',color:`var(--${accent})`}}>
          <Icon name={icon} size={17}/>
        </div>
      </div>
      <div className="row gap8" style={{alignItems:'flex-end'}}>
        <span style={{fontFamily:'var(--font-display)',fontSize:30,fontWeight:600,letterSpacing:'-.03em'}}>{value}</span>
        {trend != null && <span style={{marginBottom:6}}><Trend v={trend}/></span>}
      </div>
      <span className="muted" style={{fontSize:12.5}}>{sub}</span>
    </div>
  );
}

function HealthDonut({ good, warn, risk }) {
  const total = good + warn + risk;
  const segs = [['good',good],['warn',warn],['risk',risk]];
  const R = 54, C = 2*Math.PI*R;
  let off = 0;
  return (
    <div style={{position:'relative',width:140,height:140}}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{transform:'rotate(-90deg)'}}>
        <circle cx="70" cy="70" r={R} fill="none" stroke="var(--line-2)" strokeWidth="16"/>
        {segs.map(([c,v],i)=>{
          const len = (v/total)*C;
          const el = <circle key={i} cx="70" cy="70" r={R} fill="none" stroke={`var(--${c})`} strokeWidth="16"
            strokeDasharray={`${len} ${C-len}`} strokeDashoffset={-off} strokeLinecap="butt"/>;
          off += len; return el;
        })}
      </svg>
      <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <span style={{fontFamily:'var(--font-display)',fontSize:26,fontWeight:600}}>{total}</span>
        <span className="muted" style={{fontSize:11}}>accounts</span>
      </div>
    </div>
  );
}

function Dashboard({ ws, go, openAccount, onGenerate }) {
  const A = ws.accounts;
  const good = A.filter(a=>a.health>=75).length;
  const warn = A.filter(a=>a.health>=60&&a.health<75).length;
  const risk = A.filter(a=>a.health<60).length;
  const totalArr = A.reduce((s,a)=>s+a.arr,0);
  const upcoming = [...A].sort((a,b)=> (a.due==='overdue'?-1:0) - (b.due==='overdue'?-1:0)).slice(0,5);
  const dueSoon = A.filter(a=>a.due==='overdue'||/in [1-6] days/.test(a.due)).length;
  const declining = A.filter(a=>a.trend<0).length;
  const worst = [...A].sort((a,b)=>a.health-b.health)[0];

  return (
    <div className="content-inner fade-up">
      {/* Hero row */}
      <div className="row" style={{justifyContent:'space-between',marginBottom:22,alignItems:'flex-start'}}>
        <div>
          <h1 style={{fontSize:26,marginBottom:6}}>Good morning, Priya 👋</h1>
          <p className="muted" style={{fontSize:14.5,margin:0}}>In <b style={{color:'var(--text)'}}>{ws.name}</b> you have <b style={{color:'var(--text)'}}>{dueSoon} review{dueSoon!==1?'s':''}</b> due this week and <b style={{color:'var(--risk)'}}>{declining} account{declining!==1?'s':''}</b> trending down.</p>
        </div>
        <Btn variant="primary" icon="sparkle" onClick={onGenerate}>Generate review</Btn>
      </div>

      {/* Stats */}
      <div className="grid gap16" style={{gridTemplateColumns:'repeat(4,1fr)',marginBottom:16}}>
        <Stat label="Portfolio ARR" value={MP.fmtMoney(totalArr)} sub={`Across ${A.length} accounts`} trend={6} icon="trendUp" accent="primary"/>
        <Stat label="Avg. health" value={Math.round(A.reduce((s,a)=>s+a.health,0)/A.length)} sub="Portfolio health score" trend={-2} icon="heart" accent="good"/>
        <Stat label="Reviews this quarter" value={ws.reviews.length} sub={`${ws.reviews.filter(r=>r.kind==='EBR').length} EBR · ${ws.reviews.filter(r=>r.kind==='QBR').length} QBR`} trend={12} icon="reviews" accent="pulse"/>
        <Stat label="At-risk ARR" value={MP.fmtMoney(A.filter(a=>a.health<60).reduce((s,a)=>s+a.arr,0))} sub={`${A.filter(a=>a.health<60).length} account${A.filter(a=>a.health<60).length!==1?'s need':' needs'} attention`} icon="flag" accent="risk"/>
      </div>

      <div className="grid gap16" style={{gridTemplateColumns:'1fr 340px'}}>
        {/* Reviews due */}
        <div className="card">
          <div className="row card-pad" style={{justifyContent:'space-between',paddingBottom:12}}>
            <div><h3 style={{fontSize:16}}>Reviews due</h3><span className="muted" style={{fontSize:12.5}}>Upcoming EBRs & QBRs in your portfolio</span></div>
            <Btn size="sm" onClick={()=>go('accounts')} iconRight="arrowRight">View all</Btn>
          </div>
          <table className="tbl">
            <thead><tr><th>Account</th><th>Review</th><th>Health</th><th>ARR</th><th>Due</th><th></th></tr></thead>
            <tbody>
              {upcoming.map(a=>(
                <tr key={a.id} onClick={()=>openAccount(a)}>
                  <td><div className="row gap12"><LogoChip text={a.logo} size={34} color={a.health>=75?'pulse':'primary'}/><div><div style={{fontWeight:600}}>{a.name}</div><div className="muted" style={{fontSize:12}}>{a.tier} · {a.csm}</div></div></div></td>
                  <td><KindPill kind={a.nextReview}/></td>
                  <td><div className="row gap8"><HealthBar h={a.health}/><span className="mono" style={{fontWeight:600,fontSize:13}}>{a.health}</span></div></td>
                  <td className="mono" style={{fontWeight:600}}>{MP.fmtMoney(a.arr)}</td>
                  <td><span style={{fontWeight:600,fontSize:13,color:a.due==='overdue'?'var(--risk)':a.due.includes('3 days')?'var(--warn)':'var(--text-2)'}}>{a.due}</span></td>
                  <td style={{textAlign:'right'}}><button className="btn btn-primary btn-sm" onClick={(e)=>{e.stopPropagation();onGenerate(a);}}><Icon name="sparkle" size={14}/>Generate</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Side column */}
        <div className="grid gap16" style={{alignContent:'start'}}>
          <div className="card card-pad">
            <h3 style={{fontSize:16,marginBottom:4}}>Portfolio health</h3>
            <span className="muted" style={{fontSize:12.5}}>Distribution across accounts</span>
            <div className="row" style={{justifyContent:'center',margin:'12px 0 6px'}}><HealthDonut good={good} warn={warn} risk={risk}/></div>
            <div className="grid gap8" style={{marginTop:6}}>
              {[['good','Healthy',good],['warn','Watch',warn],['risk','At risk',risk]].map(([c,l,v])=>(
                <div key={c} className="row" style={{justifyContent:'space-between',fontSize:13}}>
                  <span className="row gap8"><span className="dot" style={{background:`var(--${c})`,width:9,height:9}}></span>{l}</span>
                  <b>{v} account{v!==1?'s':''}</b>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad" style={{background:'var(--ink)',color:'#fff',borderColor:'transparent'}}>
            <div className="row gap8" style={{marginBottom:8}}><Icon name="sparkle" size={17} stroke="var(--pulse)"/><span style={{fontFamily:'var(--font-display)',fontWeight:600}}>AI insight</span></div>
            <p style={{fontSize:13.5,lineHeight:1.55,margin:'0 0 14px',color:'#C7CCDD'}}><b style={{color:'#fff'}}>{worst.name}</b> is the lowest-health account in {ws.name} at {worst.health} ({worst.trend>=0?'+':''}{worst.trend} QoQ) — ticket volume is elevated and adoption sits at {Math.round(worst.adoption*100)}%. Recommend an <b style={{color:'var(--pulse)'}}>At-Risk Recovery {worst.nextReview}</b> before the {worst.renewal} renewal.</p>
            <button className="btn" style={{background:'rgba(255,255,255,.12)',color:'#fff',width:'100%',justifyContent:'center'}} onClick={()=>onGenerate(worst)}>Start recovery review</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
