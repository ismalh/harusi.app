
CREATE TYPE public.gender AS ENUM ('homme', 'femme');
CREATE TYPE public.marital_status AS ENUM ('celibataire', 'divorce', 'veuf');
CREATE TYPE public.religiosity_level AS ENUM ('debutant', 'pratiquant', 'tres_pratiquant');
CREATE TYPE public.prayer_frequency AS ENUM ('rarement', 'parfois', 'souvent', 'toujours');
CREATE TYPE public.wali_relation AS ENUM ('pere', 'frere', 'oncle', 'tuteur', 'autre');

CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  gender public.gender,
  birth_date DATE,
  country_code TEXT,
  city TEXT,
  marital_status public.marital_status,
  has_children BOOLEAN,
  children_count INTEGER,
  ethnicity TEXT,
  languages TEXT[] DEFAULT '{}'::text[],
  education TEXT,
  profession TEXT,
  religiosity public.religiosity_level,
  prayer public.prayer_frequency,
  hijab BOOLEAN,
  beard BOOLEAN,
  smoker BOOLEAN,
  looking_for TEXT,
  bio TEXT,
  photo_url TEXT,
  onboarding_step INTEGER NOT NULL DEFAULT 0,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Authenticated users can view completed profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (onboarding_completed = true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles FOR DELETE TO authenticated
  USING (auth.uid() = id);

CREATE TABLE public.wali (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  relation public.wali_relation NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wali TO authenticated;
GRANT ALL ON public.wali TO service_role;
ALTER TABLE public.wali ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wali"
  ON public.wali FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER profiles_touch_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER wali_touch_updated_at
  BEFORE UPDATE ON public.wali
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
