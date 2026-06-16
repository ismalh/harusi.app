
-- Wipe all existing users (cascades to profiles, wali, conversations, etc.)
DELETE FROM auth.users;

-- Replace otp_codes table to use email + device tracking
DROP TABLE IF EXISTS public.otp_codes;

CREATE TABLE public.otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code_hash text NOT NULL,
  device_id text,
  ip_address inet,
  expires_at timestamptz NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX otp_codes_email_created_idx ON public.otp_codes (lower(email), created_at DESC);
CREATE INDEX otp_codes_device_created_idx ON public.otp_codes (device_id, created_at DESC);
CREATE INDEX otp_codes_ip_created_idx ON public.otp_codes (ip_address, created_at DESC);

GRANT ALL ON public.otp_codes TO service_role;

ALTER TABLE public.otp_codes ENABLE ROW LEVEL SECURITY;

-- No client policies: this table is service-role only (server functions).
