/* EquipTrack - About page: contact form validation */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("cName");
    const mail = document.getElementById("cMail");
    const msg = document.getElementById("cMsg");
    let ok = true;
    [[name, name.value.trim().length > 1], [mail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value)], [msg, msg.value.trim().length > 4]]
      .forEach(([el, valid]) => { el.classList.toggle("invalid", !valid); if (!valid) ok = false; });
    if (!ok) { ET.toast("Please complete the required fields.", "error"); return; }
    ET.chime();
    ET.toast("Thanks, " + ET.esc(name.value.trim().split(" ")[0]) + "! IT will reply within 1 working day.", "success");
    form.reset();
  });
});
