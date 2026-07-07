/* ============================================================
   MillionPulse AI — Client Portal authentication flow
   Screens: signin · forgot · sent · reset · invite · twofa · workspace · welcome
   Reuses .login-* styles + ui.jsx primitives.
   ============================================================ */

const CLIENT = { name:'Experience.com', logo:'E', accent:'#5B4BE6', inviter:'Priya Nair', brands:['Experience.com — HQ','Coastal Lending','Summit Home Loans','Harbor Mortgage'] };

/* Shared split-panel shell */
function AuthShell({ children, headline, blurb }) {
  return (
    <div className="login-wrap">
      <div className="login-brand">
        <svg className="login-pulse" viewBox="0 0 900 600" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 340 L180 340 L225 180 L300 430 L360 120 L410 300 L470 260 L900 260" fill="none" stroke="url(#lgc)" strokeWidth="2.5"/>
          <defs><linearGradient id="lgc" x1="0" x2="900" gradientUnits="userSpaceOnUse"><stop stopColor="#14C6EE"/><stop offset="1" stopColor="#7C5CE6"/></linearGradient></defs>
        </svg>
        <div className="login-brand-top">
          <BrandMark size={42}/>
          <div>
            <div style={{fontFamily:'var(--font-display)',fontWeight:700,fontSize:19,color:'#fff',letterSpacing:'-.02em'}}>MillionPulse<span style={{color:'var(--pulse)'}}> AI</span></div>
            <div style={{fontSize:11,color:'#6E7691',letterSpacing:'.06em',textTransform:'uppercase',marginTop:2}}>Client Portal</div>
          </div>
        </div>
        <div className="login-brand-mid">
          <div className="row gap8" style={{marginBottom:16}}>
            <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#8B6BF0,#6A4BD8)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontFamily:'var(--font-display)'}}>{CLIENT.logo}</div>
            <span style={{color:'#CFD3E2',fontSize:14,fontWeight:600}}>{CLIENT.name} workspace</span>
          </div>
          <h1 style={{fontSize:32,color:'#fff',lineHeight:1.14,letterSpacing:'-.03em'}}>{headline}</h1>
          <p style={{color:'#AEB4C9',fontSize:15,lineHeight:1.6,marginTop:16,maxWidth:380}}>{blurb}</p>
        </div>
        <div style={{fontSize:11.5,color:'#565E78'}}>Powered by Million Square Solutions · Confidential</div>
      </div>
      <div className="login-form-side">{children}</div>
    </div>
  );
}

function Input({ icon, type='text', value, onChange, placeholder, autoFocus, right }) {
  return (
    <div className="login-input">
      {icon && <Icon name={icon} size={16}/>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus}/>
      {right}
    </div>
  );
}

/* 1 — Sign in */
function SignIn({ go }) {
  const [email,setEmail]=React.useState('sarah.mitchell@experience.com');
  const [pw,setPw]=React.useState(''); const [show,setShow]=React.useState(false); const [rem,setRem]=React.useState(true);
  return (
    <form className="login-card" onSubmit={e=>{e.preventDefault();go('twofa');}}>
      <span className="pill pill-ebr" style={{alignSelf:'flex-start'}}><span style={{width:16,height:16,borderRadius:5,background:'linear-gradient(135deg,#8B6BF0,#6A4BD8)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700}}>{CLIENT.logo}</span>{CLIENT.name}</span>
      <h2 style={{fontSize:24,marginTop:14}}>Sign in</h2>
      <p className="muted" style={{fontSize:13.5,marginTop:5,marginBottom:22}}>Access your Customer Success reviews & performance.</p>
      <label className="login-label">Work email</label>
      <Input icon="accounts" type="email" value={email} onChange={setEmail} placeholder="you@company.com"/>
      <label className="login-label" style={{marginTop:14}}>Password</label>
      <Input icon="flag" type={show?'text':'password'} value={pw} onChange={setPw} placeholder="••••••••"
        right={<button type="button" className="login-eye" onClick={()=>setShow(s=>!s)}><Icon name="eye" size={16}/></button>}/>
      <div className="row" style={{justifyContent:'space-between',margin:'14px 0 18px'}}>
        <label className="row gap8" style={{cursor:'pointer',fontSize:13}} onClick={()=>setRem(r=>!r)}>
          <span style={{width:18,height:18,borderRadius:5,border:`2px solid ${rem?'var(--primary)':'var(--line)'}`,background:rem?'var(--primary)':'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>{rem&&<Icon name="check" size={11} stroke="#fff" sw={3.5}/>}</span>
          <span className="muted">Remember me</span>
        </label>
        <a href="#" onClick={e=>{e.preventDefault();go('forgot');}} style={{fontSize:13,fontWeight:600}}>Forgot password?</a>
      </div>
      <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'11px'}}>Sign in <Icon name="arrowRight" size={16}/></button>
      <div className="login-divider"><span>or</span></div>
      <button type="button" className="btn btn-ghost" style={{width:'100%',justifyContent:'center',padding:'10px'}} onClick={()=>go('twofa')}><span style={{fontFamily:'var(--font-display)',fontWeight:700}}>SSO</span> Continue with Single Sign-On</button>
      <p className="muted" style={{fontSize:12.5,textAlign:'center',marginTop:20,marginBottom:0}}>Have an invite? <a href="#" onClick={e=>{e.preventDefault();go('invite');}} style={{fontWeight:600}}>Set up your account</a></p>
    </form>
  );
}

/* 2 — Forgot password */
function Forgot({ go }) {
  const [email,setEmail]=React.useState('');
  return (
    <form className="login-card" onSubmit={e=>{e.preventDefault();go('sent');}}>
      <button type="button" className="auth-back" onClick={()=>go('signin')}><Icon name="arrowLeft" size={14}/>Back to sign in</button>
      <h2 style={{fontSize:24,marginTop:14}}>Reset your password</h2>
      <p className="muted" style={{fontSize:13.5,marginTop:5,marginBottom:22}}>Enter your work email and we'll send you a secure reset link.</p>
      <label className="login-label">Work email</label>
      <Input icon="accounts" type="email" value={email} onChange={setEmail} placeholder="you@company.com" autoFocus/>
      <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'11px',marginTop:18}}>Send reset link <Icon name="arrowRight" size={16}/></button>
    </form>
  );
}

/* 3 — Reset link sent */
function Sent({ go }) {
  return (
    <div className="login-card" style={{textAlign:'center',alignItems:'center'}}>
      <div className="auth-badge" style={{background:'var(--good-wash)',color:'var(--good)'}}><Icon name="check" size={30} sw={2.6}/></div>
      <h2 style={{fontSize:23,marginTop:18}}>Check your inbox</h2>
      <p className="muted" style={{fontSize:13.5,marginTop:6,marginBottom:22,maxWidth:300}}>We've sent a password reset link to your email. It expires in 30 minutes.</p>
      <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'11px'}} onClick={()=>go('reset')}>Open reset link (demo) <Icon name="arrowRight" size={16}/></button>
      <p className="muted" style={{fontSize:12.5,marginTop:18}}>Didn't get it? <a href="#" onClick={e=>e.preventDefault()} style={{fontWeight:600}}>Resend email</a> · <a href="#" onClick={e=>{e.preventDefault();go('signin');}} style={{fontWeight:600}}>Back to sign in</a></p>
    </div>
  );
}

/* 4 — Set new password */
function Reset({ go }) {
  const [pw,setPw]=React.useState(''); const [c,setC]=React.useState(''); const [show,setShow]=React.useState(false);
  const strong = pw.length>=8; const match = pw && pw===c;
  return (
    <form className="login-card" onSubmit={e=>{e.preventDefault(); if(strong&&match) go('signin');}}>
      <h2 style={{fontSize:24}}>Set a new password</h2>
      <p className="muted" style={{fontSize:13.5,marginTop:5,marginBottom:22}}>Choose a strong password you haven't used before.</p>
      <label className="login-label">New password</label>
      <Input icon="flag" type={show?'text':'password'} value={pw} onChange={setPw} placeholder="At least 8 characters" autoFocus
        right={<button type="button" className="login-eye" onClick={()=>setShow(s=>!s)}><Icon name="eye" size={16}/></button>}/>
      <div className="row gap8" style={{margin:'8px 0 14px'}}>
        {[pw.length>=8, /[A-Z]/.test(pw), /[0-9]/.test(pw)].map((ok,i)=>(
          <div key={i} style={{flex:1,height:4,borderRadius:3,background: ok?'var(--good)':'var(--line-2)'}}></div>
        ))}
      </div>
      <label className="login-label">Confirm password</label>
      <Input icon="flag" type={show?'text':'password'} value={c} onChange={setC} placeholder="Re-enter password"/>
      {c && !match && <div className="login-err" style={{marginTop:12}}><Icon name="flag" size={13}/>Passwords don't match.</div>}
      <button type="submit" className="btn btn-primary" disabled={!(strong&&match)} style={{width:'100%',justifyContent:'center',padding:'11px',marginTop:18,opacity:(strong&&match)?1:.5}}>Update password <Icon name="check" size={16}/></button>
    </form>
  );
}

/* 5 — Accept invite */
function Invite({ go }) {
  const [name,setName]=React.useState(''); const [pw,setPw]=React.useState(''); const [show,setShow]=React.useState(false);
  const ok = name.trim().length>1 && pw.length>=8;
  return (
    <form className="login-card" onSubmit={e=>{e.preventDefault(); if(ok) go('welcome');}}>
      <span className="pill pill-qbr" style={{alignSelf:'flex-start'}}><Icon name="sparkle" size={12}/>You're invited</span>
      <h2 style={{fontSize:23,marginTop:14}}>Join {CLIENT.name}</h2>
      <p className="muted" style={{fontSize:13.5,marginTop:5,marginBottom:22}}><b style={{color:'var(--text)'}}>{CLIENT.inviter}</b> invited you to the {CLIENT.name} workspace on MillionPulse AI.</p>
      <label className="login-label">Full name</label>
      <Input icon="accounts" value={name} onChange={setName} placeholder="Your name" autoFocus/>
      <label className="login-label" style={{marginTop:14}}>Create password</label>
      <Input icon="flag" type={show?'text':'password'} value={pw} onChange={setPw} placeholder="At least 8 characters"
        right={<button type="button" className="login-eye" onClick={()=>setShow(s=>!s)}><Icon name="eye" size={16}/></button>}/>
      <button type="submit" className="btn btn-primary" disabled={!ok} style={{width:'100%',justifyContent:'center',padding:'11px',marginTop:18,opacity:ok?1:.5}}>Accept & continue <Icon name="arrowRight" size={16}/></button>
      <p className="muted" style={{fontSize:12,textAlign:'center',marginTop:16,marginBottom:0}}>By continuing you agree to the Terms & Privacy Policy.</p>
    </form>
  );
}

/* 6 — Two-factor */
function TwoFA({ go }) {
  const [d,setD]=React.useState(['','','','','','']);
  const refs = React.useRef([]);
  const set = (i,v)=>{ v=v.replace(/\D/g,'').slice(-1); setD(a=>{const n=[...a];n[i]=v;return n;}); if(v&&i<5) refs.current[i+1]?.focus(); };
  const key = (i,e)=>{ if(e.key==='Backspace'&&!d[i]&&i>0) refs.current[i-1]?.focus(); };
  const full = d.every(x=>x);
  return (
    <form className="login-card" style={{alignItems:'center',textAlign:'center'}} onSubmit={e=>{e.preventDefault(); if(full) go('workspace');}}>
      <div className="auth-badge" style={{background:'var(--primary-wash)',color:'var(--primary)'}}><Icon name="flag" size={28}/></div>
      <h2 style={{fontSize:23,marginTop:16}}>Verify it's you</h2>
      <p className="muted" style={{fontSize:13.5,marginTop:6,marginBottom:22,maxWidth:300}}>Enter the 6-digit code we sent to your email to finish signing in.</p>
      <div className="row gap8" style={{justifyContent:'center',marginBottom:20}}>
        {d.map((v,i)=>(
          <input key={i} ref={el=>refs.current[i]=el} className="otp" inputMode="numeric" value={v} autoFocus={i===0}
            onChange={e=>set(i,e.target.value)} onKeyDown={e=>key(i,e)}/>
        ))}
      </div>
      <button type="submit" className="btn btn-primary" disabled={!full} style={{width:'100%',justifyContent:'center',padding:'11px',opacity:full?1:.5}}>Verify <Icon name="check" size={16}/></button>
      <p className="muted" style={{fontSize:12.5,marginTop:18}}>Didn't get a code? <a href="#" onClick={e=>e.preventDefault()} style={{fontWeight:600}}>Resend in 0:28</a></p>
    </form>
  );
}

/* 7 — Choose workspace / brand */
function Workspace({ go }) {
  const [sel,setSel]=React.useState(0);
  return (
    <div className="login-card">
      <h2 style={{fontSize:23}}>Choose a workspace</h2>
      <p className="muted" style={{fontSize:13.5,marginTop:5,marginBottom:20}}>You have access to multiple brands under {CLIENT.name}.</p>
      <div className="grid gap8" style={{marginBottom:20}}>
        {CLIENT.brands.map((b,i)=>(
          <button key={b} onClick={()=>setSel(i)} className="pick" style={{borderColor:sel===i?'var(--primary)':'var(--line)',boxShadow:sel===i?'0 0 0 3px var(--primary-wash)':'none'}}>
            <div style={{width:34,height:34,borderRadius:9,flex:'0 0 34px',background:i===0?'linear-gradient(135deg,#8B6BF0,#6A4BD8)':'var(--surface-2)',border:i===0?'none':'1px solid var(--line)',color:i===0?'#fff':'var(--text-2)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontFamily:'var(--font-display)'}}>{b.split(/[\s—]+/).filter(Boolean).map(w=>w[0]).slice(0,2).join('')}</div>
            <div style={{textAlign:'left',flex:1}}><div style={{fontWeight:600,fontSize:14}}>{b}</div><div className="muted" style={{fontSize:12}}>{i===0?'Org-level access':'Brand workspace'}</div></div>
            <div style={{width:20,height:20,borderRadius:'50%',border:`2px solid ${sel===i?'var(--primary)':'var(--line)'}`,background:sel===i?'var(--primary)':'#fff',display:'flex',alignItems:'center',justifyContent:'center'}}>{sel===i&&<Icon name="check" size={12} stroke="#fff" sw={3.5}/>}</div>
          </button>
        ))}
      </div>
      <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'11px'}} onClick={()=>go('welcome')}>Continue <Icon name="arrowRight" size={16}/></button>
    </div>
  );
}

/* 8 — Welcome */
function Welcome({ go, onEnter }) {
  return (
    <div className="login-card" style={{textAlign:'center',alignItems:'center'}}>
      <div className="auth-badge" style={{background:'linear-gradient(135deg,#14C6EE,#7C5CE6)',color:'#fff'}}><Icon name="sparkle" size={30}/></div>
      <h2 style={{fontSize:24,marginTop:18}}>You're all set</h2>
      <p className="muted" style={{fontSize:13.5,marginTop:6,marginBottom:8,maxWidth:320}}>Welcome to the {CLIENT.name} client portal. Your reviews, performance, and renewal timeline are ready.</p>
      <div className="grid gap8" style={{width:'100%',textAlign:'left',margin:'12px 0 22px'}}>
        {[['reviews','View your EBRs & QBRs'],['chart','Track performance & health'],['clock','See your renewal timeline']].map(([ic,t])=>(
          <div key={t} className="row gap12" style={{padding:'10px 12px',border:'1px solid var(--line)',borderRadius:10}}><div style={{width:30,height:30,borderRadius:8,background:'var(--pulse-wash)',color:'#0879A0',display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name={ic} size={16}/></div><span style={{fontSize:13.5,fontWeight:600}}>{t}</span></div>
        ))}
      </div>
      <button className="btn btn-primary" style={{width:'100%',justifyContent:'center',padding:'11px'}} onClick={onEnter}>Enter portal <Icon name="arrowRight" size={16}/></button>
    </div>
  );
}

const SCREENS = [
  ['signin','Sign in',SignIn,'Your reviews, always in reach.',"See every EBR and QBR your Customer Success team builds — the moment they're ready."],
  ['forgot','Forgot password',Forgot,'Locked out?','No problem — reset your password securely in a couple of clicks.'],
  ['sent','Reset sent',Sent,'Check your email','A secure reset link is on its way to your inbox.'],
  ['reset','New password',Reset,'Pick a fresh password','Strong passwords keep your account and reviews protected.'],
  ['invite','Accept invite',Invite,'Welcome aboard.',"You've been invited to collaborate on Customer Success reviews."],
  ['twofa','Two-factor',TwoFA,'One more step.','A quick verification keeps your workspace secure.'],
  ['workspace','Choose workspace',Workspace,'Where to today?','Jump into the brand workspace you want to work in.'],
  ['welcome','Welcome',Welcome,"You're in.",'Everything your team needs, in one place.'],
];

function ClientAuthApp({ onEnter }) {
  const [screen,setScreen]=React.useState('signin');
  const cur = SCREENS.find(s=>s[0]===screen);
  const Comp = cur[2];
  return (
    <>
      <AuthShell headline={cur[3]} blurb={cur[4]}><Comp go={setScreen} onEnter={onEnter}/></AuthShell>
      <div className="scr-picker">
        <span className="scr-picker-label">Screens</span>
        {SCREENS.map((s,i)=>(
          <button key={s[0]} className={'scr-chip'+(screen===s[0]?' active':'')} onClick={()=>setScreen(s[0])}>{String(i+1).padStart(2,'0')} {s[1]}</button>
        ))}
      </div>
    </>
  );
}

function ClientRoot() {
  const [authed,setAuthed]=React.useState(()=>{ try { return !!localStorage.getItem('mp_client'); } catch(e){ return false; } });
  const enter=()=>{ try{localStorage.setItem('mp_client','1');}catch(e){} setAuthed(true); };
  const signOut=()=>{ try{localStorage.removeItem('mp_client');}catch(e){} setAuthed(false); };
  return authed ? <ClientPortal onSignOut={signOut}/> : <ClientAuthApp onEnter={enter}/>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<ClientRoot/>);
