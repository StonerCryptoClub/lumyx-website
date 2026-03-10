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
  'https://script.google.com/macros/s/AKfycbxRtLFk9cpaiUzgtvk6v0exaIIh_As7prvmOT4qD5l_nlFhz7kPIKva_sHA_oRP0iEd/exec';

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
    <p class="vsl-overlay-label">Click to Learn More</p>
  `;
  overlay.addEventListener('click', function () {
    overlay.classList.add('hiding');
    setTimeout(() => overlay.remove(), 380);
  });
  wrapper.appendChild(overlay);
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

    let submitSucceeded = false;
    const originalBtnText = submitBtn.querySelector('.hf-btn-text')?.textContent || 'Get My Free Strategy Call ->';

    try {
      // Prevent indefinite "Sending..." state if the request hangs.
      const timeoutMs = 12000;
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
      });

      await Promise.race([
        fetch(GOOGLE_SHEETS_WEBHOOK, {
          method: 'POST',
          mode: 'no-cors',
          // Keep request "simple" for Apps Script web app endpoints.
          body: JSON.stringify(payload),
          keepalive: true,
        }),
        timeoutPromise,
      ]);
      submitSucceeded = true;

      // Store lead data for potential use on booking page
      try {
        sessionStorage.setItem('lumyx_lead', JSON.stringify(payload));
      } catch (_) {}

      // Scroll to Calendly booking section
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      const btnText = submitBtn.querySelector('.hf-btn-text');
      if (btnText) btnText.textContent = 'Done! Scroll down to book your call';

    } catch (err) {
      showError('Something went wrong. Please try again or email us directly.');
    } finally {
      // Always clear loading state so user never gets stuck.
      setLoading(false);

      if (submitSucceeded) {
        const btnText = submitBtn.querySelector('.hf-btn-text');
        if (btnText) {
          setTimeout(() => {
            btnText.textContent = originalBtnText;
          }, 3500);
        }
      }
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
