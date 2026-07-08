/* ============================================================
   MillionPulse AI — live API client + data loader for the prototype
   Connects the original design to the real backend (Neon) while keeping
   window.MP / window.CLIENTS shapes identical, so no screen changes.
   ============================================================ */
(function () {
  var API_BASE = 'http://localhost:4000/api';
  var A = 'mp_access',
    R = 'mp_refresh';

  var store = {
    get access() {
      return localStorage.getItem(A);
    },
    get refresh() {
      return localStorage.getItem(R);
    },
    set: function (a, r) {
      localStorage.setItem(A, a);
      localStorage.setItem(R, r);
    },
    clear: function () {
      localStorage.removeItem(A);
      localStorage.removeItem(R);
      localStorage.removeItem('mp_user');
    },
  };

  async function refresh() {
    if (!store.refresh) return false;
    try {
      var res = await fetch(API_BASE + '/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: store.refresh }),
      });
      if (!res.ok) return false;
      var d = await res.json();
      store.set(d.accessToken, d.refreshToken);
      return true;
    } catch (e) {
      return false;
    }
  }

  async function req(path, opts, retry) {
    opts = opts || {};
    if (retry === undefined) retry = true;
    var headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
    if (store.access) headers.Authorization = 'Bearer ' + store.access;
    var res = await fetch(API_BASE + path, Object.assign({}, opts, { headers: headers }));
    if (res.status === 401 && retry) {
      var ok = await refresh();
      if (ok) return req(path, opts, false);
    }
    if (!res.ok) {
      var msg = res.statusText;
      try {
        var b = await res.json();
        msg = Array.isArray(b.message) ? b.message.join(', ') : b.message || msg;
      } catch (e) {}
      var err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    if (res.status === 204) return null;
    return res.json();
  }

  async function login(email, password, totp) {
    var res = await fetch(API_BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password, totp: totp }),
    });
    if (!res.ok) {
      var msg = 'Invalid email or password';
      try {
        var b = await res.json();
        msg = Array.isArray(b.message) ? b.message.join(', ') : b.message || msg;
      } catch (e) {}
      var err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    var d = await res.json();
    store.set(d.accessToken, d.refreshToken);
    try {
      localStorage.setItem('mp_user', JSON.stringify(d.user));
    } catch (e) {}
    return d.user;
  }

  async function uploadFiles(path, files) {
    var fd = new FormData();
    for (var i = 0; i < files.length; i++) fd.append('files', files[i]);
    var headers = {};
    if (store.access) headers.Authorization = 'Bearer ' + store.access;
    var res = await fetch(API_BASE + path, { method: 'POST', headers: headers, body: fd });
    if (!res.ok) throw new Error('Upload failed (' + res.status + ')');
    return res.json();
  }

  // ---------- transforms: API shape → prototype (mock) shape ----------
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function d(x) {
    return x ? new Date(x) : null;
  }
  function shortDate(x) {
    var dt = d(x);
    return dt ? MON[dt.getMonth()] + ' ' + dt.getFullYear() : '—';
  }
  function longDate(x) {
    var dt = d(x);
    return dt ? dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  }
  function dueStr(x) {
    var dt = d(x);
    if (!dt) return '—';
    var days = Math.ceil((dt.getTime() - Date.now()) / 86400000);
    if (days < 0) return 'overdue';
    return 'in ' + days + ' days';
  }
  function cap(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }
  function statusTitle(s) {
    return { published: 'Published', draft: 'Draft', in_review: 'In review' }[s] || cap(s);
  }
  function clientStatusTitle(s) {
    return { active: 'Active', onboarding: 'Onboarding', prospect: 'Prospect', churned: 'Churned' }[s] || cap(s);
  }
  var SRC_ICON = { CRM: 'cloud', 'Product usage': 'chart', Support: 'ticket', 'Health & NPS': 'heart' };

  function mapAccount(a) {
    var risk = a.health >= 75 ? 'low' : a.health >= 60 ? 'medium' : 'high';
    return {
      id: a.id,
      name: a.name,
      logo: a.logo,
      tier: a.tier,
      arr: a.arr,
      seats: a.seats,
      health: a.health,
      trend: a.trend || 0,
      csm: (a.csm && a.csm.name) || '—',
      srSpecialist: (a.srSpecialist && a.srSpecialist.name) || undefined,
      renewal: shortDate(a.autoRenewalDate),
      nps: a.nps,
      tickets: a.tickets,
      adoption: a.adoption,
      region: a.region,
      nextReview: a.kind || 'EBR',
      due: dueStr(a.autoRenewalDate),
      risk: risk,
      ebr: {
        autoRenewal: longDate(a.autoRenewalDate),
        termStart: longDate(a.termStartDate),
        contracted: a.seats,
        active: Math.round((a.seats || 0) * (a.adoption || 0)),
        srp: a.srpTier,
        structure: a.structure,
        brands: a.brands || [],
        posture: a.posture,
      },
    };
  }
  function mapReview(r) {
    return {
      id: r.id,
      account: (r.account && r.account.name) || '—',
      logo: (r.account && r.account.logo) || '',
      kind: r.kind,
      template: r.templateName || '',
      structure: r.structure,
      tier: r.tier,
      status: statusTitle(r.status),
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      owner: (r.owner && r.owner.name) || '—',
      quarter: r.quarter || '',
    };
  }
  function mapSource(s) {
    return {
      id: s.id,
      name: cap(s.provider),
      cat: s.category,
      status: s.status,
      detail: s.detail,
      icon: SRC_ICON[s.category] || 'cloud',
    };
  }

  // Load real data for the signed-in user and mutate window.MP / window.CLIENTS
  // in place (keeping helper functions + template definitions from the mock).
  async function loadLiveData() {
    var user = null;
    try {
      user = await req('/auth/me');
    } catch (e) {
      user = null;
    }

    // Snapshot mock templates so screens that rely on template definitions keep working.
    var mockWs = (window.MP && window.MP.workspaces.slice()) || [];

    var wss = await req('/workspaces');
    var built = [];
    for (var i = 0; i < wss.length; i++) {
      var w = wss[i];
      var parts = await Promise.all([
        req('/ws/' + w.id + '/accounts').catch(function () {
          return [];
        }),
        req('/ws/' + w.id + '/reviews').catch(function () {
          return [];
        }),
        req('/ws/' + w.id + '/sources').catch(function () {
          return [];
        }),
      ]);
      var mock = mockWs[i] || mockWs[0] || {};
      built.push({
        id: w.id,
        name: w.name,
        short: w.short || w.name,
        logo: w.logo || (w.name ? w.name[0] : '?'),
        domain: (mock && mock.domain) || '',
        plan: w.plan || 'Enterprise',
        industry: w.industry || (mock && mock.industry) || '',
        accent: w.accent || (mock && mock.accent) || '#5B4BE6',
        accounts: parts[0].map(mapAccount),
        reviews: parts[1].map(mapReview),
        sources: parts[2].map(mapSource),
        templates: (mock && mock.templates) || (window.MP && window.MP.templates) || [],
        ebrSystem: mock ? mock.ebrSystem : undefined,
      });
    }
    if (window.MP && built.length) {
      window.MP.workspaces.length = 0;
      for (var j = 0; j < built.length; j++) window.MP.workspaces.push(built[j]);
    }

    // HQ registry (super-admin only). If forbidden, keep the mock CLIENTS.
    if (user && user.isSuperAdmin && window.CLIENTS) {
      try {
        var res = await Promise.all([req('/clients'), req('/users'), req('/roles')]);
        var clients = res[0],
          users = res[1],
          rolesResp = res[2];

        var userCountByClient = {};
        users.forEach(function (u) {
          if (u.client) userCountByClient[u.client] = (userCountByClient[u.client] || 0) + 1;
        });

        window.CLIENTS.clients.length = 0;
        clients.forEach(function (c) {
          window.CLIENTS.clients.push({
            id: c.id,
            name: c.name,
            domain: c.domain,
            logo: c.logo,
            vertical: c.vertical || '—',
            plan: c.plan,
            arr: c.arr,
            accounts: c.accounts || 0,
            health: null,
            status: clientStatusTitle(c.status),
            region: c.region,
            lead: c.lead || '—',
            users: userCountByClient[c.name] || 0,
            renewal: '—',
            onboarded: c.onboarded,
            sources: 0,
            hasWorkspace: c.hasWorkspace,
          });
        });

        window.CLIENTS.users.length = 0;
        users.forEach(function (u) {
          window.CLIENTS.users.push({
            name: u.name,
            email: u.email,
            role: u.role || 'viewer',
            client: u.client || '—',
            status: cap(u.status),
            last: u.last ? new Date(u.last).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—',
          });
        });

        if (rolesResp && rolesResp.roles) {
          var matrix = {};
          var roles = rolesResp.roles.map(function (r) {
            matrix[r.id] = r.matrix;
            return { id: r.id, name: r.name, who: r.scope, scope: r.scope, color: r.color || '#8B92AC', desc: r.description || '' };
          });
          window.CLIENTS.roles.length = 0;
          roles.forEach(function (r) {
            window.CLIENTS.roles.push(r);
          });
          window.CLIENTS.caps.length = 0;
          rolesResp.caps.forEach(function (c) {
            window.CLIENTS.caps.push(c);
          });
          Object.keys(window.CLIENTS.matrix).forEach(function (k) {
            delete window.CLIENTS.matrix[k];
          });
          Object.keys(matrix).forEach(function (k) {
            window.CLIENTS.matrix[k] = matrix[k];
          });
        }
      } catch (e) {
        /* keep mock CLIENTS on error */
      }
    }

    window.__MP_USER__ = user;
    return user;
  }

  window.MPAPI = {
    store: store,
    get: function (p) {
      return req(p);
    },
    post: function (p, b) {
      return req(p, { method: 'POST', body: JSON.stringify(b || {}) });
    },
    login: login,
    logout: function () {
      store.clear();
    },
    me: function () {
      return req('/auth/me');
    },
    uploadFiles: uploadFiles,
  };
  window.loadLiveData = loadLiveData;
})();
