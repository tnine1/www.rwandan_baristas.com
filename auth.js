import { API } from "/config.js";

/* LOGIN */
document.getElementById("loginForm").onsubmit = async e => {
  e.preventDefault();

  const res = await fetch(`${API}/auth/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: loginEmail.value,
      password: loginPassword.value
    })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  localStorage.setItem("user", JSON.stringify(data.user));
  alert("Login successful");
};

/* REGISTER */
document.getElementById("registerForm").onsubmit = async e => {
  e.preventDefault();

  const res = await fetch(`${API}/auth/register.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: role.value,
      first_name: first_name.value,
      last_name: last_name.value,
      email: email.value,
      password: password.value
    })
  });

  const data = await res.json();
  if (data.error) return alert(data.error);

  alert("Registration successful");
};
