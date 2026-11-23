
const agree = document.getElementById("agree");
const continueBtn = document.getElementById("continueBtn"); 
const message = document.getElementById("message");

agree.addEventListener("change", function () {
  continueBtn.disabled = !this.checked;
});

continueBtn.addEventListener("click", function () {
  if (agree.checked) {
    window.location.href = "citizen-portal.html";
  } else {
    message.textContent = "Please agree to continue.";
  }
});
