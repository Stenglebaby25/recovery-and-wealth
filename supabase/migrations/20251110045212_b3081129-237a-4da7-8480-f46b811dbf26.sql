-- Add seat tracking and access codes to organizations
ALTER TABLE public.organizations 
ADD COLUMN seat_count integer DEFAULT 0 NOT NULL,
ADD COLUMN seats_used integer DEFAULT 0 NOT NULL,
ADD COLUMN access_code text UNIQUE,
ADD COLUMN subscription_tier text DEFAULT 'basic',
ADD COLUMN subscription_active boolean DEFAULT true NOT NULL;

-- Generate unique access codes for existing organizations
UPDATE public.organizations 
SET access_code = UPPER(SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 8))
WHERE access_code IS NULL;

-- Add constraint to ensure seats_used doesn't exceed seat_count
ALTER TABLE public.organizations 
ADD CONSTRAINT seats_used_check CHECK (seats_used <= seat_count);

-- Add index for faster access code lookups
CREATE INDEX idx_organizations_access_code ON public.organizations(access_code);

-- Function to increment seats used when a member is added
CREATE OR REPLACE FUNCTION increment_org_seats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE organizations 
  SET seats_used = seats_used + 1
  WHERE id = NEW.organization_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement seats used when a member is removed or discharged
CREATE OR REPLACE FUNCTION decrement_org_seats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE organizations 
  SET seats_used = seats_used - 1
  WHERE id = OLD.organization_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment seats when organization member added
CREATE TRIGGER on_member_added
AFTER INSERT ON organization_members
FOR EACH ROW
EXECUTE FUNCTION increment_org_seats();

-- Trigger to auto-decrement seats when organization member removed
CREATE TRIGGER on_member_removed
AFTER DELETE ON organization_members
FOR EACH ROW
EXECUTE FUNCTION decrement_org_seats();

-- Add discharge tracking
ALTER TABLE public.profiles
ADD COLUMN discharge_date timestamp with time zone,
ADD COLUMN discharge_reason text;

COMMENT ON COLUMN organizations.seat_count IS 'Total number of seats purchased by organization';
COMMENT ON COLUMN organizations.seats_used IS 'Number of seats currently in use';
COMMENT ON COLUMN organizations.access_code IS 'Unique code for patients to join organization';
COMMENT ON COLUMN profiles.discharge_date IS 'Date when user was discharged from treatment program';
COMMENT ON COLUMN profiles.discharge_reason IS 'Reason for discharge from treatment program';