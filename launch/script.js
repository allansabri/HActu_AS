const form = document.querySelector("[data-signup]");
const message = document.querySelector("[data-form-message]");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = new FormData(form).get("email")?.toString().trim() || "";
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  message.className = "";
  if (!valid) {
    message.textContent = "Adresse e-mail invalide.";
    message.classList.add("error");
    return;
  }

  const emails = JSON.parse(localStorage.getItem("quoihbo-launch-emails") || "[]");
  if (!emails.includes(email)) emails.push(email);
  localStorage.setItem("quoihbo-launch-emails", JSON.stringify(emails));
  message.textContent = "Vous serez prévenu.";
  message.classList.add("success");
  form.reset();
});
