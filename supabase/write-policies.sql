-- ============================================================
-- LA Transport — autoriser la saisie (utilisateur connecté)
-- À exécuter dans Supabase : SQL Editor → Run
-- ============================================================

drop policy if exists "ecriture voyages" on public.voyages;
create policy "ecriture voyages" on public.voyages
  for insert to authenticated with check (true);

drop policy if exists "modif voyages" on public.voyages;
create policy "modif voyages" on public.voyages
  for update to authenticated using (true) with check (true);

-- Vérification : la règle existe
select schemaname, tablename, policyname, cmd
from pg_policies
where schemaname = 'public' and tablename = 'voyages'
order by policyname;
