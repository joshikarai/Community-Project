
const STORAGE_KEY = "gpComplaints";
const $ = id => document.getElementById(id);

let selectedCategory = "Roads";

function getComplaints() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); 
}

function saveComplaints(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function showMessage(element, text, success = false) {
  element.textContent = text;
  element.style.color = success ? "green" : "red";
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#39;"
  }[char]));
}

document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach(item =>
      item.classList.remove("selected")
    );

    button.classList.add("selected");
    selectedCategory = button.dataset.category;
    $("category").value = selectedCategory;
  });
});

$("complaintForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const file = $("photo").files[0];

  if (file && file.size > 2 * 1024 * 1024) {
    showMessage($("formMessage"), "Photo must be 2 MB or smaller.");
    return;
  }

  const complaint = {
    id: "GP-" + Date.now(),
    citizenName: $("citizenName").value.trim(),
    contact: $("contact").value.trim(),
    village: $("village").value.trim(),
    ward: $("ward").value.trim(),
    category: selectedCategory,
    location: $("location").value.trim(),
    description: $("description").value.trim(),
    photo: null,
    status: "Submitted",
    officialRemarks: "",
    createdAt: new Date().toISOString()
  };

  function save(photoData) {
    complaint.photo = photoData;

    try {
      const complaints = getComplaints();
      complaints.unshift(complaint);
      saveComplaints(complaints);

      showMessage(
        $("formMessage"),
        "Complaint submitted! Your reference number is " + complaint.id,
        true
      );

      $("complaintForm").reset();
      selectedCategory = "Roads";
      $("category").value = "Roads";

      document.querySelectorAll(".category").forEach((button, index) =>
        button.classList.toggle("selected", index === 0)
      );
    } catch (error) {
      showMessage($("formMessage"),
        "Storage is full. Please try again without a photo.");
    }
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = () => save(reader.result);
    reader.onerror = () => showMessage($("formMessage"), "Could not read photo.");
    reader.readAsDataURL(file);
  } else {
    save(null);
  }
});

$("trackForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const reference = $("reference").value.trim().toUpperCase();
  const phone = $("trackPhone").value.trim();

  const complaint = getComplaints().find(item =>
    item.id.toUpperCase() === reference && item.contact === phone
  );

  if (!complaint) {
    showMessage($("trackResult"),
      "No matching complaint found in this browser.");
    return;
  }

  $("trackResult").innerHTML = `
    <div class="result">
      <strong>${escapeHTML(complaint.id)}</strong>
      <p>Category: ${escapeHTML(complaint.category)}</p>
      <p>Status: <span class="status">${escapeHTML(complaint.status)}</span></p>
      <p>Submitted: ${new Date(complaint.createdAt).toLocaleString()}</p>
      <p>Official remarks: ${escapeHTML(complaint.officialRemarks || "No remarks yet")}</p>
    </div>`;
});
