/* ============================================================
   MillionPulse AI — Level 2 · Client-side Team & Workspace Settings
   Workspace-scoped (this client only). Reuses CLIENTS data (roles/users).
   ============================================================ */

function CField({ label, children }) {
  return <label style={{display:'block'}}><span style={{display:'block',fontSize:12,fontWeight:600,color:'var(--text-2)',marginBottom:5}}>{label}</span>{children}</label>;
}
function CToggle({ on, onToggle }) {
  return <button onClick={onToggle} style={{width:44,height:26,borderRadius:20,border:'none',cursor:'pointer',background:on?'var(--primary)':'var(--line)',position:'relative',flex:'0 0 44px'}}><span style={{position:'absolute',top:3,left:on?21:3,width:20,height:20,borderRadius:'50%',background:'#fff',transition:'left .15s',boxShadow:'0 1px 3px rgba(0,0,0,.2)'}}></span></button>;
}
function CSettingRow({ title, desc, control }) {
  return <div className="row gap16" style={{padding:'14px 0',borderBottom:'1px solid var(--line-2)'}}><div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{title}</div><div className="muted" style={{fontSize:12.5,marginTop:2}}>{desc}</div></div>{control}</div>;
}
const CROLE = (id)=> (window.CLIENTS?CLIENTS.roleById(id):{name:id,color:'#5B4BE6',scope:'',desc:''});

/* ---- Invite teammate (workspace-scoped) ---- */
function ClientInvite({ ws, onClose, onInvite }) {
  const [email,setEmail]=React.useState('');
  const [role,setRole]=React.useState('csm');
  const roles=(window.CLIENTS?CLIENTS.roles:[]).filter(r=>r.id!=='superadmin');
  const ok=/\S+@\S+\.\S+/.test(email);
  return ReactDOM.createPortal((
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="row" style={{justifyContent:'space-between',marginBottom:4}}><h2 style={{fontSize:19}}>Invite teammate</h2><button className="btn btn-ghost btn-sm" style={{padding:8}} onClick={onClose}><Icon name="x" size={16}/></button></div>
        <p className="muted" style={{fontSize:13,marginTop:0,marginBottom:18}}>They'll join the <b>{ws.name}</b> workspace.</p>
        <CField label="Work email"><input className="winput" value={email} placeholder="name@company.com" onChange={e=>setEmail(e.target.value)} autoFocus/></CField>
        <div style={{marginTop:14}}><CField label="Role"><select className="winput" value={role} onChange={e=>setRole(e.target.value)}>{roles.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></CField></div>
        <div className="row gap8" style={{marginTop:12,fontSize:12.5,color:'var(--text-3)'}}><Icon name="flag" size={13}/>{CROLE(role).desc}</div>
        <div className="row" style={{justifyContent:'flex-end',gap:10,marginTop:22}}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!ok} style={{opacity:ok?1:.5}} onClick={()=>onInvite({name:email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,m=>m.toUpperCase()),email,role,client:ws.name,status:'Invited',last:'—'})}><Icon name="check" size={16}/>Send invite</button>
        </div>
      </div>
    </div>
  ), document.body);
}

function ClientTeam({ ws }) {
  const seed=(window.CLIENTS?CLIENTS.users:[]).filter(u=>u.client===ws.name);
  const [users,setUsers]=React.useState(seed.length?seed:[{name:'Sarah Mitchell',email:'sarah.mitchell@experience.com',role:'wsadmin',client:ws.name,status:'Active',last:'now'}]);
  const [inviting,setInviting]=React.useState(false);
  const roles=(window.CLIENTS?CLIENTS.roles:[]).filter(r=>r.id!=='superadmin');
  return (
    <div className="content-inner fade-up">
      <div className="row" style={{justifyContent:'space-between',marginBottom:18,alignItems:'flex-start'}}>
        <div><h1 style={{fontSize:26,marginBottom:6}}>Team</h1><p className="muted" style={{fontSize:14.5,margin:0}}>Manage who in {ws.name} can access this workspace.</p></div>
        <Btn variant="primary" icon="plus" onClick={()=>setInviting(true)}>Invite teammate</Btn>
      </div>

      <div className="card" style={{overflowX:'auto',marginBottom:20}}>
        <table className="tbl tbl-tight">
          <thead><tr><th>Member</th><th>Role</th><th>Access</th><th>Status</th><th>Last active</th><th></th></tr></thead>
          <tbody>
            {users.map(u=>{const r=CROLE(u.role);return (
              <tr key={u.email}>
                <td><div className="row gap10"><Avatar name={u.name} size={30}/><div><div style={{fontWeight:600}}>{u.name}</div><div className="muted" style={{fontSize:12}}>{u.email}</div></div></div></td>
                <td><span className="pill" style={{background:r.color+'1a',color:r.color}}>{r.name}</span></td>
                <td className="muted" style={{fontSize:12.5,whiteSpace:'nowrap'}}>{r.scope}</td>
                <td><span className={'pill '+(u.status==='Active'?'pill-good':'pill-warn')}>{u.status==='Active'&&<span className="dot" style={{background:'var(--good)'}}></span>}{u.status}</span></td>
                <td className="muted mono" style={{fontSize:12.5}}>{u.last}</td>
                <td style={{textAlign:'right'}}><button className="btn btn-ghost btn-sm" style={{padding:8}}><Icon name="settings" size={15}/></button></td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>

      <div className="nav-label" style={{color:'var(--text-3)',padding:'0 0 10px'}}>Roles in this workspace</div>
      <div className="grid gap12" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {roles.map(r=>(
          <div key={r.id} className="card card-pad" style={{display:'flex',flexDirection:'column',gap:6}}>
            <div className="row gap8"><span style={{width:10,height:10,borderRadius:3,background:r.color}}></span><span style={{fontWeight:700,fontFamily:'var(--font-display)',fontSize:13.5}}>{r.name}</span></div>
            <span className="tag" style={{alignSelf:'flex-start'}}>{r.scope}</span>
            <p className="muted" style={{fontSize:12,lineHeight:1.45,margin:0}}>{r.desc}</p>
          </div>
        ))}
      </div>

      {inviting && <ClientInvite ws={ws} onClose={()=>setInviting(false)} onInvite={(u)=>{setUsers(l=>[...l,u]);setInviting(false);}}/>}
    </div>
  );
}

/* ---- Workspace Settings (client-scoped, read-mostly) ---- */
function ClientSettings({ ws }) {
  const [n,setN]=React.useState({published:true, digest:true, renewal:true});
  const set=(k)=>setN(x=>({...x,[k]:!x[k]}));
  const connected=ws.sources.filter(s=>s.status==='connected');
  return (
    <div className="content-inner fade-up" style={{maxWidth:820}}>
      <div style={{marginBottom:20}}><h1 style={{fontSize:26,marginBottom:6}}>Workspace settings</h1><p className="muted" style={{fontSize:14.5,margin:0}}>Your organization profile, notifications, and plan.</p></div>

      <div className="card card-pad" style={{marginBottom:16}}>
        <h3 style={{fontSize:16,marginBottom:6}}>Organization</h3>
        <CSettingRow title="Organization" desc="Shown across your portal" control={<div className="row gap10"><div className="ws-logo" style={{background:'linear-gradient(135deg,#8B6BF0,#6A4BD8)',width:34,height:34,flex:'0 0 34px'}}>{ws.logo}</div><input className="winput" style={{width:200}} defaultValue={ws.name}/></div>}/>
        <CSettingRow title="Primary contact" desc="Main point of contact for reviews" control={<input className="winput" style={{width:220}} defaultValue="sarah.mitchell@experience.com"/>}/>
        <CSettingRow title="Timezone" desc="Used for scheduling & reminders" control={<select className="winput" style={{width:180}} defaultValue="America/New_York"><option>America/New_York</option><option>America/Los_Angeles</option><option>Europe/London</option></select>}/>
      </div>

      <div className="card card-pad" style={{marginBottom:16}}>
        <h3 style={{fontSize:16,marginBottom:6}}>Notifications</h3>
        <CSettingRow title="Review published" desc="Email me when a new EBR/QBR is shared" control={<CToggle on={n.published} onToggle={()=>set('published')}/>}/>
        <CSettingRow title="Renewal reminders" desc="Alert me as the renewal window opens" control={<CToggle on={n.renewal} onToggle={()=>set('renewal')}/>}/>
        <CSettingRow title="Weekly digest" desc="Portfolio summary every Monday" control={<CToggle on={n.digest} onToggle={()=>set('digest')}/>}/>
      </div>

      <div className="card card-pad" style={{marginBottom:16}}>
        <h3 style={{fontSize:16,marginBottom:6}}>Connected data sources</h3>
        <div className="grid gap8" style={{marginTop:8}}>
          {connected.map(s=>(
            <div key={s.id} className="row gap12" style={{padding:'10px 12px',border:'1px solid var(--line)',borderRadius:10}}>
              <div style={{width:30,height:30,borderRadius:8,background:'var(--surface-2)',border:'1px solid var(--line)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-2)'}}><Icon name={s.icon} size={16}/></div>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13.5}}>{s.name}</div><div className="muted" style={{fontSize:11.5}}>{s.detail}</div></div>
              <span className="pill pill-good"><span className="dot" style={{background:'var(--good)'}}></span>Connected</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card card-pad">
        <div className="row" style={{justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}><h3 style={{fontSize:16}}>Plan</h3><span className="pill pill-ebr">{ws.plan}</span></div>
        <div className="grid gap12" style={{gridTemplateColumns:'repeat(3,1fr)',margin:'12px 0 4px'}}>
          {[['Plan',ws.plan],['Accounts',ws.accounts.length],['Renewal','Oct 11, 2026']].map(([k,v])=>(
            <div key={k}><div className="muted" style={{fontSize:12,fontWeight:600}}>{k}</div><div style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:600,marginTop:2}}>{v}</div></div>
          ))}
        </div>
        <div className="muted" style={{fontSize:12.5,marginTop:8}}>To change your plan or seats, contact your Customer Success team.</div>
      </div>
    </div>
  );
}

Object.assign(window, { ClientTeam, ClientSettings });
