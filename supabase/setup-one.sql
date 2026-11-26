-- ============================================================
-- LA Transport — installation (bloc unique)
-- Colle ce script, clique Run. C'est une seule instruction :
-- elle s'exécute en entier, où que soit le curseur.
-- ============================================================

do $setup$
begin
  -- 1) Autoriser la saisie pour l'utilisateur connecté
  execute 'drop policy if exists "ecriture voyages" on public.voyages';
  execute 'create policy "ecriture voyages" on public.voyages for insert to authenticated with check (true)';
  execute 'drop policy if exists "modif voyages" on public.voyages';
  execute 'create policy "modif voyages" on public.voyages for update to authenticated using (true) with check (true)';

  -- 2) Un chauffeur peut conduire plusieurs camions
  execute 'alter table public.chauffeurs drop constraint if exists chauffeurs_unique';

  -- 3) Remplacer les données de démonstration
  delete from public.voyages;
  delete from public.chauffeurs;
  delete from public.camions;

  insert into public.camions (id, modele, annee, km, etat) values
    ('147 TU 227',  '—', null, 0, 'En service'),
    ('192 TU 4169', '—', null, 0, 'En service'),
    ('192 TU 4373', '—', null, 0, 'En service'),
    ('194 TU 2450', '—', null, 0, 'En service'),
    ('194 TU 2451', '—', null, 0, 'En service'),
    ('196 TU 733',  '—', null, 0, 'En service'),
    ('197 TU 745',  '—', null, 0, 'En service'),
    ('199 TU 8532', '—', null, 0, 'En service'),
    ('199 TU 9522', '—', null, 0, 'En service'),
    ('199 TU 9524', '—', null, 0, 'En service'),
    ('199 TU 9526', '—', null, 0, 'En service'),
    ('199 TU 9531', '—', null, 0, 'En service'),
    ('205 TU 6850', '—', null, 0, 'En service'),
    ('227 TU 147',  '—', null, 0, 'En service'),
    ('227 TU 148',  '—', null, 0, 'En service'),
    ('196 TU 2333', '—', null, 0, 'En service'),
    ('205 TU 6921', '—', null, 0, 'En service');

  insert into public.chauffeurs (nom, permis, tel, camion, statut) values
    ('Habib',        null, '53108919', '147 TU 227',  'Disponible'),
    ('Hamdi',        null, '95266853', '192 TU 4169', 'Disponible'),
    ('Mohamed Ali',  null, '53824529', '192 TU 4373', 'Disponible'),
    ('Ghazi',        null, '56691009', '194 TU 2450', 'Disponible'),
    ('Ibrahim',      null, '97471769', '194 TU 2451', 'Disponible'),
    ('Ghaith',       null, '53034634', '196 TU 733',  'Disponible'),
    ('Samir Chebbi', null, '52879966', '197 TU 745',  'Disponible'),
    ('Nabil',        null, null,       '199 TU 8532', 'Disponible'),
    ('Samir Chebbi', null, '52879966', '199 TU 9522', 'Disponible'),
    ('Mahdi',        null, '21152182', '199 TU 9524', 'Disponible'),
    ('Tawfik',       null, '27723022', '199 TU 9526', 'Disponible'),
    ('Bilel',        null, null,       '199 TU 9531', 'Disponible'),
    ('Mourad',       null, '22257123', '205 TU 6850', 'Disponible'),
    ('Habib',        null, null,       '227 TU 147',  'Disponible'),
    ('Mohamed Ali',  null, '52890827', '227 TU 148',  'Disponible'),
    ('Ahmed',        null, '26228782', '196 TU 2333', 'Disponible'),
    ('Mondher',      null, '51713350', '205 TU 6921', 'Disponible');
end
$setup$;
