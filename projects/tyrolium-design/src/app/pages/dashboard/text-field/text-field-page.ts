import { Component, inject, signal } from '@angular/core';
import {
  TyroUiTextField,
  TyroUiPageHeader,
  TyroUiLangService,
  TyroUiDataTable,
  TyroUiDataTableColDef,
  ITyroUiDataTableColumn,
  TyroUiBentoCard,
} from 'tyrolium-ui';
import { DsPreview } from '../../../components/ds-preview/ds-preview';

interface PropRow  { prop: string; type: string; default: string; description: string; descriptionEn?: string; }
interface EventRow { event: string; payload: string; description: string; descriptionEn?: string; }

@Component({
  selector: 'app-text-field-page',
  imports: [TyroUiTextField, TyroUiPageHeader, DsPreview, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './text-field-page.html',
})
export class TextFieldPage {
  readonly lang = inject(TyroUiLangService).lang;

  readonly valOutlined = signal('');
  readonly valFilled   = signal('');
  readonly valStandard = signal('');
  readonly valPassword = signal('');
  readonly valEmail    = signal('contact@tyrolium.fr');
  readonly valError    = signal('');

  readonly propCols: ITyroUiDataTableColumn[] = [
    { key: 'prop',        label: 'Propriété',  labelEn: 'Property', width: '170px' },
    { key: 'type',        label: 'Type',                             width: '280px' },
    { key: 'default',     label: 'Défaut',     labelEn: 'Default',  width: '110px' },
    { key: 'description', label: 'Description' },
  ];

  readonly eventCols: ITyroUiDataTableColumn[] = [
    { key: 'event',       label: 'Événement',  labelEn: 'Event',    width: '160px' },
    { key: 'payload',     label: 'Payload',                          width: '100px' },
    { key: 'description', label: 'Description' },
  ];

  readonly inputsData: PropRow[] = [
    {
      prop: '[variant]', type: "'outlined' | 'filled' | 'standard'", default: "'outlined'",
      description:   'Style visuel du champ',
      descriptionEn: 'Visual style of the field',
    },
    {
      prop: '[type]', type: "'text' | 'password' | 'number' | 'date' | 'email' | 'tel'", default: "'text'",
      description:   'Type HTML du champ — password ajoute automatiquement le toggle œil',
      descriptionEn: 'HTML input type — password automatically adds an eye toggle',
    },
    {
      prop: '[(value)]', type: 'string', default: "''",
      description:   'Valeur du champ — two-way binding disponible',
      descriptionEn: 'Field value — two-way binding available',
    },
    {
      prop: '[label]', type: 'string', default: '—',
      description:   'Label flottant — monte au-dessus du champ au focus ou quand une valeur est saisie',
      descriptionEn: 'Floating label — moves above the field on focus or when a value is entered',
    },
    {
      prop: '[placeholder]', type: 'string', default: '—',
      description:   'Texte indicatif dans le champ (visible une fois le label remonté)',
      descriptionEn: 'Hint text in the field (visible once the label has floated)',
    },
    {
      prop: '[icon]', type: 'string', default: '—',
      description:   'Classe Remix Icon affichée à gauche',
      descriptionEn: 'Remix Icon class displayed on the left',
    },
    {
      prop: '[disabled]', type: 'boolean', default: 'false',
      description:   'Désactive le champ',
      descriptionEn: 'Disables the field',
    },
    {
      prop: '[error]', type: 'boolean', default: 'false',
      description:   'Passe le champ en état d\'erreur (bordure rouge)',
      descriptionEn: 'Sets the field to error state (red border)',
    },
    {
      prop: '[errorMessage]', type: 'string', default: '—',
      description:   'Message d\'erreur affiché sous le champ quand error = true',
      descriptionEn: 'Error message shown below the field when error is true',
    },
  ];

  readonly outputsData: EventRow[] = [
    {
      event: '(valueChange)', payload: 'string',
      description:   'Émis à chaque saisie utilisateur',
      descriptionEn: 'Emitted on every user keystroke',
    },
  ];
}
