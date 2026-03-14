-- Football Match Booking Platform Database Schema
-- Execute this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: For PostGIS geography support, you would need to enable it with:
-- CREATE EXTENSION IF NOT EXISTS postgis;
-- For now, we'll use TEXT for location storage

-- ========================
-- USERS TABLE
-- ========================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'player' CHECK (role IN ('player', 'team_owner', 'stadium_owner', 'admin')),
    city TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================
-- STADIUMS TABLE
-- ========================
CREATE TABLE stadiums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    city TEXT NOT NULL,
    address TEXT NOT NULL,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    price_per_hour DECIMAL(10, 2) NOT NULL,
    surface_type TEXT CHECK (surface_type IN ('natural_grass', 'artificial_grass', 'indoor')),
    size TEXT CHECK (size IN ('5v5', '7v7', '11v11')),
    capacity INTEGER,
    image_urls TEXT[],
    facilities JSONB DEFAULT '{}',
    rating DECIMAL(3, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================
-- BOOKINGS TABLE
-- ========================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    payment_method TEXT,
    qr_code TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_booking_time CHECK (end_time > start_time)
);

-- ========================
-- TEAMS TABLE
-- ========================
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo_url TEXT,
    city TEXT,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    draws INTEGER DEFAULT 0,
    ranking INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================
-- TEAM MEMBERS TABLE
-- ========================
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('captain', 'vice_captain', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- ========================
-- MATCHES TABLE
-- ========================
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE,
    home_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    away_team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================
-- MATCH PLAYERS TABLE
-- ========================
CREATE TABLE match_players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    is_confirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(match_id, user_id)
);

-- ========================
-- TOURNAMENTS TABLE
-- ========================
CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    city TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_teams INTEGER,
    current_teams INTEGER DEFAULT 0,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================
-- TOURNAMENT TEAMS TABLE
-- ========================
CREATE TABLE tournament_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, team_id)
);

-- ========================
-- REVIEWS TABLE
-- ========================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stadium_id UUID REFERENCES stadiums(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================
-- NOTIFICATIONS TABLE
-- ========================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('booking', 'match', 'tournament', 'payment', 'general')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================
-- INDEXES FOR PERFORMANCE
-- ========================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_stadiums_city ON stadiums(city);
CREATE INDEX idx_stadiums_owner ON stadiums(owner_id);
CREATE INDEX idx_bookings_stadium ON bookings(stadium_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_teams_city ON teams(city);
CREATE INDEX idx_matches_stadium ON matches(stadium_id);
CREATE INDEX idx_matches_date ON matches(date);
CREATE INDEX idx_reviews_stadium ON reviews(stadium_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- ========================
-- FUNCTIONS & TRIGGERS
-- ========================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stadiums_updated_at BEFORE UPDATE ON stadiums
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate stadium rating
CREATE OR REPLACE FUNCTION calculate_stadium_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE stadiums
    SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM reviews
        WHERE stadium_id = NEW.stadium_id
    )
    WHERE id = NEW.stadium_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stadium_rating AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION calculate_stadium_rating();

-- ========================
-- ROW LEVEL SECURITY (RLS)
-- ========================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stadiums ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Stadiums are publicly viewable
CREATE POLICY "Stadiums are publicly viewable" ON stadiums
    FOR SELECT USING (true);

-- Stadium owners can manage their stadiums
CREATE POLICY "Owners can manage stadiums" ON stadiums
    FOR ALL USING (auth.uid() = owner_id);

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications are private
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- ========================
-- INITIAL DATA (Optional)
-- ========================

-- You can add some sample stadiums here for testing
-- INSERT INTO stadiums (name, city, price_per_hour, surface_type, size) VALUES
--     ('Al-Amal Stadium', 'Riyadh', 150.00, 'artificial_grass', '7v7'),
--     ('Green Field Arena', 'Jeddah', 200.00, 'natural_grass', '11v11');
