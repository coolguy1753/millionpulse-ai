/* ============================================================
   MillionPulse AI — Admin login (gates the app)
   ============================================================ */

function Login({ onLogin }) {
  const [email, setEmail] = React.useState('priya@millionsquare.com');
  const [pw, setPw] = React.useState('');
  const [show, setShow] = React.useState(false);
  const [remember, setRemember] = React.useState(true);
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const submit = async (e) => {
    e && e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setErr('Enter a valid work email.'); return; }
    if (pw.trim().length < 1) { setErr('Enter your password.'); return; }
    setErr(''); setBusy(true);
    try {
      const user = await window.MPAPI.login(email.trim(), pw);
      await window.loadLiveData();
      onLogin(user);
    } catch (ex) {
      setErr(ex && ex.message ? ex.message : 'Sign in failed');
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      {/* Left brand panel */}
      <div className="login-brand">
        <svg className="login-pulse" viewBox="0 0 900 600" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 340 L180 340 L225 180 L300 430 L360 120 L410 300 L470 260 L900 260" fill="none" stroke="url(#lg)" strokeWidth="2.5"/>
          <defs><linearGradient id="lg" x1="0" x2="900" gradientUnits="userSpaceOnUse"><stop stopColor="#14C6EE"/><stop offset="1" stopColor="#7C5CE6"/></linearGradient></defs>
        </svg>
        <div className="login-brand-top">
          <BrandMark size={42}/>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:19,color:'#fff',letterSpacing:'-.02em'}}>MillionPulse<span style={{color:'var(--pulse)'}}> AI</span></div>
            <div style={{fontSize:11,color:'#6E7691',letterSpacing:'.06em',textTransform:'uppercase',marginTop:2}}>Million Square Solutions</div>
          </div>
        </div>
        <div className="login-brand-mid">
          <h1 style={{fontSize:34,color:'#fff',lineHeight:1.12,letterSpacing:'-.03em'}}>Customer Success,<br/>on autopilot.</h1>
          <p style={{color:'#AEB4C9',fontSize:15,lineHeight:1.6,marginTop:16,maxWidth:380}}>Generate executive-ready EBRs and QBRs across every client workspace — from connected data and uploads, in minutes.</p>
          <div className="login-feats">
            {[['sparkle','AI-generated EBR & QBR decks'],['layers','Multi-tenant client workspaces'],['target','Vertical-specific review blueprints']].map(([ic,t])=>(
              <div key={t} className="row gap12"><div className="login-feat-ic"><Icon name={ic} size={16} stroke="var(--pulse)"/></div><span style={{color:'#CFD3E2',fontSize:13.5}}>{t}</span></div>
            ))}
          </div>
        </div>
        <div style={{fontSize:11.5,color:'#565E78'}}>© 2026 Million Square Solutions · Confidential</div>
      </div>

      {/* Right form */}
      <div className="login-form-side">
        <form className="login-card" onSubmit={submit}>
          <span className="pill" style={{background:'var(--primary-wash)',color:'var(--primary-ink)',alignSelf:'flex-start'}}><Icon name="templates" size={12}/>Admin Console</span>
          <h2 style={{fontSize:24,marginTop:14}}>Sign in</h2>
          <p className="muted" style={{fontSize:13.5,marginTop:5,marginBottom:22}}>Access the MillionPulse AI admin workspace.</p>

          <label className="login-label">Work email</label>
          <div className={'login-input'+(err&&!/^\S+@\S+\.\S+$/.test(email)?' err':'')}>
            <Icon name="accounts" size={16}/>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" autoComplete="username"/>
          </div>

          <label className="login-label" style={{marginTop:14}}>Password</label>
          <div className="login-input">
            <Icon name="flag" size={16}/>
            <input type={show?'text':'password'} value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" autoComplete="current-password"/>
            <button type="button" className="login-eye" onClick={()=>setShow(s=>!s)} aria-label="Toggle password"><Icon name="eye" size={16}/></button>
          </div>

          <div className="row" style={{justifyContent:'space-between',margin:'14px 0 18px'}}>
            <label className="row gap8" style={{cursor:'pointer',fontSize:13}}>
              <span onClick={()=>setRemember(r=>!r)} style={{width:18,height:18,borderRadius:5,border:`2px solid ${remember?'var(--primary)':'var(--line)'}`,background:remember?'var(--primary)':'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>{remember&&<Icon name="check" size={11} stroke="#fff" sw={3.5}/>}</span>
              <span className="muted">Remember me</span>
            </label>
            <a href="#" onClick={e=>e.preventDefault()} style={{fontSize:13,fontWeight:600}}>Forgot password?</a>
          </div>

          {err && <div className="login-err"><Icon name="flag" size={13}/>{err}</div>}

          <button type="submit" className="btn btn-primary" disabled={busy} style={{width:'100%',justifyContent:'center',padding:'11px',opacity:busy?.75:1}}>
            {busy ? <>Signing in…</> : <>Sign in <Icon name="arrowRight" size={16}/></>}
          </button>

          <div className="login-divider"><span>or</span></div>
          <button type="button" className="btn btn-ghost" style={{width:'100%',justifyContent:'center',padding:'10px'}} onClick={()=>setErr('SSO coming soon — use email + password for now.')}>
            <span style={{fontFamily:'var(--font-display)',fontWeight:700}}>SSO</span> Continue with Single Sign-On
          </button>

          <p className="muted" style={{fontSize:12,textAlign:'center',marginTop:20,marginBottom:0}}>Try: priya@millionsquare.com (HQ) · password: password123</p>
        </form>
      </div>
    </div>
  );
}

Object.assign(window, { Login });
