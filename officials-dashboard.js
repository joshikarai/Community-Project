
const STORAGE_KEY = "gpComplaints";
const $ = id => document.getElementById(id);
let selectedComplaintId = null;

if (sessionStorage.getItem("gpOfficialLoggedIn") !== "true") {
  window.location.href = "officials-login.html";
}

function getComplaints() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); 
}

function saveComplaints(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  }[char]));
}

function renderDashboard() {
  const complaints = getComplaints();

  const counts = {
    Submitted: 0,
    "In Progress": 0,
    Resolved: 0,
    Rejected: 0
  };

  complaints.forEach(c => {
    counts[c.status] = (counts[c.status] || 0) + 1;
  });

  $("totalCount").textContent = complaints.length;
  $("submittedCount").textContent = counts.Submitted;
  $("progressCount").textContent = counts["In Progress"];
  $("resolvedCount").textContent = counts.Resolved;

  const filter = $("statusFilter").value;
  const shown = filter === "All"
    ? complaints
    : complaints.filter(c => c.status === filter);

  $("complaintList").innerHTML = shown.length
    ? shown.map(c => `
      <article class="complaint">
        <div>
          <h3>${escapeHTML(c.category)}
          <span class="pill">${escapeHTML(c.status)}</span></h3>
          <p><b>${escapeHTML(c.id)}</b> · ${escapeHTML(c.village)}</p>
          <p>${escapeHTML(c.description)}</p>
          <p>${new Date(c.createdAt).toLocaleString()}</p>
        </div>
        <button type="button" data-id="${escapeHTML(c.id)}">
          View / Update
        </button>
      </article>
    `).join("")
    : "<p>No complaints found.</p>";

  document.querySelectorAll("[data-id]").forEach(button => {
    button.addEventListener("click", () => showDetails(button.dataset.id));
  });

  $("dashboardMessage").textContent =
    `Showing ${shown.length} complaint(s).`;
}

function showDetails(id) {
  const complaint = getComplaints().find(c => c.id === id);
  if (!complaint) return;

  selectedComplaintId = id;
  $("detailPanel").hidden = false;

  $("complaintDetails").innerHTML = `
    <p><b>Reference:</b> ${escapeHTML(complaint.id)}</p>
    <p><b>Name:</b> ${escapeHTML(complaint.citizenName)}</p>
    <p><b>Mobile:</b> ${escapeHTML(complaint.contact)}</p>
    <p><b>Village:</b> ${escapeHTML(complaint.village)}</p>
    <p><b>Ward:</b> ${escapeHTML(complaint.ward || "—")}</p>
    <p><b>Category:</b> ${escapeHTML(complaint.category)}</p>
    <p><b>Location:</b> ${escapeHTML(complaint.location)}</p>
    <p><b>Description:</b> ${escapeHTML(complaint.description)}</p>
    ${complaint.photo
      ? `<p><b>Photo:</b><br>
         <img src="${complaint.photo}" alt="Complaint photo"
         style="max-width:220px;border-radius:8px"></p>`
      : ""}
  `;

  $("newStatus").value = complaint.status;
  $("remarks").value = complaint.officialRemarks || "";
  $("detailPanel").scrollIntoView({ behavior: "smooth" });
}

$("updateForm").addEventListener("submit", function(event) {
  event.preventDefault();

  if (!selectedComplaintId) return;

  const complaints = getComplaints();
  const index = complaints.findIndex(c => c.id === selectedComplaintId);

  if (index === -1) return;

  complaints[index].status = $("newStatus").value;
  complaints[index].officialRemarks = $("remarks").value.trim();
  complaints[index].updatedAt = new Date().toISOString();

  saveComplaints(complaints);

  $("dashboardMessage").textContent = "Complaint updated successfully.";
  $("detailPanel").hidden = true;

  renderDashboard();
});

$("refreshBtn").addEventListener("click", renderDashboard);
$("statusFilter").addEventListener("change", renderDashboard);

$("logoutBtn").addEventListener("click", function() {
  sessionStorage.removeItem("gpOfficialLoggedIn");
  window.location.href = "index.html";
});

renderDashboard();
