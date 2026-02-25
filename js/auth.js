// ================================
// AUTH JS: login + register
// ================================

document.addEventListener("DOMContentLoaded", () => {

  // Select all forms that use data-action attribute: login or register
  const forms = document.querySelectorAll("form[data-action]");

  forms.forEach(form => {

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const action = form.dataset.action; // "login" or "register"
      const formData = new FormData(form);

      // Append the action to the formData
      formData.append("action", action);

      // Convert FormData to URLSearchParams (so PHP $_POST works)
      const body = new URLSearchParams();
      for (const pair of formData.entries()) {
        body.append(pair[0], pair[1]);
      }

      try {
        const res = await fetch("https://rwandanbarista.ct.ws/index.php", {
          method: "POST",               // MUST be POST
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: body
        });

        const data = await res.json();

        if (data.success) {
          if (action === "login") {
            alert(`Welcome, ${data.user.first_name}!`);
            // Redirect to dashboard or home page
            window.location.href = "/dashboard.html"; 
          } else if (action === "register") {
            alert("Registration successful! You can now log in.");
            form.reset();
          }
        } else {
          // Show error from backend
          alert(data.error || "Unknown error occurred");
        }

      } catch (err) {
        console.error("Fetch error:", err);
        alert("Failed to connect to the server. Please try again later.");
      }

    });
  });

});
