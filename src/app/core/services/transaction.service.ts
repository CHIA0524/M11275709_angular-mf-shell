import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Transaction {
	id: string;
	type: 'income' | 'expense';
	category: string;
	amount: number;
	currency: string;
	date: string;
	notes?: string;
}

@Injectable({
	providedIn: 'root'
})
export class TransactionService {
	private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
	private readonly storageKey = 'transactions';

	constructor(private http: HttpClient) {
		this.loadInitialData();
	}

	private loadInitialData(): void {
		const storedTransactions = localStorage.getItem(this.storageKey);

		if (storedTransactions) {
			try {
				const parsed = JSON.parse(storedTransactions);
				if (parsed.length > 0) {
					this.transactionsSubject.next(parsed);
					return;
				}
			} catch (error) {
				console.error('Error parsing stored transactions:', error);
				localStorage.removeItem(this.storageKey);
			}
		}

		this.loadMockData();
	}

	private loadMockData(): void {
		this.http.get<Transaction[]>('assets/mock/transaction/transactions.json').subscribe({
			next: (data) => {
				this.saveToLocalStorage(data);
			},
			error: (err) => console.error('Failed to load mock data', err)
		});
	}

	private saveToLocalStorage(transactions: Transaction[]): void {
		const transactionsWithCurrency = transactions.map((transaction) => ({
			...transaction,
			currency: transaction.currency || 'TWD'
		}));

		localStorage.setItem(this.storageKey, JSON.stringify(transactionsWithCurrency));
		this.transactionsSubject.next(transactionsWithCurrency);
	}

	getTransactions(): Observable<Transaction[]> {
		return this.transactionsSubject.asObservable().pipe(
			map((transactions) =>
				transactions.map((transaction) => ({
					...transaction,
					currency: transaction.currency || 'TWD'
				}))
			)
		);
	}

	getTransactionById(id: string): Observable<Transaction | undefined> {
		return this.getTransactions().pipe(map((transactions) => transactions.find((transaction) => transaction.id === id)));
	}

	addTransaction(transaction: Omit<Transaction, 'id'>): void {
		const currentTransactions = this.transactionsSubject.getValue();
		const newTransaction: Transaction = {
			...transaction,
			id: new Date().getTime().toString()
		};
		this.saveToLocalStorage([...currentTransactions, newTransaction]);
	}

	updateTransaction(updatedTransaction: Transaction): void {
		const currentTransactions = this.transactionsSubject.getValue();
		const index = currentTransactions.findIndex((transaction) => transaction.id === updatedTransaction.id);

		if (index > -1) {
			const updatedTransactions = [...currentTransactions];
			updatedTransactions[index] = updatedTransaction;
			this.saveToLocalStorage(updatedTransactions);
		}
	}

	deleteTransaction(id: string): void {
		const currentTransactions = this.transactionsSubject.getValue();
		this.saveToLocalStorage(currentTransactions.filter((transaction) => transaction.id !== id));
	}
}