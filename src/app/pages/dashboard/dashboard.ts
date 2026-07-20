import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { HealthService } from '../../core/services/health/health-service';

type BackendStatus = 'checking' | 'online' | 'offline';

/**
 * Dashboard — página de conteúdo (o shell corporativo é provido pelo Layout).
 * Exibe o status de saúde do backend Go.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly healthService = inject(HealthService);

  readonly backendStatus = signal<BackendStatus>('checking');

  ngOnInit(): void {
    this.healthService.check().subscribe({
      next: () => this.backendStatus.set('online'),
      error: () => this.backendStatus.set('offline'),
    });
  }
}
