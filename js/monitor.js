/* EquipTrack - Monitor page: table, filters, actions, chart, CSV export */
document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);
  const assetName = id => (ET_ASSETS.find(a => a.id === id) || { name: id }).name;
  let filter = "all";

  function render() {
    const list = ET.getRequests();
    const withStatus = list.map(r => Object.assign({}, r, { st: ET.requestStatus(r) }));

    /* summary cards */
    ET.countUp($("mActive"), withStatus.filter(r => !r.returned).length);
    ET.countUp($("mSoon"), withStatus.filter(r => r.st.key === "duesoon").length);
    ET.countUp($("mOver"), withStatus.filter(r => r.st.key === "overdue").length);
    ET.countUp($("mRet"), withStatus.filter(r => r.returned).length);

    /* department chart */
    const byDept = {};
    withStatus.forEach(r => byDept[r.dept] = (byDept[r.dept] || 0) + 1);
    const max = Math.max(1, ...Object.values(byDept));
    $("deptChart").innerHTML = Object.entries(byDept).sort((a, b) => b[1] - a[1])
      .map(([d, n]) => `<div class="hbar"><span>${ET.esc(d)}</span><div class="track"><i style="width:${n / max * 100}%"></i></div><b>${n}</b></div>`).join("");

    /* table */
    const term = $("mq").value.trim().toLowerCase();
    const order = { overdue: 0, duesoon: 1, ontime: 2, returned: 3 };
    const rows = withStatus
      .filter(r => filter === "all" || r.st.key === filter)
      .filter(r => [r.ticket, r.name, r.dept, r.asset, assetName(r.asset), r.empId].join(" ").toLowerCase().includes(term))
      .sort((a, b) => order[a.st.key] - order[b.st.key] || a.to.localeCompare(b.to));

    $("mBody").innerHTML = rows.length ? rows.map(r => `
      <tr>
        <td><b style="color:var(--heading)">${r.ticket}</b><small>${ET.esc(r.type)}</small></td>
        <td><div class="who"><span class="avatar">${ET.initials(r.name)}</span><div>${ET.esc(r.name)}<small>${ET.esc(r.dept)} · ${ET.esc(r.empId)}</small></div></div></td>
        <td>${ET.esc(assetName(r.asset))}<small class="tag-id">${r.asset}</small></td>
        <td>${ET.fmtDate(r.from)}</td>
        <td>${ET.fmtDate(r.to)}</td>
        <td><span class="pill ${r.st.key}">${r.st.label}</span></td>
        <td class="no-print">${r.returned ? '<span class="muted" style="font-size:.82rem">Closed</span>' :
          `<div class="actions"><button class="btn btn-success btn-sm" data-act="return" data-t="${r.ticket}" type="button">Return</button><button class="btn btn-ghost btn-sm" data-act="extend" data-t="${r.ticket}" type="button">+7d</button></div>`}</td>
      </tr>`).join("")
      : '<tr><td colspan="7" class="empty">No records found.</td></tr>';
  }

  /* action buttons inside the table */
  $("mBody").addEventListener("click", e => {
    const b = e.target.closest("button[data-act]"); if (!b) return;
    const list = ET.getRequests();
    const r = list.find(x => x.ticket === b.dataset.t); if (!r) return;
    if (b.dataset.act === "return") {
      r.returned = true; r.returnedOn = ET.iso(ET.today());
      ET.toast(`${assetName(r.asset)} marked as returned.`, "success");
    } else {
      const d = ET.parse(r.to); d.setDate(d.getDate() + 7); r.to = ET.iso(d);
      ET.toast(`${r.ticket} extended to ${ET.fmtDate(r.to)}.`, "info");
    }
    ET.saveRequests(list); render();
  });

  $("mTabs").addEventListener("click", e => {
    const b = e.target.closest(".chip"); if (!b) return;
    $("mTabs").querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
    b.classList.add("active"); filter = b.dataset.f; render();
  });
  $("mq").addEventListener("input", render);

  /* export to CSV (opens in Excel) */
  $("exportCsv").addEventListener("click", () => {
    const head = ["Ticket", "Employee ID", "Name", "Department", "Asset Tag", "Asset", "Type", "Borrowed", "Due", "Status", "Purpose"];
    const rows = ET.getRequests().map(r => [r.ticket, r.empId, r.name, r.dept, r.asset, assetName(r.asset), r.type, r.from, r.to, ET.requestStatus(r).label, r.purpose]);
    const csv = [head].concat(rows).map(row => row.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(",")).join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
    a.download = "EquipTrack_Borrowing_Report_" + ET.iso(ET.today()) + ".csv";
    a.click();
    ET.toast("Report downloaded.", "success");
  });

  $("resetDemo").addEventListener("click", () => {
    ET.resetDemo(); render(); ET.toast("Demo data restored.", "info");
  });

  render();
});
