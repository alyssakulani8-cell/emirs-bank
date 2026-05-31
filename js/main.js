(function() {
  var storage = {
    get: function(k) { try { return localStorage.getItem(k); } catch(e) { return null; } },
    set: function(k, v) { try { localStorage.setItem(k, v); } catch(e) {} }
  };

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

  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('navMenu');
    if (!hamburger || !navMenu) return;
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('open');
      this.setAttribute('aria-expanded', this.classList.contains('active') ? 'true' : 'false');
    });
    document.querySelectorAll('.dropdown > a').forEach(function(link) {
      link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          this.parentElement.classList.toggle('open');
        }
      });
    });
  }

  function initNavbarScroll() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }, { passive: true });
  }

  function initMortgageCalculator() {
    var amountInput = document.getElementById('calcAmount');
    var rateInput = document.getElementById('calcRate');
    var termSelect = document.getElementById('calcTerm');
    var resultEl = document.getElementById('calcResult');
    var amountLabel = document.getElementById('calcAmountLabel');
    var rateLabel = document.getElementById('calcRateLabel');
    if (!amountInput || !rateInput || !termSelect || !resultEl) return;

    function formatMoney(v) { return '$' + Math.round(v).toLocaleString(); }

    function calculate() {
      var P = parseFloat(amountInput.value);
      var annualRate = parseFloat(rateInput.value);
      var years = parseInt(termSelect.value);
      amountLabel.textContent = formatMoney(P);
      rateLabel.textContent = annualRate + '%';
      if (annualRate === 0) { resultEl.textContent = formatMoney(P / (years * 12)); return; }
      var r = (annualRate / 100) / 12;
      var n = years * 12;
      var payment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      resultEl.textContent = formatMoney(payment);
    }

    amountInput.addEventListener('input', calculate);
    rateInput.addEventListener('input', calculate);
    termSelect.addEventListener('change', calculate);
    calculate();
  }

  function initTestimonialCarousel() {
    var carousel = document.getElementById('testimonialCarousel');
    var dotsContainer = document.getElementById('testimonialDots');
    if (!carousel || !dotsContainer) return;
    var cards = carousel.querySelectorAll('.testimonial-card');
    if (cards.length < 2) return;
    var current = 0;
    var timer;

    cards.forEach(function(card) { card.style.minWidth = '100%'; });

    function createDots() {
      dotsContainer.innerHTML = '';
      cards.forEach(function(_, i) {
        var dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
        dot.addEventListener('click', function() { goTo(i); resetTimer(); });
        dotsContainer.appendChild(dot);
      });
    }

    function goTo(idx) {
      current = idx;
      carousel.style.transform = 'translateX(-' + (current * 100) + '%)';
      carousel.style.transition = 'transform 0.5s ease';
      dotsContainer.querySelectorAll('.testimonial-dot').forEach(function(d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    function next() { goTo((current + 1) % cards.length); }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, 5000);
    }

    createDots();
    resetTimer();
  }

  function initCounters() {
    var counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    function animateCounter(el) {
      var target = parseFloat(el.getAttribute('data-target'));
      if (!target || target === 0) return;
      var duration = 2000;
      var start = performance.now();
      var suffixEl = el.nextElementSibling;
      var isDecimal = target % 1 !== 0;

      function update(now) {
        var pct = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - pct, 3);
        var current = eased * target;
        el.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
        if (pct < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function(c) { observer.observe(c); });
  }

  function initParticles() {
    var container = document.getElementById('particles');
    if (!container) return;
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    container.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var particles = [];
    var w, h;

    function resize() {
      w = canvas.width = container.offsetWidth;
      h = canvas.height = container.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (var i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1, a: Math.random() * 0.4 + 0.1
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function(p) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212,168,67,' + p.a + ')';
        ctx.fill();
      });
      particles.forEach(function(p, i) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = p.x - particles[j].x;
          var dy = p.y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(212,168,67,' + (0.06 * (1 - dist / 150)) + ')';
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

  function initCookieConsent() {
    var consent = document.getElementById('cookieConsent');
    if (!consent) return;
    if (storage.get('emirs_cookie')) { consent.classList.add('hidden'); return; }
    document.getElementById('cookieAccept').addEventListener('click', function() {
      storage.set('emirs_cookie', 'accepted');
      consent.classList.add('hidden');
    });
    document.getElementById('cookieDecline').addEventListener('click', function() {
      storage.set('emirs_cookie', 'declined');
      consent.classList.add('hidden');
    });
  }

  function initChat() {
    var toggle = document.getElementById('chatToggle');
    var close = document.getElementById('chatClose');
    var chatWindow = document.getElementById('chatWindow');
    var send = document.getElementById('chatSend');
    var input = document.getElementById('chatInput');
    var msgs = document.getElementById('chatMessages');
    if (!toggle || !chatWindow) return;

    if (toggle) toggle.addEventListener('click', function() {
      chatWindow.classList.toggle('open');
      var badge = this.querySelector('.badge');
      if (badge) badge.style.display = 'none';
    });

    if (close) close.addEventListener('click', function() { chatWindow.classList.remove('open'); });

    if (send && input && msgs) {
      function sendMsg() {
        if (!input.value.trim()) return;
        msgs.innerHTML += '<div class="chat-msg user">' + input.value.replace(/</g,'&lt;') + '</div>';
        input.value = '';
        msgs.scrollTop = msgs.scrollHeight;
        setTimeout(function() {
          var responses = [
            "Thanks for reaching out! A team member will respond shortly.",
            "Great question! For immediate assistance, call 1-800-EMIRS-BANK.",
            "I'd be happy to help! Let me connect you with a specialist.",
            "Thank you for contacting Emirs Bank. We'll get back to you soon.",
            "For security purposes, please avoid sharing sensitive information in chat."
          ];
          msgs.innerHTML += '<div class="chat-msg bot">' + responses[Math.floor(Math.random() * responses.length)] + '</div>';
          msgs.scrollTop = msgs.scrollHeight;
        }, 1000);
      }
      send.addEventListener('click', sendMsg);
      input.addEventListener('keydown', function(e) { if (e.key === 'Enter') sendMsg(); });
    }
  }

  function initContactModal() {
    var triggers = document.querySelectorAll('.contact-trigger');
    var modal = document.getElementById('contactModal');
    var form = document.getElementById('contactForm');
    if (!modal || !form) return;

    triggers.forEach(function(t) {
      t.addEventListener('click', function(e) {
        e.preventDefault();
        var subject = this.getAttribute('data-subject') || '';
        var sel = document.getElementById('contactSubject');
        if (sel && subject) { for (var i = 0; i < sel.options.length; i++) { if (sel.options[i].value === subject) { sel.selectedIndex = i; break; } } }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    modal.querySelector('.modal-close').addEventListener('click', function() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
    modal.addEventListener('click', function(e) {
      if (e.target === modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var data = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value,
        date: new Date().toISOString()
      };
      var submissions = JSON.parse(storage.get('emirs_contact_submissions') || '[]');
      submissions.push(data);
      storage.set('emirs_contact_submissions', JSON.stringify(submissions));
      showToast('Message sent successfully! We\'ll respond within 24 hours.', 'success');
      this.reset();
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  function initLoginModal() {
    var triggers = document.querySelectorAll('.login-trigger');
    var modal = document.getElementById('loginModal');
    var form = document.getElementById('loginForm');
    if (!modal || !form) return;

    triggers.forEach(function(t) {
      t.addEventListener('click', function(e) {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    modal.querySelector('.modal-close').addEventListener('click', function() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
    modal.addEventListener('click', function(e) {
      if (e.target === modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
    });

    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var user = document.getElementById('username').value.trim();
      var pass = document.getElementById('password').value.trim();
      if (user === 'emirs' && pass === 'admin2026') { sessionStorage.setItem('emirs_admin_auth', 'true'); window.location.href = 'admin.html'; return; }
      var users = JSON.parse(storage.get('emirs_online_users') || '{}');
      if (users[user] && users[user].password === pass) { window.location.href = 'dashboard.html'; return; }
      showToast('Invalid username or password.', 'error');
    });
  }

  function initNewsletter() {
    var form = document.getElementById('newsletterForm');
    if (!form) return;
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      var email = this.querySelector('input[type="email"]').value;
      var subs = JSON.parse(storage.get('emirs_newsletter_subs') || '[]');
      subs.push({ email: email, date: new Date().toISOString() });
      storage.set('emirs_newsletter_subs', JSON.stringify(subs));
      showToast('Thank you for subscribing!', 'success');
      this.reset();
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
      a.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
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

  function initApplyPage() {
    if (!document.getElementById('applicationForm')) return;

    var STEPS = 4;
    var currentStep = 1;

    window.nextStep = function(step) {
      if (!validateStep(currentStep)) return;
      switchStep(step);
      if (step === 4) buildReview();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.prevStep = function(step) {
      switchStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    function switchStep(step) {
      document.querySelectorAll('.step-content').forEach(function(el) { el.classList.remove('active'); });
      document.querySelectorAll('.progress-step').forEach(function(el) {
        el.classList.remove('active');
        el.classList.remove('completed');
      });
      var content = document.querySelector('.step-content[data-step="' + step + '"]');
      var progress = document.querySelector('.progress-step[data-step="' + step + '"]');
      if (content) content.classList.add('active');
      if (progress) progress.classList.add('active');
      for (var i = 1; i < step; i++) {
        var p = document.querySelector('.progress-step[data-step="' + i + '"]');
        if (p) p.classList.add('completed');
      }
      currentStep = step;
    }

    function validateStep(step) {
      var container = document.querySelector('.step-content[data-step="' + step + '"]');
      if (!container) return true;
      var inputs = container.querySelectorAll('[required]');
      var valid = true;
      inputs.forEach(function(input) {
        var parent = input.parentElement;
        var errorEl = parent.querySelector('.error-msg');
        if (!errorEl) {
          errorEl = document.createElement('div');
          errorEl.className = 'error-msg';
          parent.appendChild(errorEl);
        }
        if (input.type === 'checkbox') {
          if (!input.checked) {
            errorEl.textContent = 'You must agree to continue';
            errorEl.classList.add('show');
            valid = false;
          } else { errorEl.classList.remove('show'); }
        } else if (!input.value.trim()) {
          input.classList.add('error');
          errorEl.textContent = 'This field is required';
          errorEl.classList.add('show');
          valid = false;
        } else {
          input.classList.remove('error');
          errorEl.classList.remove('show');
          if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
            input.classList.add('error');
            errorEl.textContent = 'Enter a valid email';
            errorEl.classList.add('show');
            valid = false;
          }
        }
      });
      if (!valid) showToast('Please complete all required fields.', 'error');
      return valid;
    }

    function buildReview() {
      var fields = [
        ['First Name', document.getElementById('firstName')?.value || ''],
        ['Last Name', document.getElementById('lastName')?.value || ''],
        ['Email', document.getElementById('email')?.value || ''],
        ['Phone', document.getElementById('phone')?.value || ''],
        ['Date of Birth', document.getElementById('dob')?.value || ''],
        ['Account Type', document.getElementById('accountType')?.value || ''],
        ['Initial Deposit', '$' + (parseFloat(document.getElementById('initialDeposit')?.value) || 0).toLocaleString()],
        ['Address', (document.getElementById('address')?.value || '') + (document.getElementById('apt')?.value ? ', ' + document.getElementById('apt').value : '')],
        ['City', document.getElementById('city')?.value || ''],
        ['State', (function(){ var s = document.getElementById('state'); return s ? s.options[s.selectedIndex]?.text || '' : ''; })()],
        ['ZIP Code', document.getElementById('zip')?.value || ''],
        ['Employment', (function(){ var s = document.getElementById('employmentStatus'); return s ? s.options[s.selectedIndex]?.text || '' : ''; })()],
        ['Annual Income', '$' + (parseFloat(document.getElementById('annualIncome')?.value) || 0).toLocaleString()],
        ['ID Type', document.getElementById('idType')?.value || ''],
        ['ID Number', document.getElementById('idNumber')?.value || '']
      ];
      var review = document.getElementById('reviewContent');
      if (review) {
        review.innerHTML = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
          fields.map(function(f) {
            return '<div><span style="font-size:0.75rem;color:var(--text-secondary)">' + f[0] + '</span><p style="font-size:0.9rem;font-weight:500;color:var(--primary)">' + (f[1] || '<span style="color:var(--text-muted)">Not provided</span>') + '</p></div>';
          }).join('') + '</div>';
      }
    }

    var form = document.getElementById('applicationForm');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validateStep(4)) return;
        var agree = document.getElementById('agreeTerms');
        if (agree && !agree.checked) { showToast('Please agree to the Terms & Conditions.', 'error'); return; }
        var ssnEl = document.getElementById('ssn');
        var app = {
          id: 'APP-' + String(Date.now()).slice(-6),
          name: (document.getElementById('firstName')?.value || '') + ' ' + (document.getElementById('lastName')?.value || ''),
          type: 'Account Opening', status: 'pending',
          date: new Date().toISOString().split('T')[0],
          email: document.getElementById('email')?.value || '',
          phone: document.getElementById('phone')?.value || '',
          product: document.getElementById('accountType')?.value || '',
          initialDeposit: document.getElementById('initialDeposit')?.value || '0',
          ssn: '***-**-' + (ssnEl ? ssnEl.value.replace(/\D/g, '').slice(-4) : ''),
          dob: document.getElementById('dob')?.value || '',
          idType: document.getElementById('idType')?.value || '',
          idNumber: document.getElementById('idNumber')?.value || '',
          source: 'website'
        };
        var existing = JSON.parse(storage.get('emirs_applications') || '[]');
        existing.push(app);
        storage.set('emirs_applications', JSON.stringify(existing));
        var refEl = document.getElementById('appRef');
        if (refEl) refEl.textContent = app.id;
        var progress = document.querySelector('.apply-progress');
        if (progress) progress.style.display = 'none';
        if (form) form.style.display = 'none';
        var success = document.getElementById('successMessage');
        if (success) success.style.display = 'block';
        showToast('Application submitted successfully!', 'success');
      });
    }

    var ssnInput = document.getElementById('ssn');
    if (ssnInput) {
      ssnInput.addEventListener('input', function() {
        var v = this.value.replace(/[^0-9]/g, '');
        if (v.length > 3 && v.length <= 5) v = v.slice(0,3) + '-' + v.slice(3);
        else if (v.length > 5) v = v.slice(0,3) + '-' + v.slice(3,5) + '-' + v.slice(5,9);
        this.value = v;
      });
    }

    var phoneInput = document.getElementById('phone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function() {
        var v = this.value.replace(/[^0-9]/g, '');
        if (v.length > 3 && v.length <= 6) v = '(' + v.slice(0,3) + ') ' + v.slice(3);
        else if (v.length > 6) v = '(' + v.slice(0,3) + ') ' + v.slice(3,6) + '-' + v.slice(6,10);
        this.value = v;
      });
    }

    var zipInput = document.getElementById('zip');
    if (zipInput) {
      zipInput.addEventListener('input', function() { this.value = this.value.replace(/[^0-9]/g, '').slice(0,5); });
    }

    var uploadZone = document.querySelector('.upload-zone');
    var uploadPreview = document.querySelector('.upload-preview');
    if (uploadZone) {
      var fileInput = uploadZone.querySelector('input[type="file"]');
      uploadZone.addEventListener('click', function() { if (fileInput) fileInput.click(); });
      uploadZone.addEventListener('dragover', function(e) { e.preventDefault(); this.style.borderColor = 'var(--accent)'; });
      uploadZone.addEventListener('dragleave', function() { this.style.borderColor = ''; });
      uploadZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '';
        if (e.dataTransfer.files.length && fileInput) {
          var dt = new DataTransfer();
          Array.from(e.dataTransfer.files).forEach(function(f) { dt.items.add(f); });
          fileInput.files = dt.files;
          showFilePreview(e.dataTransfer.files[0]);
        }
      });
      if (fileInput) {
        fileInput.addEventListener('change', function() { if (this.files.length) showFilePreview(this.files[0]); });
      }
    }

    function showFilePreview(file) {
      if (!uploadPreview) return;
      if (file.size > 5 * 1024 * 1024) { showToast('File is too large. Max 5MB.', 'error'); return; }
      uploadPreview.innerHTML = '<div class="file-item"><i class="fas fa-file"></i> ' + file.name + ' <small>(' + (file.size / 1024).toFixed(1) + ' KB)</small></div>';
      showToast('File uploaded successfully', 'success');
    }
  }

  function safeInit(fn) { try { fn(); } catch(e) { console.warn('Init error:', e); } }

  function init() {
    safeInit(initTheme);
    safeInit(initMobileMenu);
    safeInit(initNavbarScroll);
    safeInit(initMortgageCalculator);
    safeInit(initTestimonialCarousel);
    safeInit(initCounters);
    safeInit(initParticles);
    safeInit(initCookieConsent);
    safeInit(initChat);
    safeInit(initContactModal);
    safeInit(initLoginModal);
    safeInit(initNewsletter);
    safeInit(initSmoothScroll);
    safeInit(initApplyPage);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
