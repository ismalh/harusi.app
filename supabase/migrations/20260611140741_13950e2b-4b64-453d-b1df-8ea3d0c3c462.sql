
-- Same migration, but drop functions before recreating (return type changed)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin','moderator','user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

DO $$ BEGIN
  CREATE POLICY "Users see their own roles" ON public.user_roles
    FOR SELECT TO authenticated USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins see all roles" ON public.user_roles
    FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins manage roles" ON public.user_roles
    FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (blocker_id, blocked_id),
  CHECK (blocker_id <> blocked_id)
);
GRANT SELECT, INSERT, DELETE ON public.blocks TO authenticated;
GRANT ALL ON public.blocks TO service_role;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users see their own blocks" ON public.blocks
    FOR SELECT TO authenticated USING (auth.uid() = blocker_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users create their own blocks" ON public.blocks
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = blocker_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Users remove their own blocks" ON public.blocks
    FOR DELETE TO authenticated USING (auth.uid() = blocker_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE OR REPLACE FUNCTION public.is_blocked_between(_a uuid, _b uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT EXISTS (SELECT 1 FROM public.blocks WHERE (blocker_id=_a AND blocked_id=_b) OR (blocker_id=_b AND blocked_id=_a));
$$;

DO $$ BEGIN
  CREATE TYPE public.account_status AS ENUM ('active','suspended','banned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE public.photo_status AS ENUM ('pending','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS status public.account_status NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS photo_status public.photo_status NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS suspended_until timestamptz;

DO $$ BEGIN
  CREATE TYPE public.report_status AS ENUM ('pending','reviewed','action_taken','dismissed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS status public.report_status NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS reviewed_by uuid,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

DO $$ BEGIN
  CREATE POLICY "Admins view all reports" ON public.reports
    FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins update reports" ON public.reports
    FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins update profiles" ON public.profiles
    FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.admin_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  reason text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.admin_actions TO authenticated;
GRANT ALL ON public.admin_actions TO service_role;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Admins view actions" ON public.admin_actions
    FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Admins log actions" ON public.admin_actions
    FOR INSERT TO authenticated
    WITH CHECK (public.has_role(auth.uid(), 'admin') AND admin_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.wali_stage AS ENUM ('draft','transmitted','contacted','decided');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.wali
  ADD COLUMN IF NOT EXISTS shared_with uuid,
  ADD COLUMN IF NOT EXISTS stage public.wali_stage NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS contact_notes text,
  ADD COLUMN IF NOT EXISTS contacted_at timestamptz;

DO $$ BEGIN
  CREATE POLICY "Recipient can view shared wali" ON public.wali
    FOR SELECT TO authenticated USING (auth.uid() = shared_with);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE POLICY "Recipient can update contact" ON public.wali
    FOR UPDATE TO authenticated USING (auth.uid() = shared_with)
    WITH CHECK (auth.uid() = shared_with);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Drop and recreate listing functions (return type change)
DROP FUNCTION IF EXISTS public.list_public_profiles(gender, integer);
DROP FUNCTION IF EXISTS public.get_public_profile(uuid);

CREATE FUNCTION public.list_public_profiles(_gender gender, _limit integer DEFAULT 100)
RETURNS TABLE(id uuid, first_name text, gender gender, birth_date date, country_code text, city text, ethnicity text, religiosity religiosity_level, bio text, photo_url text, verified boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT p.id, p.first_name, p.gender, p.birth_date, p.country_code, p.city,
         p.ethnicity, p.religiosity, p.bio,
         CASE WHEN p.photo_status = 'approved' THEN p.photo_url ELSE NULL END,
         p.verified
  FROM public.profiles p
  WHERE p.onboarding_completed = true
    AND p.status = 'active'
    AND (_gender IS NULL OR p.gender = _gender)
    AND p.id <> auth.uid()
    AND NOT public.is_blocked_between(p.id, auth.uid())
  ORDER BY p.verified DESC, p.updated_at DESC
  LIMIT GREATEST(1, LEAST(_limit, 200));
$$;

CREATE FUNCTION public.get_public_profile(_id uuid)
RETURNS TABLE(id uuid, first_name text, gender gender, birth_date date, country_code text, city text, ethnicity text, religiosity religiosity_level, bio text, photo_url text, verified boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT p.id, p.first_name, p.gender, p.birth_date, p.country_code, p.city,
         p.ethnicity, p.religiosity, p.bio,
         CASE WHEN p.photo_status = 'approved' THEN p.photo_url ELSE NULL END,
         p.verified
  FROM public.profiles p
  WHERE p.id = _id
    AND p.onboarding_completed = true
    AND p.status = 'active'
    AND NOT public.is_blocked_between(p.id, auth.uid());
$$;

-- Admin dashboard stats helper
CREATE OR REPLACE FUNCTION public.admin_stats()
RETURNS TABLE(total bigint, active bigint, suspended bigint, banned bigint, pending_reports bigint, pending_photos bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
  SELECT
    (SELECT count(*) FROM public.profiles),
    (SELECT count(*) FROM public.profiles WHERE status='active'),
    (SELECT count(*) FROM public.profiles WHERE status='suspended'),
    (SELECT count(*) FROM public.profiles WHERE status='banned'),
    (SELECT count(*) FROM public.reports WHERE status='pending'),
    (SELECT count(*) FROM public.profiles WHERE photo_status='pending' AND photo_url IS NOT NULL)
  WHERE public.has_role(auth.uid(),'admin');
$$;
