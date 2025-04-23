// Initialize Supabase client
const supabase = window.supabase.createClient(config.supabase.url, config.supabase.anonKey);

// Subscriber management
async function addSubscriber(email, name = null, phone = null, source = 'newsletter') {
    try {
        const { data, error } = await supabase
            .from('subscribers')
            .upsert([
                {
                    email,
                    name,
                    phone,
                    source
                }
            ], {
                onConflict: 'email',
                ignoreDuplicates: false
            });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error adding subscriber:', error);
        return { success: false, error: error.message };
    }
}

// Booking management
async function addBooking(subscriberEmail, bookingDate, bookingTime, callType) {
    try {
        // First ensure subscriber exists
        await addSubscriber(subscriberEmail, null, null, 'booking');

        const { data, error } = await supabase
            .from('bookings')
            .insert([
                {
                    subscriber_email: subscriberEmail,
                    booking_date: bookingDate,
                    booking_time: bookingTime,
                    call_type: callType
                }
            ]);

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error adding booking:', error);
        return { success: false, error: error.message };
    }
}

// Get all bookings for a subscriber
async function getSubscriberBookings(email) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                subscribers (
                    name,
                    phone
                )
            `)
            .eq('subscriber_email', email);

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return { success: false, error: error.message };
    }
} 