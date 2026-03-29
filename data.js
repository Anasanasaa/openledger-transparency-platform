// ============================================================
// data.js — OpenLedger Dummy Database
// All data stored in JS arrays (no backend needed)
// ============================================================

const DB = {
  // ── Users ──────────────────────────────────────────────────
  users: [
    { id: 1, name: "Aarav Sharma", email: "aarav@openledger.in", password: "demo123", avatar: "AS" },
    { id: 2, name: "Priya Mehta",  email: "priya@openledger.in", password: "demo123", avatar: "PM" }
  ],

  // ── Campaigns ──────────────────────────────────────────────
  campaigns: [
    {
      id: "C001",
      title: "Kerala Flood Relief 2025",
      creator: "Aarav Sharma",
      category: "Disaster",
      goal: 500000,
      raised: 312400,
      spent: 198000,
      description: "Providing immediate relief to flood-affected families in Kerala — food, shelter, and medical aid for over 2,000 displaced families.",
      image: "🌊",
      createdAt: "2025-06-01",
      donors: 248
    },
    {
      id: "C002",
      title: "Rural School Digital Lab",
      creator: "Priya Mehta",
      category: "Education",
      goal: 200000,
      raised: 145600,
      spent: 89000,
      description: "Setting up computer labs in 5 government schools in Rajasthan for 1,200+ students to access digital education.",
      image: "📚",
      createdAt: "2025-05-15",
      donors: 134
    },
    {
      id: "C003",
      title: "Mobile Cancer Screening Van",
      creator: "Dr. Rahul Nair",
      category: "Medical",
      goal: 350000,
      raised: 267800,
      spent: 211000,
      description: "A fully-equipped mobile unit to screen 10,000+ patients in rural Maharashtra annually for early cancer detection.",
      image: "🏥",
      createdAt: "2025-04-20",
      donors: 389
    },
    {
      id: "C004",
      title: "Clean Water for Bundelkhand",
      creator: "Sunita Rao",
      category: "NGO",
      goal: 180000,
      raised: 95200,
      spent: 42000,
      description: "Installing 12 solar-powered water purifiers across drought-prone villages in Bundelkhand region.",
      image: "💧",
      createdAt: "2025-05-28",
      donors: 91
    },
    {
      id: "C005",
      title: "Uttarakhand Earthquake Aid",
      creator: "Kiran Joshi",
      category: "Disaster",
      goal: 750000,
      raised: 489000,
      spent: 370000,
      description: "Emergency response: tents, blankets, food kits, and trauma counseling for earthquake survivors across 14 villages.",
      image: "⛺",
      createdAt: "2025-06-10",
      donors: 612
    },
    {
      id: "C006",
      title: "Girl Child Scholarship Fund",
      creator: "Ananya Singh",
      category: "Education",
      goal: 300000,
      raised: 221000,
      spent: 180000,
      description: "Scholarships for 500 underprivileged girl students across Class 9–12 in Bihar to reduce dropout rates.",
      image: "🎓",
      createdAt: "2025-03-11",
      donors: 276
    }
  ],

  // ── Transactions (donations + expenses per campaign) ────────
  transactions: [
    { id: "T001", campaignId: "C001", type: "donation", amount: 5000,  from: "Vikram B.",          date: "2025-06-15", note: "Keep up the great work!" },
    { id: "T002", campaignId: "C001", type: "donation", amount: 10000, from: "Anonymous",           date: "2025-06-14", note: "" },
    { id: "T003", campaignId: "C001", type: "expense",  amount: 45000, from: "Relief Supplies",     date: "2025-06-13", note: "1000 food kits dispatched" },
    { id: "T004", campaignId: "C001", type: "donation", amount: 2500,  from: "Meera K.",            date: "2025-06-12", note: "Praying for all" },
    { id: "T005", campaignId: "C001", type: "expense",  amount: 28000, from: "Tent Procurement",    date: "2025-06-11", note: "200 emergency tents" },
    { id: "T006", campaignId: "C002", type: "donation", amount: 15000, from: "TechCorp CSR",        date: "2025-06-10", note: "Supporting digital India" },
    { id: "T007", campaignId: "C002", type: "expense",  amount: 40000, from: "HP Laptops",          date: "2025-06-08", note: "20 laptops for Jaipur school" },
    { id: "T008", campaignId: "C002", type: "donation", amount: 3000,  from: "Rohan M.",            date: "2025-06-05", note: "" },
    { id: "T009", campaignId: "C003", type: "donation", amount: 20000, from: "Apollo Trust",        date: "2025-06-14", note: "Healthcare for all" },
    { id: "T010", campaignId: "C003", type: "expense",  amount: 85000, from: "Medical Equipment",   date: "2025-06-12", note: "Ultrasound machine" },
    { id: "T011", campaignId: "C003", type: "donation", amount: 7500,  from: "Dr. Sheila V.",       date: "2025-06-09", note: "Proud to contribute" },
    { id: "T012", campaignId: "C004", type: "donation", amount: 8000,  from: "WaterAid India",      date: "2025-06-11", note: "" },
    { id: "T013", campaignId: "C004", type: "expense",  amount: 22000, from: "Purifier Units",      date: "2025-06-08", note: "3 purifiers installed" },
    { id: "T014", campaignId: "C005", type: "donation", amount: 50000, from: "PM Relief Fund",      date: "2025-06-16", note: "Emergency contribution" },
    { id: "T015", campaignId: "C005", type: "expense",  amount: 120000,from: "Emergency Ops",       date: "2025-06-15", note: "First responder deployment" },
    { id: "T016", campaignId: "C005", type: "donation", amount: 12000, from: "Raj Enterprises",     date: "2025-06-13", note: "" },
    { id: "T017", campaignId: "C006", type: "donation", amount: 6000,  from: "Infosys Foundation",  date: "2025-06-07", note: "Empowering girls" },
    { id: "T018", campaignId: "C006", type: "expense",  amount: 90000, from: "Scholarship Disbursal",date:"2025-06-01", note: "250 students – Q1 batch" }
  ],

  // ── Session helpers ─────────────────────────────────────────
  getSession() {
    try { return JSON.parse(localStorage.getItem("ol_session")); } catch { return null; }
  },
  setSession(user) {
    localStorage.setItem("ol_session", JSON.stringify(user));
  },
  clearSession() {
    localStorage.removeItem("ol_session");
  },

  // ── CRUD helpers ────────────────────────────────────────────
  getCampaign(id) {
    return this.campaigns.find(c => c.id === id) || null;
  },
  getCampaignTransactions(id) {
    return this.transactions
      .filter(t => t.campaignId === id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  addDonation(campaignId, amount, donorName, note) {
    const campaign = this.getCampaign(campaignId);
    if (!campaign) return false;
    campaign.raised += Number(amount);
    campaign.donors += 1;
    this.transactions.unshift({
      id: "T" + Date.now(),
      campaignId,
      type: "donation",
      amount: Number(amount),
      from: donorName || "Anonymous",
      date: new Date().toISOString().split("T")[0],
      note: note || ""
    });
    return true;
  },
  addExpense(campaignId, amount, description) {
    const campaign = this.getCampaign(campaignId);
    if (!campaign) return false;
    campaign.spent += Number(amount);
    this.transactions.unshift({
      id: "E" + Date.now(),
      campaignId,
      type: "expense",
      amount: Number(amount),
      from: description || "Expense",
      date: new Date().toISOString().split("T")[0],
      note: ""
    });
    return true;
  },
  addCampaign(data) {
    const emojis = { Medical: "🏥", Education: "📚", NGO: "🤝", Disaster: "🆘" };
    const newC = {
      id: "C" + Date.now(),
      title: data.title,
      creator: data.name,
      category: data.category,
      goal: Number(data.goal),
      raised: 0,
      spent: 0,
      description: data.description || "No description provided.",
      image: emojis[data.category] || "📌",
      createdAt: new Date().toISOString().split("T")[0],
      donors: 0
    };
    this.campaigns.unshift(newC);
    return newC;
  }
};
