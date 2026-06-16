
-- 1) PROFILES: restrict broad SELECT, allow matched users to see full profile, expose limited public view
DROP POLICY IF EXISTS "Authenticated users can view completed profiles" ON public.profiles;

CREATE OR REPLACE FUNCTION public.is_matched_with(_other uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE (c.user_a = auth.uid() AND c.user_b = _other)
       OR (c.user_b = auth.uid() AND c.user_a = _other)
  );
$$;

CREATE POLICY "Matched users can view full profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.is_matched_with(id));

-- Limited public discovery view (bypasses RLS via security definer; exposes only non-sensitive columns)
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker = false) AS
SELECT
  id,
  first_name,
  gender,
  birth_date,
  country_code,
  city,
  ethnicity,
  religiosity,
  bio,
  photo_url,
  marital_status,
  looking_for,
  updated_at,
  onboarding_completed
FROM public.profiles
WHERE onboarding_completed = true;

GRANT SELECT ON public.profiles_public TO authenticated;

-- 2) MATCH_REQUESTS: prevent receiver from changing fields other than status
CREATE OR REPLACE FUNCTION public.match_requests_restrict_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.sender_id IS DISTINCT FROM OLD.sender_id
     OR NEW.receiver_id IS DISTINCT FROM OLD.receiver_id
     OR NEW.message IS DISTINCT FROM OLD.message
     OR NEW.created_at IS DISTINCT FROM OLD.created_at
  THEN
    RAISE EXCEPTION 'Only the status field can be updated on a match request';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS match_requests_restrict_updates_trg ON public.match_requests;
CREATE TRIGGER match_requests_restrict_updates_trg
BEFORE UPDATE ON public.match_requests
FOR EACH ROW EXECUTE FUNCTION public.match_requests_restrict_updates();

-- 3) CONVERSATIONS: explicit UPDATE / DELETE policies for participants only
CREATE POLICY "Participants can update their conversations"
ON public.conversations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_a OR auth.uid() = user_b)
WITH CHECK (auth.uid() = user_a OR auth.uid() = user_b);

CREATE POLICY "Participants can delete their conversations"
ON public.conversations
FOR DELETE
TO authenticated
USING (auth.uid() = user_a OR auth.uid() = user_b);
