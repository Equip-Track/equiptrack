/* EquipTrack - Inventory page: search, filter, sort, detail modal */
document.addEventListener("DOMContentLoaded", () => {
  const assets = ET.assets();
  const grid = document.getElementById("assetGrid");
  const q = document.getElementById("q");
  const statusSel = document.getElementById("statusFilter");
  const sortSel = document.getElementById("sortBy");
  const chipsBox = document.getElementById("catChips");
  let cat = "All";

  /* category chips with counts */
  const cats = ["All"].concat([...new Set(assets.map(a => a.category))]);
  chipsBox.innerHTML = cats.map(c => {
    const n = c === "All" ? assets.length : assets.filter(a => a.category === c).length;
    return `<button type="button" class="chip${c === "All" ? " active" : ""}" data-cat="${c}">${c} <small style="opacity:.7">${n}</small></button>`;
  }).join("");
  chipsBox.addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    chipsBox.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
    b.classList.add("active"); cat = b.dataset.cat; render();
  });

  /* status from the URL, e.g. assets.html?status=available */
  const params = new URLSearchParams(location.search);
  if (params.get("status")) statusSel.value = params.get("status");

  function render() {
    const term = q.value.trim().toLowerCase();
    let list = assets.filter(a =>
      (cat === "All" || a.category === cat) &&
      (statusSel.value === "all" || a.status === statusSel.value) &&
      [a.id, a.name, a.specs, a.assignedTo, a.dept, a.location, a.category].join(" ").toLowerCase().includes(term)
    );
    const s = sortSel.value;
    list.sort((a, b) => s === "name" ? a.name.localeCompare(b.name) : s === "value" ? ET.bookValue(b) - ET.bookValue(a) : s === "age" ? a.purchase.localeCompare(b.purchase) : a.id.localeCompare(b.id));
    document.getElementById("resultCount").textContent = `Showing ${list.length} of ${assets.length} assets`;
    if (!list.length) { grid.innerHTML = '<div class="empty card">No assets match your search. Try another keyword or filter.</div>'; return; }
    grid.innerHTML = list.map((a, i) => `
      <article class="card asset-card spot" tabindex="0" data-id="${a.id}" style="animation-delay:${i * 40}ms" aria-label="${a.name}, ${ET.statusLabel[a.status]}">
        <div class="asset-top">
          <div class="asset-ico">${ET_ICONS[a.category]}</div>
          <span class="pill ${ET.statusClass[a.status]}">${ET.statusLabel[a.status]}</span>
        </div>
        <div><span class="tag-id">${a.id}</span><h3>${a.name}</h3><small class="muted">${a.specs}</small></div>
        <div class="meta"><span>${a.status === "available" ? "Location" : "With"}</span><b>${a.status === "available" ? a.location : ET.esc(a.assignedTo)}</b></div>
        <div class="meta"><span>Book value</span><b>${ET.peso(ET.bookValue(a))}</b></div>
        <div><div class="meta" style="margin-bottom:6px"><span>Life used</span><b>${Math.round(ET.lifeUsed(a))}%</b></div><div class="bar"><span style="width:${ET.lifeUsed(a)}%"></span></div></div>
      </article>`).join("");
  }

  [q, statusSel, sortSel].forEach(el => el.addEventListener("input", render));
  grid.addEventListener("click", e => { const c = e.target.closest(".asset-card"); if (c) openModal(c.dataset.id); });
  grid.addEventListener("keydown", e => { if (e.key === "Enter") { const c = e.target.closest(".asset-card"); if (c) openModal(c.dataset.id); } });

  /* press "/" to jump to search */
  document.addEventListener("keydown", e => {
    if (e.key === "/" && document.activeElement !== q) { e.preventDefault(); q.focus(); }
    if (e.key === "Escape") closeModal();
  });

  /* ---------- detail modal ---------- */
  const modal = document.getElementById("assetModal");
  const body = document.getElementById("modalBody");
  function barcode(text) {
    let html = "";
    for (const ch of text) { const c = ch.charCodeAt(0); for (let k = 0; k < 3; k++) html += `<i style="width:${1 + ((c >> k) & 1) * 2}px"></i>`; }
    return html;
  }
  function openModal(id) {
    const a = assets.find(x => x.id === id);
    const hist = ET_HISTORY[id] || [
      ["Purchased and received", a.purchase],
      ["Asset tag " + a.id + " issued", a.purchase],
      [a.status === "available" ? "Checked in to " + a.location : "Issued to " + a.assignedTo + " (" + a.dept + ")", a.dueBack ? "Due back " + ET.fmtDate(a.dueBack) : "Current"]
    ];
    const warrantyOk = ET.parse(a.warranty) >= ET.today();
    body.innerHTML = `
      <div class="modal-head">
        <div style="display:flex;gap:16px;align-items:center">
          <div class="asset-ico" style="width:64px;height:64px">${ET_ICONS[a.category]}</div>
          <div><span class="tag-id">${a.id}</span><h2 id="mTitle" style="margin:0;font-size:1.5rem">${a.name}</h2><span class="pill ${ET.statusClass[a.status]}">${ET.statusLabel[a.status]}</span></div>
        </div>
        <button class="icon-btn" type="button" id="mClose" aria-label="Close">✕</button>
      </div>
      <div class="modal-grid">
        <div>
          <dl class="kv">
            <dt>Category</dt><dd>${a.category}</dd>
            <dt>Specs</dt><dd>${a.specs}</dd>
            <dt>Holder</dt><dd>${ET.esc(a.assignedTo)}</dd>
            <dt>Department</dt><dd>${ET.esc(a.dept)}</dd>
            <dt>Location</dt><dd>${a.location}</dd>
            <dt>Purchased</dt><dd>${ET.fmtDate(a.purchase)}</dd>
            <dt>Cost</dt><dd>${ET.peso(a.cost)}</dd>
            <dt>Book value</dt><dd class="grad-text" style="font-weight:700">${ET.peso(ET.bookValue(a))}</dd>
            <dt>Warranty</dt><dd><span class="pill ${warrantyOk ? "available" : "overdue"}">${warrantyOk ? "Until " : "Expired "}${ET.fmtDate(a.warranty)}</span></dd>
          </dl>
          <div style="margin-top:18px"><div class="meta" style="margin-bottom:6px"><span>Useful life used (${a.life} yrs)</span><b>${Math.round(ET.lifeUsed(a))}%</b></div><div class="bar"><span style="width:${ET.lifeUsed(a)}%"></span></div></div>
        </div>
        <div>
          <h3>Lifecycle history</h3>
          <ul class="timeline">${hist.map(h => `<li>${h[0]}<small>${/^\d{4}-\d{2}-\d{2}$/.test(h[1]) ? ET.fmtDate(h[1]) : h[1]}</small></li>`).join("")}</ul>
          <div class="barcode">${barcode(a.id)}</div>
          <small class="tag-id">${a.id}</small>
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-top:24px;flex-wrap:wrap">
        ${a.status === "available" ? `<a class="btn btn-primary" href="borrow.html?asset=${a.id}">Request this asset</a>` : `<span class="muted" style="align-self:center">This asset is not available right now.</span>`}
        <a class="btn btn-ghost" href="lifecycle.html?asset=${a.id}#calculator">View depreciation</a>
      </div>`;
    modal.classList.add("open");
    document.getElementById("mClose").addEventListener("click", closeModal);
  }
  function closeModal() { modal.classList.remove("open"); }
  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

  render();
});
