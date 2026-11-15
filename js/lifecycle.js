/* EquipTrack - Lifecycle page: interactive stages + depreciation planner */
const STAGES = [
  { t: "Plan & Procure", owner: "IT Manager, Procurement, Finance",
    d: "Departments submit equipment needs. IT checks if an existing asset can be redeployed, sets standard specs, gets quotations from accredited suppliers, and Finance approves the budget before a Purchase Order (PO) is issued.",
    list: ["Needs assessment from the department", "Check the inventory for spare units first", "Standard specs approved by IT", "At least 3 supplier quotations", "PO approved by Finance"],
    kpi: [["Avg. procurement time", "10 working days"], ["Budget variance", "&lt; 5%"], ["Redeployment rate", "30%"]] },
  { t: "Receive & Tag", owner: "IT Asset Custodian",
    d: "When the delivery arrives, IT inspects every unit against the PO and delivery receipt, records serial numbers, attaches a barcode asset tag (e.g. ET-LPT-0019), and registers the asset in EquipTrack with its warranty details.",
    list: ["Match delivery receipt with the PO", "Inspect for physical damage", "Record serial number and MAC address", "Attach barcode asset tag", "Register in EquipTrack with warranty date"],
    kpi: [["Tagging time per unit", "&lt; 10 minutes"], ["Register accuracy", "99%"], ["Untagged assets", "0"]] },
  { t: "Deploy & Assign", owner: "IT Support",
    d: "The asset is prepared with the company image (OS, security tools, licensed software), then issued to the employee. The employee signs an Accountability Form, and EquipTrack records who has it and where.",
    list: ["Install company OS image and updates", "Install antivirus and endpoint management", "Enable disk encryption", "Employee signs Accountability Form", "Status set to Assigned in EquipTrack"],
    kpi: [["Deployment time", "1 working day"], ["Devices encrypted", "100%"], ["Signed accountability forms", "100%"]] },
  { t: "Monitor & Maintain", owner: "IT Support, Employees",
    d: "During use, IT tracks borrowings, patches software, and repairs issues. Warranty claims are filed when possible. Monthly spot checks and a yearly physical audit keep the records accurate.",
    list: ["Monthly security patches", "Track due dates on the Monitor page", "File warranty claims for defects", "Quarterly spot-check of 10% of assets", "Annual physical inventory audit"],
    kpi: [["On-time returns", "&gt; 95%"], ["Avg. repair turnaround", "3 days"], ["Audit match rate", "98%"]] },
  { t: "Refresh & Upgrade", owner: "IT Manager, Finance",
    d: "Before an asset becomes slow, unsupported or expensive to repair, IT plans its replacement. Refresh cycles follow the useful life (e.g. 4 years for laptops), and upgrades like extra RAM can extend usable life.",
    list: ["Flag assets near end of useful life", "Compare repair cost vs. replacement", "Consider RAM/SSD upgrade to extend life", "Include refresh in next year's budget", "Back up and migrate user data"],
    kpi: [["Laptop refresh cycle", "4 years"], ["Assets past useful life", "&lt; 10%"], ["Upgrade cost vs. new", "&lt; 30%"]] },
  { t: "Retire & Dispose", owner: "IT Asset Custodian, Admin",
    d: "Retired assets are securely wiped and certified, then redeployed, donated, sold, or recycled through an accredited e-waste partner. The record stays in EquipTrack for audits, marked Retired.",
    list: ["Remove from network and accounts", "Certified data wipe (keep certificate)", "Remove the asset tag and update the register", "Choose: redeploy, donate, sell or recycle", "File the disposal report with Finance"],
    kpi: [["Wipe certificates on file", "100%"], ["E-waste recycled properly", "100%"], ["Disposal report time", "5 days"]] }
];

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.getElementById("lcTabs");
  const panel = document.getElementById("lcPanel");
  const done = ET.load("et_checklist", {});

  tabs.innerHTML = STAGES.map((s, i) => `<button type="button" class="lc-tab" role="tab" data-i="${i}"><span class="n">0${i + 1}</span>${s.t}</button>`).join("");

  function show(i) {
    const s = STAGES[i];
    tabs.querySelectorAll(".lc-tab").forEach((b, k) => { b.classList.toggle("active", k === i); b.setAttribute("aria-selected", k === i); });
    const checked = done[i] || [];
    const pct = Math.round(checked.length / s.list.length * 100);
    panel.innerHTML = `<div class="lc-panel">
      <div class="card">
        <span class="eyebrow">Stage ${i + 1} of 6</span>
        <h2>${s.t}</h2>
        <p>${s.d}</p>
        <p class="muted" style="font-size:.9rem"><b style="color:var(--heading)">Responsible:</b> ${s.owner}</p>
        <div style="display:flex;gap:10px;margin-top:18px">
          <button class="btn btn-ghost btn-sm" type="button" id="prevS" ${i === 0 ? "disabled" : ""}>← Previous</button>
          <button class="btn btn-primary btn-sm" type="button" id="nextS" ${i === 5 ? "disabled" : ""}>Next stage →</button>
        </div>
      </div>
      <div class="card">
        <div class="meta" style="margin-bottom:8px"><h3 style="margin:0">Stage checklist</h3><b id="pct">${pct}%</b></div>
        <div class="bar" style="margin-bottom:12px"><span id="pctBar" style="width:${pct}%"></span></div>
        <ul class="checklist">${s.list.map((item, k) => `<li><label><input type="checkbox" data-k="${k}" ${checked.includes(k) ? "checked" : ""}><span>${item}</span></label></li>`).join("")}</ul>
        <h3 style="margin-top:18px">Target KPIs</h3>
        ${s.kpi.map(k => `<div class="kpi"><span class="muted">${k[0]}</span><b>${k[1]}</b></div>`).join("")}
      </div></div>`;
    panel.querySelectorAll(".checklist input").forEach(cb => cb.addEventListener("change", () => {
      done[i] = [...panel.querySelectorAll(".checklist input:checked")].map(x => +x.dataset.k);
      ET.save("et_checklist", done);
      const p = Math.round(done[i].length / s.list.length * 100);
      document.getElementById("pct").textContent = p + "%";
      document.getElementById("pctBar").style.width = p + "%";
      if (p === 100) ET.toast(`Stage "${s.t}" checklist complete!`, "success");
    }));
    document.getElementById("prevS").onclick = () => show(i - 1);
    document.getElementById("nextS").onclick = () => show(i + 1);
    if (history.replaceState) history.replaceState(null, "", location.pathname + location.search + "#" + (i + 1));
  }
  tabs.addEventListener("click", e => { const b = e.target.closest(".lc-tab"); if (b) show(+b.dataset.i); });
  const startHash = parseInt(location.hash.replace("#", ""), 10);
  show(startHash >= 1 && startHash <= 6 ? startHash - 1 : 0);

  /* ---------- depreciation planner ---------- */
  const f = id => document.getElementById(id);
  const sel = f("cAsset");
  sel.innerHTML += ET_ASSETS.map(a => `<option value="${a.id}">${a.id} - ${a.name}</option>`).join("");
  sel.addEventListener("change", () => {
    const a = ET_ASSETS.find(x => x.id === sel.value); if (!a) return;
    f("cCost").value = a.cost; f("cLife").value = a.life; f("cDate").value = a.purchase; calc();
  });
  const preset = new URLSearchParams(location.search).get("asset");
  if (preset && ET_ASSETS.some(a => a.id === preset)) { sel.value = preset; sel.dispatchEvent(new Event("change")); }

  function calc() {
    const cost = Math.max(0, +f("cCost").value || 0);
    const salvage = cost * Math.min(50, Math.max(0, +f("cSalvage").value || 0)) / 100;
    const life = +f("cLife").value;
    f("cLifeOut").textContent = life;
    const start = f("cDate").value ? ET.parse(f("cDate").value) : ET.today();
    const annual = (cost - salvage) / life;
    const yrs = Math.max(0, (ET.today() - start) / (365.25 * 86400000));
    const now = Math.max(salvage, cost - annual * yrs);
    const refresh = new Date(start); refresh.setFullYear(refresh.getFullYear() + life);
    const used = Math.min(100, yrs / life * 100);
    f("rAnnual").textContent = ET.peso(annual);
    f("rNow").textContent = ET.peso(now);
    f("rRefresh").textContent = refresh.toLocaleDateString("en-PH", { month: "long", year: "numeric" }) + (refresh < ET.today() ? " (overdue)" : "");
    f("rLife").textContent = Math.round(used) + "% of " + life + " years";
    f("rLifeBar").style.width = used + "%";
    const cols = [], labels = [];
    for (let y = 0; y <= life; y++) {
      const v = cost - annual * y;
      cols.push(`<div class="col"><span class="v">${ET.peso(v / 1000)}k</span><i style="height:${cost ? (v / cost) * 85 : 0}%"></i></div>`);
      labels.push(`<span>${y === 0 ? "Buy" : "Yr " + y}</span>`);
    }
    f("chart").innerHTML = cols.join("");
    f("chartLabels").innerHTML = labels.join("");
  }
  ["cCost", "cSalvage", "cLife", "cDate"].forEach(id => f(id).addEventListener("input", calc));
  calc();
});
