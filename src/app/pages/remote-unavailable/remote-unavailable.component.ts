import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-remote-unavailable',
	standalone: true,
	imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
	template: `
		<div class="fallback-page">
			<mat-card class="fallback-card">
				<div class="fallback-icon">
					<mat-icon>link_off</mat-icon>
				</div>
				<h2>{{ title }}</h2>
				<p>
					目前無法載入微前端 {{ remoteName }}。
					請確認對應服務已在 localhost:{{ port }} 啟動。
				</p>
				<div class="actions">
					<button mat-raised-button color="primary" type="button" (click)="reload()">
						重新載入
					</button>
					<button mat-stroked-button type="button" (click)="goDashboard()">
						回到總覽
					</button>
				</div>
			</mat-card>
		</div>
	`,
	styles: [
		`
			.fallback-page {
				display: flex;
				justify-content: center;
				padding: 48px 16px;
			}

			.fallback-card {
				max-width: 560px;
				width: 100%;
				padding: 32px;
				text-align: center;
			}

			.fallback-icon {
				display: flex;
				justify-content: center;
				margin-bottom: 16px;
			}

			.fallback-icon mat-icon {
				width: 56px;
				height: 56px;
				font-size: 56px;
				color: #d97706;
			}

			h2 {
				margin: 0 0 12px;
			}

			p {
				margin: 0;
				line-height: 1.6;
				color: #4b5563;
			}

			.actions {
				display: flex;
				justify-content: center;
				gap: 12px;
				margin-top: 24px;
				flex-wrap: wrap;
			}
		`
	]
})
export class RemoteUnavailableComponent {
	private readonly route = inject(ActivatedRoute);
	private readonly router = inject(Router);

	protected readonly title = this.route.snapshot.data['title'] ?? '頁面載入失敗';
	protected readonly remoteName = this.route.snapshot.data['remoteName'] ?? 'unknown';
	protected readonly port = this.route.snapshot.data['port'] ?? 'unknown';

	protected reload(): void {
		window.location.reload();
	}

	protected goDashboard(): void {
		void this.router.navigateByUrl('/dashboard');
	}
}