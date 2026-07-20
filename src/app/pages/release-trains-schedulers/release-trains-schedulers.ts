import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageScaffold } from '../../shared/components/page-scaffold/page-scaffold';

@Component({
  selector: 'app-release-trains-schedulers',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageScaffold],
  templateUrl: './release-trains-schedulers.html',
  styleUrl: './release-trains-schedulers.scss',
})
export class ReleaseTrainsSchedulers {}
