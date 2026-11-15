/* =========================================================
   EquipTrack - shared scripts (all pages)
   theme toggle, mobile menu, scroll reveal, toasts, storage
   ========================================================= */
document.documentElement.classList.remove("no-js");

/* ---------- Theme (dark / light) ---------- */
(function initTheme() {
  let saved = null;
  try { saved = localStorage.getItem("et_theme"); } catch (e) {}
  if (saved) document.documentElement.setAttribute("data-theme", saved);
})();

const ET = {
  /* ---- dates ---- */
  today() { const d = new Date(); d.setHours(0, 0, 0, 0); return d; },
  addDays(n) { const d = ET.today(); d.setDate(d.getDate() + n); return d; },
  iso(d) { const z = new Date(d); return z.getFullYear() + "-" + String(z.getMonth() + 1).padStart(2, "0") + "-" + String(z.getDate()).padStart(2, "0"); },
  parse(s) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); },
  fmtDate(s) { return ET.parse(s).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" }); },
  daysBetween(a, b) { return Math.round((ET.parse(b) - ET.parse(a)) / 86400000); },
  peso(n) { return "₱" + Math.round(n).toLocaleString("en-PH"); },
  initials(name) { return name.split(" ").filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase(); },

  /* ---- storage (localStorage acts as our small "database") ---- */
  load(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } },
  save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} },

  getRequests() {
    let list = ET.load("et_requests", null);
    if (!list) {
      list = ET_SEED_REQUESTS.map(r => Object.assign({}, r, {
        from: ET.iso(ET.addDays(r.from)), to: ET.iso(ET.addDays(r.to)), created: ET.iso(ET.addDays(r.from))
      }));
      ET.save("et_requests", list);
    }
    return list;
  },
  saveRequests(list) { ET.save("et_requests", list); },
  resetDemo() { try { localStorage.removeItem("et_requests"); } catch (e) {} },

  /* Status of a borrow request based on today's date */
  requestStatus(r) {
    if (r.returned) return { key: "returned", label: "Returned" };
    const left = ET.daysBetween(ET.iso(ET.today()), r.to);
    if (left < 0) return { key: "overdue", label: "Overdue " + Math.abs(left) + "d" };
    if (left <= 1) return { key: "duesoon", label: left === 0 ? "Due today" : "Due tomorrow" };
    return { key: "ontime", label: "On time" };
  },

  /* Asset status combines the asset register + active borrow requests */
  assets() {
    const active = ET.getRequests().filter(r => !r.returned);
    return ET_ASSETS.map(a => {
      const req = active.find(r => r.asset === a.id);
      if (req && a.status === "available") {
        return Object.assign({}, a, { status: "borrowed", assignedTo: req.name, dept: req.dept, dueBack: req.to });
      }
      return Object.assign({}, a);
    });
  },
  statusLabel: { available: "Available", assigned: "Assigned", borrowed: "Borrowed", repair: "In Repair", retired: "Retired" },
  statusClass: { available: "available", assigned: "assigned", borrowed: "assigned", repair: "repair", retired: "retired" },

  /* Straight-line depreciation: book value today */
  bookValue(a) {
    const yrs = (ET.today() - ET.parse(a.purchase)) / (365.25 * 86400000);
    const salvage = a.cost * 0.1;
    const v = a.cost - ((a.cost - salvage) / a.life) * yrs;
    return Math.max(salvage, v);
  },
  lifeUsed(a) {
    const yrs = (ET.today() - ET.parse(a.purchase)) / (365.25 * 86400000);
    return Math.min(100, Math.max(0, (yrs / a.life) * 100));
  },

  /* ---- toast notification ---- */
  toast(msg, type) {
    let stack = document.querySelector(".toast-stack");
    if (!stack) { stack = document.createElement("div"); stack.className = "toast-stack"; document.body.appendChild(stack); }
    const colors = { success: "c-green", error: "c-red", info: "c-cyan", warn: "c-amber" };
    const icons = {
      success: '<path d="M5 12l5 5L20 7"/>', error: '<path d="M18 6L6 18M6 6l12 12"/>',
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 12v4"/>', warn: '<path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>'
    };
    const t = type || "info";
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = '<span class="ico ' + colors[t] + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' + icons[t] + '</svg></span><span>' + msg + '</span>';
    stack.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 320); }, 3400);
  },

  /* ---- notification sound (multimedia) ---- */
  chime() {
    try { const a = new Audio("media/chime.wav"); a.volume = 0.5; a.play().catch(() => {}); } catch (e) {}
  },

  /* ---- animated number counter ---- */
  countUp(el, target, prefix) {
    const start = performance.now(), dur = 1200;
    function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = (prefix || "") + v.toLocaleString("en-PH");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  },

  esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
};

document.addEventListener("DOMContentLoaded", () => {
  /* theme toggle button */
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const next = isLight ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      ET.save("et_theme", next); try { localStorage.setItem("et_theme", next); } catch (e) {}
      ET.toast((next === "light" ? "Light" : "Dark") + " mode on", "info");
    });
  }

  /* mobile menu */
  const menuBtn = document.getElementById("menuToggle");
  const links = document.querySelector(".nav-links");
  if (menuBtn && links) menuBtn.addEventListener("click", () => links.classList.toggle("open"));

  /* scroll reveal animation */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); } });
  }, { threshold: 0.12 }) : null;
  document.querySelectorAll(".reveal").forEach(el => io ? io.observe(el) : el.classList.add("show"));

  /* cursor spotlight on cards */
  document.addEventListener("pointermove", e => {
    const card = e.target.closest && e.target.closest(".spot");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", (e.clientX - r.left) + "px");
    card.style.setProperty("--y", (e.clientY - r.top) + "px");
  });

  /* footer year */
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
