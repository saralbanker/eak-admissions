/**
 * Date logic: milestone status, countdowns, current admission phase and the
 * .ics calendar export. Pure functions of (data, "today") so they are easy to
 * test: pass a fake `today` to preview any point in the cycle.
 *   e.g. open the page with ?today=2027-01-10
 */
(function () {
  const EAK = (window.EAK = window.EAK || {});
  const DAY = 86400000;

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  /** Parse "YYYY-MM-DD" as a *local* midnight date (avoids UTC off-by-one). */
  function parse(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  /** `?today=YYYY-MM-DD` overrides the clock so reviewers can preview any phase. */
  function today() {
    const override = new URLSearchParams(window.location.search).get('today');
    return override && /^\d{4}-\d{2}-\d{2}$/.test(override) ? parse(override) : startOfDay(new Date());
  }

  function daysBetween(from, to) {
    return Math.round((to - from) / DAY);
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function toIso(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function formatDay(date) {
    return `${pad(date.getDate())} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  }

  /** "15 December 2026" or "09 – 17 January 2027" */
  function formatRange(m) {
    const start = parse(m.start);
    if (!m.end) return formatDay(start);
    const end = parse(m.end);
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return `${pad(start.getDate())} – ${pad(end.getDate())} ${MONTHS[end.getMonth()]} ${end.getFullYear()}`;
    }
    return `${formatDay(start)} – ${formatDay(end)}`;
  }

  /** Adds status ('done' | 'live' | 'upcoming'), days-to-start and a formatted label. */
  function withStatus(milestones, now) {
    let nextFound = false;
    return milestones.map((m) => {
      const start = parse(m.start);
      const until = parse(m.activeUntil || m.end || m.start);
      let status = 'upcoming';
      if (now > until) status = 'done';
      else if (now >= start) status = 'live';

      const isNext = !nextFound && status === 'upcoming';
      if (isNext) nextFound = true;

      return { ...m, status, isNext, daysToStart: daysBetween(now, start), display: formatRange(m) };
    });
  }

  /** Headline for the countdown banner + percentage of the application window elapsed. */
  function countdown(milestones, now) {
    const open = milestones.find((m) => m.id === 'open');
    const deadline = milestones.find((m) => m.id === 'deadline');
    const dl = parse(deadline.start);
    const op = parse(open.start);

    if (now <= dl) {
      const left = daysBetween(now, dl);
      const progress = Math.min(100, Math.max(0, Math.round(((now - op) / (dl - op)) * 100)));
      let headline = `Phase 1 applications close in ${left} days`;
      if (left === 1) headline = 'Phase 1 applications close tomorrow';
      if (left === 0) headline = 'Phase 1 applications close today';
      if (now < op) headline = `Applications open in ${daysBetween(now, op)} days`;
      return { headline, short: left === 0 ? 'Closes today' : `${left} day${left === 1 ? '' : 's'} left`, progress: now < op ? 0 : progress, open: true, phase: now < op ? 'before' : 'open' };
    }

    const next = milestones.find((m) => parse(m.activeUntil || m.end || m.start) >= now);
    if (next) {
      const n = daysBetween(now, parse(next.start));
      return {
        headline: n > 0 ? `Next up: ${next.label} in ${n} days` : `Now: ${next.label}`,
        short: 'Phase 1 closed',
        progress: 100,
        open: false,
        phase: 'between',
      };
    }
    return { headline: 'Admissions for this session are closed. Enquire about the next intake.', short: 'Closed', progress: 100, open: false, phase: 'closed' };
  }

  /** Which of the 5 admission steps is "current" today (array of indexes), plus done ones. */
  function stepStates(milestones, now) {
    const by = Object.fromEntries(milestones.map((m) => [m.id, m]));
    const end = (id) => parse(by[id].end || by[id].start);
    const states = ['upcoming', 'upcoming', 'upcoming', 'upcoming', 'upcoming'];
    const open = parse(by.open.start);

    if (now < open) return states;
    if (now <= parse(by.deadline.start)) return ['live', 'live', 'upcoming', 'upcoming', 'upcoming'];

    states[0] = states[1] = 'done';
    if (now <= end('interaction')) states[2] = 'live';
    else {
      states[2] = 'done';
      if (now <= end('result')) states[3] = 'live';
      else {
        states[3] = 'done';
        states[4] = now <= end('enrol') ? 'live' : 'done';
      }
    }
    return states;
  }

  /** Builds a single all-day-event .ics file for the whole cycle. */
  function buildIcs(milestones, schoolName) {
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const compact = (iso) => iso.replace(/-/g, '');
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//EAK International School//Admissions 2027-28//EN', 'CALSCALE:GREGORIAN'];

    milestones.forEach((m) => {
      const lastDay = parse(m.end || m.start);
      const exclusiveEnd = new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate() + 1);
      lines.push(
        'BEGIN:VEVENT',
        `UID:${m.id}-2027-28@eak-school.example`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${compact(m.start)}`,
        `DTEND;VALUE=DATE:${compact(toIso(exclusiveEnd))}`,
        `SUMMARY:${schoolName}: ${m.label}`,
        'BEGIN:VALARM',
        'TRIGGER:-P2D',
        'ACTION:DISPLAY',
        `DESCRIPTION:${m.label} in 2 days`,
        'END:VALARM',
        'END:VEVENT'
      );
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }

  EAK.dates = { parse, today, toIso, formatDay, formatRange, withStatus, countdown, stepStates, buildIcs, daysBetween };
})();
