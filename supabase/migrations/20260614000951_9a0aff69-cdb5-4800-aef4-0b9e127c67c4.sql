
-- 1) Wipe all app data
TRUNCATE TABLE
  public.admin_actions,
  public.announcements,
  public.app_settings,
  public.blocks,
  public.messages,
  public.reports,
  public.match_requests,
  public.conversations,
  public.login_codes,
  public.user_roles,
  public.profiles
CASCADE;

-- 2) Wipe auth users + identities (cascades to refresh tokens / sessions)
DELETE FROM auth.identities;
DELETE FROM auth.users;

-- 3) Profile fields nullable so user can register with phone only
ALTER TABLE public.profiles ALTER COLUMN first_name DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN age        DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN city       DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN island     DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN gender     DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN looking_for DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN bio        DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN bio        SET DEFAULT '';

-- 4) Admin-only plaintext code (for manual delivery by admin)
ALTER TABLE public.login_codes ADD COLUMN IF NOT EXISTS code_plain text;

-- login_codes has no client RLS access by design (handled by server admin client).
-- Make sure no broad grant exposes plaintext.
REVOKE ALL ON public.login_codes FROM anon, authenticated;
GRANT ALL ON public.login_codes TO service_role;
