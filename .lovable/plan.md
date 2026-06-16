# Refonte authentification + administration

Refonte majeure : suppression totale de l'auth email/OTP, remplacement par un système d'inscription validée manuellement par un admin via WhatsApp, et création d'un back-office complet.

Avant de coder, j'ai besoin de quelques décisions importantes (voir bas du plan).

---

## 1. Suppression de l'auth existante

À supprimer :
- Routes : `/auth`, `/email/unsubscribe`, `/lovable/email/*`
- Fichiers : `src/lib/auth.functions.ts`, `src/lib/email-templates/*`, tout `src/routes/email/*`, `src/routes/lovable/email/*`
- Tables : `otp_codes`, `email_send_log`, `email_send_state`, `email_unsubscribe_tokens`, `suppressed_emails`
- Colonne `email` partout où elle est référencée côté app (la colonne `auth.users.email` reste mais inutilisée)
- Toutes les références à OTP, magic link, password dans l'UI

Note : Supabase Auth reste utilisé en interne (impossible à supprimer), mais l'utilisateur ne voit jamais email/password. On crée des comptes auth via `supabaseAdmin.createUser` avec un email synthétique (`<uuid>@harusi.internal`) et un password aléatoire — invisible pour l'utilisateur. La "session" est créée côté admin après validation, et l'accès se fait via un **token de session** stocké côté client (magic link WhatsApp envoyé manuellement par l'admin, ou code de connexion à 6 chiffres communiqué par WhatsApp).

→ **Question 1 ci-dessous : comment l'utilisateur se reconnecte-t-il ?**

## 2. Nouveau flow d'inscription

- `/inscription` : formulaire (prénom, âge, ville, île, genre, recherche, bio, photo, WhatsApp)
- Validation Zod stricte (longueurs, format WhatsApp E.164, photo ≤ 5 Mo)
- Upload photo dans bucket Storage `profile-photos` (privé, signed URLs)
- Création d'un compte `auth.users` synthétique + ligne `profiles` avec `status='pending'`
- Redirection vers `/en-attente` (écran statique, polling status toutes les 30s)
- Si `status='approved'` → `/home`. Si `rejected` → message avec motif. Si `suspended/banned` → blocage.

## 3. Nouveau schéma `profiles`

Refonte de la table :
```
id, first_name, age, city, island (enum: grande_comore|anjouan|moheli|mayotte),
gender (enum), looking_for (enum), bio, photo_url, whatsapp,
status (enum: pending|approved|rejected|suspended|banned),
rejection_reason, admin_notes,
created_at, approved_at, last_login_at, updated_at
```

Migration : DROP des colonnes obsolètes (`birth_date`, `country_code`, `ethnicity`, `religiosity`, `verified`, `photo_status`, `onboarding_completed`…) et ajout des nouvelles. ⚠️ **Destructif** — toutes les données profiles existantes seront perdues.

→ **Question 2 ci-dessous.**

## 4. Rôles & permissions

Table `user_roles` existe déjà (admin). J'ajoute le rôle `moderator` à l'enum `app_role`. Helpers `has_role()` déjà en place. Permissions checkées par RLS + côté serveur dans chaque server fn admin.

Gate frontend : `/admin/*` sous `_authenticated/` + check `has_role(auth.uid(), 'admin'|'moderator')` dans `beforeLoad`.

## 5. Back-office `/admin`

Nouvelle architecture sous `_authenticated/admin/` :
- `admin/index.tsx` — dashboard stats
- `admin/validations.tsx` — file d'attente des profils pending (vue principale)
- `admin/users.tsx` — liste + recherche + filtres (statut, île, genre)
- `admin/users.$id.tsx` — détail profil, édition, actions (valider, refuser, suspendre, bannir, supprimer, notes)
- `admin/conversations.tsx` + `admin/conversations.$id.tsx` — toutes les convs, messages, suppression
- `admin/reports.tsx` — signalements, actions rapides
- `admin/admins.tsx` — gestion admins/modérateurs (promote, demote, liste)
- `admin/logs.tsx` — journal `admin_actions` (existe déjà, à enrichir)
- `admin/settings.tsx` — annonces globales, feature flags, textes éditables

Chaque action critique passe par un `createServerFn` avec :
- `requireSupabaseAuth`
- Vérif `has_role` côté serveur
- Log dans `admin_actions` (qui, quoi, cible, motif, timestamp)

## 6. Statistiques

Server fn `getAdminStats()` qui retourne tout : totaux par statut, répartition H/F, par île, par ville, conversations, messages, inscriptions/jour (30 jours), taux d'approbation, etc. Affiché avec `recharts` (déjà installé via shadcn `chart`).

## 7. Plateforme — paramètres dynamiques

Nouvelle table `app_settings` (clé/valeur JSONB) + `announcements` (messages affichés aux users). Feature flags simples (bool).

## 8. Sécurité

- RLS strict sur toutes les tables admin (lecture/écriture via `has_role` only)
- Profils non-approuvés invisibles dans les listes publiques (`list_public_profiles` filtre déjà sur `status='active'` → à remplacer par `approved`)
- Aucune route admin accessible sans rôle (double check : router + RLS + server fn)
- Photos en bucket privé, signed URLs avec expiration

---

## Décisions à prendre avant que je code

Je vais te poser quelques questions juste après ce plan pour clarifier :
1. **Reconnexion utilisateur** : comment un user approuvé se reconnecte-t-il (sans email/password) ? Code à 6 chiffres envoyé manuellement par WhatsApp ? Lien magique généré par admin ? Cookie longue durée + jamais de logout ?
2. **Données existantes** : OK pour tout effacer (profils, conversations, messages, demandes, blocks, reports) ou faut-il migrer ?
3. **Premier admin** : ton compte actuel reste admin ? Donne-moi l'ID ou je garde l'existant.
4. **Numéro WhatsApp admin** : pour le bouton "Contacter via WhatsApp" depuis le dashboard.

---

## Détails techniques

- Stack : TanStack Start, server fns (pas d'edge function), Supabase Cloud, RLS partout
- Storage bucket `profile-photos` privé, policies : insert par owner pending, select par owner OU admin OU matched user
- Server fns admin sous `src/lib/admin/*.functions.ts`
- Migration en plusieurs étapes : (a) nouveau schéma + données conservées si possible, (b) drop des tables email, (c) seed du rôle admin
- ~25-30 fichiers nouveaux/modifiés, ~6 migrations
