import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucideFileText } from '@lucide/angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LucideFileText],
  template: '<svg lucideFileText></svg>',
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
