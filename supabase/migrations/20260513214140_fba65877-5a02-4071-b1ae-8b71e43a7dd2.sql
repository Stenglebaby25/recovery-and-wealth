
-- 1. Prevent privilege escalation via profiles self-update
CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow service role and admins to change anything
  IF auth.role() = 'service_role' OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- Block changes to subscription / sponsorship / org / trial / discharge fields
  IF NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
     OR NEW.subscription_expires_at IS DISTINCT FROM OLD.subscription_expires_at
     OR NEW.sponsored_until IS DISTINCT FROM OLD.sponsored_until
     OR NEW.organization_id IS DISTINCT FROM OLD.organization_id
     OR NEW.trial_started_at IS DISTINCT FROM OLD.trial_started_at
     OR NEW.trial_expires_at IS DISTINCT FROM OLD.trial_expires_at
     OR NEW.discharge_date IS DISTINCT FROM OLD.discharge_date
     OR NEW.discharge_reason IS DISTINCT FROM OLD.discharge_reason
  THEN
    RAISE EXCEPTION 'Not allowed to modify subscription or sponsorship fields';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_privilege_escalation ON public.profiles;
CREATE TRIGGER profiles_prevent_privilege_escalation
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- 2. Tighten storage policies for learning-resources bucket: only admins can update/delete
DROP POLICY IF EXISTS "Authenticated users can delete their learning resources" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their learning resources" ON storage.objects;

CREATE POLICY "Admins can delete learning resources"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'learning-resources' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update learning resources"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'learning-resources' AND public.has_role(auth.uid(), 'admin'));

-- 3. Lock down direct EXECUTE on internal trigger/helper functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_org_seats() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.decrement_org_seats() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_profile_privilege_escalation() FROM anon, authenticated;
