/**
 * LUMYX — web-development page
 *
 * Three page-scoped behaviours, none shared with the other service pages:
 *   1. initVitals()  — measures THIS page live via real browser performance
 *                      APIs and prints the numbers. The page is the proof,
 *                      so every value here must be genuinely measured. There
 *                      is no fallback that invents a number: if an API is
 *                      unavailable the row says so and stays blank.
 *   2. initAnatomy() — click/keyboard-driven page teardown (visitor-driven,
 *                      never scroll-hijacked).
 *   3. initRouter()  — the three offers as a tab router.
 */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initVitals();
    initAnatomy();
    initRouter();
  });

  /* ---------------------------------------------------------
     1. LIVE VITALS
     --------------------------------------------------------- */
  function initVitals() {
    var gauge = document.querySelector('[data-vitals]');
    if (!gauge) return;

    // target = the "good" threshold each metric is measured against
    var defs = {
      lcp:    { target: 2500, unit: 'ms', fmt: msFmt },
      cls:    { target: 0.1,  unit: '',   fmt: function (v) { return v.toFixed(3); } },
      ttfb:   { target: 800,  unit: 'ms', fmt: msFmt },
      inp:    { target: 200,  unit: 'ms', fmt: msFmt },
      weight: { target: 1000, unit: 'KB', fmt: function (v) { return Math.round(v).toLocaleString(); } }
    };

    function msFmt(v) {
      return v >= 1000 ? (v / 1000).toFixed(2) : Math.round(v).toString();
    }
    function msUnit(v) { return v >= 1000 ? 's' : 'ms'; }

    function paint(key, value) {
      var def = defs[key];
      var row = gauge.querySelector('[data-metric="' + key + '"]');
      if (!row || !def) return;
      var out = row.querySelector('.wd-metric__value');
      var fill = row.querySelector('.wd-metric__fill');
      if (!out) return;

      var unit = def.unit === 'ms' ? msUnit(value) : def.unit;
      out.classList.remove('is-pending');
      out.innerHTML = def.fmt(value) + (unit ? '<span class="wd-metric__unit">' + unit + '</span>' : '');

      var pass = value <= def.target;
      out.classList.toggle('is-pass', pass);
      out.classList.toggle('is-warn', !pass);

      if (fill) {
        var pct = Math.max(4, Math.min(100, (value / def.target) * 100));
        fill.style.width = pct + '%';
        fill.classList.toggle('is-warn', !pass);
      }
    }

    function unavailable(key, why) {
      var row = gauge.querySelector('[data-metric="' + key + '"]');
      if (!row) return;
      var out = row.querySelector('.wd-metric__value');
      if (out) { out.textContent = why || 'n/a'; out.classList.add('is-pending'); }
    }

    // --- TTFB + page weight, from Navigation Timing (available immediately)
    try {
      var nav = performance.getEntriesByType('navigation')[0];
      if (nav) {
        paint('ttfb', Math.max(0, nav.responseStart - nav.requestStart));
      } else {
        unavailable('ttfb');
      }
    } catch (e) { unavailable('ttfb'); }

    // Page weight has to wait for load so late resources are counted.
    window.addEventListener('load', function () {
      setTimeout(function () {
        try {
          var bytes = 0, counted = false;
          var navEntry = performance.getEntriesByType('navigation')[0];
          if (navEntry && navEntry.transferSize) { bytes += navEntry.transferSize; counted = true; }
          performance.getEntriesByType('resource').forEach(function (r) {
            if (r.transferSize) { bytes += r.transferSize; counted = true; }
          });
          // transferSize reads 0 for cross-origin responses without
          // Timing-Allow-Origin, so a zero total means "can't measure",
          // not "weightless". Say so rather than printing a false 0.
          if (counted && bytes > 0) paint('weight', bytes / 1024);
          else unavailable('weight', 'blocked');
        } catch (e) { unavailable('weight'); }
      }, 400);
    });

    if (!('PerformanceObserver' in window)) {
      ['lcp', 'cls', 'inp'].forEach(function (k) { unavailable(k, 'n/a'); });
      return;
    }

    // --- LCP: keep the latest candidate until the user interacts away
    try {
      var lcpValue = 0;
      var lcpObs = new PerformanceObserver(function (list) {
        var entries = list.getEntries();
        var last = entries[entries.length - 1];
        if (last) { lcpValue = last.renderTime || last.loadTime || last.startTime; paint('lcp', lcpValue); }
      });
      lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });
      ['keydown', 'pointerdown'].forEach(function (evt) {
        addEventListener(evt, function () { try { lcpObs.disconnect(); } catch (e) {} }, { once: true, passive: true });
      });
    } catch (e) { unavailable('lcp'); }

    // --- CLS: sum of layout shifts not caused by recent user input
    try {
      var clsValue = 0;
      var clsObs = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
          if (!entry.hadRecentInput) { clsValue += entry.value; }
        });
        paint('cls', clsValue);
      });
      clsObs.observe({ type: 'layout-shift', buffered: true });
      // print a real 0.000 once settled even if nothing ever shifted
      window.addEventListener('load', function () {
        setTimeout(function () { paint('cls', clsValue); }, 600);
      });
    } catch (e) { unavailable('cls'); }

    // --- INP: needs a real interaction, so it stays honestly blank until one
    try {
      var worstInp = 0;
      var inpObs = new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
          if (entry.interactionId && entry.duration > worstInp) {
            worstInp = entry.duration;
            paint('inp', worstInp);
          }
        });
      });
      inpObs.observe({ type: 'event', buffered: true, durationThreshold: 16 });
    } catch (e) {
      // Older Chromium exposes first-input only; use it rather than nothing.
      try {
        var fiObs = new PerformanceObserver(function (list) {
          var e0 = list.getEntries()[0];
          if (e0) paint('inp', e0.processingStart - e0.startTime);
        });
        fiObs.observe({ type: 'first-input', buffered: true });
      } catch (e2) { unavailable('inp'); }
    }
  }

  /* ---------------------------------------------------------
     2. ANATOMY — visitor-driven teardown
     --------------------------------------------------------- */
  function initAnatomy() {
    var root = document.querySelector('[data-anatomy]');
    if (!root) return;
    var pins = Array.prototype.slice.call(root.querySelectorAll('.wd-pin'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('.wd-detail__panel'));
    if (!pins.length || pins.length !== panels.length) return;

    function select(i, focus) {
      pins.forEach(function (p, k) { p.setAttribute('aria-selected', k === i ? 'true' : 'false'); p.tabIndex = k === i ? 0 : -1; });
      panels.forEach(function (p, k) { p.classList.toggle('is-active', k === i); });
      if (focus) pins[i].focus();
    }

    pins.forEach(function (pin, i) {
      pin.addEventListener('click', function () { select(i); });
      pin.addEventListener('keydown', function (ev) {
        var next = null;
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') next = (i + 1) % pins.length;
        else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') next = (i - 1 + pins.length) % pins.length;
        else if (ev.key === 'Home') next = 0;
        else if (ev.key === 'End') next = pins.length - 1;
        if (next !== null) { ev.preventDefault(); select(next, true); }
      });
    });

    select(0);
  }

  /* ---------------------------------------------------------
     3. ROUTER — the three offers
     --------------------------------------------------------- */
  function initRouter() {
    var root = document.querySelector('[data-router]');
    if (!root) return;
    var tabs = Array.prototype.slice.call(root.querySelectorAll('.wd-tab'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('.wd-panel'));
    if (!tabs.length || tabs.length !== panels.length) return;

    function select(i, focus) {
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); t.tabIndex = k === i ? 0 : -1; });
      panels.forEach(function (p, k) { p.classList.toggle('is-active', k === i); });
      if (focus) tabs[i].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i); });
      tab.addEventListener('keydown', function (ev) {
        var next = null;
        if (ev.key === 'ArrowRight') next = (i + 1) % tabs.length;
        else if (ev.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
        else if (ev.key === 'Home') next = 0;
        else if (ev.key === 'End') next = tabs.length - 1;
        if (next !== null) { ev.preventDefault(); select(next, true); }
      });
    });

    // Deep-link support: /web-development#revamp opens that tab
    var hash = (window.location.hash || '').replace('#', '');
    var startIdx = 0;
    if (hash) {
      tabs.forEach(function (t, k) { if (t.getAttribute('data-tab') === hash) startIdx = k; });
    }
    select(startIdx);

    void reduce; // motion preference is handled in CSS for this module
  }
})();
