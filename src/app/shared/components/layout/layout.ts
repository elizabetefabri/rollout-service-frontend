import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Sidebar } from '../sidebar/sidebar';
import { Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { Icon } from '../icon/icon';

/**
 * Layout corporativo: sidebar (esquerda), topbar com header, área principal
 * responsiva com <router-outlet> e footer.
 *
 * A sidebar é fixa no desktop e vira drawer off-canvas no mobile,
 * controlado por `navOpen`.
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ButtonModule, Header, Footer, Sidebar, Breadcrumbs, Icon],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  /** Drawer da sidebar aberto (apenas relevante no mobile). */
  readonly navOpen = signal(false);

  toggleNav(): void {
    this.navOpen.update((v) => !v);
  }

  closeNav(): void {
    this.navOpen.set(false);
  }
}
