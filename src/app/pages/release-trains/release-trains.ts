import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageScaffold } from '../../shared/components/page-scaffold/page-scaffold';

@Component({
  selector: 'app-release-trains',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageScaffold],
  templateUrl: './release-trains.html',
  styleUrl: './release-trains.scss',
})
export class ReleaseTrains {}
