/* ============================================================
   MillionPulse AI — Level 1 · Team & Roles (users + access matrix)
   ============================================================ */

function RolePill({ id }) { const r=CLIENTS.roleById(id); return <span className="pill" style={{background:r.color+'1a',color:r.color}}>{r.name}</span>; }

function InviteUser({ onClose, onInvite }) {
  const [email,setEmail]=React.useState('');
  const [role,setRole]=React.useState('csm');
  const [client,setClient]=React.useState(CLIENTS.clients[0].name);
  const ok=/\S+@\S+\.\S+/.test(email);
  return ReactDOM.createPortal((
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="row" style={{justifyContent:'space-between',marginBottom:4}}><h2 style={{fontSize:19}}>Invite user</h2><button className="btn btn-ghost btn-sm" style={{padding:8}} onClick={onClose}><Icon name="x" size={16}/></button></div>
        <p className="muted" style={{fontSize:13,marginTop:0,marginBottom:18}}>Send an invite and assign a role + workspace.</p>
        <LField label="Work email"><input className="winput" value={email} placeholder="name@company.com" onChange={e=>setEmail(e.target.value)} autoFocus/></LField>
        <div className="grid gap12" style={{gridTemplateColumns:'1fr 1fr',marginTop:14}}>
          <LField label="Role"><select className="winput" value={role} onChange={e=>setRole(e.target.value)}>{CLIENTS.roles.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select></LField>
          <LField label="Workspace"><select className="winput" value={client} onChange={e=>setClient(e.target.value)}>{['All clients',...CLIENTS.clients.map(c=>c.name)].map(c=><option key={c}>{c}</option>)}</select></LField>
        </div>
        <div className="row gap8" style={{marginTop:12,fontSize:12.5,color:'var(--text-3)'}}><Icon name="flag" size={13}/>{CLIENTS.roleById(role).desc}</div>
        <div className="row" style={{justifyContent:'flex-end',gap:10,marginTop:22}}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={!ok} style={{opacity:ok?1:.5}} onClick={()=>onInvite({name:email.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,m=>m.toUpperCase()),email,role,client,status:'Invited',last:'—'})}><Icon name="check" size={16}/>Send invite</button>
        </div>
      </div>
    </div>
  ), document.body);
}

function TeamRolesPage() {
  const [tab,setTab]=React.useState('Users');
  const [users,setUsers]=React.useState(CLIENTS.users);
  const [inviting,setInviting]=React.useState(false);

  return (
    <div className="content-inner fade-up">
      <div className="row" style={{justifyContent:'space-between',marginBottom:18,alignItems:'flex-start'}}>
        <div><h1 style={{fontSize:26,marginBottom:6}}>Team & Roles</h1><p className="muted" style={{fontSize:14.5,margin:0}}>Who has access, and what each role can do across the platform.</p></div>
        {tab==='Users' && <Btn variant="primary" icon="plus" onClick={()=>setInviting(true)}>Invite user</Btn>}
      </div>

      <div style={{marginBottom:16}}><FilterTabs tabs={['Users','Roles & permissions']} active={tab} onChange={setTab}/></div>

      {tab==='Users' && (
        <div className="card" style={{overflowX:'auto'}}>
          <table className="tbl tbl-tight">
            <thead><tr><th>User</th><th>Role</th><th>Scope / workspace</th><th>Status</th><th>Last active</th><th></th></tr></thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.email}>
                  <td><div className="row gap10"><Avatar name={u.name} size={30}/><div><div style={{fontWeight:600}}>{u.name}</div><div className="muted" style={{fontSize:12}}>{u.email}</div></div></div></td>
                  <td><RolePill id={u.role}/></td>
                  <td className="muted" style={{fontSize:13,whiteSpace:'nowrap'}}>{u.client}</td>
                  <td><span className={'pill '+(u.status==='Active'?'pill-good':'pill-warn')}>{u.status==='Active'&&<span className="dot" style={{background:'var(--good)'}}></span>}{u.status}</span></td>
                  <td className="muted mono" style={{fontSize:12.5}}>{u.last}</td>
                  <td style={{textAlign:'right'}}><button className="btn btn-ghost btn-sm" style={{padding:8}}><Icon name="settings" size={15}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab==='Roles & permissions' && (
        <div>
          <div className="grid gap12" style={{gridTemplateColumns:'repeat(5,1fr)',marginBottom:18}}>
            {CLIENTS.roles.map(r=>(
              <div key={r.id} className="card card-pad" style={{display:'flex',flexDirection:'column',gap:8}}>
                <div style={{width:34,height:34,borderRadius:9,background:r.color+'1a',color:r.color,display:'flex',alignItems:'center',justifyContent:'center'}}><Icon name="accounts" size={17}/></div>
                <div><div style={{fontWeight:700,fontFamily:'var(--font-display)',fontSize:14}}>{r.name}</div><div className="muted" style={{fontSize:11.5,marginTop:2}}>{r.who}</div></div>
                <span className="tag" style={{alignSelf:'flex-start'}}>{r.scope}</span>
                <p className="muted" style={{fontSize:12,lineHeight:1.45,margin:'2px 0 0'}}>{r.desc}</p>
              </div>
            ))}
          </div>
          <div className="card" style={{overflowX:'auto'}}>
            <table className="tbl tbl-tight">
              <thead><tr><th>Capability</th>{CLIENTS.roles.map(r=><th key={r.id} style={{textAlign:'center'}}>{r.name}</th>)}</tr></thead>
              <tbody>
                {CLIENTS.caps.map((cap,ci)=>(
                  <tr key={cap} style={{cursor:'default'}}>
                    <td style={{fontWeight:600,fontSize:13.5}}>{cap}</td>
                    {CLIENTS.roles.map(r=>{const v=CLIENTS.matrix[r.id][ci];return (
                      <td key={r.id} style={{textAlign:'center'}}>
                        {v===2 ? <Icon name="check" size={16} stroke="var(--good)" sw={3}/> : v===1 ? <span title="Partial" style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:'var(--warn)'}}></span> : <span style={{color:'var(--line)'}}>—</span>}
                      </td>
                    );})}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="row gap16 card-pad" style={{paddingTop:12,fontSize:12,color:'var(--text-2)'}}>
              <span className="row gap8"><Icon name="check" size={13} stroke="var(--good)" sw={3}/>Full access</span>
              <span className="row gap8"><span style={{width:8,height:8,borderRadius:'50%',background:'var(--warn)'}}></span>Partial / contribute</span>
              <span className="row gap8"><span style={{color:'var(--text-3)'}}>—</span>No access</span>
            </div>
          </div>
        </div>
      )}

      {inviting && <InviteUser onClose={()=>setInviting(false)} onInvite={(u)=>{setUsers(l=>[...l,u]);setInviting(false);}}/>}
    </div>
  );
}

Object.assign(window, { TeamRolesPage });
