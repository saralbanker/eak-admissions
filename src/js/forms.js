/**
 * Forms: shared field validation, the (frontend-only) submit pipeline, the
 * hero enquiry form and the <dialog>-based enquiry modal.
 *
 * Validation is declarative: an input opts in with data-validate="<rule>" and
 * gets its message in the sibling element #<input id>-error.
 */
(function () {
  const EAK = (window.EAK = window.EAK || {});
  const { data, dates } = EAK;
  const $ = (id) => document.getElementById(id);

  /* ------------------------------------------------------------ Validation */
  const RULES = {
    name(value) {
      const v = value.trim();
      if (v.length < 2) return 'Please enter at least 2 characters.';
      if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(v)) return 'Use letters, spaces, dots or hyphens only.';
      return '';
    },
    phone(value) {
      const v = value.replace(/[\s-]/g, '');
      return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(v) ? '' : 'Enter a valid 10-digit Indian mobile number, e.g. +91 98765 43210.';
    },
    email(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? '' : 'Enter a valid email address, e.g. parent@example.com.';
    },
    select(value) {
      return value ? '' : 'Please choose an option.';
    },
    date(value, el) {
      if (!value) return '';
      const picked = dates.parse(value);
      const min = el.min ? dates.parse(el.min) : null;
      const max = el.max ? dates.parse(el.max) : null;
      if (min && picked < min) return 'Please pick a date from today onwards.';
      if (max && picked > max) return 'Please pick a date within the next 12 months.';
      if (picked.getDay() === 0) return 'We are closed on Sundays. Please pick Monday to Saturday.';
      return '';
    },
  };

  const isHidden = (el) => !!el.closest('[hidden]');

  /** Validates one field, updates aria + message. Returns true when valid. */
  function validateField(el) {
    if (!el.dataset.validate || el.disabled || isHidden(el)) return true;
    const value = el.value || '';
    let message = '';
    if (el.required && !value.trim()) message = 'This field is required.';
    else if (value) message = RULES[el.dataset.validate](value, el);

    const out = $(`${el.id}-error`);
    if (out) out.textContent = message;
    el.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  /** Validates a whole form; returns the first invalid field (or null). */
  function validateForm(form) {
    let firstInvalid = null;
    form.querySelectorAll('[data-validate]').forEach((el) => {
      if (!validateField(el) && !firstInvalid) firstInvalid = el;
    });
    return firstInvalid;
  }

  function clearErrors(form) {
    form.querySelectorAll('[data-validate]').forEach((el) => {
      el.setAttribute('aria-invalid', 'false');
      const out = $(`${el.id}-error`);
      if (out) out.textContent = '';
    });
  }

  /* ------------------------------------------------------------ Submit pipeline */
  const STORE_KEY = 'eak.enquiries.v1';

  /**
   * Frontend-only "backend". Swap the body for fetch('/api/enquiries', ...) when a
   * real endpoint exists; callers only depend on the returned { ref }.
   */
  function submitEnquiry(payload) {
    return new Promise((resolve) => {
      const ref = `EAK-${Math.floor(10000 + Math.random() * 90000)}`;
      try {
        const list = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
        list.push({ ...payload, ref, submittedAt: new Date().toISOString() });
        localStorage.setItem(STORE_KEY, JSON.stringify(list));
      } catch (_) {
        /* storage unavailable (private mode): the confirmation still works */
      }
      setTimeout(() => resolve({ ref }), 600); // simulated network latency
    });
  }

  function setBusy(form, busy) {
    const btn = form.querySelector('[type="submit"]');
    form.setAttribute('aria-busy', String(busy));
    if (!btn) return;
    if (busy) btn.dataset.label = btn.textContent;
    btn.disabled = busy;
    btn.textContent = busy ? 'Submitting…' : btn.dataset.label || btn.textContent;
  }

  /** Wires validation + submit to a form. `onSuccess(result, payload)` renders the confirmation. */
  function bindForm(form, collect, onSuccess) {
    form.addEventListener('focusout', (e) => {
      if (e.target.matches?.('[data-validate]') && (e.target.value || e.target.getAttribute('aria-invalid') === 'true')) validateField(e.target);
    });
    form.addEventListener('input', (e) => {
      if (e.target.matches?.('[data-validate]') && e.target.getAttribute('aria-invalid') === 'true') validateField(e.target);
    });
    form.addEventListener('change', (e) => {
      if (e.target.matches?.('select[data-validate], input[type="date"]')) validateField(e.target);
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const invalid = validateForm(form);
      if (invalid) {
        invalid.focus();
        return;
      }
      setBusy(form, true);
      const payload = collect();
      const result = await submitEnquiry(payload);
      setBusy(form, false);
      onSuccess(result, payload);
    });
  }

  const gradeLabel = (value) => (data.grades.find((g) => g.value === value) || {}).label || value;

  /* ------------------------------------------------------------ Hero form */
  function initHeroForm() {
    const form = $('hero-enquiry-form');
    if (!form) return;
    const success = $('hero-success');

    bindForm(
      form,
      () => ({
        intent: 'hero-enquiry',
        parent: $('hero-parent-name').value.trim(),
        phone: $('hero-phone').value.trim(),
        email: $('hero-email').value.trim(),
        grade: gradeLabel($('hero-grade').value),
      }),
      (result, payload) => {
        $('hero-success-text').textContent = `Thank you, ${payload.parent}! Your enquiry for ${payload.grade} is registered for Session ${data.school.session}. A counsellor will call you within 24 working hours.`;
        $('hero-success-ref').textContent = result.ref;
        form.hidden = true;
        success.hidden = false;
        success.focus();
        form.reset();
        // The submit click is a user gesture, so the browser allows the download.
        $('hero-prospectus-link').click();
      }
    );

    $('hero-success-reset').addEventListener('click', () => {
      success.hidden = true;
      form.hidden = false;
      clearErrors(form);
      $('hero-parent-name').focus();
    });
  }

  /* ------------------------------------------------------------ Enquiry modal */
  function initModal() {
    const dialog = $('enquiry-dialog');
    const form = $('modal-form');
    if (!dialog || !form) return;

    const success = $('modal-success');
    const dateRow = $('modal-date-row');
    const slotRow = $('modal-slot-row');
    const dateInput = $('modal-date');
    const slotInput = $('modal-slot');
    let opener = null;
    let currentIntent = 'enquire';

    function applyIntent(key, overrideTitle) {
      const cfg = data.intents[key] || data.intents.enquire;
      currentIntent = key in data.intents ? key : 'enquire';
      $('modal-title').textContent = overrideTitle || cfg.title;
      $('modal-badge').textContent = `Session ${data.school.session} · ${cfg.badge}`;
      $('modal-lead').textContent = cfg.lead;
      $('modal-submit').textContent = cfg.submit;
      $('modal-submit').dataset.label = cfg.submit;

      const showDate = !!cfg.date;
      dateRow.hidden = !showDate;
      dateInput.required = cfg.date === 'required';
      $('modal-date-label').textContent = cfg.dateLabel || '';

      slotRow.hidden = !cfg.slot;
      slotInput.required = !!cfg.slot;

      // Date limits: today..+12 months (the visit slots are Mon-Sat; Sundays are rejected).
      const now = dates.today();
      const max = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
      dateInput.min = dates.toIso(now);
      dateInput.max = dates.toIso(max);
    }

    function open(key, { grade = '', title = '' } = {}) {
      opener = document.activeElement;
      form.reset();
      clearErrors(form);
      form.hidden = false;
      success.hidden = true;
      applyIntent(key, title);
      $('modal-grade').value = grade;

      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      document.body.classList.add('overflow-hidden');
      $('modal-student').focus();
    }

    function close() {
      if (typeof dialog.close === 'function') dialog.close();
      else dialog.removeAttribute('open');
    }

    dialog.addEventListener('close', () => {
      document.body.classList.remove('overflow-hidden');
      if (opener && document.contains(opener)) opener.focus();
    });

    // Backdrop click: the dialog element itself is only the target outside its content box.
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) close();
    });
    dialog.querySelectorAll('[data-close-modal]').forEach((btn) => btn.addEventListener('click', close));

    // Any element with data-open-modal opens the dialog in the requested mode.
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-modal]');
      if (!trigger) return;
      e.preventDefault();
      open(trigger.dataset.openModal, { grade: trigger.dataset.grade, title: trigger.dataset.title });
    });

    bindForm(
      form,
      () => ({
        intent: currentIntent,
        student: $('modal-student').value.trim(),
        parent: $('modal-parent').value.trim(),
        phone: $('modal-phone').value.trim(),
        email: $('modal-email').value.trim(),
        grade: gradeLabel($('modal-grade').value),
        date: dateInput.value || '',
        slot: slotInput.value || '',
      }),
      (result, payload) => {
        const when = payload.date ? ` on ${dates.formatDay(dates.parse(payload.date))}${payload.slot ? `, ${payload.slot}` : ''}` : '';
        $('modal-success-text').textContent = `${data.intents[currentIntent].badge} for ${payload.student} (Parent: ${payload.parent}, ${payload.grade})${when} has been recorded. Our admissions desk will contact you shortly.`;
        $('modal-success-ref').textContent = result.ref;
        form.hidden = true;
        success.hidden = false;
        success.focus();
      }
    );
  }

  EAK.forms = {
    validateField,
    validateForm,
    init() {
      initHeroForm();
      initModal();
    },
  };
})();
