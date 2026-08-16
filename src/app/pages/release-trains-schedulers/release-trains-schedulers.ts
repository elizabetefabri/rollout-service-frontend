import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { ReleaseTrainCalendar } from './release-train-calendar/release-train-calendar';

@Component({
  selector: 'app-release-trains-schedulers',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeader, ReleaseTrainCalendar],
  templateUrl: './release-trains-schedulers.html',
  styleUrl: './release-trains-schedulers.scss',
})
export class ReleaseTrainsSchedulers {}
