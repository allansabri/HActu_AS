# Quoi sur HBO Max

Site média français dédié à HBO, Max et Warner Bros. Discovery, construit avec Next.js App Router, Tailwind CSS et Supabase.

## Installation

```bash
npm install
npm run dev
```

Le site sera disponible sur `http://localhost:3000`.

## Variables Supabase

Le fichier `.env.local` est déjà préparé avec :

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Admin

1. Crée un utilisateur dans Supabase Auth.
2. Ajoute son rôle admin dans SQL Editor :

```sql
insert into public.user_roles (user_id, role)
values ('USER_ID_ICI', 'admin');
```

3. Connecte-toi sur `/admin/login`.

## Données

Le schéma attendu est celui de `supabase.sql`. Les policies RLS laissent la lecture publique et réservent l'écriture aux comptes avec le rôle `admin`.
