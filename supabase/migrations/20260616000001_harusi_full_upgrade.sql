-- ============================================================
-- MIGRATION HARUSI FULL UPGRADE
-- Prompt 1 : nouvelles colonnes profiles
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS origine_principale TEXT,
  ADD COLUMN IF NOT EXISTS origine_secondaire TEXT,
  ADD COLUMN IF NOT EXISTS nationalite TEXT,
  ADD COLUMN IF NOT EXISTS nationalite_secondaire TEXT,
  ADD COLUMN IF NOT EXISTS lieu_naissance TEXT,
  ADD COLUMN IF NOT EXISTS date_naissance DATE,
  ADD COLUMN IF NOT EXISTS taille TEXT CHECK (taille IN ('petit', 'moyen', 'grand')),
  ADD COLUMN IF NOT EXISTS corpulence TEXT CHECK (corpulence IN ('mince', 'normale', 'sportive', 'en surpoids')),
  ADD COLUMN IF NOT EXISTS tenue_vestimentaire TEXT,
  ADD COLUMN IF NOT EXISTS porte_hijab BOOLEAN,
  ADD COLUMN IF NOT EXISTS porte_barbe BOOLEAN,
  ADD COLUMN IF NOT EXISTS statut_matrimonial TEXT CHECK (statut_matrimonial IN ('célibataire', 'divorcé', 'veuf')),
  ADD COLUMN IF NOT EXISTS a_des_enfants BOOLEAN,
  ADD COLUMN IF NOT EXISTS nb_enfants INTEGER,
  ADD COLUMN IF NOT EXISTS accepte_enfants BOOLEAN,
  ADD COLUMN IF NOT EXISTS nb_enfants_souhaites INTEGER,
  ADD COLUMN IF NOT EXISTS profession TEXT,
  ADD COLUMN IF NOT EXISTS langues TEXT[], -- array of strings
  ADD COLUMN IF NOT EXISTS frequence_priere TEXT CHECK (frequence_priere IN ('rarement', 'parfois', 'souvent', 'toujours')),
  ADD COLUMN IF NOT EXISTS priere_vendredi BOOLEAN,
  ADD COLUMN IF NOT EXISTS rapport_mosquee TEXT,
  ADD COLUMN IF NOT EXISTS rapport_coran TEXT,
  ADD COLUMN IF NOT EXISTS rapport_arabe TEXT,
  ADD COLUMN IF NOT EXISTS niveau_instruction_religieuse TEXT,
  ADD COLUMN IF NOT EXISTS ecole_jurisprudence TEXT,
  ADD COLUMN IF NOT EXISTS en_hijra BOOLEAN,
  ADD COLUMN IF NOT EXISTS souhaite_hijra BOOLEAN,
  ADD COLUMN IF NOT EXISTS hijra_quand TEXT,
  ADD COLUMN IF NOT EXISTS accepte_demenager BOOLEAN,
  ADD COLUMN IF NOT EXISTS situation_sante TEXT,
  ADD COLUMN IF NOT EXISTS en_polygamie BOOLEAN,
  ADD COLUMN IF NOT EXISTS accepte_polygamie BOOLEAN,
  ADD COLUMN IF NOT EXISTS description_recherche TEXT,
  ADD COLUMN IF NOT EXISTS criteres_redhibitoires TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0;

-- ============================================================
-- Wali table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wali (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nom_complet TEXT NOT NULL,
  relation TEXT NOT NULL CHECK (relation IN ('père', 'frère', 'oncle', 'tuteur', 'autre')),
  telephone TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.wali ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wali_owner" ON public.wali
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- Wali tokens table (lecture seule conversation)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wali_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  wali_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.wali_tokens ENABLE ROW LEVEL SECURITY;

-- Public read by token (handled in app with token lookup)
CREATE POLICY "wali_tokens_public_read" ON public.wali_tokens
  FOR SELECT USING (true);

CREATE POLICY "wali_tokens_insert_authenticated" ON public.wali_tokens
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- Index utiles
-- ============================================================
CREATE INDEX IF NOT EXISTS profiles_gender_idx ON public.profiles(gender);
CREATE INDEX IF NOT EXISTS profiles_status_idx ON public.profiles(status);
CREATE INDEX IF NOT EXISTS profiles_onboarding_idx ON public.profiles(onboarding_completed);

-- ============================================================
-- Update handle_new_user: nouveaux users commencent en 'pending'
-- + onboarding_completed = false
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
BEGIN
  INSERT INTO public.profiles (id, email, status, onboarding_completed)
  VALUES (NEW.id, NEW.email, 'pending'::profile_status, false)
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
    -- Les admins n'ont pas besoin de modération
    UPDATE public.profiles SET status = 'approved'::profile_status, onboarding_completed = true WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS policy pour permettre à l'utilisateur de lire les wali_tokens (pour la page wali)
DROP POLICY IF EXISTS "wali_tokens_public_read" ON public.wali_tokens;
CREATE POLICY "wali_tokens_public_read" ON public.wali_tokens
  FOR SELECT USING (true);

