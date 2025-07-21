// Meta Pixel Event Tracking

// Track when someone starts the booking process
function trackBookingStart() {
    console.log('Tracking booking start');
    if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
            content_category: 'Booking',
            content_name: 'Strategy Call'
        });
    }
}

// Track when a booking is completed
async function trackBookingComplete(eventData) {
    console.log('Tracking booking completion:', eventData);
    
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Schedule', {
            content_category: 'Booking',
            content_name: 'Strategy Call',
            currency: 'USD',
            value: 0.00,
            predicted_ltv: 0.00
        });
    }

    // Store booking in database
    if (eventData && eventData.event) {
        const event = eventData.event;
        const invitee = eventData.invitee || {};
        
        try {
            const bookingData = {
                email: invitee.email,
                name: invitee.name,
                phone: invitee.phone || null,
                date: new Date(event.start_time).toISOString().split('T')[0],
                time: new Date(event.start_time).toLocaleTimeString('en-US', { hour12: false }),
                callType: 'Strategy Call',
                eventId: event.uuid,
                notes: invitee.questions_and_responses || null
            };

            console.log('Storing booking data:', bookingData);
            
            if (typeof window.addBooking === 'function') {
                const result = await window.addBooking(bookingData);
                console.log('Booking storage result:', result);
                
                if (!result.success) {
                    console.error('Failed to store booking:', result.error);
                }
            } else {
                console.error('addBooking function not available');
            }
        } catch (error) {
            console.error('Error processing booking:', error);
        }
    } else {
        console.error('Invalid event data:', eventData);
    }
}

// Track when contact form is submitted
function trackContactSubmit() {
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Contact');
    }
}

// Track when someone views the pricing section
function trackPricingView() {
    if (typeof fbq !== 'undefined') {
        fbq('track', 'ViewContent', {
            content_category: 'Pricing',
            content_name: 'Services Pricing'
        });
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing event listeners');
    
    // Track booking events
    const calendlyContainer = document.getElementById('calendly-container');
    if (calendlyContainer) {
        console.log('Found Calendly container, setting up event listeners');
        
        // Track when Calendly widget loads
        window.addEventListener('calendly.event_scheduled', function(e) {
            console.log('Calendly event scheduled:', e.data);
            trackBookingComplete(e.data);
        });

        // Track when someone clicks to start booking
        calendlyContainer.addEventListener('click', function() {
            trackBookingStart();
        });
    } else {
        console.error('Calendly container not found');
    }

    // Track contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            trackContactSubmit();
        });
    }

    // Track pricing section view
    const pricingSection = document.querySelector('.pricing-section');
    if (pricingSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackPricingView();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(pricingSection);
    }
}); 