/* =========================
   CONFIG
========================= */
const API = "http://rwandanbarista.ct.ws/";

/* =========================
   GENERIC FETCH
========================= */
async function apiFetch(endpoint, data = null, method = "POST") {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  };
  if (data) options.body = JSON.stringify(data);

  const res = await fetch(API + endpoint, options);
  if (!res.ok) throw new Error("API error");
  return res.json();
}

/* =========================
   VIEW SWITCHER
========================= */
function showView(id) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
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
    const res = await fetch("https://http://rwandanbarista.ct.ws/?i=1.ct.ws/api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Login failed");

    msg.textContent = "✅ Logged in successfully";

    // Save user session locally
    localStorage.setItem("userRole", data.role);
    localStorage.setItem("userEmail", email);

    updateNav(data.role);
    showDashboard(data.role);

  } catch (err) {
    msg.textContent = "❌ " + err.message;
  }
}

/* =========================
   AUTH – REGISTER
========================= */
/* =========================
   REGISTER
========================= */
/* =========================
/* =========================
   REGISTER
========================= */
document.getElementById("registerForm")?.addEventListener("submit", async e => {
    e.preventDefault();

    const role = document.getElementById("role").value;
    const first_name = document.getElementById("first_name").value.trim();
    const last_name = document.getElementById("last_name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value.trim();
    const location = document.getElementById("location").value.trim();

    const msg = document.getElementById("registerMsg");
    msg.textContent = "Creating account...";

    try {
        const res = await fetch("http://rwandanbarista.ct.ws/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                role,
                first_name,
                last_name,
                email,
                password,
                phone,
                location
            })
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Unknown error");

        msg.textContent = "✅ Account created successfully. Please login.";

        document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
        document.getElementById("login").classList.add("active");

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
  } catch {}
}

/* =========================
   LOGOUT
========================= */
async function logout() {
  await apiFetch("/logout.php");
  location.reload();
}

/* =========================
   NAV UPDATE
========================= */
function updateNav(role) {
  document.getElementById("loginLink").classList.add("hidden");
  document.getElementById("registerLink").classList.add("hidden");
  document.getElementById("dashboardLink").classList.remove("hidden");
  document.getElementById("logoutLink").classList.remove("hidden");

  document.getElementById("roleInfo").textContent =
    "Logged in as: " + role.toUpperCase();
}

/* =========================
   DASHBOARD
========================= */
function showDashboard(role) {
  showView("dashboard");

  document.getElementById("baristaPanel").classList.add("hidden");
  document.getElementById("employerPanel").classList.add("hidden");

  if (role === "barista") {
    document.getElementById("baristaPanel").classList.remove("hidden");
  }

  if (role === "employer") {
    document.getElementById("employerPanel").classList.remove("hidden");
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





