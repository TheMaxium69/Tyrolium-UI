import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[TyroUiGloss]',
})
export class TyroUiGloss implements OnInit {
  @Input() glossColor = 'rgba(160, 165, 180, 0.25)';
  @Input() glossSize = 80;

  private glossEl!: HTMLElement;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const btn = this.el.nativeElement as HTMLElement;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    this.glossEl = document.createElement('span');

    Object.assign(this.glossEl.style, {
      pointerEvents: 'none',
      position: 'absolute',
      inset: '0',
      borderRadius: 'inherit',
      opacity: '0',
      transition: 'opacity 0.2s ease',
    });

    btn.appendChild(this.glossEl);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1) + '%';
    const y = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1) + '%';
    // On lit glossColor et glossSize ici, pas dans ngOnInit
    this.glossEl.style.background = `radial-gradient(circle ${this.glossSize}px at ${x} ${y}, ${this.glossColor} 0%, transparent 70%)`;
  }

  @HostListener('mouseenter')
  onEnter() {
    this.glossEl.style.opacity = '1';
  }

  @HostListener('mouseleave')
  onLeave() {
    this.glossEl.style.opacity = '0';
  }
}
