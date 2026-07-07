/* ============================================================
   MillionPulse AI — app shell (sidebar + topbar)
   ============================================================ */

const NAV = [
  { id:'dashboard', label:'Dashboard', icon:'dashboard' },
  { id:'accounts',  label:'Accounts',  icon:'accounts' },
  { id:'reviews',   label:'Reviews',   icon:'reviews' },
  { id:'templates', label:'Templates', icon:'templates' },
  { id:'sources',   label:'Data Sources', icon:'sources' },
];

const HQNAV = [
  ['overview','Overview','dashboard'],
  ['clients','Clients','book'],
  ['verticals','Verticals','layers'],
  ['lib','Template Library','templates'],
  ['allreviews','All Reviews','reviews'],
  ['billing','Billing','trendUp'],
  ['roles','Team & Roles','accounts'],
  ['settings','Settings','settings'],
];

function WorkspaceSwitcher({ ws, workspaces, onSwitch }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(()=>{
    const h = () => setOpen(false);
    if (open) { document.addEventListener('click', h); return ()=>document.removeEventListener('click', h); }
  },[open]);
  return (
    <div style={{position:'relative',margin:'0 6px 4px'}}>
      <button className="ws-switch" onClick={(e)=>{e.stopPropagation();setOpen(o=>!o);}}>
        <div className="ws-logo" style={{background:ws.accent}}>{ws.logo}</div>
        <div style={{flex:1,textAlign:'left',lineHeight:1.2,overflow:'hidden'}}>
          <div style={{fontSize:13.5,fontWeight:600,color:'#fff',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{ws.name}</div>
          <div style={{fontSize:11,color:'#6E7691'}}>{ws.plan} workspace</div>
        </div>
        <Icon name="chevronRight" size={15} style={{transform:'rotate(90deg)',color:'#8891AB'}}/>
      </button>
      {open && (
        <div className="ws-menu" onClick={(e)=>e.stopPropagation()}>
          <div className="ws-menu-label">Client workspaces</div>
          {workspaces.map(w=>(
            <button key={w.id} className="ws-menu-item" onClick={()=>{onSwitch(w.id);setOpen(false);}}>
              <div className="ws-logo" style={{background:w.accent,width:26,height:26,flex:'0 0 26px',fontSize:12}}>{w.logo}</div>
              <div style={{flex:1,textAlign:'left',lineHeight:1.15}}>
                <div style={{fontSize:13,fontWeight:600,color:'#fff'}}>{w.name}</div>
                <div style={{fontSize:10.5,color:'#7E86A0'}}>{w.accounts.length} accounts · {w.industry}</div>
              </div>
              {w.id===ws.id && <Icon name="check" size={15} stroke="var(--pulse)" sw={3}/>}
            </button>
          ))}
          <div className="ws-menu-sep"></div>
          <button className="ws-menu-item" style={{color:'#AEB4C9'}}><Icon name="plus" size={16}/><span style={{fontSize:13,fontWeight:600}}>New client workspace</span></button>
        </div>
      )}
    </div>
  );
}

function Sidebar({ route, go, onGenerate, ws, workspaces, onSwitch, user, onSignOut }) {
  const counts = { accounts: ws.accounts.length, reviews: ws.reviews.length };
  const at = (id) => route === id || (id === 'reviews' && route === 'review') || (id === 'reviews' && route === 'generate');
  return (
    <aside className="sidebar">
      <div className="brand" onClick={()=>go('dashboard')} style={{cursor:'pointer'}}>
        <BrandMark size={38}/>
        <div>
          <div className="brand-name">MillionPulse<span style={{color:'var(--pulse)'}}> AI</span></div>
          <div className="brand-sub">Million Square Solutions</div>
        </div>
      </div>

      <div className="nav-label" style={{paddingTop:6}}>MillionPulse HQ</div>
      {HQNAV.map(([id,label,ic])=>(
        <button key={id} className={'nav-item'+(route===id?' active':'')} onClick={()=>go(id)}>
          <Icon name={ic} className="ic" size={18}/><span>{label}</span>
        </button>
      ))}

      <div className="nav-label">Client workspace</div>
      <WorkspaceSwitcher ws={ws} workspaces={workspaces} onSwitch={onSwitch}/>

      <button className="btn btn-primary" style={{margin:'6px 6px 8px',justifyContent:'center'}} onClick={onGenerate}>
        <Icon name="sparkle" size={16}/> Generate review
      </button>

      <div className="nav-label">Workspace</div>
      {NAV.map(n => (
        <button key={n.id} className={'nav-item' + (at(n.id) ? ' active' : '')} onClick={()=>go(n.id)}>
          <Icon name={n.icon} className="ic" size={18}/>
          <span>{n.label}</span>
          {counts[n.id]!=null && <span className="nav-badge">{counts[n.id]}</span>}
        </button>
      ))}

      <div className="sidebar-foot">
        <div className="user-chip">
          <Avatar name="Priya Nair" size={32}/>
          <div style={{lineHeight:1.2,overflow:'hidden',flex:1}}>
            <div style={{fontSize:13,fontWeight:600,color:'#fff',whiteSpace:'nowrap'}}>Priya Nair</div>
            <div style={{fontSize:11,color:'#6E7691',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user?.email || 'MillionPulse Admin'}</div>
          </div>
          <button onClick={onSignOut} title="Sign out" style={{border:'none',background:'none',color:'#8891AB',cursor:'pointer',padding:6,borderRadius:8,display:'flex'}} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='#8891AB'}><Icon name="logout" size={17}/></button>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ title, crumbs, actions, ws }) {
  return (
    <header className="topbar">
      <div>
        {crumbs && <div className="crumb">{crumbs}</div>}
        <div className="page-title">{title}</div>
      </div>
      {ws && (
        <div className="ws-chip" title="You are viewing this client workspace only">
          <div className="ws-logo" style={{background:ws.accent,width:20,height:20,flex:'0 0 20px',fontSize:10}}>{ws.logo}</div>
          <span>{ws.name}</span>
        </div>
      )}
      {!actions && (
        <div className="search">
          <Icon name="search" size={16}/>
          <input placeholder="Search accounts, reviews…" />
        </div>
      )}
      <div className="row gap12" style={{marginLeft: actions ? 'auto':'16px'}}>
        {actions}
        <button className="btn btn-ghost btn-sm" style={{padding:'8px'}} aria-label="Notifications"><Icon name="bell" size={17}/></button>
      </div>
    </header>
  );
}

Object.assign(window, { Sidebar, Topbar });
