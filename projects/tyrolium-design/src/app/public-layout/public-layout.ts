import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ITyroUiNavbarPages, TyroUiFooter, TyroUiLangService, TyroUiNavbar } from 'tyrolium-ui';

@Component({
  selector: 'app-public-layout',
  imports: [RouterOutlet, TyroUiNavbar, TyroUiFooter],
  template: `
    <tyro-ui-navbar
      project="Design"
      logo="assets/tyrolium-ui/projects/Tyrolium.png"
      [pages]="pages()"
      [placeholder]="false"
    >
    </tyro-ui-navbar>

    <router-outlet />

    <tyro-ui-footer
      project="Design"
      logo="assets/tyrolium-ui/projects/Tyrolium.png"
      [content]="content()"
      [pages]="pages()"
      [socials]="socials">
    </tyro-ui-footer>
  `,
})
export class PublicLayout {
  private readonly langService = inject(TyroUiLangService);

    public pages = computed<ITyroUiNavbarPages[]>(() =>
        this.langService.lang() === 'en'
            ? [
                { label: 'Design System', link: '/', icon: 'ri-palette-line' },
                { label: 'Tyrolium',      href: 'https://tyrolium.fr', icon: 'ri-home-4-line' },
            ]
            : [
                { label: 'Design Système', link: '/', icon: 'ri-palette-line' },
                { label: 'Tyrolium',       href: 'https://tyrolium.fr', icon: 'ri-home-4-line' },
            ]
    );

    public socials: ITyroUiNavbarPages[] = [
        { label: 'facebook',  link: 'https://www.facebook.com/tyrolium/',              icon: 'ri-facebook-fill' },
        { label: 'instagram', link: 'https://www.instagram.com/tyroliumentertainment/', icon: 'ri-instagram-line' },
        { label: 'x',         link: 'https://x.com/TyroliumE',                         icon: 'ri-twitter-x-fill' },
        { label: 'youtube',   link: 'https://www.youtube.com/@tyrolium',               icon: 'ri-youtube-fill' },
        { label: 'discord',   link: 'https://discord.com/invite/km8h5jHezt',           icon: 'ri-discord-fill' },
        { label: 'linkedin',  link: 'https://www.linkedin.com/company/tyrolium/',      icon: 'ri-linkedin-fill' },
        { label: 'tiktok',    link: 'https://www.tiktok.com/@tyrolium',                icon: 'ri-tiktok-fill' },
        { label: 'twitch',    link: 'https://www.twitch.tv/tyrolium',                  icon: 'ri-twitch-fill' },
        { label: 'github',    link: 'https://github.com/tyrolium',                     icon: 'ri-github-fill' },
        { label: 'telegram',  link: 'https://t.me/tyrolium',                           icon: 'ri-telegram-fill' },
        { label: 'thread',   link: 'https://www.threads.com/@tyroliumentertainment',  icon: 'ri-threads-fill' },
    ];

    public content = computed(() =>
        this.langService.lang() === 'en'
            ? `<strong>Tyrolium</strong> is a <strong>French tech holding company</strong> founded in <strong>2017</strong> by digital enthusiasts. From <strong>web development</strong> to <strong>cloud infrastructure</strong>, we support every project with expertise and passion. In parallel, we build our <strong>own ecosystem of projects</strong>: from hosting to gaming, CRM and social networks. <em>Founded by Maxime Tournier</em>`
            : `<strong>Tyrolium</strong> est une <strong>holding technologique française</strong> fondée en <strong>2017</strong> par des passionnés du numérique. De la <strong>conception web</strong> à l'<strong>infrastructure cloud</strong>, nous accompagnons chaque projet avec expertise et passion. En parallèle, nous développons notre <strong>propre écosystème de projets</strong> : de l'hébergement au gaming, en passant par le CRM et les réseaux sociaux. <em>Fondé par Maxime Tournier</em>`
    );
}
