/* =========================
   CONFIG
========================= */
// MUST be HTTPS and MUST point to /api
const API = "https://rwandanbarista.ct.ws/api";

/* =========================
   GENERIC FETCH
========================= */
async function apiFetch(endpoint, data = null, method = "POST") {
  const res = await fetch(API + endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: data ? JSON.stringify(data) : null
  });

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok) {
    throw new Error(json.error || "Request failed");
  }

  return json;
}
/* =========================
   VIEW SWITCHER
========================= */
function showView(id) {
  document.querySelectorAll(".view")
    .forEach(v => v.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
}

/* =========================
   LOGIN
========================= */
async function loginUser() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("loginMsg");

  msg.textContent = "Logging in...";

  try {
    const data = await apiFetch("/login.php", { email, password });

    msg.textContent = "✅ Logged in successfully";

    localStorage.setItem("userRole", data.role);
    localStorage.setItem("userEmail", email);

    updateNav(data.role);
    showDashboard(data.role);

  } catch (err) {
    msg.textContent = "❌ " + err.message;
  }
}

/* =========================
   REGISTER
========================= */
document.getElementById("registerForm").addEventListener("submit", async e => {
  e.preventDefault();

  const payload = {
    role: document.getElementById("role").value,
    first_name: document.getElementById("first_name").value.trim(),
    last_name: document.getElementById("last_name").value.trim(),
    email: document.getElementById("email").value.trim().toLowerCase(),
    password: document.getElementById("password").value,
    phone: document.getElementById("phone").value.trim(),
    location: document.getElementById("location").value.trim()
  };

  const msg = document.getElementById("registerMsg");
  msg.textContent = "Creating account...";

  try {
    await apiFetch("register.php", payload);
    msg.textContent = "✅ Account created. Please login.";
  } catch (err) {
    msg.textContent = "❌ " + err.message;
  }
});

/* =========================
   SESSION CHECK
========================= */
async function checkSession() {
  try {
    const res = await apiFetch("/session.php", null, "GET");
    if (!res.logged) return;

    updateNav(res.role);
    showDashboard(res.role);
  } catch {
    // user not logged in
  }
}

/* =========================
   LOGOUT
========================= */
async function logout() {
  try {
    await apiFetch("/logout.php");
  } finally {
    localStorage.clear();
    location.reload();
  }
}

/* =========================
   NAV UPDATE
========================= */
function updateNav(role) {
  document.getElementById("loginLink")?.classList.add("hidden");
  document.getElementById("registerLink")?.classList.add("hidden");
  document.getElementById("dashboardLink")?.classList.remove("hidden");
  document.getElementById("logoutLink")?.classList.remove("hidden");

  document.getElementById("roleInfo").textContent =
    "Logged in as: " + role.toUpperCase();
}

/* =========================
   DASHBOARD
========================= */
function showDashboard(role) {
  showView("dashboard");

  document.getElementById("baristaPanel")?.classList.add("hidden");
  document.getElementById("employerPanel")?.classList.add("hidden");

  if (role === "barista") {
    document.getElementById("baristaPanel")?.classList.remove("hidden");
  }

  if (role === "employer") {
    document.getElementById("employerPanel")?.classList.remove("hidden");
    loadBaristas();
  }
}

/* =========================
   JOBS – HOME
========================= */
async function loadJobs() {
  try {
    const jobs = await apiFetch("/jobs.php", null, "GET");
    const box = document.getElementById("jobs");
    if (!box) return;

    box.innerHTML = "";

    jobs.forEach(j => {
      box.innerHTML += `
        <article class="job-card">
          <h3>${j.job_title}</h3>
          <p>${j.description}</p>
          <button onclick="applyJob(${j.id})">Apply</button>
        </article>
      `;
    });
  } catch {}
}

/* =========================
   APPLY JOB (BARISTA)
========================= */
async function applyJob(jobId) {
  try {
    await apiFetch("/apply.php", { job_id: jobId });
    alert("✅ Applied successfully");
  } catch {
    alert("❌ Login as barista to apply");
  }
}

/* =========================
   BARISTAS (EMPLOYER)
========================= */
async function loadBaristas() {
  try {
    const list = await apiFetch("/profiles.php", null, "GET");
    const box = document.getElementById("baristas");
    if (!box) return;

    box.innerHTML = "";

    list.forEach(b => {
      box.innerHTML += `
        <div class="barista-card">
          <h4>${b.first_name} ${b.last_name}</h4>
          <p>${b.skills || ""}</p>
          <small>Likes: ${b.likes}</small>
        </div>
      `;
    });
  } catch {}
}

/* =========================
   AUTO INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  loadJobs();
  checkSession();

  document.querySelectorAll("nav a[data-view]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      showView(link.dataset.view);
    });
  });
});


