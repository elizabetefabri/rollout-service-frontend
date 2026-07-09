import { Component } from '@angular/core';
import { Header } from '../../shared/components/header/header';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../../shared/components/footer/footer';
import { Breadcrumbs } from '../../shared/components/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, Header, Footer, Breadcrumbs],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {}
