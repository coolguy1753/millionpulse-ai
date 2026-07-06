/* ============================================================
   MillionPulse AI — UI primitives + icon set
   ============================================================ */

// ---- Icon set (stroke, 24 viewbox) ----
const ICONS = {
  dashboard: 'M3 13h8V3H3v10zm10 8h8V11h-8v10zM3 21h8v-6H3v6zM13 3v6h8V3h-8z',
  accounts:  'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  reviews:   'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  templates: 'M4 4h7v7H4zM13 4h7v4h-7zM13 12h7v8h-7zM4 15h7v5H4z',
  sources:   'M22 12h-4l-3 9L9 3l-3 9H2',
  settings:  'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  search:    'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35',
  plus:      'M12 5v14M5 12h14',
  arrowRight:'M5 12h14M12 5l7 7-7 7',
  arrowLeft: 'M19 12H5M12 19l-7-7 7-7',
  check:     'M20 6L9 17l-5-5',
  sparkle:   'M12 3l1.9 5.8L20 10.6l-5.1 1.9L12 18l-1.9-5.5L5 10.6l6.1-1.8zM19 4v3M5 18v3M20.5 5.5h-3M6.5 19.5h-3',
  chart:     'M18 20V10M12 20V4M6 20v-6',
  trendUp:   'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
  trendDown: 'M23 18l-9.5-9.5-5 5L1 6M17 18h6v-6',
  cloud:     'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z',
  ticket:    'M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4zM13 5v14',
  heart:     'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z',
  upload:    'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  file:      'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',
  download:  'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  bell:      'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  clock:     'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  edit:      'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z',
  share:     'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
  x:         'M18 6L6 18M6 6l12 12',
  chevronRight:'M9 18l6-6-6-6',
  eye:       'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  layers:    'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  target:    'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  flag:      'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7',
  grip:      'M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01',
  book:      'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z',
  logout:    'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
};

function Icon({ name, size = 18, className = '', style = {}, fill = 'none', stroke = 'currentColor', sw = 2 }) {
  const d = ICONS[name] || '';
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      {d.split('M').filter(Boolean).map((seg, i) => <path key={i} d={'M' + seg} />)}
    </svg>
  );
}

// ---- Brand mark: rounded square with ECG pulse line ----
function BrandMark({ size = 38 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="11" fill="url(#mpg)"/>
      <path d="M6 21h5l2.5-8 4 15 3-11 2.5 4H34" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
      <defs>
        <linearGradient id="mpg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14C6EE"/><stop offset="1" stopColor="#7C5CE6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

// ---- Pills ----
function KindPill({ kind }) {
  return <span className={'pill ' + (kind === 'EBR' ? 'pill-ebr' : 'pill-qbr')}>{kind}</span>;
}
function HealthPill({ h }) {
  const c = MP.healthColor(h);
  const label = { good:'Healthy', warn:'Watch', risk:'At risk' }[c];
  return <span className={'pill pill-' + c}><span className="dot" style={{background:`var(--${c})`}}></span>{label}</span>;
}
function StatusPill({ status }) {
  const map = { 'Published':'pill-good', 'Draft':'pill-neutral', 'In review':'pill-warn' };
  return <span className={'pill ' + (map[status]||'pill-neutral')}>{status}</span>;
}
function HealthBar({ h, w = 64 }) {
  const c = MP.healthColor(h);
  return <div className="hbar" style={{width:w}}><i style={{width:h+'%', background:`var(--${c})`}}></i></div>;
}
function Avatar({ name, size = 32 }) {
  const initials = name.split(' ').map(w=>w[0]).slice(0,2).join('');
  return <div className="avatar" style={{width:size,height:size,flex:`0 0 ${size}px`,fontSize:size*0.4}}>{initials}</div>;
}
function LogoChip({ text, size = 40, color = 'primary' }) {
  const bg = color === 'pulse' ? 'linear-gradient(135deg,#22CFF2,#0FA9CC)' : 'linear-gradient(135deg,#8B6BF0,#6A4BD8)';
  return <div style={{width:size,height:size,flex:`0 0 ${size}px`,borderRadius:11,background:bg,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:size*0.36,fontFamily:'var(--font-display)',letterSpacing:'-.02em'}}>{text}</div>;
}
function Trend({ v }) {
  const up = v >= 0;
  return <span style={{display:'inline-flex',alignItems:'center',gap:3,color:up?'var(--good)':'var(--risk)',fontWeight:600,fontSize:13}}>
    <Icon name={up?'trendUp':'trendDown'} size={13} sw={2.4}/>{up?'+':''}{v}
  </span>;
}
function Btn({ variant='ghost', size, icon, iconRight, children, ...rest }) {
  return <button className={`btn btn-${variant}${size==='sm'?' btn-sm':''}`} {...rest}>
    {icon && <Icon name={icon} size={size==='sm'?15:16}/>}
    {children}
    {iconRight && <Icon name={iconRight} size={size==='sm'?15:16}/>}
  </button>;
}

Object.assign(window, { Icon, BrandMark, KindPill, HealthPill, StatusPill, HealthBar, Avatar, LogoChip, Trend, Btn });
