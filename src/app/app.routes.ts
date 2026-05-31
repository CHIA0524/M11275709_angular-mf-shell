import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/native-federation';

const loadRemoteUnavailableComponent = () =>
	import('./pages/remote-unavailable/remote-unavailable.component').then((m) => m.RemoteUnavailableComponent);

const withRemoteUnavailable = <T>(
	loader: () => Promise<T>
) =>
	() =>
		loader().catch(() => loadRemoteUnavailableComponent() as Promise<T>);

const loadDashboardComponent = () => loadRemoteModule('dashboard', './Dashboard').then((m) => m.DashboardComponent);

const loadTransactionListComponent = () =>
	loadRemoteModule('bookkeeping', './TransactionList').then((m) => m.TransactionListComponent);

const loadQuickAddComponent = () =>
	loadRemoteModule('bookkeeping', './QuickAdd').then((m) => m.QuickAddComponent);

const loadCurrencyConverterComponent = () =>
	loadRemoteModule('currency-converter', './CurrencyConverter').then((m) => m.CurrencyConverterComponent);

const loadSettingsComponent = () =>
	loadRemoteModule('settings', './Settings').then((m) => m.SettingsComponent);

const loadSettingsWorkspaceComponent = () =>
	loadRemoteModule('settings', './SettingsWorkspace').then((m) => m.SettingsWorkspaceComponent);

const loadNotificationSettingsComponent = () =>
	loadRemoteModule('settings', './NotificationSettings').then((m) => m.NotificationSettingsComponent);

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
		children: [
			{
				path: 'dashboard',
				loadComponent: withRemoteUnavailable(loadDashboardComponent),
				data: {
					title: 'Dashboard 模組暫時無法載入',
					remoteName: 'dashboard',
					port: 4201
				}
			},
			{
				path: 'bookkeeping',
				loadComponent: withRemoteUnavailable(loadTransactionListComponent),
				data: {
					title: 'Bookkeeping 模組暫時無法載入',
					remoteName: 'bookkeeping',
					port: 4202
				}
			},
			{
				path: 'bookkeeping/add',
				loadComponent: withRemoteUnavailable(loadQuickAddComponent),
				data: {
					title: 'Quick Add 模組暫時無法載入',
					remoteName: 'bookkeeping',
					port: 4202
				}
			},
			{
				path: 'bookkeeping/edit/:id',
				loadComponent: withRemoteUnavailable(loadQuickAddComponent),
				data: {
					title: 'Quick Add 模組暫時無法載入',
					remoteName: 'bookkeeping',
					port: 4202
				}
			},
			{
				path: 'transaction-list',
				redirectTo: 'bookkeeping'
			},
			{
				path: 'currency-converter',
				loadComponent: withRemoteUnavailable(loadCurrencyConverterComponent),
				data: {
					title: 'Currency Converter 模組暫時無法載入',
					remoteName: 'currency-converter',
					port: 4203
				}
			},
			{
				path: 'settings',
				loadComponent: withRemoteUnavailable(loadSettingsComponent),
				data: {
					title: 'Settings 模組暫時無法載入',
					remoteName: 'settings',
					port: 4204
				}
			},
			{
				path: 'settings/workspace',
				loadComponent: withRemoteUnavailable(loadSettingsWorkspaceComponent),
				data: {
					title: 'Settings 模組暫時無法載入',
					remoteName: 'settings',
					port: 4204
				}
			},
			{
				path: 'settings/notifications',
				loadComponent: withRemoteUnavailable(loadNotificationSettingsComponent),
				data: {
					title: 'Settings 模組暫時無法載入',
					remoteName: 'settings',
					port: 4204
				}
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
