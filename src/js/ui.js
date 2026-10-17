/**
 * UI behaviours: mobile menu, scroll-spy, back-to-top, FAQ accordion,
 * fee breakdown + estimator, document checklist, calendar export.
 */
(function () {
  const EAK = (window.EAK = window.EAK || {});
  const { data, dates, icon } = EAK;
  const $ = (id) => document.getElementById(id);
  const money = (n) => EAK.render.money(n);

  /* ------------------------------------------------------------ Mobile menu */
  function initMenu() {
    const btn = $('mobile-menu-btn');
    const menu = $('mobile-menu');
    const glyph = $('menu-icon');
    if (!btn || !menu) return;

    function setOpen(open, { returnFocus = false } = {}) {
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
      menu.hidden = !open;
      glyph.innerHTML = icon(open ? 'close' : 'menu', 'h-6 w-6');
      if (!open && returnFocus) btn.focus();
    }

    btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') setOpen(false, { returnFocus: true });
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => e.matches && setOpen(false));
    setOpen(false);
  }

  /* ------------------------------------------------------------ Scroll-spy + back-to-top */
  function initScroll() {
    const links = document.querySelectorAll('[data-spy]');
    const sections = document.querySelectorAll('main section[id]');

    if ('IntersectionObserver' in window && sections.length) {
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.id;
            links.forEach((link) => {
              if (link.dataset.spy.split(' ').includes(id)) link.setAttribute('aria-current', 'location');
              else link.removeAttribute('aria-current');
            });
          });
        },
        { rootMargin: '-35% 0px -60% 0px' }
      );
      sections.forEach((s) => spy.observe(s));
    }

    const top = $('back-to-top');
    if (top) {
      const toggle = () => {
        const visible = window.scrollY > 700;
        top.classList.toggle('opacity-0', !visible);
        top.classList.toggle('pointer-events-none', !visible);
        top.inert = !visible;
      };
      requestAnimationFrame(toggle); // after first paint, avoids a forced layout during init
      window.addEventListener('scroll', toggle, { passive: true });
      top.addEventListener('click', () => window.scrollTo({ top: 0 }));
    }
  }

  /* ------------------------------------------------------------ FAQ accordion */
  function initFaq() {
    const list = $('faq-list');
    if (!list) return;
    const buttons = () => Array.from(list.querySelectorAll('[data-faq]'));

    list.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-faq]');
      if (!btn) return;
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      $(btn.getAttribute('aria-controls')).dataset.open = String(open);
    });

    // WAI-ARIA accordion keyboard pattern: arrows / Home / End move between headers.
    list.addEventListener('keydown', (e) => {
      const btn = e.target.closest('[data-faq]');
      if (!btn) return;
      const all = buttons();
      const i = all.indexOf(btn);
      const target = { ArrowDown: all[(i + 1) % all.length], ArrowUp: all[(i - 1 + all.length) % all.length], Home: all[0], End: all[all.length - 1] }[e.key];
      if (target) {
        e.preventDefault();
        target.focus();
      }
    });
  }

  /* ------------------------------------------------------------ Fees */
  function initFees() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="toggle-fee"]');
      if (!btn) return;
      const row = $(btn.getAttribute('aria-controls'));
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Hide breakdown' : 'View breakdown';
      row.hidden = !open;
    });

    const form = $('fee-estimator');
    const out = $('est-result');
    if (!form || !out) return;

    function update() {
      const fee = data.fees.find((f) => f.id === $('est-grade').value) || data.fees[0];
      const transport = data.feeAddOns.transport.find((t) => t.id === $('est-transport').value) || data.feeAddOns.transport[0];
      const meals = $('est-meals').checked ? data.feeAddOns.meals : 0;
      const uniform = $('est-uniform').checked ? data.feeAddOns.uniform : 0;

      const recurring = fee.tuition + transport.amount + meals;
      const total = fee.admission + recurring + uniform;
      const rows = [
        ['One-time admission fee', fee.admission],
        ['Annual tuition', fee.tuition],
        transport.amount ? [`Transport (${transport.label})`, transport.amount] : null,
        meals ? ['Meal plan', meals] : null,
        uniform ? ['Uniform kit', uniform] : null,
      ].filter(Boolean);

      out.innerHTML = `
        <dl class="space-y-1.5 text-sm">
          ${rows.map(([k, v]) => `<div class="flex justify-between gap-4"><dt class="text-slate-600">${EAK.render.esc(k)}</dt><dd class="font-medium text-slate-900">${money(v)}</dd></div>`).join('')}
          <div class="flex justify-between gap-4 border-t border-slate-200 pt-2"><dt class="font-semibold text-slate-900">First-year total</dt><dd class="text-lg font-bold text-brand-700">${money(total)}</dd></div>
        </dl>
        <p class="mt-3 rounded-lg bg-brand-50 p-3 text-xs text-brand-800">
          Pay the <strong>${money(fee.admission)}</strong> admission fee at enrollment, then
          <strong>4 quarterly instalments of ${money(recurring / 4)}</strong> (April, July, October, January).
        </p>`;
    }

    form.addEventListener('change', update);
    form.addEventListener('submit', (e) => e.preventDefault());
    update();
  }

  /* ------------------------------------------------------------ Documents checklist */
  function initDocuments() {
    const list = $('documents-list');
    if (!list) return;
    const KEY = 'eak.documents.v1';
    const boxes = Array.from(list.querySelectorAll('input[data-doc]'));
    const bar = $('docs-bar');
    const count = $('docs-count');

    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch (_) {
      /* ignore: checklist simply starts empty */
    }
    boxes.forEach((b) => (b.checked = saved.includes(b.dataset.doc)));

    function paint() {
      const done = boxes.filter((b) => b.checked).length;
      const pct = Math.round((done / boxes.length) * 100);
      bar.style.width = `${pct}%`;
      bar.parentElement.setAttribute('aria-valuenow', String(done));
      count.textContent = done === boxes.length ? 'All documents ready — you can apply now!' : `${done} of ${boxes.length} documents ready`;
    }

    list.addEventListener('change', () => {
      try {
        localStorage.setItem(KEY, JSON.stringify(boxes.filter((b) => b.checked).map((b) => b.dataset.doc)));
      } catch (_) {
        /* storage unavailable: progress just won't persist */
      }
      paint();
    });
    paint();

    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-action="print-docs"]')) return;
      document.body.classList.add('printing-documents');
      window.addEventListener('afterprint', () => document.body.classList.remove('printing-documents'), { once: true });
      window.print();
    });
  }

  /* ------------------------------------------------------------ Calendar export */
  function initCalendar() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-action="add-calendar"]')) return;
      const blob = new Blob([dates.buildIcs(data.dates, data.school.name)], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement('a'), { href: url, download: 'eak-admission-dates-2027-28.ics' });
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  EAK.ui = {
    init() {
      initMenu();
      initScroll();
      initFaq();
      initFees();
      initDocuments();
      initCalendar();
    },
  };
})();
