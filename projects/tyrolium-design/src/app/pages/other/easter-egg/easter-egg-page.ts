import { Component, inject } from '@angular/core';
import {
  TyroUiEasterEgg,
  TyroUiPageHeader,
  TyroUiLangService,
  TyroUiDataTable,
  TyroUiDataTableColDef,
  ITyroUiDataTableColumn,
  TyroUiBentoCard,
} from 'tyrolium-ui';

interface GameRow     { game: string; url: string; description: string; descriptionEn?: string; }
interface BehaviorRow { element: string; elementEn?: string; value: string; valueEn?: string; }

@Component({
  selector: 'app-easter-egg-page',
  imports: [TyroUiEasterEgg, TyroUiPageHeader, TyroUiDataTable, TyroUiDataTableColDef, TyroUiBentoCard],
  templateUrl: './easter-egg-page.html',
})
export class EasterEggPage {
  readonly lang = inject(TyroUiLangService).lang;

  /* ─── Column definitions ──────────────────────────── */

  readonly gameCols: ITyroUiDataTableColumn[] = [
    { key: 'game',        label: 'Jeu',         labelEn: 'Game',        width: '140px' },
    { key: 'url',         label: 'URL',                                  width: '340px' },
    { key: 'description', label: 'Description' },
  ];

  readonly behaviorCols: ITyroUiDataTableColumn[] = [
    { key: 'element', label: 'Élément',  labelEn: 'Element', width: '200px' },
    { key: 'value',   label: 'Valeur',   labelEn: 'Value' },
  ];

  /* ─── Jeux disponibles ────────────────────────────── */

  readonly gamesData: GameRow[] = [
    {
      game: 'Échec-ium',
      url: 'themaxium69.github.io/Echec-ium/',
      description:   'Jeu d\'échecs aux couleurs Tyrolium',
      descriptionEn: 'Chess game in Tyrolium colors',
    },
    {
      game: 'Flappium',
      url: 'themaxium69.github.io/Flappium/',
      description:   'Clone de Flappy Bird façon Tyrolium',
      descriptionEn: 'Flappy Bird clone Tyrolium style',
    },
    {
      game: 'Clavium',
      url: 'themaxium69.github.io/Clavium/',
      description:   'Jeu de rythme au clavier',
      descriptionEn: 'Keyboard rhythm game',
    },
  ];

  /* ─── Comportement ────────────────────────────────── */

  readonly behaviorData: BehaviorRow[] = [
    {
      element: 'Déclencheur',   elementEn: 'Trigger',
      value:   'Code Konami complet - 10 touches dans l\'ordre', valueEn: 'Full Konami Code - 10 keys in order',
    },
    {
      element: 'Fermeture',     elementEn: 'Close',
      value:   '<kbd>Escape</kbd> ou clic sur l\'overlay', valueEn: '<kbd>Escape</kbd> or overlay click',
    },
    {
      element: 'Ouverture jeu', elementEn: 'Open game',
      value:   '<code>window.open(url, \'_blank\', \'noopener\')</code>',
    },
    {
      element: 'State',         elementEn: 'State',
      value:   'Signal <code>isOpen</code> - <code>false</code> par défaut', valueEn: 'Signal <code>isOpen</code> - <code>false</code> by default',
    },
  ];
}
