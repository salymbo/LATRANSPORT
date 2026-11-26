-- ============================================================
-- LA Transport — nettoyage des doublons
-- À exécuter une fois dans Supabase : SQL Editor → Run
-- (supprime les lignes en double, garde la plus ancienne)
-- ============================================================

delete from public.voyages v
using public.voyages d
where v.id > d.id
  and v.date = d.date
  and v.camion is not distinct from d.camion
  and v.chauffeur is not distinct from d.chauffeur
  and v.materiaux is not distinct from d.materiaux
  and v.trajet is not distinct from d.trajet
  and v.tonnes = d.tonnes;

delete from public.chauffeurs c
using public.chauffeurs d
where c.id > d.id
  and c.nom = d.nom
  and c.tel is not distinct from d.tel;

-- Empêche les doublons lors des prochaines exécutions
alter table public.voyages
  drop constraint if exists voyages_unique;

alter table public.voyages
  add constraint voyages_unique
  unique (date, camion, chauffeur, materiaux, trajet, tonnes);

alter table public.chauffeurs
  drop constraint if exists chauffeurs_unique;

alter table public.chauffeurs
  add constraint chauffeurs_unique
  unique (nom, tel);
