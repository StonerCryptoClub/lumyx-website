/**
 * LUMYX — faq page
 *
 * Progressive enhancement only. Every question/answer is real markup in the
 * DOM (readable and crawlable with this script disabled); this file adds
 * live search, category filtering, a shareable URL state, and deep-linking.
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initFaq();
  });

  function initFaq() {
    var root = document.querySelector('[data-faq]');
    if (!root) return;

    var searchWrap = root.querySelector('.faq-search');
    var input = root.querySelector('.faq-search input');
    var clearBtn = root.querySelector('.faq-search__clear');
    var countEl = root.querySelector('.faq-count');
    var railBtns = Array.prototype.slice.call(root.querySelectorAll('.faq-rail__btn'));
    var cats = Array.prototype.slice.call(root.querySelectorAll('.faq-cat'));
    var items = Array.prototype.slice.call(root.querySelectorAll('.faq-q'));
    var emptyState = root.querySelector('.faq-empty');
    var emptyQuery = root.querySelector('.faq-empty__query');
    var emptyClearBtn = root.querySelector('.faq-empty__clear');
    var emptyShowAllBtn = root.querySelector('.faq-empty__showall');
    var totalCount = items.length;

    var state = { q: '', category: 'all' };

    function norm(s) {
      return (s || '').toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    }

    // pre-index each item's searchable text once
    items.forEach(function (item) {
      var qText = item.querySelector('.faq-q__text');
      var aText = item.querySelector('.faq-q__a');
      item.__search = norm((qText ? qText.textContent : '') + ' ' + (aText ? aText.textContent : ''));
    });

    function apply() {
      var needle = norm(state.q);
      var visibleTotal = 0;

      cats.forEach(function (cat) {
        var catSlug = cat.getAttribute('data-cat');
        var catMatches = state.category === 'all' || state.category === catSlug;
        var anyVisibleInCat = false;

        var catItems = Array.prototype.slice.call(cat.querySelectorAll('.faq-q'));
        catItems.forEach(function (item) {
          var textMatch = !needle || item.__search.indexOf(needle) !== -1;
          var show = catMatches && textMatch;
          item.classList.toggle('is-hidden', !show);
          if (show) { anyVisibleInCat = true; visibleTotal++; }
        });

        cat.classList.toggle('is-hidden', !anyVisibleInCat);
      });

      if (countEl) {
        if (!needle && state.category === 'all') {
          countEl.innerHTML = '<b>' + totalCount + '</b> answers';
        } else {
          countEl.innerHTML = '<b>' + visibleTotal + '</b> of ' + totalCount + ' answers' + (needle ? ' matching "' + escapeHtml(state.q) + '"' : '');
        }
      }

      if (emptyState) {
        var showEmpty = visibleTotal === 0;
        emptyState.classList.toggle('is-visible', showEmpty);
        if (showEmpty && emptyQuery) {
          emptyQuery.textContent = state.q ? '"' + state.q + '"' : 'this category';
        }
      }
    }

    function escapeHtml(s) {
      var div = document.createElement('div');
      div.textContent = s;
      return div.innerHTML;
    }

    // --- search input
    if (input) {
      var debounceTimer = null;
      input.addEventListener('input', function () {
        state.q = input.value;
        searchWrap.classList.toggle('has-value', !!state.q);
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(apply, 120);
      });
      input.addEventListener('keydown', function (ev) {
        if (ev.key === 'Escape' && input.value) {
          ev.preventDefault();
          clearSearch();
        }
      });
    }

    function clearSearch() {
      state.q = '';
      if (input) input.value = '';
      if (searchWrap) searchWrap.classList.remove('has-value');
      apply();
      if (input) input.focus();
    }

    if (clearBtn) clearBtn.addEventListener('click', clearSearch);
    if (emptyClearBtn) emptyClearBtn.addEventListener('click', clearSearch);
    if (emptyShowAllBtn) {
      emptyShowAllBtn.addEventListener('click', function () {
        state.category = 'all';
        railBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === 'all' ? 'true' : 'false'); });
        clearSearch();
      });
    }

    // --- category rail
    railBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-cat');
        state.category = cat;
        railBtns.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        syncUrl();
        apply();
      });
    });

    // --- URL state (shareable filtered view; never pollutes back-button history)
    function syncUrl() {
      try {
        var url = new URL(window.location.href);
        if (state.category === 'all') url.searchParams.delete('c');
        else url.searchParams.set('c', state.category);
        window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      } catch (e) {}
    }

    function readUrlCategory() {
      try {
        var url = new URL(window.location.href);
        var c = url.searchParams.get('c');
        if (c && railBtns.some(function (b) { return b.getAttribute('data-cat') === c; })) {
          state.category = c;
          railBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === c ? 'true' : 'false'); });
        }
      } catch (e) {}
    }

    // --- deep linking: #q-<slug> opens and scrolls to that question
    function openFromHash() {
      var hash = window.location.hash;
      if (!hash || hash.length < 2) return;
      var target = document.getElementById(hash.slice(1));
      if (!target || !target.classList || !target.classList.contains('faq-q')) return;

      // clear any filter state that would hide it
      state.category = 'all';
      state.q = '';
      if (input) input.value = '';
      if (searchWrap) searchWrap.classList.remove('has-value');
      railBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat') === 'all' ? 'true' : 'false'); });
      apply();

      target.setAttribute('open', '');
      requestAnimationFrame(function () {
        var headerOffset = 88;
        var top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    }

    // update hash (replaceState, no history spam) when a question is opened by click
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (item.open && item.id) {
          try { window.history.replaceState(null, '', '#' + item.id); } catch (e) {}
        }
      });
    });

    readUrlCategory();
    apply();
    openFromHash();
  }
})();
