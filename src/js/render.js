/**
 * Render layer: turns EAK.data into DOM for every repeated block, so the HTML
 * file stays a readable page skeleton and there is exactly one template per
 * card type. Static text (hero, header, footer, dialog shell) stays in index.html.
 */
(function () {
  const EAK = (window.EAK = window.EAK || {});
  const { data, icon, dates } = EAK;

  const esc = (value) =>
    String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const money = (n) => `Rs. ${Number(n).toLocaleString('en-IN')}`;
  const $ = (id) => document.getElementById(id);
  const mount = (id, html) => {
    const el = $(id);
    if (el) el.innerHTML = html;
  };

  /* ------------------------------------------------------------ 04 Highlights */
  function stats() {
    mount(
      'stats-grid',
      data.stats
        .map(
          (s) => `
        <li class="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur">
          <span class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-accent-500/15 text-accent-400">${icon(s.icon, 'h-5 w-5')}</span>
          <span class="mt-3 block font-serif text-3xl font-bold text-white sm:text-4xl">${esc(s.value)}</span>
          <span class="mt-1 block text-xs font-medium text-slate-300 sm:text-sm">${esc(s.label)}</span>
        </li>`
        )
        .join('')
    );
  }

  /* ------------------------------------------------------------ 02 Why choose */
  function whyUs() {
    mount(
      'why-grid',
      data.whyUs
        .map(
          (w) => `
        <li class="card card-hover p-6">
          <span class="icon-tile mb-4">${icon(w.icon, 'h-6 w-6')}</span>
          <h3 class="text-lg font-bold text-slate-900">${esc(w.title)}</h3>
          <p class="mt-2 text-sm leading-relaxed text-slate-600">${esc(w.text)}</p>
        </li>`
        )
        .join('')
    );
  }

  /* ------------------------------------------------------------ 03 Programs */
  function programs() {
    mount(
      'programs-grid',
      data.programs
        .map(
          (p) => `
        <article class="flex flex-col justify-between rounded-2xl border border-slate-700 bg-slate-800/90 p-6">
          <div>
            <div class="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wider text-accent-400">
              <span>${esc(p.grades)}</span>
              <span class="rounded-full bg-slate-700 px-2.5 py-1 normal-case tracking-normal text-slate-200">${esc(p.ages)}</span>
            </div>
            <h3 class="mt-3 text-xl font-bold text-white">${esc(p.title)}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-300">${esc(p.text)}</p>
            <ul class="mt-4 space-y-2 border-t border-slate-700 pt-4 text-xs text-slate-200">
              ${p.points.map((pt) => `<li class="flex items-start gap-2"><span class="mt-0.5 text-accent-400">${icon('check', 'h-4 w-4')}</span><span>${esc(pt)}</span></li>`).join('')}
            </ul>
          </div>
          <button type="button" data-open-modal="enquire" data-grade="${p.grade}" data-title="Enquire: ${esc(p.title)}"
            class="btn mt-6 w-full bg-white/10 py-2.5 text-white hover:bg-accent-500 hover:text-slate-950">${esc(p.cta)}</button>
        </article>`
        )
        .join('')
    );
  }

  /* ------------------------------------------------------------ 05 Facilities */
  function facilities() {
    mount(
      'facilities-grid',
      data.facilities
        .map(
          (f) => `
        <li class="card group overflow-hidden" tabindex="0">
          <div class="facility-frame aspect-[3/2] overflow-hidden bg-slate-200">
            <video class="facility-video h-full w-full object-cover" muted loop playsinline preload="none" poster="assets/img/${f.img}-800.jpg" aria-hidden="true" data-hover-video data-video-src="${esc(f.video)}"></video>
            <img src="assets/img/${f.img}-800.jpg" srcset="assets/img/${f.img}-480.jpg 480w, assets/img/${f.img}-800.jpg 800w"
              sizes="(min-width:1024px) 384px, (min-width:640px) 50vw, 100vw" width="${f.w}" height="${f.h}"
              alt="${esc(f.alt)}" decoding="async"
              class="facility-fallback h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div class="p-5">
            <h3 class="text-lg font-bold text-slate-900">${esc(f.title)}</h3>
            <p class="mt-1 text-sm text-slate-600">${esc(f.text)}</p>
          </div>
        </li>`
        )
        .join('')
    );
  }

  /* ------------------------------------------------------------ 06 Steps */
  const STEP_LIVE_LABEL = ['Open now', 'Open now', 'In progress', 'In progress', 'In progress'];

  function steps(milestones, now) {
    const states = dates.stepStates(milestones, now);
    mount(
      'steps-list',
      data.steps
        .map((s, i) => {
          const state = states[i];
          const last = i === data.steps.length - 1;
          const circle = state === 'done' ? 'bg-emerald-600' : last ? 'bg-emerald-600' : 'bg-brand-600';
          const tag =
            state === 'live'
              ? `<span class="chip bg-emerald-50 text-emerald-700"><span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"></span>${STEP_LIVE_LABEL[i]}</span>`
              : state === 'done'
              ? `<span class="chip bg-slate-100 text-slate-600">${icon('check', 'h-3 w-3')}Completed</span>`
              : '';
          return `
        <li class="step card p-6 ${state === 'live' ? 'border-emerald-300 ring-2 ring-emerald-200' : 'border-brand-100'}" ${state === 'live' ? 'aria-current="step"' : ''}>
          <div class="mb-4 flex items-center justify-between">
            <span class="flex h-11 w-11 items-center justify-center rounded-full ${circle} text-white">${icon(state === 'done' ? 'check' : s.icon, 'h-5 w-5')}</span>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Step ${i + 1}</span>
          </div>
          <h3 class="text-lg font-bold text-slate-900">${esc(s.title)}</h3>
          <p class="mt-2 text-sm text-slate-600">${esc(s.text)}</p>
          ${tag ? `<div class="mt-4">${tag}</div>` : ''}
        </li>`;
        })
        .join('')
    );
  }

  /* ------------------------------------------------------------ 07 Dates */
  const CHIP = {
    done: 'bg-slate-100 text-slate-600',
    live: 'bg-emerald-50 text-emerald-700',
    upcoming: 'bg-brand-50 text-brand-700',
    next: 'bg-accent-500/15 text-amber-800 ring-1 ring-accent-500/40',
  };

  /* Hero status pill, by admission phase (see dates.countdown). */
  const HERO_STATUS = { before: 'Admissions Opening Soon', open: 'Admissions Open', between: 'Phase 1 Closed', closed: 'Admissions Closed' };

  function statusLine(m) {
    if (m.status === 'done') return `<span class="text-slate-500">Completed</span>`;
    if (m.status === 'live') return `<span class="font-semibold text-emerald-700">Open now</span>`;
    const n = m.daysToStart;
    const when = n === 1 ? 'tomorrow' : `in ${n} days`;
    return m.isNext ? `<span class="font-semibold text-amber-700">Next up · ${when}</span>` : `<span class="text-slate-500">${when.replace(/^./, (c) => c.toUpperCase())}</span>`;
  }

  function datesCard(milestones, now) {
    const c = dates.countdown(data.dates, now);
    mount(
      'dates-banner',
      `<div class="rounded-xl bg-brand-50 p-4">
        <p class="flex items-center gap-2 text-sm font-semibold text-brand-800">${icon('clock', 'h-4 w-4 shrink-0')}<span>${esc(c.headline)}</span></p>
        <div class="mt-3 h-2 overflow-hidden rounded-full bg-white" aria-hidden="true">
          <div class="h-full rounded-full bg-brand-600" style="width:${c.progress}%"></div>
        </div>
        <p class="mt-1.5 flex justify-between text-xs text-slate-600"><span>Portal opened ${dates.formatDay(dates.parse(data.dates[0].start))}</span><span>${c.progress}% of window elapsed</span></p>
      </div>`
    );

    mount(
      'dates-list',
      milestones
        .map((m) => {
          const tone = m.isNext ? 'next' : m.status;
          return `
        <li class="flex flex-col gap-1.5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div>
            <span class="font-semibold text-slate-800">${esc(m.label)}</span>
            <span class="mt-0.5 block text-xs">${statusLine(m)}</span>
          </div>
          <time datetime="${m.start}" class="chip shrink-0 self-start sm:self-auto ${CHIP[tone]}">${esc(m.display)}</time>
        </li>`;
        })
        .join('')
    );

    const hero = $('hero-deadline');
    if (hero) hero.textContent = c.headline;
    const status = $('hero-status');
    if (status) status.textContent = `${HERO_STATUS[c.phase]} • Academic Session ${data.school.session}`;
  }

  /* ------------------------------------------------------------ 08 Documents */
  function documents() {
    mount(
      'documents-list',
      data.documents
        .map(
          (d) => `
        <li>
          <label class="group -mx-2 flex cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-slate-50">
            <input type="checkbox" name="doc-${d.id}" class="peer sr-only" data-doc="${d.id}" />
            <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-emerald-200 bg-emerald-50 text-emerald-400 transition peer-checked:border-emerald-600 peer-checked:bg-emerald-600 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-600 peer-focus-visible:ring-offset-2">${icon('check', 'h-3 w-3')}</span>
            <span class="text-sm text-slate-700 peer-checked:text-slate-500"><strong class="text-slate-900">${esc(d.title)}:</strong> ${esc(d.text)}</span>
          </label>
        </li>`
        )
        .join('')
    );
  }

  /* ------------------------------------------------------------ 09 Fees */
  function fees() {
    mount(
      'fees-body',
      data.fees
        .map((f) => {
          const quarter = f.tuition / 4;
          return `
        <tr class="fee-row transition-colors hover:bg-slate-50">
          <td class="fee-grade px-6 py-4"><span class="font-bold text-slate-900">${esc(f.grades)}</span><span class="block text-xs font-normal text-slate-500">${esc(f.wing)}</span></td>
          <td class="px-6 py-4 font-semibold text-brand-700" data-label="Annual Tuition Fee">${money(f.tuition)}</td>
          <td class="px-6 py-4 text-slate-700" data-label="One-Time Admission Fee">${money(f.admission)}</td>
          <td class="fee-actions px-6 py-4 text-right">
            <div class="flex flex-wrap justify-end gap-2 md:flex-nowrap">
              <button type="button" data-action="toggle-fee" aria-expanded="false" aria-controls="fee-detail-${f.id}" class="btn btn-soft btn-sm">View breakdown</button>
              <button type="button" data-open-modal="fee" data-grade="${f.id === 'senior' ? 'secondary' : f.id}" data-title="Fee Enquiry: ${esc(f.grades)}" class="btn btn-sm border border-slate-300 text-slate-700 hover:bg-slate-100">Enquire</button>
            </div>
          </td>
        </tr>
        <tr id="fee-detail-${f.id}" class="fee-detail bg-slate-50" hidden>
          <td colspan="4" class="px-6 py-4">
            <dl class="grid gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
              ${f.breakdown.map(([k, v]) => `<div class="flex justify-between gap-4"><dt class="text-slate-600">${esc(k)}</dt><dd class="font-medium text-slate-900">${money(v)}</dd></div>`).join('')}
              <div class="flex justify-between gap-4 border-t border-slate-200 pt-1.5 sm:col-span-2"><dt class="font-semibold text-slate-800">Annual tuition</dt><dd class="font-bold text-brand-700">${money(f.tuition)}</dd></div>
              <div class="flex justify-between gap-4 sm:col-span-2"><dt class="text-slate-600">Paid in 4 quarterly instalments of</dt><dd class="font-medium text-slate-900">${money(quarter)}</dd></div>
            </dl>
          </td>
        </tr>`;
        })
        .join('')
    );

    const grade = $('est-grade');
    if (grade) grade.innerHTML = data.fees.map((f) => `<option value="${f.id}">${esc(f.grades)} · ${esc(f.wing)}</option>`).join('');
    const transport = $('est-transport');
    if (transport) transport.innerHTML = data.feeAddOns.transport.map((t) => `<option value="${t.id}">${esc(t.label)}${t.amount ? ` · ${money(t.amount)}/yr` : ''}</option>`).join('');
    const mealsLabel = $('est-meals-price');
    if (mealsLabel) mealsLabel.textContent = `${money(data.feeAddOns.meals)}/yr`;
    const uniformLabel = $('est-uniform-price');
    if (uniformLabel) uniformLabel.textContent = `${money(data.feeAddOns.uniform)} one-time`;
  }

  /* ------------------------------------------------------------ 10 Testimonials */
  function testimonials() {
    mount(
      'testimonials-track',
      data.testimonials
        .map(
          (t) => `
        <li class="w-[85%] shrink-0 snap-center md:w-auto">
          <figure class="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <blockquote>
              <div class="mb-3 flex gap-0.5 text-accent-500" role="img" aria-label="${t.rating} out of 5 stars">${Array.from({ length: t.rating }, () => icon('star', 'h-5 w-5', { fill: true })).join('')}</div>
              <p class="text-sm italic leading-relaxed text-slate-700">&ldquo;${esc(t.text)}&rdquo;</p>
            </blockquote>
            <figcaption class="mt-6 flex items-center gap-3 border-t border-slate-200 pt-4">
              <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-white" aria-hidden="true">${esc(t.initials)}</span>
              <span><strong class="block text-sm text-slate-900">${esc(t.name)}</strong><span class="text-xs text-slate-600">${esc(t.role)}</span></span>
            </figcaption>
          </figure>
        </li>`
        )
        .join('')
    );
  }

  /* ------------------------------------------------------------ 11 FAQ + schema */
  function faq() {
    mount(
      'faq-list',
      data.faqs
        .map((f, i) => {
          const open = i === 0;
          return `
        <div class="card overflow-hidden">
          <h3>
            <button type="button" id="faq-btn-${i}" aria-expanded="${open}" aria-controls="faq-panel-${i}" data-faq
              class="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-slate-900 transition-colors hover:bg-slate-50 sm:px-6">
              <span>${i + 1}. ${esc(f.q)}</span>
              <span class="shrink-0 text-brand-600 transition-transform duration-200 group-aria-expanded:rotate-180">${icon('chevronDown', 'h-5 w-5')}</span>
            </button>
          </h3>
          <div id="faq-panel-${i}" role="region" aria-labelledby="faq-btn-${i}" class="faq-panel" data-open="${open}">
            <div><p class="px-5 pb-5 text-sm leading-relaxed text-slate-600 sm:px-6">${esc(f.a)}</p></div>
          </div>
        </div>`;
        })
        .join('')
    );

    // FAQPage structured data generated from the same source as the visible FAQ.
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
    document.head.appendChild(ld);
  }

  /* ------------------------------------------------------------ Form selects */
  function gradeSelects() {
    const options = data.grades.map((g) => `<option value="${g.value}">${esc(g.label)}</option>`).join('');
    ['hero-grade', 'modal-grade'].forEach((id) => {
      const el = $(id);
      if (el) el.insertAdjacentHTML('beforeend', options);
    });
    const slot = $('modal-slot');
    if (slot) slot.insertAdjacentHTML('beforeend', data.visitSlots.map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join(''));
  }

  EAK.render = {
    esc,
    money,
    all() {
      const now = dates.today();
      const milestones = dates.withStatus(data.dates, now);
      stats();
      whyUs();
      programs();
      facilities();
      steps(data.dates, now);
      datesCard(milestones, now);
      documents();
      fees();
      testimonials();
      faq();
      gradeSelects();
      return { milestones, now };
    },
  };
})();
