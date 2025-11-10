-- Fix security warnings by setting search_path on trigger functions
DROP FUNCTION IF EXISTS increment_org_seats() CASCADE;
DROP FUNCTION IF EXISTS decrement_org_seats() CASCADE;

-- Function to increment seats used when a member is added
CREATE OR REPLACE FUNCTION increment_org_seats()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE organizations 
  SET seats_used = seats_used + 1
  WHERE id = NEW.organization_id;
  RETURN NEW;
END;
$$;

-- Function to decrement seats used when a member is removed or discharged
CREATE OR REPLACE FUNCTION decrement_org_seats()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE organizations 
  SET seats_used = seats_used - 1
  WHERE id = OLD.organization_id;
  RETURN OLD;
END;
$$;

-- Recreate triggers
CREATE TRIGGER on_member_added
AFTER INSERT ON organization_members
FOR EACH ROW
EXECUTE FUNCTION increment_org_seats();

CREATE TRIGGER on_member_removed
AFTER DELETE ON organization_members
FOR EACH ROW
EXECUTE FUNCTION decrement_org_seats();