# Harusi — Instructions de déploiement complet

## ✅ Ce qui a été implémenté

### Prompt 0 — Signup fix
**Action manuelle requise dans le dashboard Supabase :**
1. Va dans **Authentication → Providers → Email**
2. Active **"Enable Email provider"**
3. Active **"Confirm email"** (mode OTP)
4. Dans **Authentication → Settings**, vérifie que **"Enable Signups"** est coché ✅

### Prompt 1 — Nouvelles colonnes
Migration : `20260616000001_harusi_full_upgrade.sql`
Colonnes ajoutées : origine, nationalité, taille, corpulence, tenue, enfants, prière, hijra, polygamie, etc.

### Prompt 2-4 — Onboarding 6 étapes
Fichier : `src/routes/_authenticated/onboarding.tsx`
- Barre de progression
- Sauvegarde Supabase à chaque étape
- Redirection auto si `onboarding_completed = false`
- Upload photo vers bucket `profile-photos`
- `looking_for` auto défini (genre opposé)

### Prompt 5 — Demandes de contact
- `src/routes/_authenticated/demandes.tsx` — page des demandes reçues
- `src/routes/_authenticated/profil.$id.tsx` — bouton "Envoyer une demande"
- Badge de demandes dans la navbar de `/home`
- Accepter → crée la conversation, Refuser → décline

### Prompt 6 — Wali
- Section wali dans `mon-profil.tsx` (visible femmes uniquement)
- `src/routes/wali.$token.tsx` — page publique lecture seule (sans connexion)
- Table `wali_tokens` dans la migration
- ⚠️ **Email wali** : à implémenter côté serveur (Edge Function Supabase) car nécessite un serveur SMTP. Voir ci-dessous.

### Prompt 7 — Filtres
- Panneau de filtres rétractable dans `home.tsx`
- Filtres : île, tranche d'âge, statut matrimonial, fréquence de prière, hijra, polygamie (homme uniquement)

### Prompt 8 — Finitions
- `src/routes/_authenticated/parametres.tsx` — page paramètres
- Suppression de compte dans `mon-profil.tsx`
- Lien vers CGU, règles, politique de confidentialité

---

## 🔧 Actions manuelles requises

### 1. Appliquer la migration Supabase
```bash
supabase db push
# ou via le dashboard : SQL Editor → coller le contenu de 20260616000001_harusi_full_upgrade.sql
```

### 2. Créer le bucket `profile-photos`
Dans Supabase → Storage → New bucket :
- Nom : `profile-photos`
- Public : **Non** (privé, accès via signed URLs)
- Taille max fichier : 5 MB
- Types autorisés : `image/jpeg, image/png, image/webp`

Policy RLS à ajouter :
```sql
-- Upload : propriétaire uniquement
CREATE POLICY "upload_own_photo" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Lecture : authentifiés
CREATE POLICY "read_photos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'profile-photos');

-- Update : propriétaire
CREATE POLICY "update_own_photo" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
```

### 3. Email wali (Edge Function)
Créer une Edge Function `notify-wali` qui :
1. Reçoit `{ conversation_id, female_first_name, male_first_name }`
2. Cherche le wali de la femme dans la table `wali`
3. Crée un token dans `wali_tokens`
4. Envoie un email avec le lien `https://tondomaine.com/wali/{token}`

Appeler cette fonction depuis `demandes.tsx` quand une demande est acceptée.

---

## 📁 Fichiers créés/modifiés

| Fichier | Status |
|---------|--------|
| `supabase/migrations/20260616000001_harusi_full_upgrade.sql` | ✅ Nouveau |
| `src/routes/_authenticated/route.tsx` | ✅ Modifié |
| `src/routes/_authenticated/onboarding.tsx` | ✅ Nouveau |
| `src/routes/_authenticated/home.tsx` | ✅ Modifié |
| `src/routes/_authenticated/profil.$id.tsx` | ✅ Modifié |
| `src/routes/_authenticated/demandes.tsx` | ✅ Nouveau |
| `src/routes/_authenticated/mon-profil.tsx` | ✅ Modifié |
| `src/routes/_authenticated/parametres.tsx` | ✅ Nouveau |
| `src/routes/wali.$token.tsx` | ✅ Nouveau |
| `src/lib/islands.ts` | ✅ Modifié |
