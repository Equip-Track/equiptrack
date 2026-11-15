/* EquipTrack - Home page: live counters, activity and alerts */
document.addEventListener("DOMContentLoaded", () => {
  const assets = ET.assets();
  const reqs = ET.getRequests();
  const counts = {
    total: assets.length,
    available: assets.filter(a => a.status === "available").length,
    out: assets.filter(a => a.status === "assigned" || a.status === "borrowed").length,
    repair: assets.filter(a => a.status === "repair").length
  };
  document.querySelectorAll("[data-count]").forEach(el => ET.countUp(el, counts[el.dataset.count]));
  ET.countUp(document.getElementById("heroTotal"), counts.total);
  ET.countUp(document.getElementById("heroActive"), reqs.filter(r => !r.returned).length);
  const value = assets.filter(a => a.status !== "retired").reduce((s, a) => s + ET.bookValue(a), 0);
  ET.countUp(document.getElementById("heroValue"), Math.round(value), "₱");

  /* Recent activity (latest requests first) */
  const assetName = id => (ET_ASSETS.find(a => a.id === id) || { name: id }).name;
  const feed = document.getElementById("activityFeed");
  const recent = reqs.slice().sort((a, b) => (b.created || b.from).localeCompare(a.created || a.from)).slice(0, 5);
  feed.innerHTML = recent.map(r => {
    const st = ET.requestStatus(r);
    const cls = st.key === "overdue" ? "c-red" : st.key === "returned" ? "c-green" : st.key === "duesoon" ? "c-amber" : "c-indigo";
    const verb = r.returned ? "returned" : "borrowed";
    return `<li><span class="ico ${cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg></span>
      <div><b>${ET.esc(r.name)}</b> ${verb} <b>${ET.esc(assetName(r.asset))}</b><small>${ET.esc(r.dept)} · ${r.ticket} · ${ET.fmtDate(r.from)}</small></div></li>`;
  }).join("");

  /* Needs attention: overdue, in repair, expired warranty on active assets */
  const att = [];
  reqs.forEach(r => { const s = ET.requestStatus(r); if (s.key === "overdue") att.push(["c-red", `<b>${ET.esc(assetName(r.asset))}</b> is ${s.label.toLowerCase()}`, `Borrowed by ${ET.esc(r.name)} (${ET.esc(r.dept)})`]); });
  reqs.forEach(r => { const s = ET.requestStatus(r); if (s.key === "duesoon") att.push(["c-amber", `<b>${ET.esc(assetName(r.asset))}</b> is ${s.label.toLowerCase()}`, `Remind ${ET.esc(r.name)}`]); });
  assets.filter(a => a.status === "repair").forEach(a => att.push(["c-amber", `<b>${a.name}</b> is in repair`, a.location]));
  const expired = assets.filter(a => a.status !== "retired" && ET.parse(a.warranty) < ET.today());
  if (expired.length) att.push(["c-purple", `<b>${expired.length} assets</b> have expired warranties`, "Consider extended support or refresh"]);
  document.getElementById("attentionFeed").innerHTML = att.slice(0, 5).map(([c, t, s]) =>
    `<li><span class="ico ${c}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 8v5M12 16h.01"/><circle cx="12" cy="12" r="9"/></svg></span><div>${t}<small>${s}</small></div></li>`
  ).join("") || '<li><div>Everything looks good today!</div></li>';
});
