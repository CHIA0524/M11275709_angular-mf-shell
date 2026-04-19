import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Currency {
	code: string;
	name: string;
}

interface RateData {
	base: string;
	date: string;
	rates: { [key: string]: number };
}

@Component({
	selector: 'app-currency-converter',
	standalone: true,
	imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatIconModule],
	templateUrl: './currency-converter.component.html'
})
export class CurrencyConverterComponent implements OnInit {
	amount = 1000;
	baseCurrency = 'TWD';
	targetCurrency = 'USD';
	convertedAmount: number | null = null;
	loading = false;

	availableCurrencies: Currency[] = [
		{ code: 'TWD', name: '新台幣' },
		{ code: 'USD', name: '美金' },
		{ code: 'EUR', name: '歐元' },
		{ code: 'JPY', name: '日圓' },
		{ code: 'KRW', name: '韓元' },
		{ code: 'CNY', name: '人民幣' },
		{ code: 'HKD', name: '港幣' },
		{ code: 'AUD', name: '澳幣' },
		{ code: 'GBP', name: '英鎊' }
	];

	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		this.convert();
	}

	onBaseCurrencyChange(): void {
		this.convert();
	}

	convert(): void {
		if (this.baseCurrency === this.targetCurrency) {
			this.convertedAmount = this.amount;
			return;
		}

		this.loading = true;

		this.http
			.get<RateData>('assets/mock/currency/rates.json')
			.pipe(
				catchError((error) => {
					console.error('Failed to load mock rates', error);
					return of(null);
				})
			)
			.subscribe((data) => {
				if (data && data.rates && data.base === 'TWD') {
					if (this.baseCurrency === 'TWD') {
						this.convertedAmount = this.amount * (data.rates[this.targetCurrency] || 0);
					} else if (this.targetCurrency === 'TWD') {
						this.convertedAmount = this.amount / (data.rates[this.baseCurrency] || 1);
					} else {
						const toTwd = this.amount / (data.rates[this.baseCurrency] || 1);
						this.convertedAmount = toTwd * (data.rates[this.targetCurrency] || 0);
					}
				}

				this.loading = false;
			});
	}
}