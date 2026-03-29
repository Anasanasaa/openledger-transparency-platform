// ============================================================
// app.js — OpenLedger Main Application Logic
// Handles routing, rendering, auth, and all UI interactions
// ============================================================

/* ── Utility helpers ─────────────────────────────────────── */

/** Format number as Indian Rupees */
function formatINR(n) {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  if (n >= 1000)   return "₹" + (n / 1000).toFixed(1)   + "K";
  return "₹" + n.toLocaleString("en-IN");
}

/** Calculate progress percentage (capped at 100) */
function pct(raised, goal) {
  return Math.min(100, Math.round((raised / goal) * 100));
}

/** Show a toast notification */
function showToast(msg, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || "ℹ️"}</span> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

/** Get current logged-in user; redirect to login if none */
function requireAuth() {
  const user = DB.getSession();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

/** Populate sidebar user info */
function initSidebar(activePage) {
  const user = DB.getSession();
  if (!user) return;

  // Avatar & name
  const el = document.getElementById("sidebarUserName");
  const av = document.getElementById("sidebarAvatar");
  if (el) el.textContent = user.name;
  if (av) av.textContent = user.avatar || user.name.slice(0, 2).toUpperCase();

  // Active nav item
  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
    if (item.dataset.page === activePage) item.classList.add("active");
  });

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      DB.clearSession();
      window.location.href = "login.html";
    });
  }

  // Mobile hamburger
  const hamburger = document.getElementById("hamburger");
  const sidebar   = document.getElementById("sidebar");
  const overlay   = document.getElementById("sidebarOverlay");
  if (hamburger && sidebar) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("show");
    });
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
    });
  }
}

/* ============================================================
   LOGIN PAGE
   ============================================================ */
function initLoginPage() {
  // If already logged in → redirect to dashboard
  if (DB.getSession()) {
    window.location.href = "dashboard.html";
    return;
  }

  const form     = document.getElementById("loginForm");
  const emailIn  = document.getElementById("loginEmail");
  const passIn   = document.getElementById("loginPassword");
  const errMsg   = document.getElementById("loginError");

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    errMsg.textContent = "";
    const email    = emailIn.value.trim().toLowerCase();
    const password = passIn.value;

    // Validate against dummy users
    const user = DB.users.find(u => u.email === email && u.password === password);
    if (!user) {
      errMsg.textContent = "Invalid email or password. Use the demo credentials below.";
      passIn.value = "";
      return;
    }

    DB.setSession(user);
    showToast("Welcome back, " + user.name + "!", "success");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 600);
  });

  // Fill demo credentials on click
  const demoBtn = document.getElementById("fillDemo");
  if (demoBtn) {
    demoBtn.addEventListener("click", () => {
      emailIn.value = "aarav@openledger.in";
      passIn.value  = "demo123";
    });
  }
}

/* ============================================================
   DASHBOARD PAGE
   ============================================================ */
function initDashboardPage() {
  const user = requireAuth();
  if (!user) return;
  initSidebar("dashboard");

  // Topbar greeting
  const topbarTitle = document.getElementById("topbarTitle");
  if (topbarTitle) topbarTitle.textContent = "Good day, " + user.name.split(" ")[0] + " 👋";

  // Aggregate stats
  const totalRaised = DB.campaigns.reduce((s, c) => s + c.raised, 0);
  const totalSpent  = DB.campaigns.reduce((s, c) => s + c.spent, 0);
  const totalDonors = DB.campaigns.reduce((s, c) => s + c.donors, 0);
  document.getElementById("statCampaigns").textContent = DB.campaigns.length;
  document.getElementById("statRaised").textContent    = formatINR(totalRaised);
  document.getElementById("statSpent").textContent     = formatINR(totalSpent);
  document.getElementById("statDonors").textContent    = totalDonors.toLocaleString();

  // Category filter
  let activeFilter = "All";
  const filterTabs = document.querySelectorAll(".filter-tab");
  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeFilter = tab.dataset.cat;
      renderCampaigns(activeFilter);
    });
  });

  renderCampaigns("All");

  // Create campaign button
  const createBtn = document.getElementById("createCampaignBtn");
  if (createBtn) createBtn.addEventListener("click", () => { window.location.href = "create.html"; });
}

/** Render campaign cards (optionally filtered by category) */
function renderCampaigns(filter) {
  const grid = document.getElementById("campaignsGrid");
  if (!grid) return;

  const list = filter === "All"
    ? DB.campaigns
    : DB.campaigns.filter(c => c.category === filter);

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">🔍</div><p>No campaigns in this category yet.</p></div>`;
    return;
  }

  grid.innerHTML = list.map(c => `
    <div class="campaign-card" onclick="openCampaign('${c.id}')">
      <div class="card-top">
        <span class="card-emoji">${c.image}</span>
        <span class="card-category ${c.category}">${c.category}</span>
      </div>
      <div class="card-title">${c.title}</div>
      <div class="card-creator">by <span>${c.creator}</span></div>
      <div class="progress-row">
        <span class="progress-label">${pct(c.raised, c.goal)}% funded</span>
        <span class="progress-pct">${c.donors} donors</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${pct(c.raised, c.goal)}%"></div>
      </div>
      <div class="card-amounts">
        <div class="amount-item">
          <div class="amount-val raised">${formatINR(c.raised)}</div>
          <div class="amount-key">Raised</div>
        </div>
        <div class="amount-item" style="text-align:right">
          <div class="amount-val goal">${formatINR(c.goal)}</div>
          <div class="amount-key">Goal</div>
        </div>
      </div>
    </div>
  `).join("");
}

/** Navigate to campaign detail page */
function openCampaign(id) {
  window.location.href = `campaign.html?id=${id}`;
}

/* ============================================================
   CAMPAIGN DETAIL PAGE
   ============================================================ */
function initCampaignPage() {
  const user = requireAuth();
  if (!user) return;
  initSidebar("dashboard");

  const params     = new URLSearchParams(window.location.search);
  const campaignId = params.get("id");
  const campaign   = DB.getCampaign(campaignId);

  if (!campaign) {
    document.getElementById("campaignContent").innerHTML =
      `<div class="empty-state"><div class="empty-icon">😕</div><p>Campaign not found.</p></div>`;
    return;
  }

  renderCampaignDetail(campaign);
  renderTransactions(campaignId);

  // Back button
  document.getElementById("backBtn").addEventListener("click", () => history.back());

  // Donate button → open modal
  document.getElementById("donateBtn").addEventListener("click", () => {
    openModal("donateModal");
  });

  // Add Expense button
  document.getElementById("expenseBtn").addEventListener("click", () => {
    openModal("expenseModal");
  });

  // Donate form submit
  document.getElementById("donateForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("donateAmount").value);
    const name   = document.getElementById("donateName").value.trim() || user.name;
    const note   = document.getElementById("donateNote").value.trim();

    if (!amount || amount <= 0) { showToast("Enter a valid amount", "error"); return; }

    DB.addDonation(campaignId, amount, name, note);
    closeModal("donateModal");
    showToast(`Donation of ${formatINR(amount)} recorded! 🎉`, "success");
    this.reset();

    // Re-render
    const updated = DB.getCampaign(campaignId);
    renderCampaignDetail(updated);
    renderTransactions(campaignId);
  });

  // Expense form submit
  document.getElementById("expenseForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const amount = parseFloat(document.getElementById("expenseAmount").value);
    const desc   = document.getElementById("expenseDesc").value.trim();

    if (!amount || amount <= 0) { showToast("Enter a valid amount", "error"); return; }
    const campaign = DB.getCampaign(campaignId);
    if (amount > (campaign.raised - campaign.spent)) {
      showToast("Expense exceeds available balance!", "error"); return;
    }

    DB.addExpense(campaignId, amount, desc);
    closeModal("expenseModal");
    showToast(`Expense of ${formatINR(amount)} added`, "info");
    this.reset();

    const updated = DB.getCampaign(campaignId);
    renderCampaignDetail(updated);
    renderTransactions(campaignId);
  });

  // Modal close buttons
  document.querySelectorAll("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
  });
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", function(e) {
      if (e.target === this) closeModal(this.id);
    });
  });
}

/** Render campaign hero & financial cards */
function renderCampaignDetail(c) {
  const balance = c.raised - c.spent;
  document.getElementById("campaignEmoji").textContent = c.image;
  document.getElementById("campaignTitle").textContent = c.title;
  document.getElementById("campaignCategory").className = `card-category hero-cat ${c.category}`;
  document.getElementById("campaignCategory").textContent = c.category;
  document.getElementById("campaignDesc").textContent = c.description;
  document.getElementById("campaignCreator").textContent = "by " + c.creator + " • " + c.createdAt;

  document.getElementById("campaignGoal").textContent    = formatINR(c.goal);
  document.getElementById("campaignRaised").textContent  = formatINR(c.raised);
  document.getElementById("campaignSpent").textContent   = formatINR(c.spent);
  document.getElementById("campaignBalance").textContent = formatINR(balance);
  document.getElementById("campaignDonors").textContent  = c.donors;

  const p = pct(c.raised, c.goal);
  document.getElementById("campaignPct").textContent = p + "%";
  document.getElementById("campaignProgressFill").style.width = p + "%";
}

/** Render transaction list */
function renderTransactions(campaignId) {
  const list = DB.getCampaignTransactions(campaignId);
  const el   = document.getElementById("txList");
  if (!el) return;

  if (list.length === 0) {
    el.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>No transactions yet.</p></div>`;
    return;
  }

  el.innerHTML = list.map(tx => `
    <div class="tx-item">
      <div class="tx-dot ${tx.type}">${tx.type === "donation" ? "💚" : "🔴"}</div>
      <div class="tx-info">
        <div class="tx-from">${tx.from}</div>
        <div class="tx-note">${tx.note || (tx.type === "donation" ? "Donation received" : "Expense recorded")}</div>
      </div>
      <div class="tx-right">
        <div class="tx-amount ${tx.type}">${tx.type === "donation" ? "+" : "-"}${formatINR(tx.amount)}</div>
        <div class="tx-date">${tx.date}</div>
      </div>
    </div>
  `).join("");
}

/** Open modal by id */
function openModal(id) {
  document.getElementById(id).classList.add("show");
}
/** Close modal by id */
function closeModal(id) {
  document.getElementById(id).classList.remove("show");
}

/* ============================================================
   CREATE CAMPAIGN PAGE
   ============================================================ */
function initCreatePage() {
  const user = requireAuth();
  if (!user) return;
  initSidebar("create");

  document.getElementById("backBtn").addEventListener("click", () => history.back());

  document.getElementById("createForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const data = {
      name:        user.name,
      title:       document.getElementById("campTitle").value.trim(),
      category:    document.getElementById("campCategory").value,
      goal:        document.getElementById("campGoal").value,
      description: document.getElementById("campDesc").value.trim()
    };

    if (!data.title || !data.category || !data.goal) {
      showToast("Please fill in all required fields", "error"); return;
    }

    const campaign = DB.addCampaign(data);
    showToast("Campaign created successfully! 🚀", "success");
    setTimeout(() => { window.location.href = `campaign.html?id=${campaign.id}`; }, 800);
  });
}

/* ============================================================
   AUTO-INIT — detect current page and call the right function
   ============================================================ */
document.addEventListener("DOMContentLoaded", function() {
  const path = window.location.pathname.split("/").pop() || "index.html";

  if (path === "login.html" || path === "index.html" || path === "") {
    if (typeof initLoginPage === "function") initLoginPage();
  } else if (path === "dashboard.html") {
    if (typeof initDashboardPage === "function") initDashboardPage();
  } else if (path === "campaign.html") {
    if (typeof initCampaignPage === "function") initCampaignPage();
  } else if (path === "create.html") {
    if (typeof initCreatePage === "function") initCreatePage();
  }
});
