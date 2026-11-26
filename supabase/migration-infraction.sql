-- ============================================================
-- LA Transport — « Escorte » devient « Infraction »
-- Une seule instruction : s'exécute en entier, où que soit le curseur.
-- ============================================================

do $migration$
begin
  execute 'alter table public.voyages add column if not exists infraction text';

  -- Si l'ancienne colonne existe, on récupère ses valeurs puis on la retire
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'voyages' and column_name = 'escorte'
  ) then
    execute 'update public.voyages set infraction = escorte where infraction is null and escorte is not null';
    execute 'alter table public.voyages drop column escorte';
  end if;
end
$migration$;
