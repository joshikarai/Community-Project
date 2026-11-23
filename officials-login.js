
const DEMO_USERNAME = "official";
const DEMO_PASSWORD = "GP1234";

document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const message = document.getElementById("loginMessage");

  if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
    sessionStorage.setItem("gpOfficialLoggedIn", "true");
    window.location.href = "officials-dashboard.html";
  } else {
    message.textContent = "Invalid username or password.";
  }
});
