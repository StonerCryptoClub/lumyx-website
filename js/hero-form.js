/**
 * Lumyx Hero Lead Form
 * - Validates fields client-side
 * - POSTs to GHL through a Netlify function
 * - On success: stores lead in sessionStorage + smooth-scrolls to Calendly
 *
 * GHL SETUP:
 * - Netlify env vars must include GHL_PRIVATE_INTEGRATION_TOKEN and GHL_LOCATION_ID
 */

const STRATEGY_CALL_ENDPOINT = '/.netlify/functions/ghl-strategy-call';
const STRATEGY_CALL_WEBHOOK_ENDPOINT =
  (typeof window !== 'undefined' && window.GHL_STRATEGY_WEBHOOK)
    ? String(window.GHL_STRATEGY_WEBHOOK).trim()
    : 'https://services.leadconnectorhq.com/hooks/yrcYgS03BFe8fHYJOaTx/webhook-trigger/013f481f-3d30-44fa-81b9-c39b3617d3cc';

// Inject VSL iframe if URL is set
function initVSL() {
  const vslUrl =
    (typeof window !== 'undefined' && window.VSL_YOUTUBE_URL)
      ? String(window.VSL_YOUTUBE_URL).trim()
      : '';
  if (!vslUrl) return;

  const wrapper = document.getElementById('vsl-wrapper');
  if (!wrapper) return;

  const videoId = extractYouTubeId(vslUrl);
  if (!videoId) return;

  const placeholder = document.getElementById('vsl-placeholder');
  if (placeholder) placeholder.remove();

  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;
  iframe.title = 'Lumyx Consulting Strategy Overview';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  wrapper.appendChild(iframe);

  // Click-to-play overlay (50% opacity hint)
  const overlay = document.createElement('div');
  overlay.className = 'vsl-click-overlay';
  overlay.innerHTML = `
    <div class="vsl-overlay-play"><i class="fas fa-play"></i></div>
    <p class="vsl-overlay-label">Watch the VSL</p>
  `;
  overlay.addEventListener('click', function () {
    document.body.classList.add('vsl-active');
    overlay.classList.add('hiding');
    setTimeout(() => overlay.remove(), 380);
  });
  wrapper.appendChild(overlay);
}

// Wire up the hero "Watch the VSL" secondary CTA to scroll to the video and start it.
function initWatchVslButton() {
  const watchBtn = document.getElementById('hero-watch-vsl');
  if (!watchBtn) return;
  watchBtn.addEventListener('click', function () {
    const wrapper = document.getElementById('vsl-wrapper');
    if (wrapper) {
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const overlay = document.querySelector('.vsl-click-overlay');
    if (overlay) {
      setTimeout(() => overlay.click(), 350);
    }
  });
}

function extractYouTubeId(url) {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&"'>]+)/
  );
  return match ? match[1] : null;
}

// Form handling
document.addEventListener('DOMContentLoaded', function () {
  // Initialize VSL after DOM is fully ready.
  initVSL();
  initWatchVslButton();

  const headlineLine = document.querySelector('.hero-headline-line');
  if (headlineLine) {
    // Trigger after first paint so the center-out animation is visible.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        headlineLine.classList.add('is-visible');
      });
    });
  }

  const form = document.getElementById('hero-lead-form');
  if (!form) return;

  const submitBtn = document.getElementById('hf-submit');
  const errorBox = document.getElementById('hf-error');
  const btnText = submitBtn ? submitBtn.querySelector('.hf-btn-text') : null;
  const defaultButtonText = btnText ? btnText.textContent : 'Get My Free Strategy Call \u2192';

  // Clear per-field error when user starts typing
  ['hf-name','hf-email','hf-business','hf-service'].forEach(function(id) {
    const el = form.querySelector('#' + id);
    if (el) {
      const eventName = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(eventName, function() {
        clearFieldError(id);
        hideError();
      });
    }
  });

  ['hf-phone-area', 'hf-phone-prefix', 'hf-phone-line'].forEach(function(id, index, fields) {
    const el = form.querySelector('#' + id);
    if (!el) return;

    el.addEventListener('input', function() {
      this.value = this.value.replace(/\D/g, '');
      clearFieldError('hf-phone');
      hideError();

      const nextId = fields[index + 1];
      if (nextId && this.value.length >= Number(this.maxLength)) {
        const next = form.querySelector('#' + nextId);
        if (next) next.focus();
      }
    });
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nameEl     = form.querySelector('#hf-name');
    const emailEl    = form.querySelector('#hf-email');
    const phoneAreaEl = form.querySelector('#hf-phone-area');
    const phonePrefixEl = form.querySelector('#hf-phone-prefix');
    const phoneLineEl = form.querySelector('#hf-phone-line');
    const phoneGroupEl = form.querySelector('#hf-phone-group');
    const businessEl = form.querySelector('#hf-business');
    const serviceEl  = form.querySelector('#hf-service');

    const name     = nameEl.value.trim();
    const email    = emailEl.value.trim();
    const phone    = [phoneAreaEl.value, phonePrefixEl.value, phoneLineEl.value].join('');
    const business = businessEl.value.trim();
    const service  = serviceEl.value;
    const smsTransactionalEl = form.querySelector('#hf-sms-transactional');
    const smsMarketingEl = form.querySelector('#hf-sms-marketing');
    const smsTransactional = smsTransactionalEl ? smsTransactionalEl.checked : false;
    const smsMarketing = smsMarketingEl ? smsMarketingEl.checked : false;
    const smsConsent = smsTransactional || smsMarketing;

    // Clear all previous errors
    clearAllFieldErrors();
    hideError();

    // Per-field validation
    let hasError = false;
    if (!name)     { showFieldError('hf-name', nameEl);     hasError = true; }
    if (!email || !isValidEmail(email)) { showFieldError('hf-email', emailEl); hasError = true; }
    if (!phone || !isValidPhone(phone)) { showFieldError('hf-phone', phoneGroupEl);   hasError = true; }
    if (!business) { showFieldError('hf-business', businessEl); hasError = true; }
    if (!service)  { showFieldError('hf-service', serviceEl);   hasError = true; }
    if (hasError) {
      showError('Please fix the highlighted fields and try again.');
      return;
    }

    const attribution = (typeof window.getLumyxAttribution === 'function') ? window.getLumyxAttribution() : {};

    const payload = { name, email, phone, business, service, smsConsent, smsTransactional, smsMarketing, attribution, timestamp: new Date().toISOString() };

    setLoading(true);

    try {
      await submitLeadToGhl(payload);
    } catch (err) {
      console.error('Strategy call submission failed:', err);
      showError('Something went wrong. Please try again or message us directly.');
      setLoading(false);
      return;
    }

    // Store lead locally
    try { sessionStorage.setItem('lumyx_lead', JSON.stringify(payload)); } catch (_) {}

    setSuccess();

    // Attempt to prefill the booking widget with captured details, then scroll.
    prefillBookingWidget(payload);

    // Scroll to booking section
    setTimeout(function () {
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      // Re-enable button after redirect so form is reusable
      setTimeout(function () {
        resetButton();
      }, 4000);
    }, 600);
  });

  function setLoading(state) {
    submitBtn.disabled = state;
    submitBtn.classList.toggle('loading', state);
    submitBtn.classList.remove('success');
    if (btnText && state) btnText.textContent = defaultButtonText;
  }

  function setSuccess() {
    submitBtn.classList.remove('loading');
    submitBtn.classList.add('success');
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Saved! Continue below';
  }

  function resetButton() {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading', 'success');
    if (btnText) btnText.textContent = defaultButtonText;
  }

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.add('visible');
  }

  function hideError() {
    errorBox.textContent = '';
    errorBox.classList.remove('visible');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return phone.replace(/\D/g, '').length >= 10;
  }

  async function submitLeadToGhl(payload) {
    // Primary path: secure server-side function (keeps private token off the client).
    try {
      const response = await fetch(STRATEGY_CALL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) return;

      const details = await response.text();
      throw new Error(`Netlify strategy endpoint failed (${response.status}): ${details}`);
    } catch (netlifyErr) {
      // Fallback path: direct GHL webhook for reliability if function/env is not configured.
      if (!STRATEGY_CALL_WEBHOOK_ENDPOINT) {
        throw netlifyErr;
      }

      const webhookPayload = {
        ...payload,
        source: 'hero-lead-form',
        page: (typeof window !== 'undefined' ? window.location.href : ''),
        submittedAt: new Date().toISOString()
      };

      const webhookResponse = await fetch(STRATEGY_CALL_WEBHOOK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookPayload)
      });

      if (!webhookResponse.ok) {
        const webhookDetails = await webhookResponse.text();
        throw new Error(
          `Webhook fallback failed (${webhookResponse.status}): ${webhookDetails}; original error: ${netlifyErr.message}`
        );
      }
    }
  }

  function prefillBookingWidget(payload) {
    const iframe = document.getElementById('d0prMwxo4qsyqutYVpCL_1781470766128');
    if (!iframe || !iframe.src) return;

    try {
      const iframeUrl = new URL(iframe.src, window.location.origin);
      iframeUrl.searchParams.set('name', payload.name || '');
      iframeUrl.searchParams.set('email', payload.email || '');
      iframeUrl.searchParams.set('phone', payload.phone || '');
      iframeUrl.searchParams.set('business', payload.business || '');
      iframeUrl.searchParams.set('service', payload.service || '');

      const nextSrc = iframeUrl.toString();
      if (iframe.src !== nextSrc) {
        iframe.src = nextSrc;
      }
    } catch (_) {
      // Ignore malformed src URL and keep normal booking flow.
    }
  }

  function showFieldError(fieldId, inputEl) {
    const errEl = document.getElementById('hf-err-' + fieldId.replace('hf-', ''));
    if (errEl) errEl.classList.add('visible');
    if (inputEl) inputEl.classList.add('hf-invalid');
  }

  function clearFieldError(fieldId) {
    const errEl = document.getElementById('hf-err-' + fieldId.replace('hf-', ''));
    if (errEl) errEl.classList.remove('visible');
    const inputEl = fieldId === 'hf-phone'
      ? form.querySelector('#hf-phone-group')
      : form.querySelector('#' + fieldId);
    if (inputEl) inputEl.classList.remove('hf-invalid');
  }

  function clearAllFieldErrors() {
    form.querySelectorAll('.hf-field-error').forEach(function(el) { el.classList.remove('visible'); });
    form.querySelectorAll('.hf-invalid').forEach(function(el) { el.classList.remove('hf-invalid'); });
  }
});
