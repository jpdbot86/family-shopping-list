-- ==============================================================================
-- FAMILY SHOPPING LIST - SUPABASE SQL SCHEMA MIGRATION
-- ==============================================================================
-- This script sets up the database table, indexes, Row Level Security (RLS),
-- Realtime publication, and initial seed data for the Family Shopping List app.
--
-- How to run:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Select your project -> Go to "SQL Editor"
-- 3. Paste this entire script and click "RUN"
-- ==============================================================================

-- 1. CREATE EXTENSION (For UUID generation)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CREATE SHOPPING ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.shopping_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Other',
    quantity TEXT NOT NULL DEFAULT '1',
    unit TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    is_purchased BOOLEAN NOT NULL DEFAULT FALSE,
    purchased_by TEXT,
    list_id TEXT NOT NULL DEFAULT 'family-main',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. CREATE PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_shopping_items_list_id ON public.shopping_items (list_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_is_purchased ON public.shopping_items (is_purchased);
CREATE INDEX IF NOT EXISTS idx_shopping_items_category ON public.shopping_items (category);
CREATE INDEX IF NOT EXISTS idx_shopping_items_created_at ON public.shopping_items (created_at DESC);

-- 4. AUTOMATIC UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_shopping_items_updated_at ON public.shopping_items;
CREATE TRIGGER set_shopping_items_updated_at
    BEFORE UPDATE ON public.shopping_items
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.shopping_items ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES FOR FAMILY ACCESS (ANON & AUTHENTICATED)
-- Allows any client with your Supabase Anon Key to read, insert, update, and delete items.
DROP POLICY IF EXISTS "Allow anonymous read access" ON public.shopping_items;
CREATE POLICY "Allow anonymous read access"
    ON public.shopping_items
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Allow anonymous insert access" ON public.shopping_items;
CREATE POLICY "Allow anonymous insert access"
    ON public.shopping_items
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous update access" ON public.shopping_items;
CREATE POLICY "Allow anonymous update access"
    ON public.shopping_items
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous delete access" ON public.shopping_items;
CREATE POLICY "Allow anonymous delete access"
    ON public.shopping_items
    FOR DELETE
    TO anon, authenticated
    USING (true);

-- 7. ENABLE SUPABASE REALTIME REPLICATION
-- This ensures postgres_changes events broadcast to all connected mobile & web clients.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'shopping_items'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.shopping_items;
    END IF;
END $$;

-- 8. INITIAL SEED DATA (GREEK & ENGLISH FRIENDLY FAMILY EXAMPLES)
-- Inserts sample items if the table is empty
INSERT INTO public.shopping_items (name, category, quantity, is_purchased, purchased_by, list_id)
SELECT name, category, quantity, is_purchased, purchased_by, list_id FROM (
    VALUES
        ('Φρέσκο Γάλα 3.5%', 'Dairy', '2 lt', false, NULL, 'family-main'),
        ('Ψωμί Τοστ Ολικής', 'Bakery', '1 πακέτο', false, NULL, 'family-main'),
        ('Μήλα Starking & Μπανάνες', 'Produce', '1.5 kg', false, NULL, 'family-main'),
        ('Ελαιόλαδο Εξαιρετικό Παρθένο', 'Pantry', '1 lt', false, NULL, 'family-main'),
        ('Τυρί Φέτα Π.Ο.Π.', 'Dairy', '500g', true, 'Μαρία', 'family-main'),
        ('Χαρτί Κουζίνας & Υγείας', 'Household', '1 πακέτο', false, NULL, 'family-main'),
        ('Φιλέτο Κοτόπουλο', 'Meat & Fish', '1 kg', false, NULL, 'family-main'),
        ('Καφές Espresso Beans', 'Pantry', '250g', true, 'Γιάννης', 'family-main')
) AS v(name, category, quantity, is_purchased, purchased_by, list_id)
WHERE NOT EXISTS (SELECT 1 FROM public.shopping_items LIMIT 1);
