// Declare global variables at the top
let selectedDate = null;
let selectedTime = null;
let confirmButton = null;
let originalText = '';

// Initialize EmailJS
(function() {
    emailjs.init("kroz7yxsw1nMzB7br");
})();

// Function to send email
async function sendEmail(templateId, templateParams) {
    try {
        const result = await emailjs.send('service_qe8dgoh', templateId, templateParams);
        console.log('Email sent successfully:', result);
        return true;
    } catch (error) {
        console.error('Failed to send email:', error);
        return false;
    }
}

// Helper function to format time
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Helper function to generate Zoom link
function generateZoomLink() {
    const meetingId = Math.floor(Math.random() * 1000000000);
    return `https://zoom.us/j/${meetingId}`;
}

// Handle Calendly event scheduling
window.addEventListener('calendly.event_scheduled', function(e) {
    const event = e.data.event;
    const invitee = e.data.payload.event.invitee;
    
    // Format date and time
    const eventDate = new Date(event.start_time);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // Send confirmation email to client
    const clientEmailParams = {
        to_email: invitee.email,
        from_name: "Lumyx Agency",
        to_name: invitee.name,
        subject: "Your Strategy Call Confirmation",
        message: `Your strategy call has been scheduled for ${formattedDate} at ${formattedTime}.`,
        meeting_type: "Strategy Call",
        meeting_details: event.location || "We'll send you the meeting details shortly.",
        date: formattedDate,
        time: formattedTime
    };
    
    sendEmail('template_jrwx295', clientEmailParams);

    // Send notification email to team
    const teamEmailParams = {
        to_email: 'cadenbuiting6@gmail.com',
        from_name: "Booking System",
        client_name: invitee.name,
        client_email: invitee.email,
        client_phone: invitee.phone || 'Not provided',
        subject: "New Strategy Call Booking",
        message: `New strategy call booked for ${formattedDate} at ${formattedTime}`,
        meeting_type: "Strategy Call",
        meeting_details: event.location || "Location to be determined",
        date: formattedDate,
        time: formattedTime
    };
    
    sendEmail('template_t5xs49r', teamEmailParams);

    // Store booking in Supabase
    if (window.addBooking) {
        window.addBooking({
            email: invitee.email,
            date: eventDate.toISOString().split('T')[0],
            time: eventDate.toLocaleTimeString('en-US', { hour12: false }),
            callType: "Strategy Call",
            name: invitee.name,
            phone: invitee.phone || null
        });
    }
});

// Override the existing confirmBooking function
window.confirmBooking = async function() {
    // Get the selected date and time from the window object
    selectedDate = window.selectedDate;
    selectedTime = window.selectedTime;

    if (!selectedDate || !selectedTime) {
        alert('Please select a date and time');
        return;
    }
    
    const name = document.getElementById('clientName').value;
    const email = document.getElementById('clientEmail').value;
    const phone = document.getElementById('clientPhone').value;
    const callType = document.querySelector('input[name="callType"]:checked')?.value;

    if (!name || !email || !phone || !callType) {
        alert('Please fill in all contact information and select a call type');
        return;
    }

    try {
        // Show loading state
        confirmButton = document.querySelector('.booking-confirmation-buttons button:first-child');
        originalText = confirmButton.textContent;
        confirmButton.textContent = 'Scheduling...';
        confirmButton.disabled = true;

        // Generate Zoom link if needed
        const meetingLink = callType === 'zoom' ? generateZoomLink() : null;

        // Format date and time for email
        const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const formattedTime = formatTime(selectedTime);

        // Send confirmation email to client
        const clientEmailParams = {
            to_email: email,
            from_name: "Lumyx Agency",
            to_name: name,
            subject: "Your Strategy Call Confirmation",
            message: `Your strategy call has been scheduled for ${formattedDate} at ${formattedTime}.`,
            meeting_type: callType === 'zoom' ? 'Zoom Call' : 'Phone Call',
            meeting_details: callType === 'zoom' ? meetingLink : phone,
            date: formattedDate,
            time: formattedTime
        };
        
        const clientEmailSent = await sendEmail('template_jrwx295', clientEmailParams);
        if (!clientEmailSent) {
            throw new Error('Failed to send client confirmation email');
        }

        // Send notification email to team
        const teamEmailParams = {
            to_email: 'cadenbuiting6@gmail.com',
            from_name: "Booking System",
            client_name: name,
            client_email: email,
            client_phone: phone,
            subject: "New Strategy Call Booking",
            message: `New strategy call booked for ${formattedDate} at ${formattedTime}`,
            meeting_type: callType === 'zoom' ? 'Zoom Call' : 'Phone Call',
            meeting_details: callType === 'zoom' ? meetingLink : phone,
            date: formattedDate,
            time: formattedTime
        };
        
        const teamEmailSent = await sendEmail('template_t5xs49r', teamEmailParams);
        if (!teamEmailSent) {
            throw new Error('Failed to send team notification email');
        }
        
        // Update UI
        const selectedDay = document.querySelector('.day-option.selected');
        if (selectedDay) selectedDay.classList.add('booked');
        const confirmationElement = document.querySelector('.booking-confirmation');
        if (confirmationElement) confirmationElement.classList.remove('show');
        
        // Clear the form
        document.getElementById('clientName').value = '';
        document.getElementById('clientEmail').value = '';
        document.getElementById('clientPhone').value = '';
        
        // Show success message
        alert('Call scheduled successfully! You will receive a confirmation email shortly.');
        
        // Update time slot UI
        document.querySelectorAll('.time-slot').forEach(slot => {
            if (slot.dataset.time === selectedTime) {
                slot.classList.add('booked');
            }
        });
    } catch (error) {
        console.error('Booking error:', error);
        alert('There was an error scheduling your call. Please try again or contact us directly at cadenbuiting6@gmail.com');
    } finally {
        // Reset button state
        if (confirmButton) {
            confirmButton.textContent = originalText;
            confirmButton.disabled = false;
        }
    }
}; 