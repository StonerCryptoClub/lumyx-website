/**
 * MERIDIAN — meridian.js
 * Animates; never mutates content meaning. Re-implements nav + smooth
 * scroll so the page has zero root-script deps for navigation.
 * All entrance states live in motion.css behind html.js-motion, so the
 * page is fully readable if this never runs. Ref: MERIDIAN-BUILD §9, §12.
 */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    heroChoreography();
    cursorSpotlight();
    typingAuditLine();
    heroStripCounters();
    meridianThread();
    scrollReveals();
    proofBand();
    growthRail();
    headerScrollState();
    mobileDrawer();
    smoothScroll();
  });

  /* ---- M1: hero choreography ---- */
  function heroChoreography() {
    if (reduce) { root.classList.add('hero-ready'); return; }
    requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('hero-ready'); }); });
  }

  /* ---- M10: cursor spotlight ---- */
  function cursorSpotlight() {
    var hero = document.querySelector('.hero');
    var spot = hero && hero.querySelector('.hero__spotlight');
    if (!hero || !spot || reduce || window.matchMedia('(pointer: coarse)').matches) return;
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

  /* ---- M3: typing audit line (once) ---- */
  function typingAuditLine() {
    var el = document.querySelector('.audit-line__text');
    if (!el) return;
    var full = el.getAttribute('data-type') || '';
    if (reduce) { el.textContent = full; return; }
    el.textContent = '';
    var i = 0;
    function step() {
      el.textContent = full.slice(0, i);
      i++;
      if (i <= full.length) setTimeout(step, 24);
    }
    setTimeout(step, 1200);
  }

  /* ---- M4: the meridian thread ---- */
  function meridianThread() {
    var thread = document.querySelector('.meridian');
    if (!thread) return;
    var fill = thread.querySelector('.meridian__fill');
    var track = thread.querySelector('.meridian__track');
    var drench = document.querySelector('.proof-band');
    var sections = Array.prototype.slice.call(document.querySelectorAll('[data-station]'));
    if (!sections.length || !track) return;

    var stations = sections.map(function (sec) {
      var s = document.createElement('div');
      s.className = 'meridian__station';
      if (sec.hasAttribute('data-station-terminal')) s.className += ' meridian__station--terminal';
      s.innerHTML = '<span class="meridian__dot"></span><span class="meridian__label">' + sec.getAttribute('data-station') + '</span>';
      thread.appendChild(s);
      return { el: s, sec: sec };
    });

    function layout() {
      var tr = track.getBoundingClientRect();
      var top = track.offsetTop, h = track.offsetHeight;
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      stations.forEach(function (st) {
        var secTop = st.sec.getBoundingClientRect().top + window.scrollY;
        var frac = docH > 0 ? Math.min(1, Math.max(0, secTop / docH)) : 0;
        st.el.style.top = (top + frac * h) + 'px';
      });
    }

    var ticking = false;
    function update() {
      ticking = false;
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var p = docH > 0 ? Math.min(1, Math.max(0, window.scrollY / docH)) : 0;
      if (fill) fill.style.transform = 'scaleY(' + p + ')';
      var line = window.innerHeight * 0.6;
      stations.forEach(function (st) {
        var r = st.sec.getBoundingClientRect();
        st.el.classList.toggle('is-active', r.top < line);
      });
      if (drench) {
        var tr = track.getBoundingClientRect();
        var dr = drench.getBoundingClientRect();
        var overlap = dr.top < tr.bottom && dr.bottom > tr.top;
        thread.classList.toggle('on-drench', overlap);
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

    layout();
    if (reduce && fill) fill.style.transform = 'scaleY(1)';
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { layout(); onScroll(); }, { passive: true });
    update();
  }

  /* ---- M5: scroll reveals ---- */
  function scrollReveals() {
    var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!reveals.length) return;
    var groups = new Map();
    reveals.forEach(function (el) {
      var p = el.parentElement, idx = groups.get(p) || 0;
      el.style.setProperty('--stagger-i', Math.min(idx, 5));
      groups.set(p, idx + 1);
    });
    if (!('IntersectionObserver' in window)) { reveals.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- M6: proof band wipe + odometers ---- */
  function proofBand() {
    var band = document.querySelector('.proof-band');
    if (!band) return;
    var counted = false;
    function run() { band.classList.add('is-in'); if (!counted) { counted = true; band.querySelectorAll('[data-count]').forEach(countUp); } }
    if (reduce || !('IntersectionObserver' in window)) {
      band.classList.add('is-in');
      band.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = fmt(el); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { run(); io.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(band);
  }

  function heroStripCounters() {
    var strip = document.querySelector('.hero-proof-strip');
    if (!strip) return;
    var nums = strip.querySelectorAll('[data-count]');
    if (!nums.length) return;
    if (reduce) { nums.forEach(function (el) { el.textContent = fmt(el); }); return; }
    setTimeout(function () { nums.forEach(countUp); }, 680);
  }

  function fmt(el, v) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    return pre + (v === undefined ? target : v).toFixed(dec) + suf;
  }
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count')), start = null, dur = 1200;
    function tick(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / dur), eased = 1 - Math.pow(1 - t, 4);
      el.textContent = fmt(el, target * eased);
      if (t < 1) requestAnimationFrame(tick); else el.textContent = fmt(el);
    }
    requestAnimationFrame(tick);
  }

  /* ---- Method local rail ---- */
  function growthRail() {
    var rail = document.querySelector('.rail');
    if (!rail) return;
    var fill = rail.querySelector('.rail__fill');
    var steps = Array.prototype.slice.call(rail.querySelectorAll('.step'));
    if (reduce) { if (fill) fill.style.transform = 'scaleY(1)'; steps.forEach(function (s) { s.classList.add('is-active'); }); return; }
    var ticking = false;
    function update() {
      ticking = false;
      var rect = rail.getBoundingClientRect(), vh = window.innerHeight;
      var start = vh * 0.75, total = rect.height + start - vh * 0.25, prog = start - rect.top;
      var p = Math.max(0, Math.min(1, prog / total));
      if (fill) fill.style.transform = 'scaleY(' + p + ')';
      var line = vh * 0.6;
      steps.forEach(function (s) { s.classList.toggle('is-active', s.getBoundingClientRect().top < line); });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ---- M8: header ---- */
  function headerScrollState() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var ticking = false;
    function update() { ticking = false; header.classList.toggle('scrolled', window.scrollY > 24); }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---- Mobile drawer ---- */
  function mobileDrawer() {
    var btn = document.getElementById('mobile-menu-btn');
    var drawer = document.getElementById('mobile-nav-sidebar');
    var overlay = document.getElementById('mobile-nav-overlay');
    var closeBtn = document.getElementById('mobile-nav-close');
    if (!btn || !drawer || !overlay) return;
    function open() { drawer.classList.add('open'); overlay.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); document.body.style.overflow = 'hidden'; }
    function close() { drawer.classList.remove('open'); overlay.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; btn.focus(); }
    btn.addEventListener('click', open);
    overlay.addEventListener('click', close);
    if (closeBtn) closeBtn.addEventListener('click', close);
    drawer.querySelectorAll('.mobile-nav-link').forEach(function (l) { l.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('open')) close(); });
  }

  /* ---- Smooth scroll + data-scroll-target ---- */
  function smoothScroll() {
    var behavior = reduce ? 'auto' : 'smooth';
    document.querySelectorAll('a[href^="#"], [data-scroll-target]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var sub = this.getAttribute('data-scroll-target');
        var href = this.getAttribute('href');
        var sel = sub || (href && href.length > 1 && href.charAt(0) === '#' ? href : null);
        if (!sel) return;
        var target = document.querySelector(sel);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 88;
        window.scrollTo({ top: top, behavior: behavior });
      });
    });
  }
})();
