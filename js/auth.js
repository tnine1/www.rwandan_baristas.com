// ================================
// AUTH JS: login + register
// ================================

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll("form[data-action]").forEach(form => {

    form.addEventListener("submit", async e => {
      e.preventDefault();

      const body = new URLSearchParams(new FormData(form));
      body.append("action", form.dataset.action);

      try {
        const res = await fetch("https://rwandanbarista.ct.ws/index.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          credentials: "include",
          body
        });

        const data = await res.json();

        if (!data.success) {
          alert(data.error);
          return;
        }

        if (form.dataset.action === "login") {
          alert(`Welcome ${data.user.first_name}`);

          document.getElementById("dashboardLink").classList.remove("hidden");

          if (data.user.role === "barista") {
            document.getElementById("baristaPanel").classList.remove("hidden");
          } else {
            document.getElementById("employerPanel").classList.remove("hidden");
          }

        } else {
          alert("Registration successful");
          form.reset();
        }

      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    });

  });

});
