-- ============================================================
-- LA Transport — ajout des numéros de BL
-- Une seule instruction : s'exécute en entier où que soit le curseur.
-- ============================================================

do $migration$
begin
  execute 'alter table public.voyages add column if not exists bl_casa text';
  execute 'alter table public.voyages add column if not exists bl_transport text';
end
$migration$;
