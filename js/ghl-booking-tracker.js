/**
 * GHL Booking Conversion Tracker
 *
 * GHL's booking widget runs inside an iframe hosted on api.leadconnectorhq.com.
 * Because it's cross-origin, Google's standard tag can't fire inside it.
 * This script listens for postMessage events the iframe sends to the parent
 * window when a booking is confirmed, then fires the GA4 + Google Ads
 * conversion events from the parent page where the Google tag is loaded.
 *
 * GHL emits messages with shapes like:
 *   { event: 'appointment_booked', ... }
 *   { message: 'appointment_booked', ... }
 *   { type: 'appointment_booked', ... }
 *   { event: 'booking_confirmed', ... }
 */
(function () {
  'use strict';

  var GHL_ORIGINS = [
    'https://api.leadconnectorhq.com',
    'https://link.msgsndr.com',
    'https://widgets.leadconnectorhq.com',
    'https://app.gohighlevel.com'
  ];

  // Terms that indicate a successful booking in GHL postMessage data.
  var BOOKING_SIGNALS = [
    'appointment_booked',
    'booking_confirmed',
    'appointment_confirmed',
    'booking_success',
    'form_submitted',
    'calendar_booked'
  ];

  var fired = false; // Only fire once per page load.

  function isBookingMessage(data) {
    if (!data || typeof data !== 'object') return false;
    var vals = [data.event, data.type, data.message, data.action, data.name]
      .map(function (v) { return String(v || '').toLowerCase(); });
    return BOOKING_SIGNALS.some(function (signal) {
      return vals.some(function (v) { return v.indexOf(signal) !== -1; });
    });
  }

  function fireBookingConversion() {
    if (fired) return;
    fired = true;

    // GA4 book_appointment event
    if (typeof gtag === 'function') {
      gtag('event', 'book_appointment', {
        event_category: 'booking',
        event_label: 'ghl_calendar',
        source_channel: (typeof window.getLumyxAttribution === 'function')
          ? (window.getLumyxAttribution().channel || 'direct')
          : 'direct'
      });

      // Google Ads conversion
      gtag('event', 'conversion', {
        send_to: 'AW-17052600393/eRqMCNemk90bEInf5MBC'
      });
    }
  }

  window.addEventListener('message', function (event) {
    // Accept messages only from GHL domains.
    if (!GHL_ORIGINS.some(function (o) { return event.origin === o; })) return;

    var data = event.data;

    // Handle JSON string payloads.
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (e) { return; }
    }

    if (isBookingMessage(data)) {
      fireBookingConversion();
    }
  }, false);

  // Fallback: also watch for URL hash/query changes that GHL sometimes uses
  // to signal booking completion (e.g. ?booking=confirmed appended to iframe src).
  var lastHref = window.location.href;
  var observer = new MutationObserver(function () {
    if (window.location.href !== lastHref) {
      lastHref = window.location.href;
      if (/booking[_-]?(confirmed|success)|appointment[_-]?(booked|confirmed)/i.test(lastHref)) {
        fireBookingConversion();
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();
