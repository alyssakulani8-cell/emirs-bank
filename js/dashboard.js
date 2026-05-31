
        window.onerror = function(msg, url, line) { try { var d=document.createElement('div');d.style.cssText='position:fixed;top:0;right:0;background:#c00;color:#fff;font-size:12px;padding:4px 8px;z-index:99999;font-family:monospace;max-width:80%';d.textContent='ERROR: '+msg+' (line '+line+')';document.body.appendChild(d); } catch(e) {} };
        try { var d=document.createElement('div');d.id='dbg0';d.style.cssText='position:fixed;top:0;left:0;background:green;color:#fff;font-size:11px;padding:2px 6px;z-index:99999;font-family:monospace';d.textContent='SCRIPT STARTED';document.body.appendChild(d); } catch(e) {}
        var storage = { get: function(k) { try { return localStorage.getItem(k); } catch(e) { return null; } }, set: function(k, v) { try { localStorage.setItem(k, v); } catch(e) {} }, remove: function(k) { try { localStorage.removeItem(k); } catch(e) {} } };
        const CUSTOMER_DB = [
            { account: '****4829', ssn: '1234', dob: '1985-06-15', email: 'john@email.com', name: 'John Smith', initials: 'JS', accounts: [
                { id: 'a1', type: 'Premium Checking', number: '****4829', balance: 12480.50 },
                { id: 'a2', type: 'High-Yield Savings', number: '****2190', balance: 45200.00 },
                { id: 'a3', type: 'Platinum Credit Card', number: '****7712', balance: -2340.00 }
            ], transactions: [
                { desc: 'Salary Deposit', type: 'credit', amount: 5200.00, date: 'Today', icon: 'in' },
                { desc: 'Whole Foods Market', type: 'debit', amount: 87.43, date: 'Today', icon: 'out' },
                { desc: 'Transfer to Savings', type: 'debit', amount: 500.00, date: 'Yesterday', icon: 'transfer' },
                { desc: 'Amazon.com', type: 'debit', amount: 129.99, date: 'Yesterday', icon: 'out' },
                { desc: 'Dividend Payment', type: 'credit', amount: 34.50, date: '2 days ago', icon: 'in' },
                { desc: 'Electric Bill', type: 'debit', amount: 142.00, date: '2 days ago', icon: 'out' },
                { desc: 'Starbucks', type: 'debit', amount: 5.75, date: '3 days ago', icon: 'out' },
                { desc: 'Interest Payment', type: 'credit', amount: 12.84, date: '5 days ago', icon: 'in' },
            ]},
            { account: '****6678', ssn: '5678', dob: '1990-11-22', email: 'sarah@email.com', name: 'Sarah Johnson', initials: 'SJ', accounts: [
                { id: 'b1', type: 'Premium Savings', number: '****6678', balance: 89200.75 },
                { id: 'b2', type: 'Basic Checking', number: '****3345', balance: 3250.00 },
            ], transactions: [
                { desc: 'Paycheck Deposit', type: 'credit', amount: 3800.00, date: 'Today', icon: 'in' },
                { desc: 'Target', type: 'debit', amount: 156.32, date: 'Today', icon: 'out' },
                { desc: 'Auto Transfer to Savings', type: 'debit', amount: 800.00, date: 'Yesterday', icon: 'transfer' },
                { desc: 'Netflix', type: 'debit', amount: 15.99, date: 'Yesterday', icon: 'out' },
                { desc: 'Shell Gas', type: 'debit', amount: 42.50, date: '3 days ago', icon: 'out' },
            ]},
            { account: '****7231', ssn: '9012', dob: '2000-03-08', email: 'mike@email.com', name: 'Michael Chen', initials: 'MC', accounts: [
                { id: 'c1', type: 'Basic Checking', number: '****7231', balance: 8750.00 },
                { id: 'c2', type: 'Student Banking', number: '****8902', balance: 2340.00 },
            ], transactions: [
                { desc: 'Part-time Job Deposit', type: 'credit', amount: 1200.00, date: 'Today', icon: 'in' },
                { desc: 'Campus Dining', type: 'debit', amount: 12.50, date: 'Today', icon: 'out' },
                { desc: 'Textbook Purchase', type: 'debit', amount: 89.99, date: 'Yesterday', icon: 'out' },
                { desc: 'Transfer to Savings', type: 'debit', amount: 200.00, date: 'Yesterday', icon: 'transfer' },
                { desc: 'Spotify', type: 'debit', amount: 9.99, date: '3 days ago', icon: 'out' },
            ]},
        ];

        let enrolledUsers = {};
        try { enrolledUsers = JSON.parse(storage.get('emirs_online_users') || '{}'); } catch(e) { console.warn('parse enrolledUsers:', e); }
        let currentCustomer = null;
        let verifiedCustomer = null;
        let currentView = 'overview';
        let approvedCustomers = [];
        let currentUsername = '';
        let refreshInterval = null;

        let transferType = 'local';

        const CATEGORIES = {
            'food': ['Whole Foods','Starbucks','Coffee','Restaurant','Dining','Campus Dining','Groceries'],
            'transport': ['Shell','Gas','Uber','Lyft','Transport'],
            'bills': ['Electric','Water','Internet','Phone','Netflix','Spotify','Insurance'],
            'shopping': ['Amazon','Target','Walmart','Shopping','Textbook'],
        };

        function categorize(desc) {
            for (let cat in CATEGORIES) {
                if (CATEGORIES[cat].some(k => desc.includes(k))) return cat;
            }
            return 'other';
        }

        function loadApprovedCustomers() { try { approvedCustomers = JSON.parse(storage.get('emirs_customers') || '[]'); } catch(e) { approvedCustomers = []; console.warn('loadApprovedCustomers error:', e); } }
        function getAllCustomers() { loadApprovedCustomers(); return [...CUSTOMER_DB, ...approvedCustomers]; }

        if (typeof sb !== 'undefined') {
          sb.list('customers').then(function(remote) {
            var local = JSON.parse(storage.get('emirs_customers') || '[]');
            var byAcct = {};
            local.forEach(function(c) { byAcct[c.account] = c; });
            remote.forEach(function(c) {
              if (byAcct[c.account]) { Object.assign(byAcct[c.account], c); }
              else { local.push(c); byAcct[c.account] = c; }
            });
            storage.set('emirs_customers', JSON.stringify(local));
            loadApprovedCustomers();
          }).catch(function(e) { console.warn('Supabase customer sync failed:', e); });

          sb.list('enrolled_users').then(function(remote) {
            var local = JSON.parse(storage.get('emirs_online_users') || '{}');
            remote.forEach(function(u) { if (!local[u.username]) { local[u.username] = { password: u.password, account: u.account, transferPin: u.transferPin }; } });
            storage.set('emirs_online_users', JSON.stringify(local));
            enrolledUsers = local;
          }).catch(function(e) { console.warn('Supabase enrolled_users sync failed:', e); });
        }

        function refreshCustomerData() {
            if (!currentCustomer || !currentUsername) return;
            const customers = JSON.parse(storage.get('emirs_customers') || '[]');
            const fresh = customers.find(c => c.account === currentCustomer.account);
            if (fresh) {
                currentCustomer.accounts = fresh.accounts;
                currentCustomer.transactions = fresh.transactions;
            }
            renderAccounts();
            renderRecentTxns();
            renderFullTxns();
            populateTransferAccounts();
            renderInsights();
            renderStatements();
        }

        window.verifyIdentity = function verifyIdentity() {
            try {
              const acct = document.getElementById('enrollAccount').value.trim();
              const ssn = document.getElementById('enrollSsn').value.trim();
              const dob = document.getElementById('enrollDob').value;
              const email = document.getElementById('enrollEmail').value.trim();
              let valid = true;
              if (!acct) { showFieldError('errAccount', 'Account number is required'); valid = false; } else { hideFieldError('errAccount'); }
              if (!ssn || ssn.length !== 4) { showFieldError('errSsn', 'Enter the last 4 digits'); valid = false; } else { hideFieldError('errSsn'); }
              if (!dob) { showFieldError('errDob', 'Date of birth is required'); valid = false; } else { hideFieldError('errDob'); }
              if (!email || !email.includes('@')) { showFieldError('errEmail', 'Valid email is required'); valid = false; } else { hideFieldError('errEmail'); }
              if (!valid) return;
              var allCustomers = getAllCustomers();
              var match = allCustomers.find(function(c) { return c.account === acct && c.ssn === ssn && c.dob === dob && c.email.toLowerCase() === email.toLowerCase(); });
              if (!match) {
                if (typeof sb !== 'undefined') {
                  sb.list('customers').then(function(remote) {
                    var found = remote.find(function(c) { return c.account === acct && c.ssn === ssn && c.dob === dob && c.email.toLowerCase() === email.toLowerCase(); });
                    if (found) {
                      var local = JSON.parse(storage.get('emirs_customers') || '[]');
                      local.push(found);
                      storage.set('emirs_customers', JSON.stringify(local));
                      loadApprovedCustomers();
                      verifiedCustomer = found;
                      document.getElementById('verifySuccess').classList.add('show');
                      document.querySelectorAll('.auth-step').forEach(function(s) { s.classList.remove('active'); });
                      document.getElementById('enrollStep2').classList.add('active');
                      document.querySelectorAll('.step-dot')[0].classList.add('completed');
                      document.querySelectorAll('.step-dot')[1].classList.add('active');
                    } else {
                      showToast('No match found. Check your account number, SSN, DOB and email are exactly correct.', 'error');
                    }
                  }).catch(function() { showToast('Verification service unavailable. Please try again.', 'error'); });
                } else {
                  showToast('We could not verify your information.', 'error');
                }
                return;
              }
              for (let u in enrolledUsers) { if (enrolledUsers[u].account === acct) { showToast('Already enrolled. Please sign in.', 'warning'); return; } }
              verifiedCustomer = match;
              document.getElementById('verifySuccess').classList.add('show');
              document.querySelectorAll('.auth-step').forEach(s => s.classList.remove('active'));
              document.getElementById('enrollStep2').classList.add('active');
              document.querySelectorAll('.step-dot')[0].classList.add('completed');
              document.querySelectorAll('.step-dot')[1].classList.add('active');
            } catch(e) { console.error('verifyIdentity error:', e); showToast('An unexpected error occurred. Please try again.', 'error'); }
        }

        function completeEnrollment() {
            const username = document.getElementById('newUsername').value.trim().toLowerCase();
            const password = document.getElementById('newPassword').value;
            const confirm = document.getElementById('confirmPassword').value;
            const transferPin = document.getElementById('transferPin').value;
            let valid = true;
            if (!username || username.length < 3) { showFieldError('errUsername', 'Username must be at least 3 characters'); valid = false; } else { hideFieldError('errUsername'); }
            if (!password || password.length < 8) { showFieldError('errPassword', 'Password must be at least 8 characters'); valid = false; } else { hideFieldError('errPassword'); }
            if (password !== confirm) { showFieldError('errConfirm', 'Passwords do not match'); valid = false; } else { hideFieldError('errConfirm'); }
            if (!transferPin || transferPin.length !== 4 || !/^\d{4}$/.test(transferPin)) { showFieldError('errTransferPin', 'Enter a valid 4-digit PIN'); valid = false; } else { hideFieldError('errTransferPin'); }
            if (enrolledUsers[username]) { showFieldError('errUsername', 'Username already taken'); valid = false; }
            if (!valid) return;
            enrolledUsers[username] = { password: password, account: verifiedCustomer.account, transferPin: transferPin };
            storage.set('emirs_online_users', JSON.stringify(enrolledUsers));
            sb.upsert('enrolled_users', { username: username, password: password, account: verifiedCustomer.account, transferpin: transferPin }, 'username').catch(function(e) { console.warn('Supabase sync failed:', e); });
            document.querySelectorAll('.auth-step').forEach(s => s.classList.remove('active'));
            document.getElementById('enrollStep3').classList.add('active');
            document.querySelectorAll('.step-dot')[1].classList.add('completed');
            document.querySelectorAll('.step-dot')[2].classList.add('active');
            showToast('Enrollment complete!', 'success');
            launchConfetti();
        }

        function backToStep1() { document.querySelectorAll('.auth-step').forEach(s => s.classList.remove('active')); document.getElementById('enrollStep1').classList.add('active'); document.querySelectorAll('.step-dot').forEach(d => d.classList.remove('active','completed')); document.querySelectorAll('.step-dot')[0].classList.add('active'); }
        function proceedToLogin() { document.getElementById('enrollScreen').style.display='none'; document.getElementById('loginScreen').style.display='flex'; }
        function showLogin() { document.getElementById('enrollScreen').style.display='none'; document.getElementById('loginScreen').style.display='flex'; }
        function showEnrollment() { document.getElementById('loginScreen').style.display='none'; document.getElementById('enrollScreen').style.display='flex'; document.querySelectorAll('.auth-step').forEach(s => s.classList.remove('active')); document.getElementById('enrollStep1').classList.add('active'); document.querySelectorAll('.step-dot').forEach(d => d.classList.remove('active','completed')); document.querySelectorAll('.step-dot')[0].classList.add('active'); }
        function showFieldError(id, msg) { const el=document.getElementById(id); if(el){el.textContent=msg;el.classList.add('show');} }
        function hideFieldError(id) { const el=document.getElementById(id); if(el)el.classList.remove('show'); }

        try { document.getElementById('bankLoginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUser').value.trim().toLowerCase();
            const password = document.getElementById('loginPass').value.trim();
            if (username === 'emirs' && password === 'admin2026') { sessionStorage.setItem('emirs_admin_auth', 'true'); window.location.href = 'admin.html'; return; }
            var user = enrolledUsers[username];
            if (!user || user.password !== password) {
              sb.list('enrolled_users').then(function(rows) {
                var found = rows.find(function(u) { return u.username === username && u.password === password; });
                if (found) {
                  enrolledUsers[username] = { password: found.password, account: found.account, transferPin: found.transferPin };
                  storage.set('emirs_online_users', JSON.stringify(enrolledUsers));
                  loginWithUser(found);
                } else {
                  showToast('Invalid username or password.', 'error');
                }
              }).catch(function() { showToast('Invalid username or password.', 'error'); });
              return;
            }
            loginWithUser(user);
            function loginWithUser(user) {
            const allCustomers = getAllCustomers();
            currentCustomer = allCustomers.find(c => c.account === user.account);
            if (!currentCustomer) { showToast('Account not found.', 'error'); return; }
            currentUsername = username;
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('bankDashboard').style.display = 'flex';
            initDashboard();
            initSessionTimer();
            if (refreshInterval) clearInterval(refreshInterval);
            refreshInterval = setInterval(refreshCustomerData, 15000);
        }); } catch(e) { console.warn('login form init:', e); }

        try { document.getElementById('logoutBank').addEventListener('click', function(e) {
            e.preventDefault(); currentCustomer = null; currentUsername = '';
            if (refreshInterval) { clearInterval(refreshInterval); refreshInterval = null; }
            if (sessionTimer) { clearTimeout(sessionTimer); sessionTimer = null; }
            if (warnTimer) { clearTimeout(warnTimer); warnTimer = null; }
            if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
            document.getElementById('timeoutModal').classList.remove('active');
            document.getElementById('bankDashboard').style.display = 'none';
            document.getElementById('loginScreen').style.display = 'flex';
            document.getElementById('loginUser').value = ''; document.getElementById('loginPass').value = '';
            document.getElementById('cSidebar').classList.remove('open');
            var b = document.getElementById('cSidebarBackdrop');
            if (b) b.style.display = 'none';
        }); } catch(e) { console.warn('logout btn init:', e); }

        try { document.getElementById('cSidebarToggle').addEventListener('click', toggleCustomerSidebar); } catch(e) { console.warn('sidebar toggle init:', e); }

        let cardStatus = {};

        function initDashboard() {
            sb.list('customers').then(function(remote) {
              var local = JSON.parse(storage.get('emirs_customers') || '[]');
              var ids = {};
              local.forEach(function(c) { ids[c.account] = true; });
              remote.forEach(function(c) { if (!ids[c.account]) { local.push(c); ids[c.account] = true; } });
              storage.set('emirs_customers', JSON.stringify(local));
              loadApprovedCustomers();
              refreshCustomerData();
            }).catch(function() { refreshCustomerData(); });
            sb.list('enrolled_users').then(function(remote) {
              var local = JSON.parse(storage.get('emirs_online_users') || '{}');
          remote.forEach(function(u) { if (!local[u.username]) { local[u.username] = { password: u.password, account: u.account, transferPin: u.transferpin || u.transferPin }; } });
              storage.set('emirs_online_users', JSON.stringify(local));
              enrolledUsers = local;
            }).catch(function() {});
            const h = new Date().getHours();
            document.getElementById('welcomeMsg').textContent = (h<12?'Good morning':h<18?'Good afternoon':'Good evening') + ', ' + currentCustomer.name.split(' ')[0] + '!';
            document.getElementById('userNameDisplay').textContent = currentCustomer.name;
            document.getElementById('userAvatar').textContent = currentCustomer.initials;
            document.getElementById('cDate').textContent = new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'});
            renderInsights();
            renderCards();
            renderBeneficiaries();
            renderRecurring();
            renderBudget();
            renderStatements();
            renderProfile();
            navigateView('overview');
        }

        function renderAccounts() {
            document.getElementById('accountsGrid').innerHTML = currentCustomer.accounts.map(a => {
                const frozen = cardStatus[a.id] === 'frozen';
                const target = Math.abs(a.balance);
                return `<div class="account-card ${frozen?'frozen':''}">
                    <div class="acct-type">${a.type} ${frozen?'<span style="color:var(--error);font-size:0.7rem">(Frozen)</span>':''}</div>
                    <div class="acct-number">${a.number}</div>
                    <div class="acct-balance" data-target="${target}">${a.balance<0?'-$':'$'}0.00 <small>${a.balance<0?'outstanding':'balance'}</small></div>
                    <div class="acct-footer">
                        <button onclick="showToast('Viewing ${a.type} activity','info')"><i class="fas fa-list"></i> Activity</button>
                        <button onclick="document.getElementById('fromAccount').value='${a.id}';navigateView('transfer')"><i class="fas fa-arrow-right"></i> Transfer</button>
                        <button class="frozen-btn" onclick="toggleCardFreeze('${a.id}')"><i class="fas ${frozen?'fa-unlock':'fa-snowflake'}"></i> ${frozen?'Unfreeze':'Freeze'}</button>
                    </div>
                </div>`;
            }).join('');
            setTimeout(animateBalances, 50);
        }

        function animateBalances() {
            document.querySelectorAll('.acct-balance[data-target]').forEach(function(el) {
                var target = parseFloat(el.dataset.target);
                var duration = 800, start = performance.now();
                function update(now) {
                    var pct = Math.min((now - start) / duration, 1);
                    var eased = 1 - Math.pow(1 - pct, 3);
                    var current = eased * target;
                    var isNeg = el.textContent.trim().startsWith('-$');
                    el.innerHTML = (isNeg ? '-$' : '$') + current.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}) + ' <small>' + (isNeg ? 'outstanding' : 'balance') + '</small>';
                    if (pct < 1) requestAnimationFrame(update);
                }
                requestAnimationFrame(update);
            });
        }

        function toggleCardFreeze(acctId) {
            if (cardStatus[acctId] === 'frozen') delete cardStatus[acctId];
            else cardStatus[acctId] = 'frozen';
            renderAccounts();
            renderCards();
            showToast(cardStatus[acctId] === 'frozen' ? 'Card frozen' : 'Card unfrozen', 'info');
        }

        function renderInsights() {
            const allTxns = [...(currentCustomer.transactions || [])];
            const credits = allTxns.filter(t => t.type === 'credit');
            const debits = allTxns.filter(t => t.type === 'debit');
            const totalIncome = credits.reduce((s,t) => s + t.amount, 0);
            const totalSpending = debits.reduce((s,t) => s + t.amount, 0);
            const savings = totalIncome - totalSpending;
            const savingsRate = totalIncome > 0 ? (savings / totalIncome * 100) : 0;
            document.getElementById('monthlyIncome').textContent = '$' + totalIncome.toLocaleString();
            document.getElementById('monthlySpending').textContent = '$' + totalSpending.toLocaleString();
            document.getElementById('savingsRate').textContent = savingsRate.toFixed(0) + '%';
            document.getElementById('savingsBar').style.width = Math.min(savingsRate, 100) + '%';
            document.getElementById('netWorth').textContent = '$' + currentCustomer.accounts.reduce((s,a) => s + a.balance, 0).toLocaleString();
            document.getElementById('netWorthBar').style.width = '65%';

            const cats = { food: 0, transport: 0, bills: 0, shopping: 0, other: 0 };
            debits.forEach(t => { const c = categorize(t.desc); cats[c] = (cats[c] || 0) + t.amount; });
            const maxCat = Math.max(...Object.values(cats), 1);
            document.getElementById('insightFood').textContent = '$' + (cats.food || 0).toLocaleString();
            document.getElementById('foodBar').style.width = ((cats.food||0)/maxCat*100)+'%';
            document.getElementById('insightTransport').textContent = '$' + (cats.transport || 0).toLocaleString();
            document.getElementById('transportBar').style.width = ((cats.transport||0)/maxCat*100)+'%';
            document.getElementById('insightBills').textContent = '$' + (cats.bills || 0).toLocaleString();
            document.getElementById('billsBar').style.width = ((cats.bills||0)/maxCat*100)+'%';
            document.getElementById('insightShopping').textContent = '$' + (cats.shopping || 0).toLocaleString();
            document.getElementById('shoppingBar').style.width = ((cats.shopping||0)/maxCat*100)+'%';
        }

        function renderCards() {
            const container = document.getElementById('cardsList');
            if (!container) return;
            container.innerHTML = currentCustomer.accounts.map(a => {
                const frozen = cardStatus[a.id] === 'frozen';
                return `<div style="display:flex;align-items:center;gap:16px;padding:16px;border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:12px">
                    <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,#1a2a4a,#0f1d35);display:flex;align-items:center;justify-content:center;color:var(--accent)"><i class="fas fa-credit-card"></i></div>
                    <div style="flex:1"><strong style="display:block;font-size:0.9rem;color:var(--primary)">${a.type}</strong><small style="color:var(--text-secondary)">${a.number} ${frozen?'Â· <span style="color:var(--error)">Frozen</span>':''}</small></div>
                    <button class="btn btn-sm ${frozen?'btn-success':'btn-outline'}" onclick="toggleCardFreeze('${a.id}')">${frozen?'<i class="fas fa-unlock"></i> Unfreeze':'<i class="fas fa-snowflake"></i> Freeze'}</button>
                    <button class="btn btn-sm btn-outline" onclick="showToast('Card limits coming soon','info')"><i class="fas fa-cog"></i></button>
                </div>`;
            }).join('');
        }

        function renderBeneficiaries() {
            const list = document.getElementById('beneficiariesList');
            if (!list) return;
            let beneficiaries = JSON.parse(storage.get('emirs_beneficiaries_' + currentUsername) || '[]');
            const sel = document.getElementById('toAccountSelect');
            if (sel) {
                sel.innerHTML = '<option value="">Select beneficiary...</option>' + beneficiaries.map(b => `<option value="${b.account}">${b.nickname || b.name} â€” ${b.account}</option>`).join('');
            }
            if (!beneficiaries.length) {
                list.innerHTML = '<div class="empty-state"><i class="fas fa-users"></i><h3>No Beneficiaries</h3><p>Add beneficiaries for quick transfers.</p></div>';
                return;
            }
            list.innerHTML = beneficiaries.map(b => `
                <div class="beneficiary-item">
                    <div class="beneficiary-avatar">${(b.nickname||b.name).charAt(0).toUpperCase()}</div>
                    <div class="beneficiary-info"><strong>${b.nickname || b.name}</strong><small>${b.name} Â· ${b.account}</small></div>
                    <button class="btn btn-sm btn-outline" onclick="removeBeneficiary('${b.account}')"><i class="fas fa-trash"></i></button>
                </div>
            `).join('');
        }

        function showAddBeneficiary() { document.getElementById('beneficiaryModal').classList.add('active'); }
        function closeBeneficiaryModal() { document.getElementById('beneficiaryModal').classList.remove('active'); }

        document.getElementById('beneficiaryForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('benefName').value.trim();
            const account = document.getElementById('benefAccount').value.trim();
            const nickname = document.getElementById('benefNickname').value.trim() || name;
            if (!name || !account) { showToast('Name and account are required', 'error'); return; }
            let beneficiaries = JSON.parse(storage.get('emirs_beneficiaries_' + currentUsername) || '[]');
            if (beneficiaries.find(b => b.account === account)) { showToast('Beneficiary already exists', 'warning'); return; }
            beneficiaries.push({ name, account, nickname });
            storage.set('emirs_beneficiaries_' + currentUsername, JSON.stringify(beneficiaries));
            this.reset();
            closeBeneficiaryModal();
            renderBeneficiaries();
            showToast('Beneficiary added', 'success');
        });

        function removeBeneficiary(account) {
            let beneficiaries = JSON.parse(storage.get('emirs_beneficiaries_' + currentUsername) || '[]');
            beneficiaries = beneficiaries.filter(b => b.account !== account);
            storage.set('emirs_beneficiaries_' + currentUsername, JSON.stringify(beneficiaries));
            renderBeneficiaries();
            showToast('Beneficiary removed', 'info');
        }

        function useBeneficiary(account) {
            if (account) { document.getElementById('toAccount').value = account; lookupRecipient(); }
        }

        function renderRecurring() {
            const list = document.getElementById('recurringList');
            if (!list) return;
            let recurring = JSON.parse(storage.get('emirs_recurring_' + currentUsername) || '[]');
            if (!recurring.length) {
                list.innerHTML = '<div class="empty-state"><i class="fas fa-clock"></i><h3>No Scheduled Transfers</h3><p>Set up recurring transfers from the Transfer page.</p></div>';
                return;
            }
            list.innerHTML = recurring.map(r => `
                <div style="display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--border)">
                    <i class="fas fa-redo" style="color:var(--accent-dark)"></i>
                    <div style="flex:1"><strong style="display:block;font-size:0.85rem">$${r.amount} to ${r.toName}</strong><small style="color:var(--text-secondary)">${r.freq} Â· ${r.count} payments remaining</small></div>
                    <button class="btn btn-sm btn-danger" onclick="cancelRecurring('${r.id}')"><i class="fas fa-times"></i></button>
                </div>
            `).join('');
        }

        function cancelRecurring(id) {
            let recurring = JSON.parse(storage.get('emirs_recurring_' + currentUsername) || '[]');
            recurring = recurring.filter(r => r.id !== id);
            storage.set('emirs_recurring_' + currentUsername, JSON.stringify(recurring));
            renderRecurring();
            showToast('Scheduled transfer cancelled', 'info');
        }

        function renderBudget() {
            const list = document.getElementById('budgetList');
            if (!list) return;
            const budgets = [
                { name: 'Food & Dining', spent: 250, limit: 600, color: 'safe' },
                { name: 'Transportation', spent: 120, limit: 300, color: 'safe' },
                { name: 'Bills & Utilities', spent: 420, limit: 500, color: 'warning' },
                { name: 'Shopping', spent: 180, limit: 400, color: 'safe' },
                { name: 'Entertainment', spent: 85, limit: 200, color: 'safe' },
            ];
            list.innerHTML = budgets.map(b => {
                const pct = Math.min((b.spent / b.limit) * 100, 100);
                const barColor = pct > 90 ? 'danger' : pct > 75 ? 'warning' : 'safe';
                return `<div style="margin-bottom:20px">
                    <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:6px">
                        <span style="font-weight:600;color:var(--primary)">${b.name}</span>
                        <span style="color:var(--text-secondary)">$${b.spent} / $${b.limit}</span>
                    </div>
                    <div class="budget-bar"><div class="fill ${barColor}" style="width:${pct}%"></div></div>
                </div>`;
            }).join('');
        }

        function renderRecentTxns() {
            const all = [...currentCustomer.transactions, ...getPendingTxns()];
            all.sort((a,b) => txnSortValue(b) - txnSortValue(a));
            document.getElementById('recentTxnList').innerHTML = all.slice(0,5).length ? all.slice(0,5).map(t => txnRow(t)).join('') : '<div class="empty-state" style="padding:20px"><i class="fas fa-exchange-alt"></i><h3>No Transactions</h3></div>';
        }

        function txnSortValue(t) {
            if (t._ts) return t._ts;
            const d = t.date;
            const now = Date.now(), day = 86400000;
            if (/^\d{4}-\d{2}-\d{2}/.test(d)) return new Date(d + 'T00:00:00').getTime();
            if (d === 'Just now') return now;
            if (d === 'Today' || d.startsWith('Scheduled ')) return now;
            if (d === 'Yesterday') return now - day;
            const m = d.match(/(\d+)\s+days?\s+ago/);
            if (m) return now - parseInt(m[1]) * day;
            const parsed = new Date(d);
            if (!isNaN(parsed)) return parsed.getTime();
            return 0;
        }

        function getPendingTxns() {
            const all = JSON.parse(storage.get('emirs_pending_transfers') || '[]');
            return all.filter(p => p.fromAccount === currentCustomer.account).map(p => ({
                desc: 'Transfer to ' + p.toName + ' â€” Pending', type: 'debit', amount: p.amount, date: new Date(p.date).toLocaleDateString(), icon: 'pending', _ts: new Date(p.date).getTime()
            }));
        }

        function renderFullTxns(filter) {
            let txns = [...currentCustomer.transactions, ...getPendingTxns()];
            txns.sort((a,b) => txnSortValue(b) - txnSortValue(a));
            if (filter && filter !== 'all') txns = txns.filter(t => t.type === filter);
            const q = (document.getElementById('txnSearch')?.value || '').toLowerCase().trim();
            if (q) txns = txns.filter(t => t.desc.toLowerCase().includes(q) || t.amount.toString().includes(q));
            const container = document.getElementById('fullTxnList');
            container.innerHTML = txns.length ? txns.map(t => txnRow(t)).join('') : '<div class="empty-state" style="padding:20px"><i class="fas fa-exchange-alt"></i><h3>No Transactions</h3></div>';
        }

        function filterCustomerTxns(v) { renderFullTxns(v); }

        function exportUserTxns() {
            const txns = [...currentCustomer.transactions, ...getPendingTxns()];
            txns.sort((a,b) => txnSortValue(b) - txnSortValue(a));
            const rows = [['Description','Type','Amount','Date']];
            txns.forEach(t => rows.push([t.desc, t.type, t.amount.toFixed(2), t.date]));
            const csv = rows.map(r => r.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'transactions_export.csv'; a.click();
            URL.revokeObjectURL(a.href);
            showToast('Transactions exported', 'success');
        }

        function txnRow(t) {
            const iconMap = { in:'arrow-down', out:'arrow-up', transfer:'exchange-alt', pending:'clock' };
            return `<div class="txn-row"><div class="txn-icon ${t.icon}"><i class="fas fa-${iconMap[t.icon]||'exchange-alt'}"></i></div><div class="txn-info"><span>${t.desc}</span><small>${t.date}</small></div><div class="txn-amount ${t.type==='credit'?'credit':'debit'}">${t.type==='credit'?'+':'-'}$${t.amount.toFixed(2)}</div></div>`;
        }

        function populateTransferAccounts() {
            const opts = currentCustomer.accounts.map(a => `<option value="${a.id}">${a.type} â€” ${a.number} ($${a.balance.toLocaleString()})</option>`).join('');
            ['fromAccount','billAccount'].forEach(id => document.getElementById(id).innerHTML = opts);
        }

        function showTransferReceipt(data) {
            document.getElementById('receiptTitle').textContent = data.isRecurring ? 'Recurring Transfer Scheduled' : 'Transfer Initiated';
            document.getElementById('receiptRef').textContent = data.ref;
            document.getElementById('receiptTransferType').textContent = data.transferType === 'international' ? 'International' : 'Local';
            document.getElementById('receiptFrom').innerHTML = data.fromName + '<br><span style="font-size:0.7rem;font-weight:400;color:var(--text-secondary)">' + data.fromAccount + '</span>';
            document.getElementById('receiptTo').innerHTML = data.toName + '<br><span style="font-size:0.7rem;font-weight:400;color:var(--text-secondary)">' + data.toAccount + '</span>';
            document.getElementById('receiptAmount').textContent = '$' + data.amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            document.getElementById('receiptDate').textContent = data.date;
            document.getElementById('receiptStatus').textContent = data.isRecurring ? 'Active' : data.transferType === 'international' ? 'Awaiting SWIFT Processing' : 'Pending Approval';
            document.getElementById('receiptStatus').style.color = data.isRecurring ? 'var(--success)' : data.transferType === 'international' ? 'var(--accent-dark)' : 'var(--warning)';
            const memoEl = document.getElementById('receiptMemo');
            if (data.memo && data.memo !== 'Transfer' && data.memo !== 'International Transfer') {
                memoEl.style.display = 'block';
                document.getElementById('receiptMemoText').textContent = data.memo;
            } else {
                memoEl.style.display = 'none';
            }
            const intlEl = document.getElementById('receiptIntlDetails');
            if (data.transferType === 'international') {
                intlEl.style.display = 'block';
                document.getElementById('receiptBeneficiary').textContent = data.intlRecipientName;
                document.getElementById('receiptSwift').textContent = data.intlSwift;
                document.getElementById('receiptBank').textContent = data.intlBankName;
                document.getElementById('receiptCountry').textContent = data.intlCountry;
                document.getElementById('receiptCurrency').textContent = data.intlCurrency;
            } else {
                intlEl.style.display = 'none';
            }
            document.getElementById('receiptModal').classList.add('active');
        }

        function lookupRecipient() {
            const el = document.getElementById('recipientName');
            const acct = document.getElementById('toAccount').value.trim();
            if (acct.length < 4) { el.innerHTML = ''; return; }
            loadApprovedCustomers();
            const normalized = acct.replace(/[^0-9*]/g, '');
            const found = getAllCustomers().find(c =>
              c.account === acct ||
              c.account.replace(/[^0-9*]/g, '').endsWith(normalized.slice(-4))
            );
            el.innerHTML = found ? '<span style="color:var(--success)"><i class="fas fa-check-circle"></i> ' + found.name + '</span>' : '<span style="color:var(--error)"><i class="fas fa-exclamation-circle"></i> Account not found</span>';
        }

        function switchTransferType(type) {
            transferType = type;
            document.querySelectorAll('.type-option').forEach(function(el) { el.classList.toggle('active', el.dataset.type === type); });
            document.getElementById('localFields').style.display = type === 'local' ? 'block' : 'none';
            document.getElementById('intlFields').style.display = type === 'international' ? 'block' : 'none';
        }

        function closePinModal() { document.getElementById('pinModal').classList.remove('active'); document.getElementById('pinInput').value = ''; updatePinDots(); document.getElementById('pinErrorMsg').style.display = 'none'; pendingTransferData = null; }

        function updatePinDots() {
            var val = document.getElementById('pinInput').value;
            document.querySelectorAll('.pin-dot').forEach(function(dot, i) { dot.classList.toggle('filled', i < val.length); });
        }

        document.getElementById('pinInput').addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
            updatePinDots();
            if (this.value.length === 4) { document.getElementById('pinConfirmBtn').focus(); }
        });

        document.getElementById('pinInput').addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && this.value.length === 4) { verifyPinAndSubmit(); }
        });

        let pendingTransferData = null;

        document.getElementById('transferForm').addEventListener('submit', function(e) {
            e.preventDefault();
            if (this.dataset.submitting === 'true') { showToast('Please wait...', 'info'); return; }
            const fromId = document.getElementById('fromAccount').value;
            const amt = parseFloat(document.getElementById('transferAmount').value);
            const memo = document.getElementById('transferMemo').value || (transferType === 'international' ? 'International Transfer' : 'Transfer');
            const type = document.getElementById('transferType').value;

            if (!fromId) { showToast('Select a source account', 'error'); return; }
            if (isNaN(amt) || amt <= 0) { showToast('Enter a valid amount greater than zero', 'error'); return; }
            const fa = currentCustomer.accounts.find(a => a.id === fromId);
            if (!fa || fa.balance < amt) { showToast('Insufficient funds', 'error'); return; }

            if (transferType === 'local') {
                const toAcct = document.getElementById('toAccount').value.trim();
                if (!toAcct) { showToast('Enter a recipient account number', 'error'); return; }
                if (toAcct === fa.number) { showToast('Cannot transfer to your own account', 'error'); return; }
                loadApprovedCustomers();
                const all = getAllCustomers();
                const recipient = all.find(c => c.account === toAcct);
                if (!recipient) { showToast('Recipient account not found', 'error'); return; }
            } else {
                const intlName = document.getElementById('intlRecipientName').value.trim();
                const intlIban = document.getElementById('intlIban').value.trim();
                const intlSwift = document.getElementById('intlSwift').value.trim();
                const intlBank = document.getElementById('intlBankName').value.trim();
                const intlCountry = document.getElementById('intlCountry').value;
                const intlCurrency = document.getElementById('intlCurrency').value;
                if (!intlName) { showToast('Enter recipient full name', 'error'); return; }
                if (!intlIban) { showToast('Enter recipient IBAN', 'error'); return; }
                if (!intlSwift) { showToast('Enter SWIFT/BIC code', 'error'); return; }
                if (!intlBank) { showToast('Enter bank name', 'error'); return; }
                if (!intlCountry) { showToast('Select country', 'error'); return; }
                if (!intlCurrency) { showToast('Select currency', 'error'); return; }
            }

            if (transferType !== 'local' && type === 'recurring') { showToast('Recurring transfers are only available for local transfers', 'warning'); return; }

            pendingTransferData = { fromId, amt, memo, type };
            document.getElementById('pinInput').value = '';
            updatePinDots();
            document.getElementById('pinErrorMsg').style.display = 'none';
            document.getElementById('pinModal').classList.add('active');
            setTimeout(function() { document.getElementById('pinInput').focus(); }, 100);
        });

        function verifyPinAndSubmit() {
            const pin = document.getElementById('pinInput').value;
            const user = enrolledUsers[currentUsername];
            if (!user || user.transferPin !== pin) {
                document.getElementById('pinErrorMsg').style.display = 'block';
                document.getElementById('pinInput').value = '';
                updatePinDots();
                document.getElementById('pinInput').focus();
                return;
            }
            closePinModal();
            executeTransfer();
        }

        function executeTransfer() {
            const form = document.getElementById('transferForm');
            form.dataset.submitting = 'true';
            const btn = form.querySelector('button[type="submit"]');
            const origHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            btn.disabled = true;

            const { fromId, amt, memo } = pendingTransferData;
            const fa = currentCustomer.accounts.find(a => a.id === fromId);
            const selectedFromAccount = fa;
            const refId = 'TFR-' + Date.now().toString(36).toUpperCase();
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

            fa.balance -= amt;
            currentCustomer.transactions.unshift({ desc: memo || (transferType === 'international' ? 'International Transfer' : 'Transfer'), type: 'debit', amount: amt, date: dateStr, icon: 'out' });
            const allCustomers = JSON.parse(storage.get('emirs_customers') || '[]');
            const custIdx = allCustomers.findIndex(c => c.account === currentCustomer.account);
            if (custIdx >= 0) { allCustomers[custIdx] = currentCustomer; storage.set('emirs_customers', JSON.stringify(allCustomers)); }

            if (transferType === 'local') {
                const toAcct = document.getElementById('toAccount').value.trim();
                const all = getAllCustomers();
                const recipient = all.find(c => c.account === toAcct);
                const pending = JSON.parse(storage.get('emirs_pending_transfers') || '[]');
                pending.push({ id: refId, fromAccount: selectedFromAccount.number, fromAccountId: fromId, fromName: currentCustomer.name, toAccount: toAcct, toName: recipient.name, amount: amt, memo: memo, status: 'pending', date: new Date().toISOString(), transferType: 'local' });
                storage.set('emirs_pending_transfers', JSON.stringify(pending));
                showTransferReceipt({
                    ref: refId, transferType: 'local',
                    fromName: currentCustomer.name, fromAccount: selectedFromAccount.number,
                    toName: recipient.name, toAccount: toAcct,
                    amount: amt, memo: memo, date: dateStr, isRecurring: false
                });
            } else {
                const intlName = document.getElementById('intlRecipientName').value.trim();
                const intlIban = document.getElementById('intlIban').value.trim();
                const intlSwift = document.getElementById('intlSwift').value.trim();
                const intlBank = document.getElementById('intlBankName').value.trim();
                const intlBankAddress = document.getElementById('intlBankAddress').value.trim();
                const intlCountry = document.getElementById('intlCountry').value;
                const intlCurrency = document.getElementById('intlCurrency').value;
                const intlPurpose = document.getElementById('intlPurpose').value;
                const intlFeeOption = document.getElementById('intlFeeOption').value;
                const pending = JSON.parse(storage.get('emirs_pending_transfers') || '[]');
                pending.push({
                    id: refId, fromAccount: selectedFromAccount.number, fromAccountId: fromId,
                    fromName: currentCustomer.name, amount: amt, memo: memo,
                    status: 'pending', date: new Date().toISOString(), transferType: 'international',
                    intlRecipientName: intlName, intlIban: intlIban, intlSwift: intlSwift,
                    intlBankName: intlBank, intlBankAddress: intlBankAddress,
                    intlCountry: intlCountry, intlCurrency: intlCurrency,
                    intlPurpose: intlPurpose, intlFeeOption: intlFeeOption
                });
                storage.set('emirs_pending_transfers', JSON.stringify(pending));
                const countryNames = { US:'United States', GB:'United Kingdom', DE:'Germany', FR:'France', IT:'Italy', ES:'Spain', CA:'Canada', AU:'Australia', JP:'Japan', NG:'Nigeria', GH:'Ghana', KE:'Kenya', ZA:'South Africa', BR:'Brazil', IN:'India' };
                showTransferReceipt({
                    ref: refId, transferType: 'international',
                    fromName: currentCustomer.name, fromAccount: selectedFromAccount.number,
                    toName: intlName + ' (' + intlIban + ')', toAccount: intlSwift + ' Â· ' + intlBank,
                    amount: amt, memo: memo, date: dateStr, isRecurring: false,
                    intlRecipientName: intlName, intlSwift: intlSwift, intlBankName: intlBank,
                    intlCountry: countryNames[intlCountry] || intlCountry, intlCurrency: intlCurrency
                });
            }
            renderAccounts(); renderRecentTxns(); renderFullTxns(); populateTransferAccounts();
            form.reset();
            document.getElementById('recipientName').innerHTML = '';
            document.getElementById('toAccountSelect').selectedIndex = 0;
            document.getElementById('recurringOptions').style.display = 'none';
            if (document.getElementById('intlFields')) {
                document.getElementById('intlFields').querySelectorAll('input, select, textarea').forEach(function(el) {
                    if (el.type !== 'hidden') el.value = '';
                });
            }
            btn.innerHTML = origHtml; btn.disabled = false; delete form.dataset.submitting;
            pendingTransferData = null;
        }

        document.getElementById('transferType').addEventListener('change', function() {
            document.getElementById('recurringOptions').style.display = this.value === 'recurring' ? 'block' : 'none';
        });

        document.getElementById('billForm').addEventListener('submit', function(e) {
            e.preventDefault();
            if (this.dataset.submitting === 'true') { showToast('Please wait...', 'info'); return; }
            this.dataset.submitting = 'true';
            const btn = this.querySelector('button[type="submit"]');
            const origHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            btn.disabled = true;
            const acct = document.getElementById('billAccount').value;
            const payee = document.getElementById('billPayee').value;
            const amt = parseFloat(document.getElementById('billAmount').value);
            const date = document.getElementById('billDate').value;
            const freq = document.getElementById('billFreq').value;
            const done = function() { btn.innerHTML = origHtml; btn.disabled = false; delete this.dataset.submitting; }.bind(this);
            if (!payee) { done(); showToast('Select a payee', 'error'); return; }
            if (isNaN(amt) || amt <= 0) { done(); showToast('Enter a valid amount', 'error'); return; }
            if (!date) { done(); showToast('Select a date', 'error'); return; }
            const fa = currentCustomer.accounts.find(a => a.id === acct);
            if (!fa || fa.balance < amt) { done(); showToast('Insufficient funds', 'error'); return; }
            fa.balance -= amt;
            currentCustomer.transactions.unshift({ desc: 'Bill Pay â€” ' + payee, type: 'debit', amount: amt, date: 'Scheduled ' + date, icon: 'out' });
            if (freq !== 'once') {
                const bills = JSON.parse(storage.get('emirs_recurring_bills') || '[]');
                bills.push({ id: 'BILL-' + Date.now().toString(36).toUpperCase(), payee: payee, amount: amt, freq: freq, nextDate: date, account: currentCustomer.account });
                storage.set('emirs_recurring_bills', JSON.stringify(bills));
            }
            const customers = JSON.parse(storage.get('emirs_customers') || '[]');
            const idx = customers.findIndex(c => c.account === currentCustomer.account);
            if (idx >= 0) { customers[idx] = currentCustomer; storage.set('emirs_customers', JSON.stringify(customers)); }
            renderAccounts(); renderRecentTxns(); renderFullTxns(); populateTransferAccounts();
            this.reset(); document.getElementById('billDate').valueAsDate = new Date();
            done();
            showToast((freq !== 'once' ? 'Recurring ' : '') + 'Payment scheduled for ' + date, 'success');
        });

        function renderStatements() {
            document.getElementById('statementsList').innerHTML = ['May','April','March','February','January'].map((m,i) => `
                <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--border)">
                    <div><strong style="font-size:0.9rem;color:var(--primary)">${m} 2026</strong><p style="font-size:0.78rem;color:var(--text-secondary)">${currentCustomer.accounts.length} accounts</p></div>
                    <button class="btn btn-sm btn-outline" onclick="showToast('Downloading ${m} statement...','info')"><i class="fas fa-download"></i> PDF</button>
                </div>
            `).join('');
        }

        function renderProfile() {
            document.getElementById('profileInfo').innerHTML = `
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:500px">
                    <div><span style="font-size:0.75rem;color:var(--text-secondary)">Name</span><p style="font-weight:600;color:var(--primary)">${currentCustomer.name}</p></div>
                    <div><span style="font-size:0.75rem;color:var(--text-secondary)">Email</span><p style="font-weight:600;color:var(--primary)">${currentCustomer.email || 'N/A'}</p></div>
                    <div><span style="font-size:0.75rem;color:var(--text-secondary)">Member Since</span><p style="font-weight:600;color:var(--primary)">March 2023</p></div>
                    <div><span style="font-size:0.75rem;color:var(--text-secondary)">Online Banking</span><p style="font-weight:600;color:var(--primary)">Active</p></div>
                </div>
                <hr style="border:none;border-top:1px solid var(--border);margin:24px 0">
                <h4 style="font-size:0.9rem;color:var(--primary);margin-bottom:16px">Transfer PIN</h4>
                <div style="max-width:400px;margin-bottom:24px">
                    <div style="display:flex;gap:12px;align-items:flex-end">
                        <div class="form-group" style="flex:1;margin-bottom:0">
                            <label>Change Transfer PIN</label>
                            <input type="password" id="newTransferPin" placeholder="Enter new 4-digit PIN" maxlength="4" style="width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:8px;font-size:0.9rem;font-family:var(--font);letter-spacing:4px;font-weight:700">
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="updateTransferPin()"><i class="fas fa-save"></i> Update</button>
                    </div>
                    <div id="pinUpdateMsg" style="font-size:0.78rem;margin-top:4px;display:none"></div>
                </div>
                <hr style="border:none;border-top:1px solid var(--border);margin:24px 0">
                <h4 style="font-size:0.9rem;color:var(--primary);margin-bottom:16px">Change Password</h4>
                <form id="passwordChangeForm" style="max-width:400px">
                    <div class="form-group"><label>Current Password</label><input type="password" id="pwCurrent" required style="width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:8px;font-size:0.9rem"></div>
                    <div class="form-group"><label>New Password</label><input type="password" id="pwNew" required minlength="8" style="width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:8px;font-size:0.9rem"></div>
                    <div class="form-group"><label>Confirm New Password</label><input type="password" id="pwConfirm" required style="width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:8px;font-size:0.9rem"></div>
                    <button type="submit" class="btn btn-primary btn-sm"><i class="fas fa-save"></i> Update Password</button>
                </form>`;
            const pwForm = document.getElementById('passwordChangeForm');
            if (pwForm) {
                pwForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const current = document.getElementById('pwCurrent').value;
                    const newPw = document.getElementById('pwNew').value;
                    const confirm = document.getElementById('pwConfirm').value;
                    const users = JSON.parse(storage.get('emirs_online_users') || '{}');
                    if (!users[currentUsername] || users[currentUsername].password !== current) {
                        showToast('Current password is incorrect', 'error'); return;
                    }
                    if (newPw.length < 8) { showToast('New password must be at least 8 characters', 'error'); return; }
                    if (newPw !== confirm) { showToast('Passwords do not match', 'error'); return; }
                    users[currentUsername].password = newPw;
                    storage.set('emirs_online_users', JSON.stringify(users));
                    this.reset();
                    showToast('Password updated successfully', 'success');
                });
            }
        }

        function updateTransferPin() {
            const newPin = document.getElementById('newTransferPin').value;
            const msgEl = document.getElementById('pinUpdateMsg');
            if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
                msgEl.style.display = 'block';
                msgEl.style.color = 'var(--error)';
                msgEl.textContent = 'Please enter a valid 4-digit PIN';
                return;
            }
            enrolledUsers[currentUsername].transferPin = newPin;
            storage.set('emirs_online_users', JSON.stringify(enrolledUsers));
            sb.update('enrolled_users', 'username', currentUsername, { transferpin: newPin }).catch(function(e) { console.warn('Supabase PIN sync failed:', e); });
            msgEl.style.display = 'block';
            msgEl.style.color = 'var(--success)';
            msgEl.textContent = 'Transfer PIN updated successfully';
            document.getElementById('newTransferPin').value = '';
            setTimeout(function() { msgEl.style.display = 'none'; }, 3000);
        }

        function toggleCustomerTheme() {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
            storage.set('emirs_theme', isDark ? 'light' : 'dark');
        }

        let sessionTimer = null, warnTimer = null, countdownTimer = null;
        const SESSION_TIMEOUT = 14 * 60 * 1000;
        const WARN_BEFORE = 60;

        function resetSessionTimer() {
            document.getElementById('timeoutModal').classList.remove('active');
            if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
            if (warnTimer) { clearTimeout(warnTimer); }
            if (sessionTimer) { clearTimeout(sessionTimer); }
            warnTimer = setTimeout(showSessionWarning, SESSION_TIMEOUT);
            sessionTimer = setTimeout(logoutSession, SESSION_TIMEOUT + WARN_BEFORE * 1000);
        }

        function showSessionWarning() {
            let remaining = WARN_BEFORE;
            document.getElementById('timeoutCountdown').textContent = remaining;
            document.getElementById('timeoutModal').classList.add('active');
            if (countdownTimer) clearInterval(countdownTimer);
            countdownTimer = setInterval(function() {
                remaining--;
                document.getElementById('timeoutCountdown').textContent = remaining;
                if (remaining <= 0) { clearInterval(countdownTimer); countdownTimer = null; }
            }, 1000);
        }

        function toggleCustomerSidebar() {
            var s = document.getElementById('cSidebar');
            var t = document.getElementById('cSidebarToggle');
            var b = document.getElementById('cSidebarBackdrop');
            var opened = s.classList.toggle('open');
            if (t) t.setAttribute('aria-expanded', opened ? 'true' : 'false');
            if (b) b.style.display = opened ? 'block' : 'none';
        }

        function logoutSession() {
            if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
            if (warnTimer) { clearTimeout(warnTimer); warnTimer = null; }
            if (sessionTimer) { clearTimeout(sessionTimer); sessionTimer = null; }
            document.getElementById('timeoutModal').classList.remove('active');
            showToast('Session expired due to inactivity', 'warning');
            setTimeout(function() { document.getElementById('logoutBank').click(); }, 1500);
        }

        function initSessionTimer() {
            ['click','mousemove','keydown','touchstart','scroll'].forEach(function(evt) {
                var opts = (evt === 'scroll' || evt === 'touchstart') ? { passive: true } : false;
                document.addEventListener(evt, resetSessionTimer, opts);
            });
            resetSessionTimer();
        }

        function launchConfetti() {
            var canvas = document.createElement('canvas');
            canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999';
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            document.body.appendChild(canvas);
            var ctx = canvas.getContext('2d');
            var pieces = [], colors = ['#d4a843','#e8c96a','#059669','#2563eb','#dc2626','#8b5cf6'];
            for (var i = 0; i < 120; i++) {
                pieces.push({
                    x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height,
                    w: Math.random() * 8 + 4, h: Math.random() * 6 + 3,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    vx: (Math.random() - 0.5) * 4, vy: Math.random() * 3 + 2,
                    rot: Math.random() * 360, rv: (Math.random() - 0.5) * 10
                });
            }
            var frames = 0, maxFrames = 180;
            function draw() {
                if (frames++ > maxFrames) { canvas.remove(); return; }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                pieces.forEach(function(p) {
                    p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.rot += p.rv;
                    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
                    ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
                    ctx.restore();
                });
                requestAnimationFrame(draw);
            }
            draw();
        }

        function navigateView(view) {
            currentView = view;
            document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('[data-cview]').forEach(n => n.classList.remove('active'));
            var page = document.getElementById('cview-' + view);
            if (page) page.classList.add('active');
            var nav = document.querySelector('[data-cview="' + view + '"]');
            if (nav) nav.classList.add('active');
            document.getElementById('cPageTitle').textContent = nav ? nav.querySelector('span').textContent : view;
            if (window.innerWidth <= 768) {
                var s = document.getElementById('cSidebar');
                if (s) s.classList.remove('open');
                var t = document.getElementById('cSidebarToggle');
                if (t) t.setAttribute('aria-expanded', 'false');
                var b = document.getElementById('cSidebarBackdrop');
                if (b) b.style.display = 'none';
            }
        }

        document.querySelectorAll('[data-cview]').forEach(el => { el.addEventListener('click', function(e) { e.preventDefault(); navigateView(this.dataset.cview); }); });

        (function() {
            const saved = storage.get('emirs_theme');
            if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
        })();

        const s = document.createElement('style'); s.textContent = '@keyframes slideUp{from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)}}';
        document.head.appendChild(s);

        function showToast(msg, type) {
            const old = document.querySelector('.ctoast'); if (old) old.remove();
            const t = document.createElement('div'); t.className = 'ctoast';
            const c = { success:'#059669', error:'#dc2626', warning:'#d97706', info:'#2563eb' };
            t.style.cssText = 'position:fixed;bottom:24px;right:24px;padding:14px 24px;border-radius:8px;color:white;font-size:0.85rem;font-weight:500;z-index:9999;display:flex;align-items:center;gap:10px;animation:slideUp 0.3s ease;box-shadow:0 10px 30px rgba(0,0,0,0.15);background:'+(c[type]||'#2563eb');
            const icons = { success:'check-circle', error:'times-circle', warning:'exclamation-circle', info:'info-circle' };
            t.innerHTML = '<i class="fas fa-'+(icons[type]||'info-circle')+'"></i> '+msg;
            document.body.appendChild(t);
            setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(100px)'; t.style.transition='all 0.3s ease'; setTimeout(() => t.remove(), 300); }, 3500);
        }

        // Chat support
        try { document.getElementById('chatSend').addEventListener('click', function() {
            const input = document.getElementById('chatInput');
            const msgs = document.getElementById('chatMessages');
            if (!input.value.trim()) return;
            msgs.innerHTML += '<div class="chat-msg user">' + input.value + '</div>';
            input.value = '';
            setTimeout(function() {
                msgs.innerHTML += '<div class="chat-msg bot">Thanks for your message! A representative will be with you shortly. For immediate help, call 1-800-EMIRS-BANK.</div>';
                msgs.scrollTop = msgs.scrollHeight;
            }, 1000);
            msgs.scrollTop = msgs.scrollHeight;
        }); } catch(e) { console.warn('chat init:', e); }
        try { document.getElementById('chatInput').addEventListener('keydown', function(e) { if (e.key === 'Enter') document.getElementById('chatSend').click(); }); } catch(e) { console.warn('chat input init:', e); }
        try {
          var btn = document.getElementById('verifyIdentityBtn');
          if (btn) btn.addEventListener('click', function(e) { if (typeof window.verifyIdentity === 'function') window.verifyIdentity(); else alert('verifyIdentity not loaded yet'); });
        } catch(e) {}
        try {
          var d = document.createElement('div');
          d.id = 'debugStatus';
          d.style.cssText = 'position:fixed;bottom:0;left:0;background:#333;color:#0f0;font-size:11px;padding:2px 6px;z-index:99999;font-family:monospace';
          var txt = 'JS loaded | verify=' + (typeof window.verifyIdentity === 'function' ? 'OK' : 'MISSING');
          txt += ' | sb=' + (typeof sb !== 'undefined' ? 'OK' : 'N/A');
          try { txt += ' | customers=' + (typeof getAllCustomers === 'function' ? getAllCustomers().length : '?'); } catch(e) { txt += ' | customers=ERR'; }
          d.textContent = txt;
          document.body.appendChild(d);
        } catch(e) {}
    
