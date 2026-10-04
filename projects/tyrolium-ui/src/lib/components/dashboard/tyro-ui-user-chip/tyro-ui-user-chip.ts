import {
  Component, DestroyRef, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild, inject, signal,
} from '@angular/core';
import { TyroUiAvatar, TyroUiAvatarSize } from '../tyro-ui-avatar/tyro-ui-avatar';
import { TyroUiChip } from '../tyro-ui-chip/tyro-ui-chip';
import { TyroUiSkeleton } from '../tyro-ui-skeleton/tyro-ui-skeleton';
import { TyroUiLangService } from '../../../services/tyro-ui-lang.service';
import { ITyroUiUserChipBadge, ITyroUiUserChipLine } from '../../../interface/ityro-ui-user-chip-detail';

const BUBBLE_WIDTH = 260;

/**
 * Utilisateur affiché en "pilule" : avatar + nom. Au clic, ouvre une bulle "Détail"
 * (grand avatar, nom, @pseudo, lignes d'info, étiquettes).
 * Purement présentationnel : le site peut charger le détail sur (opened) et le renvoyer
 * via [badges] / [lines] / [detailLoading] / [detailError].
 */
@Component({
  selector: 'tyro-ui-user-chip',
  imports: [TyroUiAvatar, TyroUiChip, TyroUiSkeleton],
  templateUrl: './tyro-ui-user-chip.html',
  styleUrl: './tyro-ui-user-chip.css',
})
export class TyroUiUserChip {
  /** Nom affiché (ex. displayName, sinon pseudo). */
  @Input() name = '';
  /** Pseudo, affiché en "@pseudo" dans la bulle. */
  @Input() username?: string;
  /** URL de la photo ; sinon avatar généré depuis [name] (voir tyro-ui-avatar). */
  @Input() src?: string;
  @Input() size: TyroUiAvatarSize = 'sm';
  /** false : simple affichage, sans bulle. */
  @Input() clickable = true;

  /* ─── Bulle "Détail" ─── */
  @Input() badges: ITyroUiUserChipBadge[] = [];
  @Input() lines:  ITyroUiUserChipLine[]  = [];
  @Input() detailLoading = false;
  @Input() detailError: string | null = null;
  /** Titre de la bulle ; par défaut "Détail" / "Details". */
  @Input() bubbleLabel?: string;

  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  readonly lang = inject(TyroUiLangService).lang;
  private readonly host = inject(ElementRef<HTMLElement>);

  /**
   * La bulle est déplacée dans <body> à l'ouverture : un parent avec transform/filter
   * ferait sinon de position:fixed une position relative à ce parent (et l'overflow la couperait).
   * Le nœud garde ses attributs d'encapsulation : les styles du composant s'appliquent toujours.
   */
  @ViewChild('bubble') set bubbleRef(ref: ElementRef<HTMLElement> | undefined) {
    this.bubbleEl = ref?.nativeElement;
    if (this.bubbleEl) document.body.appendChild(this.bubbleEl);
  }
  private bubbleEl?: HTMLElement;

  readonly open     = signal(false);
  /** Position fixe : la bulle n'est pas coupée par un conteneur qui défile (tableaux…). */
  readonly position = signal({ top: 0, left: 0 });

  constructor() {
    // Capture : le défilement d'un conteneur interne ne remonte pas jusqu'à document.
    const onScroll = () => this.close();
    document.addEventListener('scroll', onScroll, true);
    inject(DestroyRef).onDestroy(() => {
      document.removeEventListener('scroll', onScroll, true);
      this.bubbleEl?.remove();
    });
  }

  toggle(event: MouseEvent) {
    if (!this.clickable) return;
    // Pas de stopPropagation : les autres chips doivent voir ce clic pour fermer leur bulle.
    if (this.open()) {
      this.close();
      return;
    }
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.position.set({
      top:  rect.bottom + 8,
      left: Math.max(8, Math.min(rect.left, window.innerWidth - BUBBLE_WIDTH - 8)),
    });
    this.open.set(true);
    this.opened.emit();
  }

  close() {
    if (!this.open()) return;
    this.open.set(false);
    this.closed.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as Node;
    if (!this.host.nativeElement.contains(target) && !this.bubbleEl?.contains(target)) this.close();
  }

  @HostListener('document:keydown.escape')
  onEscape() { this.close(); }
}
