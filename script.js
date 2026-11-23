/* =========================================================
   Global Team Clock — script.js
   =========================================================

   ╔══════════════════════════════════════════════════════════╗
   ║  TEAM CONFIGURATION — Edit the array below to manage    ║
   ║  your team. Each member needs:                          ║
   ║                                                         ║
   ║    name:     Full name                                  ║
   ║    role:     Job title / role                           ║
   ║    city:     City name                                  ║
   ║    country:  Country name                               ║
   ║    timezone: IANA timezone identifier                   ║
   ║              (e.g. "Asia/Kolkata", "Europe/London")     ║
   ║                                                         ║
   ║  Find your timezone here:                               ║
   ║  https://en.wikipedia.org/wiki/List_of_tz_database_time_zones  ║
   ╚══════════════════════════════════════════════════════════╝
*/

const TEAM = [

  {
    name: "Josh",
    role: "CEO",
    city: "Auckland",
    country: "New Zealand",
    timezone: "Pacific/Auckland",
  },

  {
    name: "Rooks",
    role: "Editor",
    city: "Sofia",
    country: "Bulgaria",
    timezone: "Europe/Sofia",
  },

  {
    name: "Chandler",
    role: "Editor",
    city: "India",
    country: "India",
    timezone: "Asia/Kolkata",
  },

  {
    name: "Yussuf",
    role: "Editor",
    city: "Istanbul",
    country: "Turkey",
    timezone: "Europe/Istanbul",
  },

  {
    name: "Kristine",
    role: "Task Manager",
    city: "Manila",
    country: "Philippines",
    timezone: "Asia/Manila",
  },

  {
    name: "Stan",
    role: "Editor",
    city: "TBD",            // TODO: Update once confirmed
    country: "TBD",            // TODO: Update once confirmed
    timezone: "UTC",            // TODO: Replace with correct IANA timezone
  },

  {
    name: "Dalmer",
    role: "Editor",
    city: "Paris",            // TODO: Update once confirmed
    country: "Italy",            // TODO: Update once confirmed
    timezone: "UTC",            // TODO: Replace with correct IANA timezone
  },

];

/* ═══════════════════════════════════════════════════════════
   Everything below runs the clocks. No need to edit.
   ═══════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  // ── State ──
  let searchQuery = '';
  let sortMode = 'name';

  // ── DOM ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  const searchInput = $('#search-input');
  const sortNameBtn = $('#sort-name');
  const sortTimeBtn = $('#sort-time');
  const gridEl = $('#grid');

  // ── Timezone helpers ──
  function isValidTimezone(tz) {
    try { Intl.DateTimeFormat(undefined, { timeZone: tz }); return true; }
    catch { return false; }
  }

  function getTimeInTZ(tz) {
    const now = new Date();
    const parts = {};
    try {
      new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: 'numeric', minute: '2-digit', second: '2-digit',
        hour12: true, weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
      }).formatToParts(now).forEach(p => { parts[p.type] = p.value; });
    } catch { return null; }
    return parts;
  }

  function getHour24(tz) {
    try {
      return parseInt(new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hour: 'numeric', hour12: false
      }).format(new Date()), 10);
    } catch { return -1; }
  }

  function getMinutesSinceMidnight(tz) {
    try {
      const parts = {};
      new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hour: 'numeric', minute: 'numeric', hour12: false
      }).formatToParts(new Date()).forEach(p => { parts[p.type] = p.value; });
      return parseInt(parts.hour, 10) * 60 + parseInt(parts.minute, 10);
    } catch { return 0; }
  }

  function getTimeOfDay(hour) {
    if (hour >= 6 && hour < 9) return { key: 'early-morning', label: 'Early Morning' };
    if (hour >= 9 && hour < 18) return { key: 'daytime', label: 'Daytime' };
    if (hour >= 18 && hour < 22) return { key: 'evening', label: 'Evening' };
    return { key: 'late-night', label: 'Late Night' };
  }

  // ── HTML escaping ──
  function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // ── Build card HTML ──
  function buildCard(m) {
    const valid = isValidTimezone(m.timezone);
    const hour = valid ? getHour24(m.timezone) : -1;
    const tod = hour >= 0 ? getTimeOfDay(hour) : { key: 'late-night', label: 'Unknown' };

    return `
      <div class="card">
        <div class="card-indicator ${tod.key}"></div>
        <div class="card-header">
          <div>
            <div class="card-name">${esc(m.name)}</div>
            ${m.role ? `<div class="card-role">${esc(m.role)}</div>` : ''}
          </div>
        </div>
        <div class="card-time" data-tz="${esc(m.timezone)}">--:--:--</div>
        <div class="card-date" data-tz-date="${esc(m.timezone)}">---</div>
        <div class="card-footer">
          <div class="card-location">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <span class="card-location-text">${esc(m.city)}, ${esc(m.country)}</span>
          </div>
          <span class="card-badge ${tod.key}">${tod.label}</span>
        </div>
      </div>`;
  }

  // ── Render grid ──
  function renderGrid() {
    let members = [...TEAM];

    // Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      members = members.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        m.country.toLowerCase().includes(q) ||
        (m.role && m.role.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortMode === 'name') {
      members.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      members.sort((a, b) => getMinutesSinceMidnight(a.timezone) - getMinutesSinceMidnight(b.timezone));
    }

    if (members.length === 0) {
      gridEl.innerHTML = `
        <div class="grid-empty">
          <div class="grid-empty-icon">🌍</div>
          No team members match your search.
        </div>`;
      return;
    }

    gridEl.innerHTML = members.map(buildCard).join('');
    updateClocks();
  }

  // ── Update clocks (called every second) ──
  function updateClocks() {
    $$('[data-tz]').forEach(el => {
      const tz = el.dataset.tz;
      const p = getTimeInTZ(tz);
      if (p) {
        el.textContent = `${p.hour}:${p.minute}:${p.second}`;
        const ampm = document.createElement('span');
        ampm.className = 'card-ampm';
        ampm.textContent = ` ${p.dayPeriod}`;
        el.appendChild(ampm);
      } else {
        el.textContent = 'Invalid TZ';
      }
    });

    $$('[data-tz-date]').forEach(el => {
      const tz = el.dataset.tzDate;
      const p = getTimeInTZ(tz);
      el.textContent = p ? `${p.weekday}, ${p.month} ${p.day}, ${p.year}` : '—';
    });

    // Update badges + indicators
    $$('.card').forEach(card => {
      const tzEl = card.querySelector('[data-tz]');
      if (!tzEl) return;
      const hour = getHour24(tzEl.dataset.tz);
      if (hour < 0) return;
      const tod = getTimeOfDay(hour);
      const ind = card.querySelector('.card-indicator');
      const badge = card.querySelector('.card-badge');
      if (ind) ind.className = 'card-indicator ' + tod.key;
      if (badge) { badge.className = 'card-badge ' + tod.key; badge.textContent = tod.label; }
    });
  }

  // ── Events ──
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGrid();
  });

  sortNameBtn.addEventListener('click', () => {
    sortMode = 'name';
    sortNameBtn.classList.add('active');
    sortTimeBtn.classList.remove('active');
    renderGrid();
  });

  sortTimeBtn.addEventListener('click', () => {
    sortMode = 'time';
    sortTimeBtn.classList.add('active');
    sortNameBtn.classList.remove('active');
    renderGrid();
  });

  // ── Init ──
  renderGrid();
  setInterval(() => { updateClocks(); }, 1000);
  setInterval(renderGrid, 5 * 60 * 1000);
})();
