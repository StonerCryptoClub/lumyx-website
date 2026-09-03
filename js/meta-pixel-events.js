(function () {
    'use strict';

    var META_PIXEL_ID = '914274674738131';
    var BOOKING_START_KEY = 'lumyx_meta_booking_start_fired';

    function installMetaPixel() {
        if (window.fbq) return;

        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
    }

    function initializeMetaPixel() {
        installMetaPixel();
        if (typeof window.fbq !== 'function') return false;

        if (!window.__lumyxMetaPixelInitialized) {
            window.fbq('init', META_PIXEL_ID);
            window.fbq('track', 'PageView');
            window.__lumyxMetaPixelInitialized = true;
        }

        return true;
    }

    function safeSessionGet(key) {
        try { return window.sessionStorage.getItem(key); } catch (e) { return null; }
    }

    function safeSessionSet(key, value) {
        try { window.sessionStorage.setItem(key, value); } catch (e) {}
    }

    function getVariant() {
        return window.location.pathname.indexOf('/v2') === 0 ? 'v2' : 'main';
    }

    function trackMeta(eventName, payload, options) {
        if (!initializeMetaPixel()) return false;

        window.fbq('track', eventName, payload || {}, options || {});
        return true;
    }

    window.lumyxTrackMetaConversion = function (source, metadata) {
        var details = metadata || {};
        var conversionSource = source || 'lead';
        var eventName = conversionSource === 'booking' ? 'Schedule' : 'Lead';
        var dedupeKey = 'lumyx_meta_v2_' + eventName.toLowerCase() + '_conversion_fired';
        var eventId = details.transaction_id || details.eventId || details.email || '';

        if (safeSessionGet(dedupeKey)) return false;

        var payload = {
            content_name: details.event_label || details.service || (conversionSource === 'booking' ? 'Growth Audit Booking' : 'Growth Audit Lead Form'),
            content_category: conversionSource === 'booking' ? 'Booking' : 'Lead Generation',
            source_channel: details.source_channel || 'website',
            form_location: details.form_location || window.location.pathname,
            variant: details.variant || getVariant()
        };

        var options = eventId ? { eventID: String(eventId) } : {};
        var tracked = trackMeta(eventName, payload, options);
        if (tracked) {
            safeSessionSet(dedupeKey, String(Date.now()));
        }
        return tracked;
    };

    window.trackBookingStart = function () {
        if (safeSessionGet(BOOKING_START_KEY)) return false;
        safeSessionSet(BOOKING_START_KEY, String(Date.now()));

        return trackMeta('InitiateCheckout', {
            content_category: 'Booking',
            content_name: 'Growth Audit Booking',
            form_location: window.location.pathname,
            variant: getVariant()
        });
    };

    window.trackContactSubmit = function () {
        return window.lumyxTrackMetaConversion('lead_form', {
            event_label: 'Contact Form',
            form_location: window.location.pathname,
            variant: getVariant()
        });
    };

    window.trackPricingView = function () {
        return trackMeta('ViewContent', {
            content_category: 'Pricing',
            content_name: 'Services Pricing',
            variant: getVariant()
        });
    };

    initializeMetaPixel();

    document.addEventListener('DOMContentLoaded', function() {
        var calendlyContainer = document.getElementById('calendly-container');
        if (calendlyContainer) {
            calendlyContainer.addEventListener('click', window.trackBookingStart);
        }

        var contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', window.trackContactSubmit);
        }

        var pricingSection = document.querySelector('.pricing-section');
        if (pricingSection && 'IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        window.trackPricingView();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(pricingSection);
        }
    });
})();