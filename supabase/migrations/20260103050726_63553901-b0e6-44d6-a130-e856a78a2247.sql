-- Add RLS policy for organization members to view their own organization
CREATE POLICY "Organization members can view their own organization"
ON public.organizations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = organizations.id
    AND organization_members.user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin'::app_role)
);