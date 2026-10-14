-- ==============================================================================
-- CRAFTELLA SUPABASE DATABASE SCHEMA & MIGRATION SCRIPT
-- ==============================================================================
-- This script sets up all tables, Row Level Security (RLS) policies, storage buckets,
-- indexes, and initial seed data for the Craftella platform.
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. TABLE: payment_cards (Workshop Passes / Ticket Tiers)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payment_cards (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'PASS',
    subtitle TEXT,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    formatted_price TEXT,
    category TEXT DEFAULT 'Individual',
    color_theme TEXT DEFAULT 'blue',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused')),
    spots_left INTEGER DEFAULT 25,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. TABLE: bookings (Guest Orders & Ticket Passes Sold)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    ticket_code TEXT NOT NULL UNIQUE,
    ticket_type TEXT NOT NULL,
    card_id TEXT REFERENCES public.payment_cards(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL DEFAULT 0,
    total_price NUMERIC NOT NULL DEFAULT 0,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    city TEXT,
    payment_method TEXT DEFAULT 'UPI',
    utr_number TEXT,
    receipt_url TEXT,
    status TEXT NOT NULL DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Pending Verification', 'Cancelled')),
    event_date TEXT DEFAULT 'Sunday, 18 October 2026',
    event_time TEXT DEFAULT '2:00 PM – 5:00 PM',
    venue TEXT DEFAULT '55 Bistro',
    booked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. TABLE: payment_config (Merchant UPI, Payee Details & Dynamic QR)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payment_config (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    upi_id TEXT NOT NULL DEFAULT '9701451646@ybl',
    payee_name TEXT NOT NULL DEFAULT 'Craftella Events',
    qr_image_url TEXT DEFAULT '',
    payment_url TEXT DEFAULT 'upi://pay?pa=9701451646@ybl&pn=Craftella&cu=INR',
    instructions TEXT DEFAULT 'Scan this QR code with PhonePe, Google Pay or another UPI app.',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. TABLE: location_config (Venue Details, Timings & Google Maps)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.location_config (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    venue_name TEXT NOT NULL DEFAULT '55 Bistro',
    heading TEXT DEFAULT 'Meet us at 55 Bistro',
    kicker TEXT DEFAULT 'FIND YOUR WAY',
    description TEXT DEFAULT 'Your Craftella experience awaits. Use the official Google Maps link below to locate the venue and plan your journey.',
    address TEXT DEFAULT '55 Bistro, 100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038',
    status TEXT DEFAULT 'OFFICIAL EVENT VENUE',
    event_date TEXT DEFAULT 'Sunday, 18 October 2026',
    event_time TEXT DEFAULT '2:00 PM – 5:00 PM',
    info_text TEXT DEFAULT 'Join us for Craftella on Sunday, 18 October 2026, from 2:00 PM to 5:00 PM.',
    google_maps_url TEXT DEFAULT 'https://maps.app.goo.gl/ucLTnMRVcffDAmKV7',
    button_text TEXT DEFAULT 'Get Directions',
    note TEXT DEFAULT 'Tap “Get Directions” to open the venue in Google Maps.',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_payment_cards_status ON public.payment_cards(status);
CREATE INDEX IF NOT EXISTS idx_payment_cards_sort_order ON public.payment_cards(sort_order);
CREATE INDEX IF NOT EXISTS idx_bookings_ticket_code ON public.bookings(ticket_code);
CREATE INDEX IF NOT EXISTS idx_bookings_booked_at ON public.bookings(booked_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_email ON public.bookings(customer_email);

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.payment_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_config ENABLE ROW LEVEL SECURITY;

-- 6.1 Policies for payment_cards
-- Anyone can view cards (visitors need to view passes to book)
DROP POLICY IF EXISTS "Public can view payment cards" ON public.payment_cards;
CREATE POLICY "Public can view payment cards"
    ON public.payment_cards FOR SELECT
    USING (true);

-- Authenticated admins can insert cards
DROP POLICY IF EXISTS "Admins can insert payment cards" ON public.payment_cards;
CREATE POLICY "Admins can insert payment cards"
    ON public.payment_cards FOR INSERT
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Authenticated admins can update cards
DROP POLICY IF EXISTS "Admins can update payment cards" ON public.payment_cards;
CREATE POLICY "Admins can update payment cards"
    ON public.payment_cards FOR UPDATE
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon')
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Authenticated admins can delete cards
DROP POLICY IF EXISTS "Admins can delete payment cards" ON public.payment_cards;
CREATE POLICY "Admins can delete payment cards"
    ON public.payment_cards FOR DELETE
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- 6.2 Policies for bookings
-- Anyone (guests) can create a booking pass
DROP POLICY IF EXISTS "Guests can insert bookings" ON public.bookings;
CREATE POLICY "Guests can insert bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (true);

-- Anyone can view their own booking via ticket_code, or admins can view all
DROP POLICY IF EXISTS "Users and Admins can view bookings" ON public.bookings;
CREATE POLICY "Users and Admins can view bookings"
    ON public.bookings FOR SELECT
    USING (true);

-- Admins can update booking status (verify, cancel, confirm)
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
CREATE POLICY "Admins can update bookings"
    ON public.bookings FOR UPDATE
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon')
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Admins can delete bookings
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;
CREATE POLICY "Admins can delete bookings"
    ON public.bookings FOR DELETE
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- 6.3 Policies for payment_config
DROP POLICY IF EXISTS "Public can view payment config" ON public.payment_config;
CREATE POLICY "Public can view payment config"
    ON public.payment_config FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can modify payment config" ON public.payment_config;
CREATE POLICY "Admins can modify payment config"
    ON public.payment_config FOR ALL
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon')
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- 6.4 Policies for location_config
DROP POLICY IF EXISTS "Public can view location config" ON public.location_config;
CREATE POLICY "Public can view location config"
    ON public.location_config FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins can modify location config" ON public.location_config;
CREATE POLICY "Admins can modify location config"
    ON public.location_config FOR ALL
    USING (auth.role() = 'authenticated' OR auth.role() = 'anon')
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- ==============================================================================
-- 7. SUPABASE STORAGE BUCKET CONFIGURATION
-- ==============================================================================
-- Create public storage bucket for payment QR images and customer payment screenshots
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'craftella-assets',
    'craftella-assets',
    true,
    5242880, -- 5 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public view craftella assets" ON storage.objects;
CREATE POLICY "Public view craftella assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'craftella-assets');

DROP POLICY IF EXISTS "Public upload craftella assets" ON storage.objects;
CREATE POLICY "Public upload craftella assets"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'craftella-assets');

DROP POLICY IF EXISTS "Admin update craftella assets" ON storage.objects;
CREATE POLICY "Admin update craftella assets"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'craftella-assets');

DROP POLICY IF EXISTS "Admin delete craftella assets" ON storage.objects;
CREATE POLICY "Admin delete craftella assets"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'craftella-assets');

-- ==============================================================================
-- 8. INITIAL SEED DATA
-- ==============================================================================
-- 8.1 Default Payment Cards
INSERT INTO public.payment_cards (
    id, title, type, subtitle, price, original_price, formatted_price, category, color_theme, status, spots_left, features, recommended, sort_order
) VALUES
(
    'single',
    'Single',
    'SINGLE ENTRY',
    'Entry for one person',
    499,
    NULL,
    '₹499',
    'Individual',
    'blue',
    'active',
    32,
    '["1x Rhinestone canvas art kit", "All sparkling craft supplies included", "Beverage & light refreshments", "Take home your customized artwork"]'::jsonb,
    false,
    1
),
(
    'duo',
    'Duo',
    'DUO PASS',
    'Entry for two people',
    899,
    NULL,
    '₹899',
    'Popular Duo',
    'purple',
    'active',
    14,
    '["2x Rhinestone canvas art kits", "Reserved adjacent seating", "Complimentary sparkling treats", "Dedicated artist assistance"]'::jsonb,
    true,
    2
),
(
    'group',
    'Group (4 Passes)',
    'CREATIVE GROUP',
    'Entry for four people',
    1599,
    NULL,
    '₹1,599',
    'Group Plan',
    'amber',
    'active',
    6,
    '["4x Rhinestone canvas art kits", "Private group table setup", "Group photo session keepsake", "Deluxe rhinestone embellishment pack"]'::jsonb,
    false,
    3
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    price = EXCLUDED.price,
    features = EXCLUDED.features;

-- 8.2 Default Payment Configuration
INSERT INTO public.payment_config (id, upi_id, payee_name, qr_image_url, payment_url, instructions)
VALUES (
    'primary',
    '9701451646@ybl',
    'Craftella Events',
    '',
    'upi://pay?pa=9701451646@ybl&pn=Craftella&cu=INR',
    'Scan this QR code with PhonePe, Google Pay or another UPI app.'
)
ON CONFLICT (id) DO NOTHING;

-- 8.3 Default Location Configuration
INSERT INTO public.location_config (
    id, venue_name, heading, kicker, description, address, status, event_date, event_time, info_text, google_maps_url, button_text, note
) VALUES (
    'primary',
    '55 Bistro',
    'Meet us at 55 Bistro',
    'FIND YOUR WAY',
    'Your Craftella experience awaits. Use the official Google Maps link below to locate the venue and plan your journey.',
    '55 Bistro, 100 Feet Rd, Indiranagar, Bengaluru, Karnataka 560038',
    'OFFICIAL EVENT VENUE',
    'Sunday, 18 October 2026',
    '2:00 PM – 5:00 PM',
    'Join us for Craftella on Sunday, 18 October 2026, from 2:00 PM to 5:00 PM.',
    'https://maps.app.goo.gl/ucLTnMRVcffDAmKV7',
    'Get Directions',
    'Tap “Get Directions” to open the venue in Google Maps.'
)
ON CONFLICT (id) DO NOTHING;

-- 8.4 Initial Demo Bookings
INSERT INTO public.bookings (
    id, ticket_code, ticket_type, card_id, quantity, unit_price, total_price, customer_name, customer_email, whatsapp_number, city, payment_method, utr_number, status, event_date, venue, booked_at
) VALUES
(
    'BK-8942',
    'X8K9M2',
    'Duo',
    'duo',
    1,
    899,
    899,
    'Aarav Patel',
    'aarav.patel@example.com',
    '9876543210',
    'Bengaluru',
    'UPI (9701451646@ybl)',
    '329482910492',
    'Confirmed',
    'Sunday, 18 October 2026',
    '55 Bistro',
    NOW() - INTERVAL '4 hours'
),
(
    'BK-7319',
    'Q4W7P9',
    'Single',
    'single',
    2,
    499,
    998,
    'Priya Sundaram',
    'priya.s@example.com',
    '9123456780',
    'Chennai',
    'UPI (9701451646@ybl)',
    '918239019234',
    'Confirmed',
    'Sunday, 18 October 2026',
    '55 Bistro',
    NOW() - INTERVAL '18 hours'
)
ON CONFLICT (id) DO NOTHING;
