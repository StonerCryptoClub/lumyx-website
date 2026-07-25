/**
 * Lumyx B — b-motion.js
 * Animates; never mutates content. Re-implements the tiny nav toggle
 * and smooth-scroll sub-target pattern so B has zero root-script deps
 * for navigation. Ref: BLUEPRINT.md §4.1, §8.
 *
 * All entrance states live in motion.css behind `.js-motion` (added in
 * <head>), so content is fully visible if this script never runs.
 */
(function () {
  'use strict';

  var root = document.documentElement;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    heroChoreography();
    cursorSpotlight();
    heroStripCounters();
    scrollReveals();
    proofBand();
    growthRail();
    headerScrollState();
    mobileDrawer();
    smoothScroll();
  });

  /* ---------- Cursor-reactive hero instrument (grid spotlight follows pointer) ---------- */
  function cursorSpotlight() {
    var hero = document.querySelector('.hero');
    var spot = hero && hero.querySelector('.hero__spotlight');
    if (!hero || !spot || prefersReduced) return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch
    var raf = null, mx = 72, my = 30;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width) * 100;
      my = ((e.clientY - r.top) / r.height) * 100;
      if (!raf) raf = requestAnimationFrame(function () {
        raf = null;
        spot.style.setProperty('--mx', mx.toFixed(2) + '%');
        spot.style.setProperty('--my', my.toFixed(2) + '%');
      });
    });
  }

  /* ---------- Hero proof strip counters (fire once hero is ready) ---------- */
  function heroStripCounters() {
    var strip = document.querySelector('.hero-proof-strip');
    if (!strip) return;
    var nums = strip.querySelectorAll('[data-count]');
    if (!nums.length) return;
    if (prefersReduced) { nums.forEach(function (el) { el.textContent = format(el); }); return; }
    // Wait for the choreography to seat the strip, then roll.
    setTimeout(function () { nums.forEach(countUp); }, 640);
  }

  /* ---------- 1. Hero load choreography (runs once) ---------- */
  function heroChoreography() {
    if (prefersReduced) { root.classList.add('hero-ready'); return; }
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { root.classList.add('hero-ready'); });
    });
  }

  /* ---------- 2. Scroll reveals with capped stagger ---------- */
  function scrollReveals() {
    var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!reveals.length) return;

    // Assign staggered delays within each reveal's parent (cap 5).
    var groups = new Map();
    reveals.forEach(function (el) {
      var parent = el.parentElement;
      var idx = groups.get(parent) || 0;
      el.style.setProperty('--stagger-i', Math.min(idx, 5));
      groups.set(parent, idx + 1);
    });

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 3. Growth method progress rail ---------- */
  function growthRail() {
    var rail = document.querySelector('.rail');
    if (!rail) return;
    var fill = rail.querySelector('.rail__fill');
    var steps = Array.prototype.slice.call(rail.querySelectorAll('.step'));
    if (prefersReduced) {
      if (fill) fill.style.transform = 'scaleY(1)';
      steps.forEach(function (s) { s.classList.add('is-active'); });
      return;
    }

    var ticking = false;
    function update() {
      ticking = false;
      var rect = rail.getBoundingClientRect();
      var vh = window.innerHeight;
      var start = vh * 0.75;
      var total = rect.height + start - vh * 0.25;
      var progressed = start - rect.top;
      var p = Math.max(0, Math.min(1, progressed / total));
      if (fill) fill.style.transform = 'scaleY(' + p + ')';

      var line = vh * 0.6;
      steps.forEach(function (step) {
        var sr = step.getBoundingClientRect();
        step.classList.toggle('is-active', sr.top < line);
      });
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ---------- 4. Proof band wipe + counters (once) ---------- */
  function proofBand() {
    var band = document.querySelector('.proof-band');
    if (!band) return;
    var counted = false;

    function run() {
      band.classList.add('is-in');
      if (!counted) { counted = true; band.querySelectorAll('[data-count]').forEach(countUp); }
    }

    if (prefersReduced || !('IntersectionObserver' in window)) {
      band.classList.add('is-in');
      band.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = format(el); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { run(); io.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(band);
  }

  function format(el, value) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var v = (value === undefined) ? target : value;
    return prefix + v.toFixed(decimals) + suffix;
  }

  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var duration = 1200;
    var startT = null;
    function tick(ts) {
      if (startT === null) startT = ts;
      var t = Math.min(1, (ts - startT) / duration);
      var eased = 1 - Math.pow(1 - t, 4); // out-quart
      el.textContent = format(el, target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = format(el);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- 5. Header scroll state ---------- */
  function headerScrollState() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var ticking = false;
    function update() { ticking = false; header.classList.toggle('scrolled', window.scrollY > 24); }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- 6. Mobile drawer (re-implemented, no root deps) ---------- */
  function mobileDrawer() {
    var btn = document.getElementById('mobile-menu-btn');
    var drawer = document.getElementById('mobile-nav-sidebar');
    var overlay = document.getElementById('mobile-nav-overlay');
    var closeBtn = document.getElementById('mobile-nav-close');
    if (!btn || !drawer || !overlay) return;

    function open() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', open);
    overlay.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);
    drawer.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', close);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* ---------- 7. Smooth scroll + data-scroll-target sub-target ---------- */
  function smoothScroll() {
    var behavior = prefersReduced ? 'auto' : 'smooth';
    document.querySelectorAll('a[href^="#"], [data-scroll-target]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var subSel = this.getAttribute('data-scroll-target');
        var href = this.getAttribute('href');
        var targetSel = subSel || (href && href.length > 1 && href.charAt(0) === '#' ? href : null);
        if (!targetSel) return;
        var target = document.querySelector(targetSel);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: top, behavior: behavior });
      });
    });
  }
})();
