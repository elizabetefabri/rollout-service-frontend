import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map } from 'rxjs';

import { ButtonModule } from 'primeng/button';

import { AuthService } from '../../../core/services/auth/auth.service';
import { Icon } from '../icon/icon';
import { UserAvatar } from '../user-avatar/user-avatar';

interface NavLink {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, ButtonModule, Icon, UserAvatar],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly topLinks: NavLink[] = [
    { label: 'Calendário', icon: 'calendar-minus-2', route: '/calendario' },
    { label: 'Quality Budget', icon: 'tool-case', route: '/quality-budget' },
    { label: 'Dogfooding', icon: 'paw-print', route: '/dogfooding' },
  ];

  readonly rolloutLinks: NavLink[] = [
    { label: 'Release Trains', icon: 'git-branch', route: '/release-trains' },
    { label: 'Applications', icon: 'box', route: '/applications' },
    { label: 'Release Trains Schedulers', icon: 'calendar', route: '/release-train-schedulers' },
  ];

  readonly bottomLinks: NavLink[] = [
    { label: 'Configurações', icon: 'settings', route: '/configuracoes' },
  ];

  /** Flyout do Rollouts aberto. */
  readonly rolloutOpen = signal(false);

  /** URL atual (reativa) para destacar o grupo pelo contexto. */
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** Rollouts está ativo quando a rota atual é uma de suas sub-rotas. */
  readonly rolloutActive = computed(() =>
    this.rolloutLinks.some((l) => this.url().startsWith(l.route)),
  );

  toggleRollout(): void {
    this.rolloutOpen.update((v) => !v);
  }

  closeRollout(): void {
    this.rolloutOpen.set(false);
  }

  logout(): void {
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/login'));
  }
}
