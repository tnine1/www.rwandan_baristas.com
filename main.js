// Simple view switching
const views = document.querySelectorAll('.view');
document.getElementById('nav').addEventListener('click', (e) => {
  const v = e.target.dataset.view;
  if (!v) return;
  e.preventDefault();
  showView(v);
});

function showView(id) {
  views.forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

let authToken = null;
let userRole = null;

function setAuth(token, role) {
  authToken = token;
  userRole = role;
  document.getElementById('loginLink').classList.add('hidden');
  document.getElementById('registerLink').classList.add('hidden');
  document.getElementById('dashboardLink').classList.remove('hidden');
  document.getElementById('logoutLink').classList.remove('hidden');
  showView('dashboard');
  renderDashboard();
  loadNotifications();
}

document.getElementById('logoutLink').addEventListener('click', (e) => {
  e.preventDefault();
  authToken = null;
  userRole = null;
  document.getElementById('loginLink').classList.remove('hidden');
  document.getElementById('registerLink').classList.remove('hidden');
  document.getElementById('dashboardLink').classList.add('hidden');
  document.getElementById('logoutLink').classList.add('hidden');
  showView('home');
});

function authHeaders() {
  return authToken ? { 'Authorization': 'Bearer ' + authToken } : {};
}
// Register
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = Object.fromEntries(fd.entries());
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  document.getElementById('registerMsg').textContent = data.error || data.message;
  if (data.token) setAuth(data.token, data.role);
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = Object.fromEntries(fd.entries());
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  document.getElementById('loginMsg').textContent = data.error || data.message;
  if (data.token) setAuth(data.token, data.role);
});
async function loadJobs() {
  const q = document.getElementById('searchQ').value.trim();
  const job_type = document.getElementById('searchType').value;
  const location = document.getElementById('searchLocation').value.trim();
  const params = new URLSearchParams();
  if (q) params.append('q', q);
  if (job_type) params.append('job_type', job_type);
  if (location) params.append('location', location);

  const res = await fetch(`${API_BASE}/jobs/list?` + params.toString());
  const data = await res.json();
  const list = document.getElementById('jobsList');
  list.innerHTML = '';
  (data.jobs || []).forEach(job => {
    const div = document.createElement('div');
    div.className = 'job';
    div.innerHTML = `
      <strong>${job.title}</strong> — ${job.company_name}<br>
      <em>${job.job_type.replace('_',' ')}</em> • ${job.location}<br>
      <small>${job.skills_required || ''}</small><br>
      <p>${job.description || ''}</p>
      ${userRole === 'barista' ? `<button data-id="${job.id}" class="applyBtn">Apply</button>` : ''}
    `;
    list.appendChild(div);
  });

  list.querySelectorAll('.applyBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const cover_note = prompt('Add a short note (optional):') || '';
      const res = await fetch(`${API_BASE}/applications/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ job_id: btn.dataset.id, cover_note })
      });
      const data = await res.json();
      alert(data.error || data.message);
    });
  });
}

document.getElementById('searchBtn').addEventListener('click', loadJobs);
window.addEventListener('DOMContentLoaded', loadJobs);
function renderDashboard() {
  document.getElementById('roleInfo').textContent = userRole ? `Logged in as ${userRole}` : 'Not logged in';
  document.getElementById('baristaPanel').classList.toggle('hidden', userRole !== 'barista');
  document.getElementById('employerPanel').classList.toggle('hidden', userRole !== 'employer');
  document.getElementById('adminPanel').classList.toggle('hidden', userRole !== 'admin');
}

document.getElementById('baristaForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const res = await fetch(`${API_BASE}/baristas/create`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: fd
  });
  const data = await res.json();
  document.getElementById('baristaMsg').textContent = data.error || data.message;
});
document.getElementById('companyForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = Object.fromEntries(fd.entries());
  const res = await fetch(`${API_BASE}/employers/company`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  document.getElementById('employerMsg').textContent = data.error || data.message;
});

document.getElementById('jobForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const payload = Object.fromEntries(fd.entries());
  const res = await fetch(`${API_BASE}/jobs/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  document.getElementById('employerMsg').textContent = data.error || data.message;
});
async function loadNotifications() {
  if (!authToken) {
    document.getElementById('notifications').innerHTML = '<em>Login to see notifications</em>';
    return;
  }
  const res = await fetch(`${API_BASE}/notifications/list`, { headers: { ...authHeaders() } });
  const data = await res.json();
  const wrap = document.getElementById('notifications');
  wrap.innerHTML = '';
  (data.notifications || []).forEach(n => {
    const div = document.createElement('div');
    div.className = 'job';
    div.innerHTML = `<strong>${n.type}</strong> — ${n.message} <small>${n.created_at}</small> ${n.is_read ? '' : '<button data-id="'+n.id+'">Mark read</button>'}`;
    wrap.appendChild(div);
  });
  wrap.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', async () => {
      await fetch(`${API_BASE}/notifications/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ id: b.dataset.id })
      });
      loadNotifications();
    });
  });
}

async function loadAdminPanels() {
  if (userRole !== 'admin') return;
  const pb = await fetch(`${API_BASE}/admin/pending-baristas`, { headers: { ...authHeaders() } }).then(r => r.json());
  const pj = await fetch(`${API_BASE}/admin/pending-jobs`, { headers: { ...authHeaders() } }).then(r => r.json());

  const bWrap = document.getElementById('pendingBaristas');
  bWrap.innerHTML = '';
  (pb.baristas || []).forEach(b => {
    const div = document.createElement('div');
    div.className = 'job';
    div.innerHTML = `
      <strong>${b.full_name}</strong> — ${b.location} • ${b.availability}<br>
      ${b.latte_art_image ? `<img src="${API_BASE.replace('/api','')}/${b.latte_art_image}" alt="latte art" style="max-width:120px;">` : ''}
      ${b.cv_file ? `<a href="${API_BASE.replace('/api','')}/${b.cv_file}" target="_blank">CV</a>` : ''}
      <br>
      <button data-id="${b.id}" data-approve="1">Approve</button>
      <button data-id="${b.id}" data-approve="0">Reject</button>
    `;
    bWrap.appendChild(div);
  });

  const jWrap = document.getElementById('pendingJobs');
  jWrap.innerHTML = '';
  (pj.jobs || []).forEach(j => {
    const div = document.createElement('div');
    div.className = 'job';
    div.innerHTML = `
      <strong>${j.title}</strong> — ${j.company_name}<br>
      ${j.job_type.replace('_',' ')} • ${j.location}<br>
      <button data-id="${j.id}" data-approve="1">Approve</button>
      <button data-id="${j.id}" data-approve="0">Reject</button>
    `;
    jWrap.appendChild(div);
  });

  // Bind approve/reject
  bWrap.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const res = await fetch(`${API_BASE}/admin/approve-barista`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ barista_id: btn.dataset.id, approve: btn.dataset.approve === '1' })
      });
      const data = await res.json();
      alert(data.message || data.error);
      loadAdminPanels();
    });
  });

  jWrap.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const res = await fetch(`${API_BASE}/admin/approve-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ job_id: btn.dataset.id, approve: btn.dataset.approve === '1' })
      });
      const data = await res.json();
      alert(data.message || data.error);
      loadAdminPanels();
    });
  });
}

document.getElementById('dashboardLink').addEventListener('click', () => {
  renderDashboard();
  loadNotifications();
  loadAdminPanels();
});
