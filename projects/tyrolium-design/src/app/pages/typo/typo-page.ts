import { Component, inject, signal } from '@angular/core';
import {
  TyroUiBentoCard,
  TyroUiChip,
  TyroUiLangService,
  TyroUiPageHeader,
} from 'tyrolium-ui';

@Component({
  selector: 'app-typo-page',
  imports: [TyroUiPageHeader, TyroUiBentoCard, TyroUiChip],
  templateUrl: './typo-page.html',
  styleUrl: './typo-page.css',
})
export class TypoPage {
  readonly lang = inject(TyroUiLangService).lang;

  readonly fonts = [
    {
      name: 'Syne',
      role: 'Titres & Displays', roleEn: 'Headings & Displays',
      weight: '700 — Bold',
      family: "'Syne', sans-serif",
      sample: 'Tyrolium',
      desc: 'Police principale pour les grandes typographies. Utilisée sur les H1, H2 et les sections héros.',
      descEn: 'Primary typeface for large typography. Used on H1, H2 and hero sections.',
    },
    {
      name: 'Inter',
      role: 'Corps de texte & UI', roleEn: 'Body text & UI',
      weight: '300 / 400 / 700',
      family: "'Inter', sans-serif",
      sample: 'Tyrolium',
      desc: "Police système de l'interface. Utilisée partout dans le body, labels, boutons et navigation.",
      descEn: 'System interface typeface. Used throughout body text, labels, buttons and navigation.',
    },
    {
      name: 'Noto Sans Display',
      role: 'Sous-marque / Labels', roleEn: 'Sub-brand / Labels',
      weight: '400 — Regular',
      family: "'Noto Sans Display', sans-serif",
      sample: 'TYROLIUM',
      desc: 'Police des identifiants secondaires. Utilisée dans la navbar pour le label "Tyrolium" sous-marque.',
      descEn: 'Secondary identifier typeface. Used in the navbar for the "Tyrolium" sub-brand label.',
    },
  ];

  readonly uiColors = [
    { hex: '#111827', name: 'Texte principal', nameEn: 'Primary text',  role: 'Text',    light: false },
    { hex: '#0533c8', name: 'Bleu label',      nameEn: 'Label blue',    role: 'Label',   light: false },
    { hex: '#f6f7fb', name: 'Fond clair',      nameEn: 'Light surface', role: 'Surface', light: true  },
    { hex: '#0f1117', name: 'Fond sombre',     nameEn: 'Dark BG',       role: 'Dark BG', light: false },
  ];

  readonly gradientColors = [
    { hex: '#0000FF', name: 'Bleu pur',   nameEn: 'Pure blue', role: 'Début', roleEn: 'Start', light: false },
    { hex: '#BF0000', name: 'Rouge',      nameEn: 'Red',       role: 'Fin',   roleEn: 'End',   light: false },
  ];

  readonly brandGradient = 'linear-gradient(135deg, #0400d4 0%, #6600cc 40%, #cc0000 100%)';

  readonly copied = signal('');

  copyHex(hex: string) {
    navigator.clipboard.writeText(hex).then(() => {
      this.copied.set(hex);
      setTimeout(() => { if (this.copied() === hex) this.copied.set(''); }, 1800);
    });
  }
}
