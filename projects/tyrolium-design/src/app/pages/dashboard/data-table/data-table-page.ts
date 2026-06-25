import { Component, inject } from '@angular/core';
import {
  TyroUiPageHeader,
  TyroUiLangService,
  TyroUiDataTable,
  TyroUiDataTableColDef,
  ITyroUiDataTableColumn,
  TyroUiBentoCard,
  TyroUiChip,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow  { prop: string; type: string; default: string; description: string; descriptionEn?: string; }
interface FieldRow { field: string; type: string; description: string; descriptionEn?: string; }
interface UserRow  { name: string; email: string; role: string; roleEn?: string; status: string; statusEn?: string; }

@Component({
  selector: 'app-data-table-page',
  imports: [TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard, TyroUiChip],
  templateUrl: './data-table-page.html',
})
export class DataTablePage {
  readonly lang = inject(TyroUiLangService).lang;

  /* ─── Column definitions ──────────────────────────── */

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '200px' },
    { key: 'type',        label: 'Type',                             width: '180px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '80px'  },
    { key: 'description', label: 'Description' },
  ];

  readonly fieldCols: ITyroUiDataTableColumn[] = [
    { key: 'field',       label: 'Champ',  labelEn: 'Field', width: '180px' },
    { key: 'type',        label: 'Type',                      width: '220px' },
    { key: 'description', label: 'Description' },
  ];

  /* ─── Preview sample data ─────────────────────────── */

  readonly userCols: ITyroUiDataTableColumn[] = [
    { key: 'name',   label: 'Nom',    labelEn: 'Name',   width: '160px', sortable: true },
    { key: 'email',  label: 'Email',                      width: '220px', sortable: true },
    { key: 'role',   label: 'Rôle',   labelEn: 'Role',   width: '130px', filterable: true },
    { key: 'status', label: 'Statut', labelEn: 'Status', width: '120px', filterable: true },
  ];

  readonly sampleUsers: UserRow[] = [
    { name: 'Maxime Tournier', email: 'maxime@tyrolium.fr',  role: 'Admin',      roleEn: 'Admin',     status: 'Actif',    statusEn: 'Active' },
    { name: 'Alice Martin',    email: 'alice@tyrolium.fr',   role: 'Éditeur',    roleEn: 'Editor',    status: 'Actif',    statusEn: 'Active' },
    { name: 'Bob Dupont',      email: 'bob@solidserv.fr',    role: 'Viewer',     roleEn: 'Viewer',    status: 'Inactif',  statusEn: 'Inactive' },
    { name: 'Chloé Bernard',   email: 'chloe@influnias.fr',  role: 'Éditeur',    roleEn: 'Editor',    status: 'Actif',    statusEn: 'Active' },
    { name: 'David Chen',      email: 'david@tyrociel.fr',   role: 'Viewer',     roleEn: 'Viewer',    status: 'Suspendu', statusEn: 'Suspended' },
    { name: 'Emma Leblanc',    email: 'emma@gamenium.fr',    role: 'Moderateur', roleEn: 'Moderator', status: 'Actif',    statusEn: 'Active' },
    { name: 'François Petit',  email: 'francois@tyrolium.fr', role: 'Admin',     roleEn: 'Admin',     status: 'Actif',    statusEn: 'Active' },
    { name: 'Giulia Romano',   email: 'giulia@useritium.fr', role: 'Éditeur',    roleEn: 'Editor',    status: 'Inactif',  statusEn: 'Inactive' },
    { name: 'Hugo Moreau',     email: 'hugo@vturias.fr',     role: 'Viewer',     roleEn: 'Viewer',    status: 'Actif',    statusEn: 'Active' },
    { name: 'Inès Garnier',    email: 'ines@tyrolium.fr',    role: 'Moderateur', roleEn: 'Moderator', status: 'Actif',    statusEn: 'Active' },
    { name: 'Julien Faure',    email: 'julien@solidserv.fr', role: 'Viewer',     roleEn: 'Viewer',    status: 'Suspendu', statusEn: 'Suspended' },
    { name: 'Karim Amara',     email: 'karim@influnias.fr',  role: 'Éditeur',    roleEn: 'Editor',    status: 'Actif',    statusEn: 'Active' },
  ];

  /* ─── Inputs ──────────────────────────────────────── */

  readonly inputsData: PropRow[] = [
    {
      prop: '[columns]', type: 'ITyroUiDataTableColumn[]', default: '[]',
      description:   'Définition des colonnes (clé, label, largeur, tri, filtre…)',
      descriptionEn: 'Column definitions (key, label, width, sort, filter…)',
    },
    {
      prop: '[data]', type: 'unknown[]', default: '[]',
      description:   'Données à afficher — accepte n\'importe quel tableau d\'objets',
      descriptionEn: 'Data to display — accepts any array of objects',
    },
    {
      prop: '[searchable]', type: 'boolean', default: 'false',
      description:   'Affiche une barre de recherche globale (filtre toutes les colonnes)',
      descriptionEn: 'Displays a global search bar (filters all columns)',
    },
    {
      prop: '[filterable]', type: 'boolean', default: 'false',
      description:   'Affiche des filtres individuels par colonne (nécessite <code>filterable: true</code> sur la colonne)',
      descriptionEn: 'Displays individual per-column filters (requires <code>filterable: true</code> on the column)',
    },
    {
      prop: '[paginated]', type: 'boolean', default: 'false',
      description:   'Active la pagination avec navigation par pages',
      descriptionEn: 'Enables pagination with page navigation',
    },
    {
      prop: '[pageSize]', type: 'number', default: '10',
      description:   'Nombre de lignes affichées par page (ignoré si <code>[paginated]="false"</code>)',
      descriptionEn: 'Number of rows displayed per page (ignored if <code>[paginated]="false"</code>)',
    },
  ];

  /* ─── Interface ITyroUiDataTableColumn ────────────── */

  readonly columnInterfaceData: FieldRow[] = [
    { field: 'key',          type: 'string',                          description: 'Clé correspondant à la propriété de l\'objet de données',        descriptionEn: 'Key matching the property in the data object' },
    { field: 'label',        type: 'string',                          description: 'En-tête de colonne (fr)',                                         descriptionEn: 'Column header (fr)' },
    { field: 'labelEn?',     type: 'string',                          description: 'En-tête de colonne (en)',                                         descriptionEn: 'Column header (en)' },
    { field: 'sortable?',    type: 'boolean',                         description: 'Active le tri au clic sur l\'en-tête',                            descriptionEn: 'Enables sorting on header click' },
    { field: 'filterable?',  type: 'boolean',                         description: 'Inclut cette colonne dans le panneau de filtres individuels',      descriptionEn: 'Includes this column in the individual filter panel' },
    { field: 'width?',       type: 'string',                          description: 'Largeur fixe de la colonne (ex : <em>"160px"</em>)',              descriptionEn: 'Fixed column width (e.g. <em>"160px"</em>)' },
    { field: 'align?',       type: "'left' | 'center' | 'right'",    description: 'Alignement du texte dans la colonne',                             descriptionEn: 'Text alignment in the column' },
  ];
}
