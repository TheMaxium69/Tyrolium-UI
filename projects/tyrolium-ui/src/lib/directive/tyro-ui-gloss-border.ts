import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[TyroUiGlossBorder]',
})
export class TyroUiGlossBorder implements OnInit {
  @Input() borderWidth = 4;
  @Input() glossColor:string = 'rgba(255, 255, 255, 0.9)';
  @Input() glossSize = 80;

  private glossEl!: HTMLElement;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const btn = this.el.nativeElement as HTMLElement;
    btn.style.position = 'relative';

    this.glossEl = document.createElement('span');
    const bw = this.borderWidth + 'px';

    Object.assign(this.glossEl.style, {
      pointerEvents: 'none',
      position: 'absolute',
      inset: `-${bw}`,
      borderRadius: 'inherit',
      padding: bw,
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      opacity: '0',
      transition: 'opacity 0.2s ease',
    });

    btn.appendChild(this.glossEl);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';
    this.glossEl.style.background =
      `radial-gradient(circle ${this.glossSize}px at ${x} ${y}, ${this.glossColor} 0%, transparent 70%)`;
  }

  @HostListener('mouseenter')
  onEnter() { this.glossEl.style.opacity = '1'; }

  @HostListener('mouseleave')
  onLeave() { this.glossEl.style.opacity = '0'; }
}
