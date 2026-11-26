-- ============================================================
-- LA Transport — colonnes « infraction » et « client »
-- Une seule instruction : s'exécute en entier, où que soit le curseur.
-- ============================================================

do $migration$
begin
  -- 1) Infraction (remplace « escorte »)
  execute 'alter table public.voyages add column if not exists infraction text';

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'voyages' and column_name = 'escorte'
  ) then
    execute 'update public.voyages set infraction = escorte where infraction is null and escorte is not null';
    execute 'alter table public.voyages drop column escorte';
  end if;

  -- 2) Client (remplace « saisie_par »)
  execute 'alter table public.voyages add column if not exists client text';

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'voyages' and column_name = 'saisie_par'
  ) then
    execute 'update public.voyages set client = saisie_par where client is null and saisie_par is not null';
    execute 'alter table public.voyages drop column saisie_par';
  end if;
end
$migration$;
