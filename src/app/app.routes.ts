import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

const withRemoteFallback = <T>(loader: () => Promise<T>, fallback: () => Promise<T>) => () => loader().catch(() => fallback());

const loadLocalTransactionListComponent = () =>
	import('./pages/transaction-list/transaction-list.component').then((m) => m.TransactionListComponent);

const loadLocalQuickAddComponent = () =>
	import('./pages/quick-add/quick-add.component').then((m) => m.QuickAddComponent);

const loadLocalCurrencyConverterComponent = () =>
	import('./pages/currency-converter/currency-converter.component').then((m) => m.CurrencyConverterComponent);

const loadLocalSettingsComponent = () =>
	import('./pages/settings/settings.component').then((m) => m.SettingsComponent);

const loadDashboardComponent = () =>
	loadRemoteModule('dashboard', './Dashboard')
		.then((m) => m.DashboardComponent)
		.catch(() => import('./pages/dashboard/dashboard.component').then((component) => component.DashboardComponent));

const loadTransactionListComponent = () =>
	loadRemoteModule('bookkeeping', './TransactionList').then((m) => m.TransactionListComponent);

const loadQuickAddComponent = () =>
	loadRemoteModule('bookkeeping', './QuickAdd').then((m) => m.QuickAddComponent);

const loadCurrencyConverterComponent = () =>
	loadRemoteModule('currency-converter', './CurrencyConverter').then((m) => m.CurrencyConverterComponent);

const loadSettingsComponent = () =>
	loadRemoteModule('settings', './Settings').then((m) => m.SettingsComponent);

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
		children: [
			{
				path: 'dashboard',
				loadComponent: loadDashboardComponent
			},
			{
				path: 'bookkeeping',
				loadComponent: withRemoteFallback(loadTransactionListComponent, loadLocalTransactionListComponent)
			},
			{
				path: 'bookkeeping/add',
				loadComponent: withRemoteFallback(loadQuickAddComponent, loadLocalQuickAddComponent)
			},
			{
				path: 'bookkeeping/edit/:id',
				loadComponent: withRemoteFallback(loadQuickAddComponent, loadLocalQuickAddComponent)
			},
			{
				path: 'transaction-list',
				redirectTo: 'bookkeeping'
			},
			{
				path: 'currency-converter',
				loadComponent: withRemoteFallback(loadCurrencyConverterComponent, loadLocalCurrencyConverterComponent)
			},
			{
				path: 'settings',
				loadComponent: withRemoteFallback(loadSettingsComponent, loadLocalSettingsComponent)
			},
			{
				path: '',
				redirectTo: 'dashboard',
				pathMatch: 'full'
			}
		]
	},
	{
		path: '**',
		redirectTo: 'dashboard'
	}
];
