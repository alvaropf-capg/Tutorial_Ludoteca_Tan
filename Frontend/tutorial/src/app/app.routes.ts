import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: '', redirectTo: '/games', pathMatch: 'full' },
  {path: 'categories', loadComponent: () => import('../app/category/category-list/category-list').then(m => m.CategoryListComponent)},
  {path: 'authors', loadComponent: () => import('../app/author/author-list/author-list').then(m => m.AuthorListComponent)},
  {path: 'games', loadComponent: () => import('../app/game/game-list/game-list').then(m => m.GameListComponent)},
  {path: 'cliente', loadComponent: () => import('../app/cliente/cliente-list/cliente-list').then(m => m.ClienteListComponent)},
  {path: 'prestamos', loadComponent: () => import('../app/prestamo/prestamo-list/prestamo-list').then(m => m.PrestamoListComponent)},
];
