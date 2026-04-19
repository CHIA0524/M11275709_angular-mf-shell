import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { SettingsService } from '../../core/services/settings.service';

@Component({
	selector: 'app-settings',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		MatCardModule,
		MatSlideToggleModule,
		MatSelectModule,
		MatFormFieldModule,
		MatDividerModule,
		MatIconModule
	],
	template: `
		<div class="settings-container">
			<mat-card>
				<mat-card-header>
					<mat-card-title>個人設定</mat-card-title>
					<mat-card-subtitle>自訂您的應用程式偏好</mat-card-subtitle>
				</mat-card-header>

				<mat-card-content>
					<div class="setting-item">
						<div class="setting-icon">
							<mat-icon>{{ isDarkMode ? 'dark_mode' : 'light_mode' }}</mat-icon>
						</div>
						<div class="setting-details">
							<h3>深色模式</h3>
							<p>啟用深色背景以減輕眼睛疲勞</p>
						</div>
						<div class="setting-action">
							<mat-slide-toggle [checked]="isDarkMode" (change)="toggleTheme($event.checked)"></mat-slide-toggle>
						</div>
					</div>

					<mat-divider></mat-divider>

					<div class="setting-item">
						<div class="setting-icon">
							<mat-icon>attach_money</mat-icon>
						</div>
						<div class="setting-details">
							<h3>預設貨幣</h3>
							<p>設定記帳預設使用的貨幣單位</p>
						</div>
						<div class="setting-action">
							<mat-form-field appearance="outline">
								<mat-label>選擇貨幣</mat-label>
								<mat-select [value]="currentCurrency" (selectionChange)="updateCurrency($event.value)">
									<mat-option value="TWD">新台幣 (TWD)</mat-option>
									<mat-option value="USD">美金 (USD)</mat-option>
									<mat-option value="JPY">日圓 (JPY)</mat-option>
									<mat-option value="EUR">歐元 (EUR)</mat-option>
									<mat-option value="KRW">韓元 (KRW)</mat-option>
									<mat-option value="CNY">人民幣 (CNY)</mat-option>
									<mat-option value="HKD">港幣 (HKD)</mat-option>
									<mat-option value="AUD">澳幣 (AUD)</mat-option>
									<mat-option value="GBP">英鎊 (GBP)</mat-option>
								</mat-select>
							</mat-form-field>
						</div>
					</div>

					<mat-divider></mat-divider>

					<div class="style-isolation-test">
						<h3>樣式隔離測試 (Style Isolation)</h3>
						<p class="isolated-text">
							這段文字的顏色只會在設定頁面中被覆寫為藍色，
							證明 Angular Component 的 View Encapsulation 正確運作。
						</p>
					</div>
				</mat-card-content>
			</mat-card>
		</div>
	`,
	styles: [
		`
			.settings-container {
				max-width: 800px;
				margin: 2rem auto;
				padding: 0 1rem;
			}

			mat-card-content {
				padding-top: 1rem;
			}

			.setting-item {
				display: flex;
				align-items: center;
				padding: 1.5rem 0;
				gap: 1rem;
			}

			@media (max-width: 600px) {
				.setting-item {
					flex-wrap: wrap;
				}
			}

			.setting-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 48px;
				height: 48px;
				border-radius: 50%;
				background-color: rgba(0, 0, 0, 0.04);
				color: #673ab7;
			}

			.setting-details {
				flex: 1;
			}

			.setting-details h3 {
				margin: 0;
				font-size: 1.1rem;
				font-weight: 500;
			}

			.setting-details p {
				margin: 0.25rem 0 0;
				color: rgba(254, 254, 254, 0.6);
				font-size: 0.9rem;
			}

			.setting-action {
				min-width: 150px;
				display: flex;
				justify-content: flex-end;
			}

			mat-form-field {
				width: 100%;
				margin-bottom: -1.25em;
			}

			.style-isolation-test {
				margin-top: 2rem;
				padding: 1rem;
				border: 1px dashed #ccc;
				border-radius: 4px;
				background-color: rgba(0, 0, 0, 0.02);
			}

			.style-isolation-test h3 {
				margin-top: 0;
				font-size: 1rem;
				color: #555;
			}

			.isolated-text {
				color: #2196f3;
				font-weight: bold;
			}
		`
	]
})
export class SettingsComponent {
	private settingsService = inject(SettingsService);

	isDarkMode = this.settingsService.settings().theme === 'dark';
	currentCurrency = this.settingsService.settings().defaultCurrency;

	constructor() {
		effect(() => {
			const settings = this.settingsService.settings();
			this.isDarkMode = settings.theme === 'dark';
			this.currentCurrency = settings.defaultCurrency;
		});
	}

	toggleTheme(checked: boolean): void {
		this.settingsService.updateSettings({
			theme: checked ? 'dark' : 'light'
		});
	}

	updateCurrency(currency: string): void {
		this.settingsService.updateSettings({
			defaultCurrency: currency as never
		});
	}
}