// BARISTA REGISTRATION
const form = document.getElementById("baristaForm");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const barista = {
      name: document.getElementById("name").value,
      location: document.getElementById("location").value,
      skills: document.getElementById("skills").value,
      experience: document.getElementById("experience").value,
      phone: document.getElementById("phone").value,
      status: "Available"
    };

    let baristas = JSON.parse(localStorage.getItem("baristas")) || [];
    baristas.push(barista);
    localStorage.setItem("baristas", JSON.stringify(baristas));

    alert("Iyandikishije neza!");
    form.reset();
  });
}

// DISPLAY BARISTAS
const list = document.getElementById("baristaList");

if (list) {
  const baristas = JSON.parse(localStorage.getItem("baristas")) || [];

  if (baristas.length === 0) {
    list.innerHTML = "<p>Nta barista uriyandikisha.</p>";
  }

  baristas.forEach(b => {
    list.innerHTML += `
      <div class="card">
        <h3>${b.name}</h3>
        <p><strong>Aho:</strong> ${b.location}</p>
        <p><strong>Skills:</strong> ${b.skills}</p>
        <p><strong>Experience:</strong> ${b.experience}</p>
        <p class="status">${b.status}</p>
        <a class="btn primary" target="_blank"
           href="https://wa.me/25${b.phone}">
           Vugana kuri WhatsApp
        </a>
      </div>
    `;
  });
}
// JOB POSTING
const jobForm = document.getElementById("jobForm");

if (jobForm) {
  jobForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const job = {
      company: document.getElementById("company").value,
      location: document.getElementById("location").value,
      type: document.getElementById("type").value,
      pay: document.getElementById("pay").value,
      description: document.getElementById("description").value,
      contact: document.getElementById("contact").value,
      date: new Date().toLocaleDateString()
    };

    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    jobs.push(job);
    localStorage.setItem("jobs", JSON.stringify(jobs));

    alert("Akazi koherejwe neza!");
    jobForm.reset();
  });
}

// DISPLAY JOBS
const jobList = document.getElementById("jobList");

if (jobList) {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  if (jobs.length === 0) {
    jobList.innerHTML = "<p>Nta kazi karashyirwaho.</p>";
  }

  jobs.forEach(j => {
    jobList.innerHTML += `
      <div class="card">
        <span class="badge">${j.type}</span>
        <h3>${j.company}</h3>
        <p><strong>Aho:</strong> ${j.location}</p>
        <p><strong>Igihembo:</strong> ${j.pay || "Byumvikane"}</p>
        <p>${j.description}</p>
        <p><small>Byashyizweho: ${j.date}</small></p>
        <a class="btn primary" target="_blank"
           href="https://wa.me/25${j.contact}">
           Saba akazi kuri WhatsApp
        </a>
      </div>
    `;
  });
}
const jobSearch = document.getElementById("jobSearch");
const jobTypeFilter = document.getElementById("jobTypeFilter");

function displayJobs(filteredJobs) {
  const jobList = document.getElementById("jobList");
  jobList.innerHTML = "";

  if (filteredJobs.length === 0) {
    jobList.innerHTML = "<p>Nta kazi kabonetse.</p>";
    return;
  }

  filteredJobs.forEach(j => {
    jobList.innerHTML += `
      <div class="card">
        <span class="badge">${j.type}</span>
        <h3>${j.company}</h3>
        <p><strong>Aho:</strong> ${j.location}</p>
        <p><strong>Igihembo:</strong> ${j.pay || "Byumvikane"}</p>
        <p>${j.description}</p>
        <a class="btn primary" target="_blank"
           href="https://wa.me/25${j.contact}">
           Saba akazi
        </a>
      </div>
    `;
  });
}

if (jobSearch || jobTypeFilter) {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];

  function filterJobs() {
    const searchValue = jobSearch.value.toLowerCase();
    const typeValue = jobTypeFilter.value;

    const filtered = jobs.filter(j =>
      j.location.toLowerCase().includes(searchValue) &&
      (typeValue === "" || j.type === typeValue)
    );

    displayJobs(filtered);
  }

  if (jobSearch) jobSearch.addEventListener("input", filterJobs);
  if (jobTypeFilter) jobTypeFilter.addEventListener("change", filterJobs);

  displayJobs(jobs);
}
const baristaSearch = document.getElementById("baristaSearch");

if (baristaSearch) {
  const baristas = JSON.parse(localStorage.getItem("baristas")) || [];
  const list = document.getElementById("baristaList");

  function displayBaristas(filtered) {
    list.innerHTML = "";

    if (filtered.length === 0) {
      list.innerHTML = "<p>Nta barista wabonetse.</p>";
      return;
    }

    filtered.forEach(b => {
      list.innerHTML += `
        <div class="card">
          <h3>${b.name}</h3>
          <p><strong>Aho:</strong> ${b.location}</p>
          <p><strong>Skills:</strong> ${b.skills}</p>
          <p class="status">${b.status}</p>
          <a class="btn primary" target="_blank"
             href="https://wa.me/25${b.phone}">
             WhatsApp
          </a>
        </div>
      `;
    });
  }

  baristaSearch.addEventListener("input", function () {
    const value = this.value.toLowerCase();
    const filtered = baristas.filter(b =>
      b.name.toLowerCase().includes(value) ||
      b.location.toLowerCase().includes(value)
    );
    displayBaristas(filtered);
  });

  displayBaristas(baristas);
}
// LOGIN LOGIC
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    // SIMPLE DEMO AUTH (later PHP/MySQL)
    if (username && password && role) {
      localStorage.setItem("user", JSON.stringify({ username, role }));
      window.location.href = "dashboard.html";
    } else {
      alert("Shyiramo amakuru yose");
    }
  });
}

// DASHBOARD ROLE CONTROL
const user = JSON.parse(localStorage.getItem("user"));

if (user && document.getElementById("welcome")) {
  document.getElementById("welcome").innerText =
    "Murakaza neza, " + user.username;

  if (user.role === "barista") {
    document.getElementById("baristaDash").style.display = "block";
  }
  if (user.role === "employer") {
    document.getElementById("employerDash").style.display = "block";
  }
  if (user.role === "admin") {
    document.getElementById("adminDash").style.display = "block";
  }
}

// LOGOUT
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  });
}
// ADMIN DASHBOARD CONTROL
if (user && user.role === "admin") {
  const adminJobs = document.getElementById("adminJobs");
  const adminBaristas = document.getElementById("adminBaristas");

  // LOAD JOBS
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  jobs.forEach((j, i) => {
    const row = adminJobs.insertRow();
    row.innerHTML = `
      <td>${j.company}</td>
      <td>${j.location}</td>
      <td>${j.type}</td>
      <td>${j.pay || "Byumvikane"}</td>
      <td>
        <button class="editJob" data-index="${i}">Edit</button>
        <button class="deleteJob" data-index="${i}">Delete</button>
      </td>
    `;
  });

  // LOAD BARISTAS
  let baristas = JSON.parse(localStorage.getItem("baristas")) || [];
  baristas.forEach((b, i) => {
    const row = adminBaristas.insertRow();
    row.innerHTML = `
      <td>${b.name}</td>
      <td>${b.location}</td>
      <td>${b.skills}</td>
      <td>${b.experience}</td>
      <td>${b.status}</td>
      <td>
        <button class="editBarista" data-index="${i}">Edit</button>
        <button class="deleteBarista" data-index="${i}">Delete</button>
      </td>
    `;
  });

  // DELETE JOB
  document.querySelectorAll(".deleteJob").forEach(btn => {
    btn.addEventListener("click", e => {
      const i = e.target.getAttribute("data-index");
      if (confirm("Urifuza gusiba akazi?")) {
        jobs.splice(i, 1);
        localStorage.setItem("jobs", JSON.stringify(jobs));
        location.reload();
      }
    });
  });

  // DELETE BARISTA
  document.querySelectorAll(".deleteBarista").forEach(btn => {
    btn.addEventListener("click", e => {
      const i = e.target.getAttribute("data-index");
      if (confirm("Urifuza gusiba barista?")) {
        baristas.splice(i, 1);
        localStorage.setItem("baristas", JSON.stringify(baristas));
        location.reload();
      }
    });
  });

  // NOTE: Edit buttons can later open a form to update
}
// EDIT JOBS
function editJob(index) {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const job = jobs[index];

  const company = prompt("Izina rya Café / Event:", job.company);
  const location = prompt("Aho akazi kari:", job.location);
  const type = prompt("Ubwoko bw'akazi:", job.type);
  const pay = prompt("Umushahara / Igihembo:", job.pay);
  const description = prompt("Sobanura akazi:", job.description);
  const contact = prompt("WhatsApp number:", job.contact);

  if (company && location && type && contact) {
    jobs[index] = { company, location, type, pay, description, contact, date: job.date };
    localStorage.setItem("jobs", JSON.stringify(jobs));
    alert("Job ivuguruwe neza!");
    location.reload();
  }
}

// EDIT BARISTA PROFILE
function editBarista(index) {
  const baristas = JSON.parse(localStorage.getItem("baristas")) || [];
  const b = baristas[index];

  const name = prompt("Izina:", b.name);
  const location = prompt("Aho ubarizwa:", b.location);
  const skills = prompt("Skills:", b.skills);
  const experience = prompt("Experience:", b.experience);

  if (name && location && skills && experience) {
    baristas[index] = { ...b, name, location, skills, experience };
    localStorage.setItem("baristas", JSON.stringify(baristas));
    alert("Profile ya Barista ivuguruwe!");
    location.reload();
  }
}
if (user && user.role === "barista") {
  const baristas = JSON.parse(localStorage.getItem("baristas")) || [];
  const myIndex = baristas.findIndex(b => b.phone === user.username);

  if (myIndex !== -1) {
    const myCard = document.getElementById("baristaList").children[myIndex];
    const editBtn = document.createElement("button");
    editBtn.innerText = "Hindura Profile";
    editBtn.className = "btn secondary";
    editBtn.onclick = () => editBarista(myIndex);
    myCard.appendChild(editBtn);
  }
}
// EMPLOYER DASHBOARD
if (user && user.role === "employer") {
  const employerJobsTable = document.getElementById("employerJobs");
  let allJobs = JSON.parse(localStorage.getItem("jobs")) || [];

  // FILTER jobs by employer (we use username as identifier in contact field)
  const myJobs = allJobs.filter(job => job.contact.includes(user.username));

  myJobs.forEach((job, i) => {
    const row = employerJobsTable.insertRow();
    row.innerHTML = `
      <td>${job.company}</td>
      <td>${job.location}</td>
      <td>${job.type}</td>
      <td>${job.pay || "Byumvikane"}</td>
      <td>
        <button class="editJob" onclick="editJob(${allJobs.indexOf(job)})">Edit</button>
        <button class="deleteJob" onclick="deleteJob(${allJobs.indexOf(job)})">Delete</button>
      </td>
    `;
  });
}

// DELETE JOB (for both Admin and Employer)
function deleteJob(index) {
  let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  if (confirm("Urifuza gusiba akazi?")) {
    jobs.splice(index, 1);
    localStorage.setItem("jobs", JSON.stringify(jobs));
    alert("Akazi kasibwe neza!");
    location.reload();
  }
}
if (user && user.role === "barista") {
  const baristas = JSON.parse(localStorage.getItem("baristas")) || [];
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];

  // Find current barista by phone (username used as phone)
  const myIndex = baristas.findIndex(b => b.phone === user.username);
  const myBarista = baristas[myIndex];

  // Status Button
  const baristaListCards = document.getElementById("baristaList").children;
  if (myIndex !== -1 && baristaListCards[myIndex]) {
    const statusBtn = document.createElement("button");
    statusBtn.innerText = myBarista.status === "Available" ? "Hindura kuri Busy" : "Hindura kuri Available";
    statusBtn.className = "btn primary";
    statusBtn.onclick = () => {
      baristas[myIndex].status = baristas[myIndex].status === "Available" ? "Busy" : "Available";
      localStorage.setItem("baristas", JSON.stringify(baristas));
      location.reload();
    };
    baristaListCards[myIndex].appendChild(statusBtn);
  }

  // Display Applied Jobs
  const appliedDiv = document.getElementById("appliedJobs");
  const myAppliedJobs = appliedJobs.filter(a => a.baristaPhone === user.username);

  if (myAppliedJobs.length === 0) {
    appliedDiv.innerHTML = "<p>Nta kazi wasabye.</p>";
  } else {
    myAppliedJobs.forEach(a => {
      appliedDiv.innerHTML += `
        <div class="card">
          <h4>${a.company}</h4>
          <p><strong>Aho:</strong> ${a.location}</p>
          <p><strong>Type:</strong> ${a.type}</p>
          <p><small>Yasabwe ku: ${a.date}</small></p>
        </div>
      `;
    });
  }

  // Display Available Jobs
  const availableDiv = document.getElementById("availableJobs");
  if (jobs.length === 0) {
    availableDiv.innerHTML = "<p>Nta kazi karashyirwaho.</p>";
  } else {
    jobs.forEach((j, i) => {
      const hasApplied = myAppliedJobs.some(a => a.company === j.company && a.contact === j.contact);
      if (!hasApplied) {
        availableDiv.innerHTML += `
          <div class="card">
            <h4>${j.company}</h4>
            <p><strong>Aho:</strong> ${j.location}</p>
            <p><strong>Type:</strong> ${j.type}</p>
            <p><strong>Igihembo:</strong> ${j.pay || "Byumvikane"}</p>
            <a class="btn primary" target="_blank"
               href="https://wa.me/25${j.contact}">
               Saba akazi kuri WhatsApp
            </a>
            <button class="btn secondary" onclick="applyJob(${i})">
               Ndasaba hano
            </button>
          </div>
        `;
      }
    });
  }
}

// APPLY JOB FUNCTION
function applyJob(index) {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs")) || [];
  const user = JSON.parse(localStorage.getItem("user"));

  const job = jobs[index];
  appliedJobs.push({
    ...job,
    baristaPhone: user.username,
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
  alert("Wasabye akazi neza!");
  location.reload();
}
function notify(message, type = "success") {
  const div = document.createElement("div");
  div.innerText = message;
  div.className = `notification ${type}`;
  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}

// Usage examples
// notify("Akazi koherejwe neza!");
// notify("Job deleted!", "error");

if (user && user.role === "barista") {
  const baristas = JSON.parse(localStorage.getItem("baristas")) || [];
  const myIndex = baristas.findIndex(b => b.phone === user.username);
  const uploadInput = document.getElementById("latteUpload");
  const previewDiv = document.getElementById("lattePreview");

  // Show current image if exists
  if (baristas[myIndex] && baristas[myIndex].latteSample) {
    previewDiv.innerHTML = `<img src="${baristas[myIndex].latteSample}" style="max-width:200px; border-radius:5px; margin-top:10px;">`;
  }

  // Handle new upload
  uploadInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // Save base64 string in localStorage
        baristas[myIndex].latteSample = e.target.result;
        localStorage.setItem("baristas", JSON.stringify(baristas));

        // Preview
        previewDiv.innerHTML = `<img src="${e.target.result}" style="max-width:200px; border-radius:5px; margin-top:10px;">`;
        notify("Latte Art Sample yashyizweho neza!");
      };
      reader.readAsDataURL(file);
    }
  });
}
