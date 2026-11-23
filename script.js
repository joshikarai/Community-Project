
const language = document.getElementById("language");

const savedLanguage = localStorage.getItem("gpLanguage") || "en";
language.value = savedLanguage;

function changeLanguage(lang) {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-en]").forEach(element => {
    element.textContent =
      element.getAttribute("data-" + lang) ||
      element.getAttribute("data-en");
  });

  localStorage.setItem("gpLanguage", lang);
}

changeLanguage(savedLanguage);

language.addEventListener("change", function () {
  changeLanguage(this.value);
});
