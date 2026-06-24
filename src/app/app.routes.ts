import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.HomePage),
    title: 'celesterosa — Strumenti musicali',
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./features/catalog/catalog').then((m) => m.CatalogPage),
    title: 'Catalogo — celesterosa',
  },
  {
    path: 'prodotto/:slug',
    loadComponent: () => import('./features/product/product').then((m) => m.ProductPage),
    title: 'Prodotto — celesterosa',
  },
  {
    path: 'carrello',
    loadComponent: () => import('./features/cart/cart-page').then((m) => m.CartPage),
    title: 'Carrello — celesterosa',
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout').then((m) => m.CheckoutPage),
    title: 'Checkout — celesterosa',
  },
  {
    path: 'accedi',
    loadComponent: () => import('./features/auth/login').then((m) => m.LoginPage),
    title: 'Accedi — celesterosa',
  },
  {
    path: 'account',
    canActivate: [authGuard],
    loadComponent: () => import('./features/account/account').then((m) => m.AccountPage),
    title: 'Il mio account — celesterosa',
  },
  {
    path: 'ordini',
    canActivate: [authGuard],
    loadComponent: () => import('./features/orders-list/orders-list').then((m) => m.OrdersListPage),
    title: 'I miei ordini — celesterosa',
  },
  {
    path: 'ordini/:orderNumber',
    canActivate: [authGuard],
    loadComponent: () => import('./features/order-detail/order-detail').then((m) => m.OrderDetailPage),
    title: 'Ordine — celesterosa',
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin-shell/admin-shell').then((m) => m.AdminShell),
    children: [
      { path: '', redirectTo: 'ordini', pathMatch: 'full' },
      {
        path: 'ordini',
        loadComponent: () => import('./features/admin-orders/admin-orders').then((m) => m.AdminOrdersPage),
      },
      {
        path: 'prodotti',
        loadComponent: () =>
          import('./features/admin-products/admin-products').then((m) => m.AdminProductsPage),
      },
      {
        path: 'prodotti/nuovo',
        loadComponent: () =>
          import('./features/admin-product-form/admin-product-form').then((m) => m.AdminProductFormPage),
      },
      {
        path: 'prodotti/:id',
        loadComponent: () =>
          import('./features/admin-product-form/admin-product-form').then((m) => m.AdminProductFormPage),
      },
      {
        path: 'categorie',
        loadComponent: () =>
          import('./features/admin-categories/admin-categories').then((m) => m.AdminCategoriesPage),
      },
      {
        path: 'marche',
        loadComponent: () =>
          import('./features/admin-brands/admin-brands').then((m) => m.AdminBrandsPage),
      },
    ],
    title: 'Admin — celesterosa',
  },
  { path: '**', redirectTo: '' },
];
