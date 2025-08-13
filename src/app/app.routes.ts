import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', loadComponent() {
      return import('./pages/start-page.component/start-page.component').then(c => c.StartPageComponent);
    },
  },
  {
    path: 'game', loadComponent() {
      return import('./pages/game-page.component/game-page.component').then(c => c.GamePageComponent);
    },
  },
  {
    path: 'scoreboard', loadComponent() {
      return import('./pages/scoreboard-page.component/scoreboard-page.component').then(c => c.ScoreboardPageComponent);
    },
  },
  { path: '**', redirectTo: '/' },
];
