/**
 * Lumyx Google conversion events + A/B test variant tracking
 *
 * Page views should stay as Google Ads/GA4 config calls only.
 * Lead conversions should fire only after a successful form submission or
 * confirmed booking signal.
 *
 * All events now include 'variant' parameter for A/B testing (v1 vs v2)
 */
(function () {
  'use strict';

  var GOOGLE_ADS_LEAD_SEND_TO = 'AW-17852608393/5N5kCO_t3MocEInf5MBC';
  var SESSION_DEDUPE_KEY = 'lumyx_google_lead_conversion_fired';

  // Detect which variant user is viewing (v1 = current, v2 = new)
  function getVariant() {
    const pathname = window.location.pathname;
    if (pathname.startsWith('/v2')) {
      return 'v2'; // New design version
    }
    return 'v1'; // Original live version
  }

  function safeSessionGet(key) {
    try { return window.sessionStorage.getItem(key); } catch (e) { return null; }
  }

  function safeSessionSet(key, value) {
    try { window.sessionStorage.setItem(key, value); } catch (e) {}
  }

  function getAttributionChannel() {
    if (typeof window.getLumyxAttribution !== 'function') return 'direct';
    try {
      return window.getLumyxAttribution().channel || 'direct';
    } catch (e) {
      return 'direct';
    }
  }

  window.lumyxTrackLeadConversion = function (source, metadata) {
    var details = metadata || {};
    var conversionSource = source || 'lead';
    var transactionId = details.transaction_id || details.eventId || details.email || '';
    var variant = getVariant();

    if (typeof window.gtag !== 'function') return false;

    window.gtag('event', conversionSource === 'booking' ? 'book_appointment' : 'generate_lead', {
      event_category: conversionSource === 'booking' ? 'booking' : 'lead_form',
      event_label: details.event_label || details.service || conversionSource,
      source_channel: details.source_channel || getAttributionChannel(),
      form_location: details.form_location || window.location.pathname,
      variant: variant
    });

    // Avoid counting the same visitor twice if they submit the form and book
    // in the same session. Google Ads can still count repeat sessions normally.
    if (safeSessionGet(SESSION_DEDUPE_KEY)) return false;

    safeSessionSet(SESSION_DEDUPE_KEY, String(Date.now()));

    var conversionPayload = {
      send_to: GOOGLE_ADS_LEAD_SEND_TO,
      variant: variant
    };

    if (transactionId) {
      conversionPayload.transaction_id = String(transactionId);
    }

    window.gtag('event', 'conversion', conversionPayload);
    return true;
  };

  console.log('A/B Variant:', getVariant());
})();
