(function() {
  var storage = {
    get: function(k) { try { return localStorage.getItem(k); } catch(e) { return null; } },
    set: function(k, v) { try { localStorage.setItem(k, v); } catch(e) {} }
  };

  var currentPage = 'dashboard';
  var chartInstance = null;
  var notifications = [];

  var SAMPLE_TRANSACTIONS = [
    { id: 'TXN-001', customer: 'Sarah Johnson', type: 'deposit', amount: 5200.00, account: '****4829', status: 'completed', date: 'Today, 9:32 AM', icon: 'in' },
    { id: 'TXN-002', customer: 'Michael Chen', type: 'withdrawal', amount: 500.00, account: '****2190', status: 'completed', date: 'Today, 9:15 AM', icon: 'out' },
    { id: 'TXN-003', customer: 'Emily Davis', type: 'transfer', amount: 1250.00, account: '****7712', status: 'pending', date: 'Today, 8:45 AM', icon: 'transfer' },
    { id: 'TXN-004', customer: 'James Wilson', type: 'payment', amount: 2340.00, account: '****3345', status: 'flagged', date: 'Yesterday, 4:20 PM', icon: 'out' },
    { id: 'TXN-005', customer: 'Maria Garcia', type: 'deposit', amount: 180.00, account: '****6678', status: 'completed', date: 'Yesterday, 3:10 PM', icon: 'in' },
    { id: 'TXN-006', customer: 'Robert Brown', type: 'withdrawal', amount: 75.50, account: '****8902', status: 'completed', date: 'Yesterday, 2:30 PM', icon: 'out' },
    { id: 'TXN-007', customer: 'Lisa Anderson', type: 'transfer', amount: 3200.00, account: '****7231', status: 'pending', date: 'Yesterday, 1:00 PM', icon: 'transfer' },
    { id: 'TXN-008', customer: 'David Martinez', type: 'deposit', amount: 4500.00, account: '****4829', status: 'completed', date: '2 days ago, 11:20 AM', icon: 'in' },
    { id: 'TXN-009', customer: 'Jennifer Taylor', type: 'payment', amount: 189.99, account: '****2190', status: 'completed', date: '2 days ago, 10:05 AM', icon: 'out' },
    { id: 'TXN-010', customer: 'Thomas Jackson', type: 'withdrawal', amount: 2500.00, account: '****7712', status: 'flagged', date: '2 days ago, 8:30 AM', icon: 'out' },
    { id: 'TXN-011', customer: 'Amanda White', type: 'deposit', amount: 3200.00, account: '****3345', status: 'completed', date: '3 days ago, 3:45 PM', icon: 'in' },
    { id: 'TXN-012', customer: 'Christopher Lee', type: 'transfer', amount: 750.00, account: '****6678', status: 'completed', date: '3 days ago, 1:15 PM', icon: 'transfer' }
  ];

  var SAMPLE_APPLICATIONS = [
    { id: 'APP-482910', name: 'Emily Davis', type: 'account', product: 'Premium Checking', amount: null, status: 'pending', date: '2026-05-28', email: 'emily@email.com', phone: '(404) 555-1212' },
    { id: 'APP-482911', name: 'James Wilson', type: 'loan', product: 'Personal Loan', amount: 15000, status: 'pending', date: '2026-05-27', email: 'james@email.com', phone: '(678) 555-3434' },
    { id: 'APP-482912', name: 'Robert Brown', type: 'credit', product: 'Platinum Credit Card', amount: 10000, status: 'approved', date: '2026-05-26', email: 'robert@email.com', phone: '(770) 555-5656' },
    { id: 'APP-482913', name: 'Lisa Anderson', type: 'mortgage', product: '30-Year Fixed', amount: 350000, status: 'pending', date: '2026-05-25', email: 'lisa@email.com', phone: '(404) 555-7878' },
    { id: 'APP-482914', name: 'David Martinez', type: 'account', product: 'High-Yield Savings', amount: null, status: 'approved', date: '2026-05-24', email: 'david@email.com', phone: '(678) 555-9090' },
    { id: 'APP-482915', name: 'Jennifer Taylor', type: 'loan', product: 'Auto Loan', amount: 28000, status: 'rejected', date: '2026-05-23', email: 'jennifer@email.com', phone: '(770) 555-1111' },
    { id: 'APP-482916', name: 'Thomas Jackson', type: 'credit', product: 'Silver Credit Card', amount: 5000, status: 'pending', date: '2026-05-22', email: 'thomas@email.com', phone: '(404) 555-2222' },
    { id: 'APP-482917', name: 'Amanda White', type: 'account', product: 'Business Checking', amount: null, status: 'pending', date: '2026-05-21', email: 'amanda@email.com', phone: '(678) 555-3333' }
  ];

  var SAMPLE_SUBMISSIONS = [
    { id: 'SUB-001', name: 'Henry Ford', email: 'henry@email.com', subject: 'General Question', message: 'I would like to know about your current CD rates and minimum deposit requirements.', status: 'unread', date: '2026-05-28' },
    { id: 'SUB-002', name: 'Grace Kim', email: 'grace@email.com', subject: 'Technical Support', message: 'I am having trouble logging into my online banking account. The 2FA code is not being sent to my phone.', status: 'unread', date: '2026-05-28' },
    { id: 'SUB-003', name: 'Samuel Adams', email: 'samuel@email.com', subject: 'Lost or Stolen Card', message: 'My debit card was lost yesterday. I need to report it stolen and request a replacement.', status: 'unread', date: '2026-05-27' },
    { id: 'SUB-004', name: 'Diana Prince', email: 'diana@email.com', subject: 'Account Inquiry', message: 'I noticed a charge I do not recognize on my statement from May 15th. Please investigate.', status: 'read', date: '2026-05-26' },
    { id: 'SUB-005', name: 'Bruce Wayne', email: 'bruce@email.com', subject: 'Business Banking', message: 'Our company is looking to open a new business checking account and line of credit. Please reach out.', status: 'unread', date: '2026-05-26' },
    { id: 'SUB-006', name: 'Clark Kent', email: 'clark@email.com', subject: 'Mortgage & Home Loans', message: 'We are first-time home buyers interested in learning about FHA loan options and current rates.', status: 'read', date: '2026-05-25' }
  ];

  var SAMPLE_USERS = [
    { name: 'Sarah Johnson', email: 'sarah@email.com', account: '****4829', balance: 12480.50, status: 'active' },
    { name: 'Michael Chen', email: 'michael@email.com', account: '****2190', balance: 45200.00, status: 'active' },
    { name: 'Emily Davis', email: 'emily@email.com', account: '****7712', balance: 89200.75, status: 'active' },
    { name: 'James Wilson', email: 'james@email.com', account: '****3345', balance: 3250.00, status: 'active' },
    { name: 'Maria Garcia', email: 'maria@email.com', account: '****6678', balance: 2340.00, status: 'frozen' },
    { name: 'Robert Brown', email: 'robert@email.com', account: '****8902', balance: 8750.00, status: 'active' },
    { name: 'Lisa Anderson', email: 'lisa@email.com', account: '****7231', balance: 15750.00, status: 'active' },
    { name: 'David Martinez', email: 'david@email.com', account: '****2191', balance: 62300.00, status: 'active' },
    { name: 'Jennifer Taylor', email: 'jennifer@email.com', account: '****4821', balance: 11890.00, status: 'active' },
    { name: 'Thomas Jackson', email: 'thomas@email.com', account: '****7834', balance: 450.00, status: 'suspended' }
  ];

  var SAMPLE_BRANCHES = [
    { name: 'Main Street Financial Center', address: '245 Main Street, Atlanta, GA 30303', phone: '(404) 555-1000', hours: 'Mon-Fri 9AM-6PM, Sat 10AM-2PM', status: 'open' },
    { name: 'Peachtree Branch', address: '1200 Peachtree St NE, Atlanta, GA 30309', phone: '(404) 555-1001', hours: 'Mon-Fri 8AM-7PM, Sat 9AM-1PM', status: 'open' },
    { name: 'Buckhead Banking Center', address: '3220 Peachtree Rd, Atlanta, GA 30305', phone: '(404) 555-1002', hours: 'Mon-Fri 9AM-6PM', status: 'open' },
    { name: 'Midtown Plaza', address: '98 14th St NE, Atlanta, GA 30309', phone: '(404) 555-1003', hours: 'Mon-Fri 9AM-5PM, Sat 10AM-2PM', status: 'open' },
    { name: 'Airport Location', address: '6000 N Terminal Pkwy, Atlanta, GA 30320', phone: '(404) 555-1004', hours: 'Mon-Sun 7AM-9PM', status: 'open' },
    { name: 'Decatur Community Branch', address: '125 W Trinity Pl, Decatur, GA 30030', phone: '(404) 555-1005', hours: 'Mon-Fri 9AM-5PM', status: 'closed' }
  ];

  var SAMPLE_STAFF = [
    { name: 'Alice Williams', role: 'Branch Manager', email: 'alice.w@emirsbank.com', phone: '(404) 555-2001', department: 'Management' },
    { name: 'Bob Thompson', role: 'Loan Officer', email: 'bob.t@emirsbank.com', phone: '(404) 555-2002', department: 'Lending' },
    { name: 'Carol Martinez', role: 'Customer Service Rep', email: 'carol.m@emirsbank.com', phone: '(404) 555-2003', department: 'Service' },
    { name: 'Daniel Kim', role: 'Financial Advisor', email: 'daniel.k@emirsbank.com', phone: '(404) 555-2004', department: 'Wealth Management' },
    { name: 'Eva Patel', role: 'Operations Manager', email: 'eva.p@emirsbank.com', phone: '(404) 555-2005', department: 'Operations' },
    { name: 'Frank Rivera', role: 'IT Security Specialist', email: 'frank.r@emirsbank.com', phone: '(404) 555-2006', department: 'Technology' },
    { name: 'Grace Okafor', role: 'Compliance Officer', email: 'grace.o@emirsbank.com', phone: '(404) 555-2007', department: 'Compliance' },
    { name: 'Henry Chen', role: 'Teller', email: 'henry.c@emirsbank.com', phone: '(404) 555-2008', department: 'Service' }
  ];

  var SAMPLE_PRODUCTS = [
    { name: 'Premium Checking', type: 'Checking', apy: '0.25%', status: 'active' },
    { name: 'Basic Checking', type: 'Checking', apy: '0.05%', status: 'active' },
    { name: 'High-Yield Savings', type: 'Savings', apy: '4.50%', status: 'active' },
    { name: 'Money Market', type: 'Savings', apy: '3.85%', status: 'active' },
    { name: 'Student Banking', type: 'Checking', apy: '0.10%', status: 'active' },
    { name: 'Business Checking', type: 'Business', apy: '0.15%', status: 'active' },
    { name: '12-Month CD', type: 'CD', apy: '5.10%', status: 'active' },
    { name: 'Platinum Credit Card', type: 'Credit', apy: '18.99%', status: 'active' }
  ];

  var SAMPLE_AUDIT = [
    { timestamp: '2026-05-28 09:32:15', user: 'Super Admin', action: 'Login', details: 'Admin login from IP 192.168.1.100', ip: '192.168.1.100' },
    { timestamp: '2026-05-28 09:30:00', user: 'Super Admin', action: 'Approve', details: 'Approved application APP-482912', ip: '192.168.1.100' },
    { timestamp: '2026-05-28 08:45:22', user: 'Super Admin', action: 'View', details: 'Viewed transaction TXN-004', ip: '192.168.1.100' },
    { timestamp: '2026-05-27 16:20:10', user: 'Super Admin', action: 'Update', details: 'Updated user profile for Sarah Johnson', ip: '192.168.1.100' },
    { timestamp: '2026-05-27 14:15:33', user: 'Super Admin', action: 'Export', details: 'Exported transactions report (CSV)', ip: '192.168.1.100' },
    { timestamp: '2026-05-27 11:05:45', user: 'Super Admin', action: 'Reject', details: 'Rejected application APP-482915', ip: '192.168.1.100' },
    { timestamp: '2026-05-26 15:30:00', user: 'Super Admin', action: 'Create', details: 'Created new staff account for Henry Chen', ip: '192.168.1.100' },
    { timestamp: '2026-05-26 10:00:12', user: 'Super Admin', action: 'Settings', details: 'Updated system security settings', ip: '192.168.1.100' }
  ];

  function initTheme() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var saved = storage.get('emirs_theme');
    if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    btn.innerHTML = saved === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    btn.addEventListener('click', function() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
      storage.set('emirs_theme', isDark ? 'light' : 'dark');
      this.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    });
  }

  function initDate() {
    var el = document.getElementById('currentDate');
    if (el) el.textContent = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  function initSidebar() {
    var toggle = document.getElementById('sidebarToggle');
    var backdrop = document.getElementById('sidebarBackdrop');
    var sidebar = document.getElementById('sidebar');
    if (toggle) {
      toggle.addEventListener('click', function() {
        var opened = sidebar.classList.toggle('open');
        this.setAttribute('aria-expanded', opened ? 'true' : 'false');
        if (backdrop) backdrop.style.display = opened ? 'block' : 'none';
      });
    }
    if (backdrop) {
      backdrop.addEventListener('click', function() {
        sidebar.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
        this.style.display = 'none';
      });
    }
  }

  function navigateTo(page) {
    currentPage = page;
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    var target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    var nav = document.querySelector('.nav-item[data-page="' + page + '"]');
    if (nav) nav.classList.add('active');
    var title = document.getElementById('pageTitle');
    var subtitle = document.getElementById('pageSubtitle');
    var titles = {
      dashboard: ['Dashboard', 'Overview of your banking operations'],
      transactions: ['Transactions', 'Monitor and manage all transactions'],
      applications: ['Applications', 'Review and process applications'],
      submissions: ['Submissions', 'Customer inquiries and messages'],
      users: ['User Management', 'Manage customer accounts'],
      branches: ['Branches', 'Manage branch locations'],
      staff: ['Staff', 'Manage bank employees'],
      cms: ['Content CMS', 'Manage website content'],
      products: ['Products', 'Manage banking products'],
      settings: ['Settings', 'System configuration'],
      audit: ['Audit Log', 'Security and activity log']
    };
    if (title && titles[page]) title.textContent = titles[page][0];
    if (subtitle && titles[page]) subtitle.textContent = titles[page][1];
    if (page === 'transactions') renderTransactions();
    if (page === 'applications') renderApplications();
    if (page === 'submissions') renderSubmissions();
    if (page === 'users') renderUsers();
    if (page === 'branches') renderBranches();
    if (page === 'staff') renderStaff();
    if (page === 'products') renderProducts();
    if (page === 'audit') renderAudit();
    if (window.innerWidth <= 768) {
      var s = document.getElementById('sidebar');
      if (s) s.classList.remove('open');
      var b = document.getElementById('sidebarBackdrop');
      if (b) b.style.display = 'none';
    }
  }

  document.querySelectorAll('.nav-item[data-page]').forEach(function(el) {
    el.addEventListener('click', function(e) { e.preventDefault(); navigateTo(this.dataset.page); });
  });

  window.navigateTo = navigateTo;

  function initDashboard() {
    renderRecentTransactions();
    renderPendingApprovals();
    renderChart('deposits');
    initChartTabs();
  }

  function renderRecentTransactions() {
    var tbody = document.getElementById('recentTransactions');
    if (!tbody) return;
    tbody.innerHTML = SAMPLE_TRANSACTIONS.slice(0, 6).map(function(t) {
      var statusClass = t.status === 'completed' ? 'badge-success' : t.status === 'pending' ? 'badge-warning' : 'badge-danger';
      return '<tr><td>' + t.customer + '</td><td>$' + t.amount.toFixed(2) + '</td><td><span class="badge ' + statusClass + '">' + t.status + '</span></td><td style="color:var(--text-secondary)">' + t.date + '</td></tr>';
    }).join('');
  }

  function renderPendingApprovals() {
    var container = document.getElementById('pendingApprovals');
    if (!container) return;
    var pending = SAMPLE_APPLICATIONS.filter(function(a) { return a.status === 'pending'; });
    container.innerHTML = pending.length ? pending.map(function(a) {
      return '<div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="viewApplicationDetail(\'' + a.id + '\')">' +
        '<div style="width:36px;height:36px;border-radius:50%;background:rgba(212,168,67,0.1);display:flex;align-items:center;justify-content:center;color:var(--accent-dark)"><i class="fas fa-file-alt"></i></div>' +
        '<div style="flex:1"><strong style="font-size:0.82rem;color:var(--primary)">' + a.name + '</strong><p style="font-size:0.72rem;color:var(--text-secondary)">' + a.product + '</p></div>' +
        '<span style="font-size:0.72rem;color:var(--text-secondary)">' + a.date + '</span></div>';
    }).join('') : '<div class="empty-state"><p>No pending approvals</p></div>';
  }

  function initChartTabs() {
    document.querySelectorAll('.chart-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        document.querySelectorAll('.chart-tab').forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');
        renderChart(this.dataset.chart);
      });
    });
  }

  function renderChart(type) {
    var container = document.getElementById('activityChart');
    if (!container) return;
    if (typeof Chart === 'undefined') {
      container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-secondary)"><i class="fas fa-spinner fa-spin" style="margin-right:8px"></i> Loading chart...</div>';
      loadChartJS(function() { renderChart(type); });
      return;
    }
    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
    var labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var datasets = {
      deposits: { label: 'Deposits ($K)', color: '#059669', data: [128, 195, 142, 210, 178, 89, 65] },
      withdrawals: { label: 'Withdrawals ($K)', color: '#dc2626', data: [85, 120, 95, 140, 110, 55, 40] },
      loans: { label: 'Loans ($K)', color: '#2563eb', data: [45, 72, 38, 95, 62, 28, 15] }
    };
    var ds = datasets[type] || datasets.deposits;
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var textColor = isDark ? '#94a3b8' : '#64748b';
    var gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

    chartInstance = new Chart(container, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: ds.label,
          data: ds.data,
          backgroundColor: ds.color + '33',
          borderColor: ds.color,
          borderWidth: 2,
          borderRadius: 6,
          barPercentage: 0.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 11 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { size: 11 } }
          }
        }
      }
    });
  }

  function loadChartJS(callback) {
    if (typeof Chart !== 'undefined') { if (callback) callback(); return; }
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
    script.onload = function() { if (callback) callback(); };
    document.head.appendChild(script);
  }

  function renderTransactions() {
    var tbody = document.getElementById('transactionsBody');
    if (!tbody) return;
    renderFilteredTransactions();
    var checkboxes = tbody.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function(cb) {
      cb.addEventListener('change', function() { updateBatchToolbar(); });
    });
  }

  function renderFilteredTransactions() {
    var tbody = document.getElementById('transactionsBody');
    var filter = document.getElementById('txnFilter')?.value || 'all';
    var typeFilter = document.getElementById('txnType')?.value || 'all';
    if (!tbody) return;
    var filtered = SAMPLE_TRANSACTIONS.filter(function(t) {
      if (filter !== 'all' && t.status !== filter) return false;
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      return true;
    });
    tbody.innerHTML = filtered.map(function(t) {
      var statusClass = t.status === 'completed' ? 'badge-success' : t.status === 'pending' ? 'badge-warning' : 'badge-danger';
      return '<tr>' +
        '<td><input type="checkbox" class="txn-check" value="' + t.id + '"></td>' +
        '<td style="font-family:monospace;font-size:0.78rem">' + t.id + '</td>' +
        '<td>' + t.customer + '</td>' +
        '<td><span style="text-transform:capitalize">' + t.type + '</span></td>' +
        '<td><strong>$' + t.amount.toFixed(2) + '</strong></td>' +
        '<td style="font-family:monospace;font-size:0.78rem">' + t.account + '</td>' +
        '<td><span class="badge ' + statusClass + '">' + t.status + '</span></td>' +
        '<td style="color:var(--text-secondary);font-size:0.78rem">' + t.date + '</td>' +
        '<td><button class="btn btn-sm btn-ghost" onclick="showToast(\'Viewing ' + t.id + '\',\'info\')"><i class="fas fa-eye"></i></button></td>' +
        '</tr>';
    }).join('');
    updateBatchToolbar();
  }

  function updateBatchToolbar() {
    var toolbar = document.getElementById('batchToolbar');
    var count = document.getElementById('batchCount');
    if (!toolbar || !count) return;
    var checked = document.querySelectorAll('.txn-check:checked').length;
    toolbar.classList.toggle('show', checked > 0);
    count.textContent = checked + ' selected';
  }

  window.exportCSV = function() {
    var rows = [['ID','Customer','Type','Amount','Account','Status','Date']];
    SAMPLE_TRANSACTIONS.forEach(function(t) { rows.push([t.id, t.customer, t.type, t.amount.toFixed(2), t.account, t.status, t.date]); });
    downloadCSV(rows, 'transactions_export.csv');
    showToast('Transactions exported', 'success');
  };

  window.refreshTransactions = function() {
    renderFilteredTransactions();
    showToast('Transactions refreshed', 'success');
  };

  window.batchApprove = function() {
    showToast('Selected transactions approved', 'success');
    document.querySelectorAll('.txn-check:checked').forEach(function(cb) { cb.checked = false; });
    updateBatchToolbar();
  };

  window.batchReject = function() {
    showToast('Selected transactions rejected', 'error');
    document.querySelectorAll('.txn-check:checked').forEach(function(cb) { cb.checked = false; });
    updateBatchToolbar();
  };

  function renderApplications() {
    var container = document.getElementById('applicationsList');
    if (!container) return;
    var filter = document.getElementById('appFilter')?.value || 'all';
    var type = document.getElementById('appType')?.value || 'all';
    var localApps = JSON.parse(storage.get('emirs_applications') || '[]');

    if (typeof sb !== 'undefined') {
      sb.list('applications').then(function(remoteApps) {
        var merged = mergeAppArrays(localApps, remoteApps);
        renderAppList(container, merged, filter, type);
      }).catch(function() {
        renderAppList(container, localApps, filter, type);
      });
    } else {
      renderAppList(container, localApps, filter, type);
    }
  }

  function mergeAppArrays(local, remote) {
    var map = {};
    local.forEach(function(a) { map[a.id] = a; });
    remote.forEach(function(a) { if (!map[a.id]) map[a.id] = a; });
    return Object.keys(map).map(function(k) { return map[k]; });
  }

  function renderAppList(container, apps, filter, type) {
    var allApps = SAMPLE_APPLICATIONS.concat(apps.map(function(a) { return { id: a.id, name: a.name, type: 'account', product: a.product || a.accountType, amount: null, status: a.status, date: a.date, email: a.email, phone: a.phone }; }));
    var filtered = allApps.filter(function(a) {
      if (filter !== 'all' && a.status !== filter) return false;
      if (type !== 'all' && a.type !== type) return false;
      return true;
    });
    var pending = filtered.filter(function(a) { return a.status === 'pending'; }).length;
    var countEl = document.getElementById('appCount');
    if (countEl) countEl.textContent = pending + ' pending';
    container.innerHTML = filtered.length ? filtered.map(function(a) {
      var statusClass = a.status === 'approved' ? 'badge-success' : a.status === 'rejected' ? 'badge-danger' : 'badge-warning';
      return '<div class="application-item" onclick="viewApplicationDetail(\'' + a.id + '\')">' +
        '<div class="app-icon"><i class="fas fa-file-alt"></i></div>' +
        '<div class="app-info"><h4>' + a.name + '</h4><p>' + a.product + ' · ' + a.date + '</p></div>' +
        '<span class="badge ' + statusClass + ' app-status">' + a.status + '</span>' +
        '</div>';
    }).join('') : '<div class="empty-state"><i class="fas fa-inbox"></i><h3>No Applications</h3><p>No applications match the current filters.</p></div>';
  }

  document.getElementById('appFilter')?.addEventListener('change', renderApplications);
  document.getElementById('appType')?.addEventListener('change', renderApplications);

  window.viewApplicationDetail = function(id) {
    var modal = document.getElementById('appDetailModal');
    var body = document.getElementById('appDetailBody');
    var footer = document.getElementById('appDetailFooter');
    var localStorageApps = JSON.parse(storage.get('emirs_applications') || '[]');
    var sampleApp = SAMPLE_APPLICATIONS.find(function(a) { return a.id === id; });
    var localApp = localStorageApps.find(function(a) { return a.id === id; });
    var isSample = !!sampleApp;
    if (sampleApp) { showAppDetailInModal(sampleApp, !isSample); return; }
    if (localApp) { showAppDetailInModal(localApp, true); return; }
    if (typeof sb !== 'undefined') {
      sb.getById('applications', 'id', id).then(function(remoteApp) {
        if (remoteApp) { showAppDetailInModal(remoteApp, true); }
        else { showToast('Application not found', 'error'); }
      }).catch(function() { showToast('Application not found', 'error'); });
    } else { showToast('Application not found', 'error'); }
  };

  function showAppDetailInModal(app, showActions) {
    var modal = document.getElementById('appDetailModal');
    var body = document.getElementById('appDetailBody');
    var footer = document.getElementById('appDetailFooter');
    var isPending = app.status === 'pending';
    var isAccountType = app.type === 'account' || app.type === 'Account Opening' || app.type.indexOf('Account') !== -1;

    var initialDeposit = app.initialDeposit || app.initialdeposit;
    var idType = app.idType || app.idtype;
    var idNumber = app.idNumber || app.idnumber;

    var html = '';
    html += '<div class="detail-row"><span class="detail-label">Application ID</span><span class="detail-value" style="font-family:monospace">' + app.id + '</span></div>';
    html += '<div class="detail-row"><span class="detail-label">Applicant</span><span class="detail-value">' + app.name + '</span></div>';
    html += '<div class="detail-row"><span class="detail-label">Product</span><span class="detail-value">' + app.product + '</span></div>';
    html += '<div class="detail-row"><span class="detail-label">Type</span><span class="detail-value" style="text-transform:capitalize">' + app.type + '</span></div>';
    if (initialDeposit && parseFloat(initialDeposit) > 0) {
      html += '<div class="detail-row"><span class="detail-label">Initial Deposit</span><span class="detail-value">$' + parseFloat(initialDeposit).toLocaleString(undefined, {minimumFractionDigits:2}) + '</span></div>';
    }
    if (app.amount) {
      html += '<div class="detail-row"><span class="detail-label">Amount</span><span class="detail-value">$' + app.amount.toLocaleString() + '</span></div>';
    }
    html += '<div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">' + app.date + '</span></div>';
    html += '<div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="badge ' + (app.status === 'approved' ? 'badge-success' : app.status === 'rejected' ? 'badge-danger' : 'badge-warning') + '">' + app.status + '</span></span></div>';
    var allocatedAcct = app.accountNumber || app.accountnumber;
    if (allocatedAcct) {
      html += '<div class="detail-row"><span class="detail-label">Account Number</span><span class="detail-value" style="font-family:monospace;color:var(--success);font-weight:700">' + allocatedAcct + '</span></div>';
    }
    html += '<hr style="border:none;border-top:1px solid var(--border);margin:12px 0">';

    if (app.email) html += '<div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">' + app.email + '</span></div>';
    if (app.phone) html += '<div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">' + app.phone + '</span></div>';
    if (app.dob) html += '<div class="detail-row"><span class="detail-label">Date of Birth</span><span class="detail-value">' + app.dob + '</span></div>';
    if (app.ssn) html += '<div class="detail-row"><span class="detail-label">SSN</span><span class="detail-value">' + app.ssn + '</span></div>';
    if (idType && idNumber) html += '<div class="detail-row"><span class="detail-label">ID</span><span class="detail-value">' + idType + ' — ' + idNumber + '</span></div>';

    if (isPending && isAccountType && showActions) {
      html += '<hr style="border:none;border-top:1px solid var(--border);margin:12px 0">';
      html += '<div style="margin-top:12px">';
      html += '<label style="display:block;font-size:0.82rem;font-weight:600;color:var(--primary);margin-bottom:6px">Allocate Account Number</label>';
      html += '<div style="display:flex;gap:8px;align-items:center">';
      html += '<input type="text" id="allocAccountNum" placeholder="e.g. ****7834 or generate" style="flex:1;padding:10px 14px;border:1.5px solid var(--border);border-radius:8px;font-size:0.9rem;font-family:monospace">';
      html += '<button class="btn btn-sm btn-outline" onclick="generateAccountNumber()" style="white-space:nowrap"><i class="fas fa-sync"></i> Generate</button>';
      html += '</div>';
      html += '<div style="font-size:0.72rem;color:var(--text-muted);margin-top:4px">Enter a masked account number (e.g. ****4829) or click Generate</div>';
      html += '</div>';
    }

    body.innerHTML = html;
    modal.dataset.appId = app.id;
    modal.dataset.appData = JSON.stringify(app);

    if (isPending && showActions) {
      footer.style.display = 'flex';
    } else {
      footer.style.display = 'none';
    }

    modal.classList.add('active');
  };

  window.generateAccountNumber = function() {
    var num = '10' + String(Math.floor(100000 + Math.random() * 900000));
    document.getElementById('allocAccountNum').value = num;
  };

  window.approveApplication = function() {
    var modal = document.getElementById('appDetailModal');
    var app = JSON.parse(modal.dataset.appData || 'null');
    if (!app || !app.id) { showToast('No application selected', 'error'); return; }
    if (app.status !== 'pending') { showToast('Application already ' + app.status, 'warning'); return; }

    var isAccountType = app.type === 'account' || app.type === 'Account Opening' || app.type.indexOf('Account') !== -1;
    var accountNumber = '';

    if (isAccountType) {
      accountNumber = (document.getElementById('allocAccountNum') || {}).value || '';
      if (!accountNumber) { showToast('Please allocate an account number or click Generate', 'error'); return; }
      if (accountNumber.length < 4) { showToast('Account number must be at least 4 characters', 'error'); return; }

      var existingCusts = JSON.parse(storage.get('emirs_customers') || '[]');
      var initials = app.name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase() || 'NA';
      var deposit = parseFloat(app.initialDeposit || app.initialdeposit) || 0;

      var customer = {
        account: accountNumber,
        ssn: app.ssn ? app.ssn.replace(/\D/g, '').slice(-4) : '0000',
        dob: app.dob || '',
        email: app.email || '',
        name: app.name,
        initials: initials,
        accounts: [{
          id: 'acct_' + Date.now().toString(36),
          type: app.product || 'Checking',
          number: accountNumber,
          balance: deposit
        }],
        transactions: []
      };

      if (deposit > 0) {
        customer.transactions.push({
          desc: 'Initial Deposit',
          type: 'credit',
          amount: deposit,
          date: new Date().toISOString().split('T')[0],
          icon: 'in'
        });
      }

      existingCusts.push(customer);
      storage.set('emirs_customers', JSON.stringify(existingCusts));
      if (typeof sb !== 'undefined') sb.insert('customers', customer).catch(function(e) { console.warn('Supabase customer insert failed:', e); });
      app.accountNumber = accountNumber;
    }

    app.status = 'approved';
    var localApps = JSON.parse(storage.get('emirs_applications') || '[]');
    var idx = localApps.findIndex(function(a) { return a.id === app.id; });
    if (idx !== -1) { localApps[idx] = app; }
    else { localApps.push(app); }
    storage.set('emirs_applications', JSON.stringify(localApps));
    if (typeof sb !== 'undefined') sb.update('applications', 'id', app.id, { status: 'approved' }).catch(function(e) { console.warn('Supabase update failed:', e); });

    closeModal('appDetailModal');
    renderApplications();
    renderPendingApprovals();

    var msg = isAccountType ? ' approved. Account: ' + accountNumber : ' approved.';
    addNotification('Application Approved', app.name + '\'s application' + msg, 'success');
    showToast(app.name + '\'s application' + msg, 'success');
  };

  window.rejectApplication = function() {
    var modal = document.getElementById('appDetailModal');
    var app = JSON.parse(modal.dataset.appData || 'null');
    if (!app || !app.id) { showToast('No application selected', 'error'); return; }
    if (app.status !== 'pending') { showToast('Application already ' + app.status, 'warning'); return; }

    app.status = 'rejected';
    var localApps = JSON.parse(storage.get('emirs_applications') || '[]');
    var idx = localApps.findIndex(function(a) { return a.id === app.id; });
    if (idx !== -1) { localApps[idx] = app; }
    else { localApps.push(app); }
    storage.set('emirs_applications', JSON.stringify(localApps));
    if (typeof sb !== 'undefined') sb.update('applications', 'id', app.id, { status: 'rejected' }).catch(function(e) { console.warn('Supabase update failed:', e); });

    closeModal('appDetailModal');
    renderApplications();
    renderPendingApprovals();
    addNotification('Application Rejected', app.name + '\'s application was rejected.', 'error');
    showToast(app.name + '\'s application rejected.', 'warning');
  };

  function renderSubmissions() {
    var container = document.getElementById('submissionsList');
    if (!container) return;
    var filter = document.getElementById('subFilter')?.value || 'all';
    var localSubs = JSON.parse(storage.get('emirs_contact_submissions') || '[]').map(function(s, i) {
      return { id: 'SUB-LOCAL-' + i, name: s.name, email: s.email, subject: s.subject, message: s.message, status: s.responded ? 'read' : 'unread', date: s.date ? s.date.split('T')[0] : new Date().toISOString().split('T')[0] };
    });

    if (typeof sb !== 'undefined') {
      sb.list('contact_submissions').then(function(remoteSubs) {
        var remoteMapped = remoteSubs.map(function(s) {
          return { id: 'SUB-REMOTE-' + s.id, name: s.name, email: s.email, subject: s.subject, message: s.message, status: s.responded ? 'read' : 'unread', date: s.date ? s.date.split('T')[0] : '', _responded: s.responded, _remoteId: s.id };
        });
        renderSubList(container, SAMPLE_SUBMISSIONS.concat(localSubs).concat(remoteMapped), filter);
      }).catch(function() {
        renderSubList(container, SAMPLE_SUBMISSIONS.concat(localSubs), filter);
      });
    } else {
      renderSubList(container, SAMPLE_SUBMISSIONS.concat(localSubs), filter);
    }
  }

  function renderSubList(container, allSubs, filter) {
    var filtered = filter === 'all' ? allSubs : allSubs.filter(function(s) { return s.status === filter; });
    var unread = filtered.filter(function(s) { return s.status === 'unread'; }).length;
    var countEl = document.getElementById('subCount');
    if (countEl) countEl.textContent = unread + ' unread';
    container.innerHTML = filtered.length ? filtered.map(function(s) {
      return '<div class="application-item ' + (s.status === 'unread' ? 'unread' : '') + '" onclick="viewSubmissionDetail(\'' + s.id + '\')">' +
        '<div class="app-icon" style="background:rgba(37,99,235,0.1);color:#2563eb"><i class="fas fa-envelope"></i></div>' +
        '<div class="app-info"><h4>' + s.name + '</h4><p>' + s.subject + ' · ' + s.date + '</p></div>' +
        '<span class="badge ' + (s.status === 'unread' ? 'badge-warning' : 'badge-neutral') + '">' + s.status + '</span></div>';
    }).join('') : '<div class="empty-state"><i class="fas fa-inbox"></i><h3>No Submissions</h3><p>No customer submissions found.</p></div>';
  }

  document.getElementById('subFilter')?.addEventListener('change', renderSubmissions);

  window.viewSubmissionDetail = function(id) {
    if (id.indexOf('SUB-REMOTE-') === 0) {
      var remoteId = parseInt(id.replace('SUB-REMOTE-', ''));
      if (typeof sb !== 'undefined') {
        sb.getById('contact_submissions', 'id', remoteId).then(function(sub) {
          if (!sub) { showToast('Submission not found', 'error'); return; }
          showSubDetail(sub.name, sub.email, sub.subject, sub.message, sub.date, id);
        }).catch(function() { showToast('Submission not found', 'error'); });
      } else { showToast('Submission not found', 'error'); }
      return;
    }
    var localSubs = JSON.parse(storage.get('emirs_contact_submissions') || '[]').map(function(s, i) {
      return { id: 'SUB-LOCAL-' + i, name: s.name, email: s.email, subject: s.subject, message: s.message, status: s.responded ? 'read' : 'unread', date: s.date ? s.date.split('T')[0] : '' };
    });
    var allSubs = SAMPLE_SUBMISSIONS.concat(localSubs);
    var sub = allSubs.find(function(s) { return s.id === id; });
    if (!sub) { showToast('Submission not found', 'error'); return; }
    showSubDetail(sub.name, sub.email, sub.subject, sub.message, sub.date, id);
  };

  function showSubDetail(name, email, subject, message, date, id) {
    var body = document.getElementById('subDetailBody');
    if (body) {
      body.innerHTML = '<div class="detail-row"><span class="detail-label">From</span><span class="detail-value">' + name + ' (' + email + ')</span></div>' +
        '<div class="detail-row"><span class="detail-label">Subject</span><span class="detail-value">' + subject + '</span></div>' +
        '<div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">' + date + '</span></div>' +
        '<div style="margin-top:16px;padding:16px;background:var(--bg);border-radius:8px"><p style="font-size:0.85rem;color:var(--primary);line-height:1.7">' + message + '</p></div>';
    }
    var subModal = document.getElementById('subDetailModal');
    if (subModal) subModal.dataset.subId = id;
    if (subModal) subModal.classList.add('active');
  }

  window.markResponded = function() {
    var modal = document.getElementById('subDetailModal');
    var id = modal ? modal.dataset.subId : '';
    if (id && id.indexOf('SUB-REMOTE-') === 0) {
      var remoteId = parseInt(id.replace('SUB-REMOTE-', ''));
      if (typeof sb !== 'undefined') {
        sb.update('contact_submissions', 'id', remoteId, { responded: true }).catch(function(e) { console.warn('Supabase update failed:', e); });
      }
    }
    showToast('Marked as responded', 'success');
    closeModal('subDetailModal');
    renderSubmissions();
  };

  function getAllCustomers(callback) {
    var local = JSON.parse(storage.get('emirs_customers') || '[]');
    var all = local.map(function(c) { return { _source: 'local', _key: c.account || c.email, _name: c.name, _raw: c }; });

    callback(all);
    if (typeof sb === 'undefined') return;
    sb.list('customers').then(function(remote) {
      remote.forEach(function(r) {
        var key = r.account || r.email || r.name;
        if (!all.some(function(a) { return a._key === key; })) {
          all.push({ _source: 'remote', _key: key, _name: r.name, _raw: r });
        }
      });
      callback(all);
    }).catch(function() { /* remote sync failed, local data already shown */ });
  }

  var SAMPLE_STATUSES = ['active', 'active', 'active', 'active', 'frozen', 'active', 'active', 'active', 'active', 'suspended'];

  function renderUsers() {
    var tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    var q = (document.getElementById('userSearch')?.value || '').toLowerCase();

    getAllCustomers(function(customers) {
      var toRender = customers.length ? customers : SAMPLE_USERS.map(function(u, i) {
        return { _source: 'sample', _key: u.account, _name: u.name, _raw: u };
      });
      var filtered = q ? toRender.filter(function(u) {
        return (u._name || '').toLowerCase().includes(q) || ((u._raw.email || '') + (u._raw.account || '')).toLowerCase().includes(q);
      }) : toRender;

      tbody.innerHTML = filtered.map(function(u, idx) {
        var raw = u._raw;
        var name = raw.name || raw.Name || 'Unknown';
        var email = raw.email || raw.Email || '';
        var accountNum = raw.account || (raw.accounts && raw.accounts[0] && raw.accounts[0].number) || raw.accountNumber || '';
        var balance = 0;
        if (raw.accounts && raw.accounts[0]) { balance = parseFloat(raw.accounts[0].balance) || 0; }
        else if (typeof raw.balance === 'number') { balance = raw.balance; }
        var status = raw.status || SAMPLE_STATUSES[idx % SAMPLE_STATUSES.length] || 'active';
        var statusClass = status === 'active' ? 'badge-success' : status === 'frozen' ? 'badge-warning' : 'badge-danger';
        return '<tr>' +
          '<td><strong>' + name + '</strong></td>' +
          '<td style="color:var(--text-secondary)">' + email + '</td>' +
          '<td style="font-family:monospace">' + accountNum + '</td>' +
          '<td><strong>$' + balance.toLocaleString(undefined, {minimumFractionDigits:2}) + '</strong></td>' +
          '<td><span class="badge ' + statusClass + '">' + status + '</span></td>' +
          '<td><button class="btn btn-sm btn-ghost" onclick="viewCustomerDetail(\'' + u._key.replace(/'/g, "\\'") + '\')"><i class="fas fa-eye"></i></button></td></tr>';
      }).join('');
    });
  }

  window.filterUsers = renderUsers;
  document.getElementById('userSearch')?.addEventListener('input', renderUsers);

  window.viewCustomerDetail = function(key) {
    getAllCustomers(function(customers) {
      var entry = customers.find(function(c) { return c._key === key; });
      var raw = entry ? entry._raw : SAMPLE_USERS.find(function(u) { return u.account === key || u.name === key; });
      if (!raw) { showToast('Customer not found', 'error'); return; }

      var name = raw.name || raw.Name || 'Unknown';
      var email = raw.email || raw.Email || 'N/A';
      var accountNum = raw.account || (raw.accounts && raw.accounts[0] && raw.accounts[0].number) || raw.accountNumber || 'N/A';
      var balance = 0;
      if (raw.accounts && raw.accounts[0]) { balance = parseFloat(raw.accounts[0].balance) || 0; }
      else if (typeof raw.balance === 'number') { balance = raw.balance; }
      var ssn = raw.ssn || raw.SSN || 'N/A';
      var dob = raw.dob || raw.DOB || raw.dateOfBirth || 'N/A';
      var status = raw.status || 'active';

      var body = document.getElementById('customerDetailBody');
      if (body) {
        body.innerHTML =
          '<div class="detail-row"><span class="detail-label">Name</span><span class="detail-value">' + name + '</span></div>' +
          '<div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">' + email + '</span></div>' +
          '<div class="detail-row"><span class="detail-label">Account Number</span><span class="detail-value" style="font-family:monospace">' + accountNum + '</span></div>' +
          '<div class="detail-row"><span class="detail-label">Balance</span><span class="detail-value">$' + balance.toLocaleString(undefined, {minimumFractionDigits:2}) + '</span></div>' +
          '<div class="detail-row"><span class="detail-label">SSN</span><span class="detail-value">' + ssn + '</span></div>' +
          '<div class="detail-row"><span class="detail-label">Date of Birth</span><span class="detail-value">' + dob + '</span></div>' +
          '<div class="detail-row"><span class="detail-label">Status</span><span class="detail-value"><span class="badge badge-' + (status === 'active' ? 'success' : 'warning') + '">' + status + '</span></span></div>' +
          (raw.accounts && raw.accounts.length > 1 ? '<div class="detail-row"><span class="detail-label">Other Accounts</span><span class="detail-value">' + raw.accounts.slice(1).map(function(a) { return a.number + ' ($' + (parseFloat(a.balance) || 0).toLocaleString() + ')'; }).join(', ') + '</span></div>' : '') +
          '<div class="detail-row"><span class="detail-label">Approved On</span><span class="detail-value">' + new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + '</span></div>';
      }
      document.getElementById('customerDetailModal')?.classList.add('active');
    });
  };

  window.showAddUser = function() { showToast('Add user feature coming soon', 'info'); };

  function renderBranches() {
    var grid = document.getElementById('branchesGrid');
    if (!grid) return;
    grid.innerHTML = SAMPLE_BRANCHES.map(function(b) {
      return '<div class="branch-card">' +
        '<h4>' + b.name + '</h4>' +
        '<p><i class="fas fa-map-pin" style="color:var(--accent-dark);width:16px"></i> ' + b.address + '</p>' +
        '<p><i class="fas fa-phone" style="color:var(--accent-dark);width:16px"></i> ' + b.phone + '</p>' +
        '<p><i class="fas fa-clock" style="color:var(--accent-dark);width:16px"></i> ' + b.hours + '</p>' +
        '<span class="badge ' + (b.status === 'open' ? 'badge-success' : 'badge-danger') + ' branch-status">' + (b.status === 'open' ? 'Open' : 'Closed') + '</span>' +
        '</div>';
    }).join('');
  }

  window.showAddBranch = function() { showToast('Add branch feature coming soon', 'info'); };

  function renderStaff() {
    var container = document.getElementById('staffList');
    if (!container) return;
    var q = (document.getElementById('staffSearch')?.value || '').toLowerCase();
    var filtered = q ? SAMPLE_STAFF.filter(function(s) { return s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q); }) : SAMPLE_STAFF;
    container.innerHTML = '<div class="staff-grid">' + filtered.map(function(s) {
      var initials = s.name.split(' ').map(function(n) { return n[0]; }).join('');
      return '<div class="staff-card">' +
        '<div class="staff-avatar">' + initials + '</div>' +
        '<div><strong style="font-size:0.88rem;color:var(--primary)">' + s.name + '</strong>' +
        '<p style="font-size:0.78rem;color:var(--text-secondary)">' + s.role + ' · ' + s.department + '</p>' +
        '<p style="font-size:0.75rem;color:var(--text-muted)">' + s.email + ' · ' + s.phone + '</p></div></div>';
    }).join('') + '</div>';
  }

  window.filterStaff = renderStaff;
  document.getElementById('staffSearch')?.addEventListener('input', renderStaff);
  window.showAddStaff = function() { showToast('Add staff feature coming soon', 'info'); };

  function renderProducts() {
    var tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    tbody.innerHTML = SAMPLE_PRODUCTS.map(function(p) {
      return '<tr><td><strong>' + p.name + '</strong></td><td>' + p.type + '</td><td>' + p.apy + '</td>' +
        '<td><span class="badge badge-success">' + p.status + '</span></td>' +
        '<td><button class="btn btn-sm btn-ghost"><i class="fas fa-edit"></i></button></td></tr>';
    }).join('');
  }

  window.showAddProduct = function() { showToast('Add product feature coming soon', 'info'); };

  function renderAudit() {
    var tbody = document.getElementById('auditLogBody');
    if (!tbody) return;
    tbody.innerHTML = SAMPLE_AUDIT.map(function(a) {
      return '<tr><td style="font-size:0.78rem;white-space:nowrap">' + a.timestamp + '</td>' +
        '<td>' + a.user + '</td>' +
        '<td><span class="badge badge-info">' + a.action + '</span></td>' +
        '<td style="color:var(--text-secondary);font-size:0.8rem">' + a.details + '</td>' +
        '<td style="font-family:monospace;font-size:0.78rem;color:var(--text-muted)">' + a.ip + '</td></tr>';
    }).join('');
  }

  window.refreshAudit = function() { renderAudit(); showToast('Audit log refreshed', 'success'); };

  window.saveAllContent = function() {
    var fields = document.querySelectorAll('.cms-fields input, .cms-fields textarea');
    var data = {};
    fields.forEach(function(f) { data[f.id] = f.value; });
    storage.set('emirs_cms_content', JSON.stringify(data));
    showToast('All content saved successfully!', 'success');
  };

  window.closeModal = function(id) { document.getElementById(id)?.classList.remove('active'); };

  document.querySelectorAll('.modal-overlay').forEach(function(m) {
    m.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('active'); });
  });

  window.toggleSidebar = function() {
    var s = document.getElementById('sidebar');
    var t = document.getElementById('sidebarToggle');
    var b = document.getElementById('sidebarBackdrop');
    var opened = s.classList.toggle('open');
    if (t) t.setAttribute('aria-expanded', opened ? 'true' : 'false');
    if (b) b.style.display = opened ? 'block' : 'none';
  };

  function initSearch() {
    var input = document.getElementById('globalSearch');
    var suggestions = document.getElementById('searchSuggestions');
    if (!input || !suggestions) return;
    var allItems = [
      ...SAMPLE_USERS.map(function(u) { return { label: u.name + ' — ' + u.account, type: 'Customer' }; }),
      ...SAMPLE_TRANSACTIONS.map(function(t) { return { label: t.id + ' — ' + t.customer, type: 'Transaction' }; }),
      ...SAMPLE_APPLICATIONS.map(function(a) { return { label: a.id + ' — ' + a.name, type: 'Application' }; })
    ];
    input.addEventListener('input', function() {
      var q = this.value.toLowerCase().trim();
      if (q.length < 2) { suggestions.classList.remove('show'); return; }
      var matches = allItems.filter(function(item) { return item.label.toLowerCase().includes(q); }).slice(0, 6);
      if (!matches.length) { suggestions.classList.remove('show'); return; }
      suggestions.innerHTML = matches.map(function(m) {
        return '<div class="suggestion-item" onclick="showToast(\'Searching for ' + m.label + '\',\'info\');document.getElementById(\'globalSearch\').value=\'' + m.label.replace(/'/g, "\\'") + '\';document.getElementById(\'searchSuggestions\').classList.remove(\'show\')">' +
          '<span>' + m.label + '</span> <small style="color:var(--text-muted)">' + m.type + '</small></div>';
      }).join('');
      suggestions.classList.add('show');
    });
    document.addEventListener('click', function(e) {
      if (!input.contains(e.target) && !suggestions.contains(e.target)) suggestions.classList.remove('show');
    });
  }

  function initNotifications() {
    var btn = document.getElementById('notifBtn');
    var panel = document.getElementById('notifPanel');
    if (!btn || !panel) return;
    btn.addEventListener('click', function() { panel.classList.toggle('open'); });

    notifications = [
      { title: 'New Application', desc: 'Emily Davis submitted a Premium Checking application', time: '5 min ago', type: 'info' },
      { title: 'Flagged Transaction', desc: 'TXN-004 flagged for manual review ($2,340.00)', time: '1 hour ago', type: 'warning' },
      { title: 'New Contact Submission', desc: 'Henry Ford sent a general inquiry', time: '2 hours ago', type: 'info' },
      { title: 'System Update', desc: 'Security patch applied successfully', time: '1 day ago', type: 'success' }
    ];
    renderNotifications();
  }

  function renderNotifications() {
    var list = document.getElementById('notifList');
    if (!list) return;
    list.innerHTML = notifications.map(function(n, i) {
      return '<div class="notif-item' + (i < 2 ? ' unread' : '') + '">' +
        '<div class="notif-title">' + n.title + '</div>' +
        '<div class="notif-desc">' + n.desc + '</div>' +
        '<div class="notif-time">' + n.time + '</div></div>';
    }).join('');
  }

  window.clearNotifs = function() {
    notifications = [];
    renderNotifications();
    showToast('Notifications cleared', 'info');
  };

  function addNotification(title, desc, type) {
    notifications.unshift({ title: title, desc: desc, time: 'Just now', type: type || 'info' });
    renderNotifications();
  }

  function showToast(message, type) {
    var container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.className = 'toast ' + (type || 'info');
    var icons = { success: 'check-circle', error: 'times-circle', warning: 'exclamation-circle', info: 'info-circle' };
    toast.innerHTML = '<i class="fas fa-' + (icons[type] || icons.info) + '"></i> ' + message;
    container.appendChild(toast);
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(function() { toast.remove(); }, 300);
    }, 3500);
  }

  function downloadCSV(rows, filename) {
    var csv = rows.map(function(r) { return r.map(function(c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','); }).join('\n');
    var blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
    URL.revokeObjectURL(blob);
  }

  function safeInit(name, fn) {
    try { fn(); } catch(e) { console.warn('admin: ' + name + ' failed:', e); }
  }

  function init() {
    safeInit('theme', initTheme);
    safeInit('date', initDate);
    safeInit('sidebar', initSidebar);
    safeInit('dashboard', initDashboard);
    safeInit('search', initSearch);
    safeInit('notifications', initNotifications);
    navigateTo('dashboard');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
