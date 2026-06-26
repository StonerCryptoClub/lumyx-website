/**
 * Lumyx attribution tracking
 * - Captures UTM params + ad click IDs (gclid/fbclid/etc.) on landing
 * - Persists FIRST-TOUCH attribution in localStorage so it survives navigation
 * - Derives a simple channel (meta / google / tiktok / bing / direct / referral)
 * - Exposes window.getLumyxAttribution() for the lead form to read
 */
(function () {
  'use strict';

  var KEY = 'lumyx_attribution';
  var FIELDS = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'gclid', 'fbclid', 'ttclid', 'msclkid'
  ];

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }

  function write(obj) {
    try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {}
    try { sessionStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {}
  }

  function deriveChannel(data, referrer) {
    var s = String(data.utm_source || '').toLowerCase();
    if (data.fbclid || /facebook|fb|meta|instagram|^ig$/.test(s)) return 'meta';
    if (data.gclid || /google|adwords|gads/.test(s)) return 'google';
    if (data.ttclid || /tiktok/.test(s)) return 'tiktok';
    if (data.msclkid || /bing|microsoft/.test(s)) return 'bing';
    if (s) return s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    var ref = String(referrer || '').toLowerCase();
    if (/facebook|instagram/.test(ref)) return 'meta';
    if (/google/.test(ref)) return 'google';
    if (/bing/.test(ref)) return 'bing';
    if (/tiktok/.test(ref)) return 'tiktok';
    return ref ? 'referral' : 'direct';
  }

  var params = new URLSearchParams(window.location.search);
  var current = {};
  FIELDS.forEach(function (k) {
    var v = params.get(k);
    if (v) current[k] = String(v).slice(0, 255);
  });

  var stored = read();

  // First-touch wins: only write attribution once per browser unless none captured yet.
  if (!stored || !stored.captured) {
    stored = {
      captured: true,
      channel: deriveChannel(current, document.referrer),
      landingPage: window.location.href.slice(0, 500),
      referrer: (document.referrer || '').slice(0, 500),
      capturedAt: new Date().toISOString()
    };
    FIELDS.forEach(function (k) { stored[k] = current[k] || ''; });
    write(stored);
  }

  window.LumyxAttribution = stored;
  window.getLumyxAttribution = function () {
    return window.LumyxAttribution || read() || {};
  };
})();
