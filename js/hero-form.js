/**
 * Lumyx Hero Lead Form
 * - Validates fields client-side
 * - POSTs to Google Sheets via Apps Script webhook
 * - On success: stores lead in sessionStorage + smooth-scrolls to Calendly
 *
 * GOOGLE SHEETS SETUP (one-time):
 * 1. Go to https://script.google.com → New Project
 * 2. Paste the Apps Script from the README / plan doc
 * 3. Deploy → Web App → Anyone → copy URL
 * 4. Replace the WEBHOOK value below with your URL
 */

const GOOGLE_SHEETS_WEBHOOK =
  'https://script.google.com/macros/s/AKfycbxGXQQjusPhkFBfSd1FneQwpKp_QZD_wtK7hbsPfMrpHt9gVho_-OY2LJxG9lE-Xj5WAQ/exec';

// Inject VSL iframe if URL is set
(function initVSL() {
  if (typeof VSL_YOUTUBE_URL === 'undefined' || !VSL_YOUTUBE_URL) return;
  const wrapper = document.getElementById('vsl-wrapper');
  if (!wrapper) return;
  const placeholder = document.getElementById('vsl-placeholder');
  if (placeholder) placeholder.remove();
  const iframe = document.createElement('iframe');
  const videoId = extractYouTubeId(VSL_YOUTUBE_URL);
  if (!videoId) return;
  iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;
  iframe.title = 'Lumyx Consulting Strategy Overview';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  wrapper.appendChild(iframe);
})();

function extractYouTubeId(url) {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^?&"'>]+)/
  );
  return match ? match[1] : null;
}

// Form handling
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('hero-lead-form');
  if (!form) return;

  const submitBtn = document.getElementById('hf-submit');
  const errorBox = document.getElementById('hf-error');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name     = form.querySelector('#hf-name').value.trim();
    const email    = form.querySelector('#hf-email').value.trim();
    const phone    = form.querySelector('#hf-phone').value.trim();
    const business = form.querySelector('#hf-business').value.trim();
    const service  = form.querySelector('#hf-service').value;

    // Validation
    if (!name || !email || !phone || !business || !service) {
      showError('Please fill in all fields before submitting.');
      return;
    }
    if (!isValidEmail(email)) {
      showError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    hideError();

    const payload = { name, email, phone, business, service };

    try {
      await fetch(GOOGLE_SHEETS_WEBHOOK, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Store lead data for potential use on booking page
      try {
        sessionStorage.setItem('lumyx_lead', JSON.stringify(payload));
      } catch (_) {}

      // Scroll to Calendly booking section
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Update button to success state
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      const btnText = submitBtn.querySelector('.hf-btn-text');
      if (btnText) btnText.textContent = 'Done! Scroll down to book your call';

    } catch (err) {
      setLoading(false);
      showError('Something went wrong. Please try again or email us directly.');
    }
  });

  function setLoading(state) {
    submitBtn.disabled = state;
    if (state) {
      submitBtn.classList.add('loading');
    } else {
      submitBtn.classList.remove('loading');
    }
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
});
