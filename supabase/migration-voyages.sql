-- ============================================================
-- LA Transport — colonnes du formulaire voyage
-- BL Casa, BL LA Transport, Saisie par, Escorte
-- Une seule instruction : s'exécute en entier, où que soit le curseur.
-- ============================================================

do $migration$
begin
  execute 'alter table public.voyages add column if not exists bl_casa text';
  execute 'alter table public.voyages add column if not exists bl_transport text';
  execute 'alter table public.voyages add column if not exists saisie_par text';
  execute 'alter table public.voyages add column if not exists escorte text';
end
$migration$;
