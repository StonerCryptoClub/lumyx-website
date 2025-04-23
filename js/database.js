// This file is temporarily removed while we fix the email functionality.
// We'll add back database support in a separate update. 

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = 'https://ctvmeagzyszekbljtuwm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0dm1lYWd6eXN6ZWtibGp0dXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA5NTQ5NzcsImV4cCI6MjAyNjUzMDk3N30.2jvxMxPPbvPHqyxDmXX6GbRz_JJVGaB2FK1YAS5N9Ow';

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to add booking to database
export async function addBooking(bookingData) {
    console.log('Adding booking:', bookingData);
    try {
        // Validate required fields
        if (!bookingData.email || !bookingData.date || !bookingData.time) {
            throw new Error('Missing required booking fields');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(bookingData.email)) {
            throw new Error('Invalid email format');
        }

        // First, ensure the subscriber exists
        await addSubscriber({
            email: bookingData.email,
            name: bookingData.name,
            phone: bookingData.phone,
            source: 'booking'
        });

        // Then add the booking
        const { data, error } = await supabase
            .from('bookings')
            .insert([{
                subscriber_email: bookingData.email.toLowerCase(),
                booking_date: bookingData.date,
                booking_time: bookingData.time,
                call_type: bookingData.callType || 'zoom'
            }])
            .select();
            
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        console.log('Booking added successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error in addBooking:', error);
        return { 
            success: false, 
            error: error.message,
            details: error.details || null
        };
    }
}

// Function to get booked times for a specific date
export async function getBookedTimes(date) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('time, status')
            .eq('date', date)
            .eq('status', 'confirmed');
            
        if (error) throw error;
        
        return data.map(booking => booking.time);
    } catch (error) {
        console.error('Error fetching booked times:', error);
        return [];
    }
}

// Function to add subscriber to database
export async function addSubscriber(subscriberData) {
    console.log('Adding subscriber:', subscriberData);
    try {
        // Validate email
        if (!subscriberData.email || !subscriberData.email.includes('@')) {
            throw new Error('Invalid email address');
        }

        const email = subscriberData.email.toLowerCase();

        // Check if subscriber already exists
        const { data: existing } = await supabase
            .from('subscribers')
            .select('email')
            .eq('email', email)
            .single();

        if (existing) {
            console.log('Subscriber already exists:', existing);
            return { success: true, data: existing };
        }

        // Add new subscriber
        const { data, error } = await supabase
            .from('subscribers')
            .insert([{
                email: email,
                name: subscriberData.name,
                phone: subscriberData.phone,
                source: subscriberData.source || 'website'
            }])
            .select();
            
        if (error) throw error;
        
        console.log('Subscriber added successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error in addSubscriber:', error);
        return { 
            success: false, 
            error: error.message,
            details: error.details || null
        };
    }
}

// Function to get all subscribers
export async function getSubscribers() {
    try {
        const { data, error } = await supabase
            .from('subscribers')
            .select('*')
            .eq('status', 'active')
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        return { success: false, error: error.message };
    }
}

// Function to test database connection
export async function testSupabaseConnection() {
    try {
        const { data, error } = await supabase
            .from('subscribers')
            .select('count')
            .limit(1);
            
        return !error;
    } catch (error) {
        console.error('Database connection test failed:', error);
        return false;
    }
} 