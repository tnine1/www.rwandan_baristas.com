/* =========================
   CONFIG
========================= */
const API_BASE = "https://rwandanbarista.ct.ws/api/auth";

/* =========================
   REGISTER
========================= */
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const fd = new FormData(form);

  try {
    const res = await fetch(`${API_BASE}/register.php`, {
      method: "POST",
      body: fd
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Registration successful. You can now login.");
      form.reset();
    } else {
      alert("❌ " + (data.error || "Registration failed"));
    }
  } catch (err) {
    alert("❌ Network error");
    console.error(err);
  }
});

/* =========================
   LOGIN
========================= */
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const fd = new FormData(form);

  try {
    const res = await fetch(`${API_BASE}/login.php`, {
      method: "POST",
      body: fd
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Login successful");

      // Save session info (basic)
      localStorage.setItem("user", JSON.stringify(data.user));

      // redirect if needed
      // window.location.href = "dashboard.html";
    } else {
      alert("❌ " + (data.error || "Login failed"));
    }
  } catch (err) {
    alert("❌ Network error");
    console.error(err);
  }
});
