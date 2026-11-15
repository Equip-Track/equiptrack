/* EquipTrack - Request form: live ticket preview + validation */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("borrowForm");
  const $ = id => document.getElementById(id);
  const assets = ET.assets();
  const available = assets.filter(a => a.status === "available");

  $("dept").innerHTML += ET_DEPARTMENTS.map(d => `<option>${d}</option>`).join("");
  $("asset").innerHTML = '<option value="">Select an available asset</option>' +
    available.map(a => `<option value="${a.id}">${a.id} - ${a.name} (${a.category})</option>`).join("");

  const preset = new URLSearchParams(location.search).get("asset");
  if (preset && available.some(a => a.id === preset)) $("asset").value = preset;

  const todayIso = ET.iso(ET.today());
  $("from").min = todayIso; $("from").value = todayIso;
  $("to").min = todayIso; $("to").value = ET.iso(ET.addDays(3));

  const nextNo = () => "ET-REQ-" + new Date().getFullYear() + "-" + String(141 + ET.getRequests().length).padStart(4, "0");

  function barcode(text) {
    let h = ""; for (const ch of text) { const c = ch.charCodeAt(0); for (let k = 0; k < 3; k++) h += `<i style="width:${1 + ((c >> k) & 1) * 2}px"></i>`; } return h;
  }

  function maxDays() { const t = form.type.value; return t === "Long-term Assignment" ? 90 : t === "Replacement" ? 30 : 14; }

  /* live preview of the ticket */
  function preview() {
    const a = ET_ASSETS.find(x => x.id === $("asset").value);
    $("tNo").textContent = nextNo();
    $("tName").textContent = $("fullName").value.trim() || "-";
    $("tDept").textContent = $("dept").value || "-";
    $("tType").textContent = form.type.value;
    $("tAsset").textContent = a ? a.name : "-";
    const ok = $("from").value && $("to").value;
    $("tDates").textContent = ok ? ET.fmtDate($("from").value) + " → " + ET.fmtDate($("to").value) : "-";
    const days = ok ? ET.daysBetween($("from").value, $("to").value) + 1 : 0;
    $("tDays").textContent = ok && days > 0 ? days + (days > 1 ? " days" : " day") : "-";
    $("tBarcode").innerHTML = barcode($("tNo").textContent);
    $("purposeCount").textContent = $("purpose").value.length;
  }
  form.addEventListener("input", preview);
  form.addEventListener("change", preview);

  /* auto-format the employee ID as EMP-0000 */
  $("empId").addEventListener("input", e => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    e.target.value = digits ? "EMP-" + digits : e.target.value.toUpperCase().startsWith("E") ? "EMP-" : "";
  });

  function setErr(el, bad, msg) {
    el.classList.toggle("invalid", bad);
    const err = el.parentElement.querySelector(".err");
    if (err) { if (msg) err.textContent = msg; err.classList.toggle("show", bad); }
    return !bad;
  }

  function validate() {
    let ok = true;
    ok = setErr($("empId"), !/^EMP-\d{4}$/.test($("empId").value)) && ok;
    ok = setErr($("fullName"), $("fullName").value.trim().split(/\s+/).length < 2, "Please enter your first and last name.") && ok;
    ok = setErr($("email"), !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($("email").value)) && ok;
    ok = setErr($("dept"), !$("dept").value) && ok;
    ok = setErr($("asset"), !$("asset").value) && ok;
    ok = setErr($("from"), !$("from").value || $("from").value < todayIso) && ok;
    const days = ET.daysBetween($("from").value || todayIso, $("to").value || todayIso);
    let toMsg = "Return date must be on or after the borrow date.";
    let toBad = !$("to").value || days < 0;
    if (!toBad && days + 1 > maxDays()) { toBad = true; toMsg = `${form.type.value} is limited to ${maxDays()} days.`; }
    ok = setErr($("to"), toBad, toMsg) && ok;
    ok = setErr($("purpose"), $("purpose").value.trim().length < 10) && ok;
    const agreed = $("agree").checked && $("privacy").checked;
    $("agreeErr").classList.toggle("show", !agreed);
    return ok && agreed;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validate()) {
      ET.toast("Please fix the highlighted fields.", "error");
      const first = form.querySelector(".invalid"); if (first) first.focus();
      return;
    }
    const list = ET.getRequests();
    const ticket = nextNo();
    list.push({
      ticket, empId: $("empId").value, name: $("fullName").value.trim(), email: $("email").value,
      dept: $("dept").value, asset: $("asset").value, type: form.type.value,
      from: $("from").value, to: $("to").value, purpose: $("purpose").value.trim(),
      returned: false, created: todayIso
    });
    ET.saveRequests(list);
    ET.chime();
    $("sNo").textContent = ticket;
    $("successModal").classList.add("open");
    ET.toast("Request " + ticket + " saved.", "success");
  });

  form.addEventListener("reset", () => setTimeout(() => {
    form.querySelectorAll(".invalid").forEach(x => x.classList.remove("invalid"));
    form.querySelectorAll(".err").forEach(x => x.classList.remove("show"));
    $("from").value = todayIso; $("to").value = ET.iso(ET.addDays(3)); preview();
  }, 0));

  $("sClose").addEventListener("click", () => location.href = "borrow.html");
  preview();
});
