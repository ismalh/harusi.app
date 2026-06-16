
DROP VIEW IF EXISTS public.profiles_public;

CREATE OR REPLACE FUNCTION public.list_public_profiles(_gender public.gender, _limit int DEFAULT 100)
RETURNS TABLE (
  id uuid,
  first_name text,
  gender public.gender,
  birth_date date,
  country_code text,
  city text,
  ethnicity text,
  religiosity public.religiosity_level,
  bio text,
  photo_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.first_name, p.gender, p.birth_date, p.country_code, p.city,
         p.ethnicity, p.religiosity, p.bio, p.photo_url
  FROM public.profiles p
  WHERE p.onboarding_completed = true
    AND (_gender IS NULL OR p.gender = _gender)
    AND p.id <> auth.uid()
  ORDER BY p.updated_at DESC
  LIMIT GREATEST(1, LEAST(_limit, 200));
$$;

CREATE OR REPLACE FUNCTION public.get_public_profile(_id uuid)
RETURNS TABLE (
  id uuid,
  first_name text,
  gender public.gender,
  birth_date date,
  country_code text,
  city text,
  ethnicity text,
  religiosity public.religiosity_level,
  bio text,
  photo_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.first_name, p.gender, p.birth_date, p.country_code, p.city,
         p.ethnicity, p.religiosity, p.bio, p.photo_url
  FROM public.profiles p
  WHERE p.id = _id AND p.onboarding_completed = true;
$$;

REVOKE ALL ON FUNCTION public.list_public_profiles(public.gender, int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_public_profiles(public.gender, int) TO authenticated;

REVOKE ALL ON FUNCTION public.get_public_profile(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.is_matched_with(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_matched_with(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.match_requests_restrict_updates() FROM PUBLIC, anon, authenticated;
