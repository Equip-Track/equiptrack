/* =========================================================
   EquipTrack - sample data
   Corporate IT asset register + borrowing records
   (Demo data only. In a real deployment this would come
   from a database / API.)
   ========================================================= */

const ET_ICONS = {
  Laptop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="11" rx="2"/><path d="M2 19h20l-2-4H4z"/></svg>',
  Monitor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  Projector: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="20" height="9" rx="2"/><circle cx="16" cy="12.5" r="2.5"/><path d="M6 12h4M5 17l-1 3M19 17l1 3"/></svg>',
  Camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8a2 2 0 0 1 2-2h2l2-3h6l2 3h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="4"/></svg>',
  Network: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="14" width="20" height="7" rx="2"/><path d="M6 17.5h.01M10 17.5h.01M12 14V9M8 6a6 6 0 0 1 8 0M5.5 3.5a10 10 0 0 1 13 0"/></svg>',
  Printer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><rect x="2" y="9" width="20" height="8" rx="2"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>',
  Phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/></svg>',
  Tablet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="3"/><path d="M11 18h2"/></svg>',
  Server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6"/></svg>',
  Peripheral: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="2" y="14" width="5" height="7" rx="2"/><rect x="17" y="14" width="5" height="7" rx="2"/></svg>'
};

/* status: available | assigned | repair | retired */
const ET_ASSETS = [
  { id: "ET-LPT-0001", name: "Dell Latitude 5440", category: "Laptop", specs: "Intel Core i5-1335U · 16GB RAM · 512GB SSD", status: "available", assignedTo: "-", dept: "IT Pool", location: "IT Room, 3F", purchase: "2024-02-12", cost: 62500, life: 4, warranty: "2027-02-12" },
  { id: "ET-LPT-0002", name: "Lenovo ThinkPad T14 Gen 4", category: "Laptop", specs: "AMD Ryzen 7 PRO · 32GB RAM · 1TB SSD", status: "assigned", assignedTo: "Maria Santos", dept: "Finance", location: "Finance Office, 5F", purchase: "2023-08-03", cost: 78900, life: 4, warranty: "2026-08-03" },
  { id: "ET-LPT-0003", name: "Apple MacBook Air M2", category: "Laptop", specs: "Apple M2 · 16GB RAM · 512GB SSD", status: "available", assignedTo: "-", dept: "IT Pool", location: "IT Room, 3F", purchase: "2024-06-18", cost: 74990, life: 4, warranty: "2027-06-18" },
  { id: "ET-LPT-0004", name: "HP EliteBook 840 G9", category: "Laptop", specs: "Intel Core i7-1255U · 16GB RAM · 512GB SSD", status: "repair", assignedTo: "-", dept: "IT Pool", location: "Service Center", purchase: "2022-11-21", cost: 69800, life: 4, warranty: "2025-11-21" },
  { id: "ET-MON-0005", name: "Dell UltraSharp U2723QE", category: "Monitor", specs: '27" 4K IPS · USB-C hub', status: "available", assignedTo: "-", dept: "IT Pool", location: "IT Room, 3F", purchase: "2024-01-09", cost: 32500, life: 5, warranty: "2027-01-09" },
  { id: "ET-MON-0006", name: "LG 24MP400", category: "Monitor", specs: '24" Full HD IPS · HDMI/VGA', status: "assigned", assignedTo: "Jose Reyes", dept: "HR", location: "HR Office, 2F", purchase: "2022-05-14", cost: 7800, life: 5, warranty: "2024-05-14" },
  { id: "ET-PRJ-0007", name: "Epson EB-X51", category: "Projector", specs: "3,800 lumens · XGA · HDMI", status: "available", assignedTo: "-", dept: "Facilities", location: "Conference Room A", purchase: "2023-03-28", cost: 29995, life: 5, warranty: "2025-03-28" },
  { id: "ET-PRJ-0008", name: "BenQ MW560", category: "Projector", specs: "4,000 lumens · WXGA · 3D ready", status: "assigned", assignedTo: "Ana Cruz", dept: "Marketing", location: "Client site - Makati", purchase: "2022-09-02", cost: 27500, life: 5, warranty: "2024-09-02" },
  { id: "ET-CAM-0009", name: "Canon EOS M50 Mark II", category: "Camera", specs: "24.1MP · 4K video · Kit lens", status: "available", assignedTo: "-", dept: "Marketing", location: "Media Room, 4F", purchase: "2023-10-10", cost: 41995, life: 5, warranty: "2025-10-10" },
  { id: "ET-NET-0010", name: "Cisco Catalyst 1000-24T", category: "Network", specs: "24-port Gigabit · 4x SFP uplink", status: "assigned", assignedTo: "Network Team", dept: "IT", location: "Server Room, 3F", purchase: "2021-07-19", cost: 58000, life: 6, warranty: "2026-07-19" },
  { id: "ET-PRN-0011", name: "HP LaserJet Pro M404dn", category: "Printer", specs: "Mono laser · Duplex · Network", status: "available", assignedTo: "-", dept: "Admin", location: "Admin Office, 1F", purchase: "2021-12-06", cost: 18990, life: 5, warranty: "2023-12-06" },
  { id: "ET-PHN-0012", name: "iPhone 13 (Company Line)", category: "Phone", specs: "128GB · eSIM + nano SIM", status: "assigned", assignedTo: "Carlo Mendoza", dept: "Sales", location: "Field", purchase: "2022-10-15", cost: 45990, life: 3, warranty: "2023-10-15" },
  { id: "ET-TAB-0013", name: "Apple iPad (10th gen)", category: "Tablet", specs: '10.9" · 64GB · Wi-Fi', status: "available", assignedTo: "-", dept: "IT Pool", location: "IT Room, 3F", purchase: "2024-03-22", cost: 28990, life: 4, warranty: "2025-03-22" },
  { id: "ET-SRV-0014", name: "Dell PowerEdge T150", category: "Server", specs: "Xeon E-2314 · 32GB ECC · 2x 2TB RAID 1", status: "assigned", assignedTo: "Infrastructure", dept: "IT", location: "Server Room, 3F", purchase: "2022-04-11", cost: 165000, life: 6, warranty: "2027-04-11" },
  { id: "ET-PER-0015", name: "Jabra Evolve2 65 Headset", category: "Peripheral", specs: "Wireless · ANC · USB-A dongle", status: "available", assignedTo: "-", dept: "IT Pool", location: "IT Room, 3F", purchase: "2024-08-01", cost: 13500, life: 3, warranty: "2026-08-01" },
  { id: "ET-LPT-0016", name: "Acer TravelMate P214", category: "Laptop", specs: "Intel Core i5-8265U · 8GB RAM · 256GB SSD", status: "retired", assignedTo: "-", dept: "IT", location: "Disposal Storage", purchase: "2019-06-10", cost: 42000, life: 4, warranty: "2022-06-10" },
  { id: "ET-PRJ-0017", name: "Epson EB-E01", category: "Projector", specs: "3,300 lumens · XGA · Portable", status: "available", assignedTo: "-", dept: "Facilities", location: "Training Room B", purchase: "2024-05-07", cost: 22995, life: 5, warranty: "2026-05-07" },
  { id: "ET-MON-0018", name: "Samsung Odyssey G5 27\"", category: "Monitor", specs: '27" QHD 144Hz · Curved', status: "available", assignedTo: "-", dept: "IT Pool", location: "IT Room, 3F", purchase: "2024-09-12", cost: 16495, life: 5, warranty: "2027-09-12" }
];

/* Lifecycle event history used in the asset detail window */
const ET_HISTORY = {
  "ET-LPT-0002": [["Purchased via PO-2023-118", "2023-08-03"], ["Tagged & imaged (Windows 11 Pro)", "2023-08-07"], ["Assigned to Maria Santos - Finance", "2023-08-10"], ["Battery replaced under warranty", "2025-04-22"]],
  "ET-LPT-0004": [["Purchased via PO-2022-301", "2022-11-21"], ["Assigned to Sales Dept.", "2022-11-28"], ["Returned - keyboard failure", "2026-10-30"], ["Sent to service center", "2026-11-03"]],
  "ET-LPT-0016": [["Purchased", "2019-06-10"], ["Reassigned 3 times", "2019-2023"], ["End of useful life", "2023-06-10"], ["Data wiped (DoD 5220.22-M) - awaiting disposal", "2024-01-15"]]
};

/* Borrow records. Dates are relative to TODAY (offset in days),
   so the monitoring dashboard always shows realistic statuses. */
const ET_SEED_REQUESTS = [
  { ticket: "ET-REQ-2026-0141", empId: "EMP-1042", name: "Kristine Villanueva", dept: "Marketing", asset: "ET-CAM-0009", type: "Short-term Borrow", from: -6, to: -1, purpose: "Product photoshoot for Q4 campaign", returned: false },
  { ticket: "ET-REQ-2026-0142", empId: "EMP-0877", name: "Paolo Garcia", dept: "Sales", asset: "ET-PRJ-0017", type: "Short-term Borrow", from: -3, to: 1, purpose: "Client presentation - Ortigas", returned: false },
  { ticket: "ET-REQ-2026-0143", empId: "EMP-1120", name: "Bea Domingo", dept: "HR", asset: "ET-LPT-0003", type: "Short-term Borrow", from: -2, to: 5, purpose: "Onboarding sessions for new hires", returned: false },
  { ticket: "ET-REQ-2026-0144", empId: "EMP-0954", name: "Miguel Tan", dept: "Finance", asset: "ET-TAB-0013", type: "Short-term Borrow", from: -10, to: -4, purpose: "Inventory count at warehouse", returned: true },
  { ticket: "ET-REQ-2026-0145", empId: "EMP-1201", name: "Ella Ramos", dept: "Operations", asset: "ET-PER-0015", type: "Long-term Assignment", from: -1, to: 20, purpose: "Remote support calls", returned: false },
  { ticket: "ET-REQ-2026-0146", empId: "EMP-0733", name: "Rafael Lim", dept: "IT", asset: "ET-MON-0005", type: "Replacement", from: -14, to: -7, purpose: "Temporary replacement while monitor is repaired", returned: false },
  { ticket: "ET-REQ-2026-0147", empId: "EMP-1088", name: "Nicole Aquino", dept: "Marketing", asset: "ET-PRJ-0007", type: "Short-term Borrow", from: 0, to: 0, purpose: "Town hall meeting", returned: false }
];

const ET_DEPARTMENTS = ["Finance", "HR", "IT", "Marketing", "Operations", "Sales", "Admin", "Facilities"];
