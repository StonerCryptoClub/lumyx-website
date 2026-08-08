/**
 * MERIDIAN — blog.js
 * Builds a category filter from the live Contentful cards the shared loader
 * injects into `.blog-grid`, then filters by toggling [hidden]. The loader is
 * never touched; this only reads its output. Content works fully without JS.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.querySelector('.blog-grid');
    var bar = document.querySelector('.blog-filter');
    if (!grid || !bar) return;

    function build() {
      var cards = Array.prototype.slice.call(grid.querySelectorAll('.blog-card'));
      if (!cards.length) return false;

      // collect unique categories in first-seen order
      var cats = [];
      cards.forEach(function (c) {
        var el = c.querySelector('.blog-category');
        var t = el ? el.textContent.trim() : '';
        if (t && cats.indexOf(t) === -1) cats.push(t);
      });
      if (cats.length < 2) return true; // nothing worth filtering

      bar.innerHTML = '';
      addChip('All', null, true);
      cats.forEach(function (c) { addChip(c, c, false); });
      return true;
    }

    function addChip(label, cat, active) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'blog-filter__chip' + (active ? ' is-active' : '');
      b.textContent = label;
      b.addEventListener('click', function () { apply(cat, b); });
      bar.appendChild(b);
    }

    function apply(cat, chip) {
      bar.querySelectorAll('.blog-filter__chip').forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      if (cat === null) { grid.removeAttribute('data-filtered'); }
      else { grid.setAttribute('data-filtered', ''); }
      grid.querySelectorAll('.blog-card').forEach(function (c) {
        var el = c.querySelector('.blog-category');
        var t = el ? el.textContent.trim() : '';
        c.hidden = (cat !== null && t !== cat);
      });
    }

    // The loader populates .blog-grid asynchronously; watch for it, then build once.
    if (build()) return;
    if (!('MutationObserver' in window)) { setTimeout(build, 1500); return; }
    var mo = new MutationObserver(function () { if (build()) mo.disconnect(); });
    mo.observe(grid, { childList: true });
    setTimeout(function () { mo.disconnect(); build(); }, 6000); // safety cutoff
  });
})();
