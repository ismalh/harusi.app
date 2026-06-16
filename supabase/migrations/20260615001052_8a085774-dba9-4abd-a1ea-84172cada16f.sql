
-- 1. Wipe all data
DELETE FROM auth.users;

-- 2. Drop obsolete tables
DROP TABLE IF EXISTS public.login_codes CASCADE;
DROP TABLE IF EXISTS public.app_settings CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.admin_actions CASCADE;

-- 3. Profiles tweaks
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ALTER COLUMN whatsapp DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN status SET DEFAULT 'approved'::profile_status;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS whatsapp_format;
ALTER TABLE public.profiles ADD CONSTRAINT whatsapp_format
  CHECK (whatsapp IS NULL OR whatsapp ~ '^\+?[0-9]{8,15}$');
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unique
  ON public.profiles (lower(email)) WHERE email IS NOT NULL;

-- 4. Reports: support photo/message moderation
DO $$ BEGIN
  CREATE TYPE public.report_target AS ENUM ('profile','photo','message');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.reports
  ADD COLUMN IF NOT EXISTS target_type public.report_target NOT NULL DEFAULT 'profile',
  ADD COLUMN IF NOT EXISTS message_id uuid REFERENCES public.messages(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS photo_url text;

-- 5. Moderators can update profile status (ban/suspend)
DROP POLICY IF EXISTS "admins update any profile" ON public.profiles;
CREATE POLICY "staff update any profile" ON public.profiles FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'moderator'::app_role));

-- 6. Auto-admin allowlist
CREATE TABLE IF NOT EXISTS public.admin_emails (
  email text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.admin_emails TO authenticated;
GRANT ALL ON public.admin_emails TO service_role;
ALTER TABLE public.admin_emails ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admins read admin_emails" ON public.admin_emails;
CREATE POLICY "admins read admin_emails" ON public.admin_emails
  FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.admin_emails (email) VALUES
  ('ismaelelamine06@gmail.com'),
  ('mamza773@gmail.com'),
  ('aham.a@hotmail.com')
ON CONFLICT DO NOTHING;

-- 7. New-user trigger: create profile + grant role(s)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
BEGIN
  INSERT INTO public.profiles (id, email, status)
  VALUES (NEW.id, NEW.email, 'approved'::profile_status)
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user'::app_role)
  ON CONFLICT DO NOTHING;

  SELECT EXISTS(
    SELECT 1 FROM public.admin_emails
    WHERE lower(email) = lower(NEW.email)
  ) INTO is_admin;

  IF is_admin THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Global stats RPC
CREATE OR REPLACE FUNCTION public.admin_stats()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'total_users', (SELECT count(*) FROM public.profiles),
    'new_today', (SELECT count(*) FROM public.profiles WHERE created_at >= now() - interval '1 day'),
    'new_week', (SELECT count(*) FROM public.profiles WHERE created_at >= now() - interval '7 days'),
    'new_month', (SELECT count(*) FROM public.profiles WHERE created_at >= now() - interval '30 days'),
    'banned', (SELECT count(*) FROM public.profiles WHERE status = 'banned'),
    'suspended', (SELECT count(*) FROM public.profiles WHERE status = 'suspended'),
    'active_week', (SELECT count(*) FROM public.profiles WHERE last_login_at >= now() - interval '7 days'),
    'active_today', (SELECT count(*) FROM public.profiles WHERE last_login_at >= now() - interval '1 day'),
    'pending_reports', (SELECT count(*) FROM public.reports WHERE status = 'pending'),
    'messages_total', (SELECT count(*) FROM public.messages),
    'conversations_total', (SELECT count(*) FROM public.conversations)
  );
$$;
REVOKE ALL ON FUNCTION public.admin_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_stats() TO authenticated;
