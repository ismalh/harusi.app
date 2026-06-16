
DELETE FROM auth.users;

DROP TABLE IF EXISTS public.otp_codes CASCADE;
DROP TABLE IF EXISTS public.email_send_log CASCADE;
DROP TABLE IF EXISTS public.email_send_state CASCADE;
DROP TABLE IF EXISTS public.email_unsubscribe_tokens CASCADE;
DROP TABLE IF EXISTS public.suppressed_emails CASCADE;
DROP FUNCTION IF EXISTS public.enqueue_email(text, jsonb) CASCADE;
DROP FUNCTION IF EXISTS public.read_email_batch(text, int, int) CASCADE;
DROP FUNCTION IF EXISTS public.delete_email(text, bigint) CASCADE;
DROP FUNCTION IF EXISTS public.move_to_dlq(text, text, bigint, jsonb) CASCADE;

DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.match_requests CASCADE;
DROP TABLE IF EXISTS public.blocks CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
DROP TABLE IF EXISTS public.wali CASCADE;
DROP TABLE IF EXISTS public.admin_actions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP FUNCTION IF EXISTS public.my_message_count(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_matched_with(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.match_requests_restrict_updates() CASCADE;
DROP FUNCTION IF EXISTS public.is_conversation_participant(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.is_blocked_between(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.list_public_profiles(public.gender, int) CASCADE;
DROP FUNCTION IF EXISTS public.get_public_profile(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.admin_stats() CASCADE;
DROP FUNCTION IF EXISTS public.admin_search_users(text) CASCADE;
DROP FUNCTION IF EXISTS public.admin_list_admins() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

DROP TYPE IF EXISTS public.marital_status CASCADE;
DROP TYPE IF EXISTS public.photo_status CASCADE;
DROP TYPE IF EXISTS public.prayer_frequency CASCADE;
DROP TYPE IF EXISTS public.religiosity_level CASCADE;
DROP TYPE IF EXISTS public.report_status CASCADE;
DROP TYPE IF EXISTS public.request_status CASCADE;
DROP TYPE IF EXISTS public.user_plan CASCADE;
DROP TYPE IF EXISTS public.wali_relation CASCADE;
DROP TYPE IF EXISTS public.wali_stage CASCADE;
DROP TYPE IF EXISTS public.account_status CASCADE;

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'moderator';

CREATE TYPE public.island AS ENUM ('grande_comore', 'anjouan', 'moheli', 'mayotte');
CREATE TYPE public.profile_status AS ENUM ('pending', 'approved', 'rejected', 'suspended', 'banned');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 99),
  city TEXT NOT NULL,
  island public.island NOT NULL,
  gender public.gender NOT NULL,
  looking_for public.gender NOT NULL,
  bio TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  whatsapp TEXT NOT NULL,
  status public.profile_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT whatsapp_format CHECK (whatsapp ~ '^\+?[0-9]{8,15}$')
);
CREATE INDEX idx_profiles_status ON public.profiles(status);
CREATE INDEX idx_profiles_whatsapp ON public.profiles(whatsapp);
CREATE INDEX idx_profiles_created ON public.profiles(created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own profile" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));
CREATE POLICY "users read approved profiles" ON public.profiles FOR SELECT TO authenticated
  USING (status = 'approved' AND EXISTS (SELECT 1 FROM public.profiles me WHERE me.id = auth.uid() AND me.status = 'approved'));
CREATE POLICY "users update own basic fields" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "admins update any profile" ON public.profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete profile" ON public.profiles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.login_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_login_codes_whatsapp ON public.login_codes(whatsapp, created_at DESC);
GRANT ALL ON public.login_codes TO service_role;
ALTER TABLE public.login_codes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_b UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT distinct_users CHECK (user_a <> user_b),
  CONSTRAINT users_ordered CHECK (user_a < user_b),
  UNIQUE (user_a, user_b)
);
CREATE INDEX idx_conv_users ON public.conversations(user_a, user_b);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "participants read conv" ON public.conversations FOR SELECT TO authenticated
  USING (user_a = auth.uid() OR user_b = auth.uid() OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));
CREATE POLICY "participants create conv" ON public.conversations FOR INSERT TO authenticated
  WITH CHECK (user_a = auth.uid() OR user_b = auth.uid());
CREATE POLICY "admins delete conv" ON public.conversations FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (length(content) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_msg_conv ON public.messages(conversation_id, created_at);
GRANT SELECT, INSERT, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "participants read messages" ON public.messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND (c.user_a = auth.uid() OR c.user_b = auth.uid())) OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));
CREATE POLICY "participants send messages" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND (c.user_a = auth.uid() OR c.user_b = auth.uid())));
CREATE POLICY "admins delete messages" ON public.messages FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));

CREATE TYPE public.request_status AS ENUM ('pending', 'accepted', 'declined');
CREATE TABLE public.match_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT,
  status public.request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT distinct_sr CHECK (sender_id <> receiver_id),
  UNIQUE (sender_id, receiver_id)
);
GRANT SELECT, INSERT, UPDATE ON public.match_requests TO authenticated;
GRANT ALL ON public.match_requests TO service_role;
ALTER TABLE public.match_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users see their requests" ON public.match_requests FOR SELECT TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "users send requests" ON public.match_requests FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());
CREATE POLICY "receivers update status" ON public.match_requests FOR UPDATE TO authenticated
  USING (receiver_id = auth.uid()) WITH CHECK (receiver_id = auth.uid());

CREATE TYPE public.report_status AS ENUM ('pending', 'resolved', 'dismissed');
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status public.report_status NOT NULL DEFAULT 'pending',
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_reports_status ON public.reports(status, created_at DESC);
GRANT SELECT, INSERT ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users create reports" ON public.reports FOR INSERT TO authenticated
  WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "admins read reports" ON public.reports FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));
CREATE POLICY "admins update reports" ON public.reports FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'moderator'));

CREATE TABLE public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);
GRANT SELECT, INSERT, DELETE ON public.blocks TO authenticated;
GRANT ALL ON public.blocks TO service_role;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users manage own blocks" ON public.blocks FOR ALL TO authenticated
  USING (blocker_id = auth.uid()) WITH CHECK (blocker_id = auth.uid());

CREATE TABLE public.admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  reason TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_admin_actions_target ON public.admin_actions(target_user_id, created_at DESC);
CREATE INDEX idx_admin_actions_created ON public.admin_actions(created_at DESC);
GRANT SELECT ON public.admin_actions TO authenticated;
GRANT ALL ON public.admin_actions TO service_role;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read logs" ON public.admin_actions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.app_settings TO authenticated, anon;
GRANT ALL ON public.app_settings TO service_role;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read settings" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "admins write settings" ON public.app_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read active announcements" ON public.announcements FOR SELECT TO authenticated
  USING (active = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage announcements" ON public.announcements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER conv_touch BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER mr_touch BEFORE UPDATE ON public.match_requests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.is_approved(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND status = 'approved');
$$;
