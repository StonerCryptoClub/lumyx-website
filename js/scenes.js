/**
 * MERIDIAN — scenes.js
 * Signature scroll scenes for the service pages only (PPC desk, AI timeline,
 * build log, build-sheet dots). Every hidden state lives in motion.css behind
 * html.js-motion, so the pages read fully without this. Ref: SUBPAGES-BUILD §5,§6.
 */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initDeskScene();
    initSnapDots();
    initTimeline();
    initBuildLog();
  });

  /* ---------- PPC: the scrolling audit (sticky terminal state machine) ---------- */
  function initDeskScene() {
    var scene = document.querySelector('.desk');
    if (!scene) return;
    var steps = Array.prototype.slice.call(scene.querySelectorAll('[data-desk-step]'));
    var bars = Array.prototype.slice.call(scene.querySelectorAll('.desk-readout__bar'));
    var rows = Array.prototype.slice.call(scene.querySelectorAll('.desk-readout__row'));
    var findings = scene.querySelector('.desk-findings');
    var lamps = Array.prototype.slice.call(scene.querySelectorAll('.desk-lamp'));
    if (!steps.length || !bars.length) return;

    // [ad, page, speed, loop], current-row index, findings text
    var states = [
      { w: [82, 48, 34, 56], cur: 0, f: '> demand confirmed — the clicks are not the problem' },
      { w: [82, 48, 34, 56], cur: 1, f: '> page does not repeat the ad’s promise — rewrite above the fold' },
      { w: [82, 71, 34, 56], cur: 2, f: '> avg first response 3h 40m — booked-call rate decays after 5 min' },
      { w: [82, 71, 68, 56], cur: 3, f: '> outcomes never reach the bid strategy — optimizing blind' }
    ];

    function apply(i) {
      var s = states[i];
      bars.forEach(function (b, k) { b.style.width = s.w[k] + '%'; });
      rows.forEach(function (r, k) { r.classList.toggle('is-current', k === s.cur); });
      lamps.forEach(function (l, k) { l.classList.toggle('is-current', k === s.cur); });
      steps.forEach(function (st, k) { st.classList.toggle('is-current', k === i); });
      if (findings) {
        findings.style.opacity = '0';
        setTimeout(function () { findings.textContent = s.f; findings.style.opacity = '1'; }, 150);
      }
    }

    if (reduce || !('IntersectionObserver' in window)) { apply(states.length - 1); steps.forEach(function (s) { s.classList.add('is-current'); }); return; }

    apply(0);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { var i = parseInt(e.target.getAttribute('data-desk-step'), 10); apply(i); }
      });
    }, { threshold: 0.5, rootMargin: '-10% 0px -10% 0px' });
    steps.forEach(function (s) { io.observe(s); });
  }

  /* ---------- PPC: build-sheet snap dots ---------- */
  function initSnapDots() {
    var track = document.querySelector('.buildsheet');
    var dotsWrap = document.querySelector('.buildsheet-dots');
    if (!track || !dotsWrap) return;
    var cards = Array.prototype.slice.call(track.querySelectorAll('.buildsheet__card'));
    var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('button'));
    if (cards.length !== dots.length) return;

    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { cards[i].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', inline: 'center', block: 'nearest' }); });
    });
    if (!('IntersectionObserver' in window)) { dots[0].classList.add('is-current'); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var i = cards.indexOf(e.target);
          dots.forEach(function (d, k) { d.classList.toggle('is-current', k === i); });
        }
      });
    }, { root: track, threshold: 0.6 });
    cards.forEach(function (c) { io.observe(c); });
  }

  /* ---------- AI: the follow-up timeline ---------- */
  function initTimeline() {
    var tl = document.querySelector('.tl');
    if (!tl) return;
    var fill = tl.querySelector('.tl__fill');
    var events = Array.prototype.slice.call(tl.querySelectorAll('.tl-event, .tl-note'));

    // reveal events + fire typing on SMS cards
    if (reduce || !('IntersectionObserver' in window)) {
      events.forEach(function (ev) { ev.classList.add('is-in'); revealSms(ev, true); });
      if (fill) fill.style.transform = 'scaleY(1)';
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); revealSms(e.target, false); io.unobserve(e.target); }
        });
      }, { threshold: 0.4, rootMargin: '0px 0px -8% 0px' });
      events.forEach(function (ev) { io.observe(ev); });

      // spine fill bound to section scroll progress
      var ticking = false;
      function update() {
        ticking = false;
        var r = tl.getBoundingClientRect(), vh = window.innerHeight;
        var start = vh * 0.7, total = r.height + start - vh * 0.3, prog = start - r.top;
        var p = Math.max(0, Math.min(1, prog / total));
        if (fill) fill.style.transform = 'scaleY(' + p + ')';
      }
      window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      window.addEventListener('resize', update, { passive: true });
      update();
    }
  }

  function revealSms(ev, instant) {
    var holder = ev.querySelector('[data-sms]');
    if (!holder) return;
    var msg = holder.querySelector('.tl-sms');
    var typing = holder.querySelector('.tl-typing');
    if (!msg) return;
    if (instant || reduce) { if (typing) typing.style.display = 'none'; msg.style.display = ''; return; }
    msg.style.display = 'none';
    if (typing) typing.style.display = 'inline-flex';
    setTimeout(function () {
      if (typing) typing.style.display = 'none';
      msg.style.display = '';
      msg.style.opacity = '0';
      requestAnimationFrame(function () { msg.style.transition = 'opacity 180ms'; msg.style.opacity = '1'; });
    }, 500);
  }

  /* ---------- AI: the build log (sequential typing) ---------- */
  function initBuildLog() {
    var log = document.querySelector('.buildlog');
    if (!log) return;
    var lines = Array.prototype.slice.call(log.querySelectorAll('.buildlog__line'));
    if (!lines.length) return;
    var data = lines.map(function (l) { return { el: l, day: l.getAttribute('data-day') || '', text: l.getAttribute('data-text') || '' }; });

    function render(instant) {
      var caret = log.querySelector('.buildlog__caret');
      if (instant || reduce) {
        data.forEach(function (d) { d.el.innerHTML = '<span class="buildlog__day">' + d.day + '</span> ' + d.text; });
        return;
      }
      var li = 0;
      function typeLine() {
        if (li >= data.length) { if (caret) caret.style.display = 'none'; return; }
        var d = data[li];
        d.el.innerHTML = '<span class="buildlog__day">' + d.day + '</span> ';
        if (li > 0 && caret) { data[li - 1].el.querySelector('.buildlog__caret') && data[li - 1].el.removeChild(data[li - 1].el.querySelector('.buildlog__caret')); }
        var i = 0;
        var caretSpan = document.createElement('span');
        caretSpan.className = 'buildlog__caret';
        d.el.appendChild(caretSpan);
        function typeChar() {
          if (i <= d.text.length) {
            caretSpan.insertAdjacentText('beforebegin', d.text.charAt(i - 1) || '');
            i++;
            setTimeout(typeChar, 14);
          } else {
            d.el.removeChild(caretSpan);
            li++;
            setTimeout(typeLine, 350);
          }
        }
        typeChar();
      }
      typeLine();
    }

    if (reduce || !('IntersectionObserver' in window)) { render(true); return; }
    // preset each line's day prefix so height is stable before typing
    data.forEach(function (d) { d.el.innerHTML = '<span class="buildlog__day">' + d.day + '</span>'; });
    var fired = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting && !fired) { fired = true; render(false); io.disconnect(); } });
    }, { threshold: 0.4 });
    io.observe(log);
  }
})();
