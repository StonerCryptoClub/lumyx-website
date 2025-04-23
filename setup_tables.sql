-- Create the subscribers table
CREATE TABLE subscribers (
    email TEXT PRIMARY KEY,  -- Using email as the primary key since it's unique
    name TEXT,              -- Optional for newsletter subscribers
    phone TEXT,             -- Optional for newsletter subscribers
    source TEXT,            -- Either 'newsletter' or 'booking'
    subscription_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add a comment to the table
COMMENT ON TABLE subscribers IS 'Stores all newsletter subscribers and booking clients';

-- Add comments to the columns
COMMENT ON COLUMN subscribers.email IS 'Primary email address of the subscriber';
COMMENT ON COLUMN subscribers.name IS 'Full name of the subscriber (required for bookings)';
COMMENT ON COLUMN subscribers.phone IS 'Phone number (required for bookings)';
COMMENT ON COLUMN subscribers.source IS 'How they subscribed: newsletter or booking';
COMMENT ON COLUMN subscribers.subscription_date IS 'When they first subscribed';

-- Create the bookings table
CREATE TABLE bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,  -- Unique identifier for each booking
    subscriber_email TEXT REFERENCES subscribers(email),  -- Links to subscribers table
    booking_date DATE NOT NULL,                      -- Date of the call
    booking_time TIME NOT NULL,                      -- Time of the call
    call_type TEXT NOT NULL,                         -- 'zoom' or 'phone'
    status TEXT DEFAULT 'scheduled',                 -- 'scheduled', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add a comment to the table
COMMENT ON TABLE bookings IS 'Stores all call bookings';

-- Add comments to the columns
COMMENT ON COLUMN bookings.id IS 'Unique identifier for the booking';
COMMENT ON COLUMN bookings.subscriber_email IS 'Email of the client who booked (links to subscribers table)';
COMMENT ON COLUMN bookings.booking_date IS 'Date of the scheduled call';
COMMENT ON COLUMN bookings.booking_time IS 'Time of the scheduled call';
COMMENT ON COLUMN bookings.call_type IS 'Type of call: zoom or phone';
COMMENT ON COLUMN bookings.status IS 'Current status of the booking';
COMMENT ON COLUMN bookings.created_at IS 'When the booking was created'; 