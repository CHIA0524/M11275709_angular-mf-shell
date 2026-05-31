import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService, UserInfo } from '../../core/services/auth.service';
import { LanguageService, SupportedLanguage, TranslationKey } from '../../core/services/language.service';

interface MenuItem {
  labelKey: TranslationKey;
  icon: string;
  route: string;
  descriptionKey?: TranslationKey;
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent implements OnInit {
  currentUser: UserInfo | null = null;

  menuItems: MenuItem[] = [
    {
      labelKey: 'shell.menu.dashboard.label',
      icon: 'dashboard',
      route: '/dashboard',
      descriptionKey: 'shell.menu.dashboard.description'
    },
    {
      labelKey: 'shell.menu.bookkeeping.label',
      icon: 'receipt_long',
      route: '/bookkeeping',
      descriptionKey: 'shell.menu.bookkeeping.description'
    },
    {
      labelKey: 'shell.menu.currency.label',
      icon: 'currency_exchange',
      route: '/currency-converter',
      descriptionKey: 'shell.menu.currency.description'
    },
    {
      labelKey: 'shell.menu.settings.label',
      icon: 'settings',
      route: '/settings',
      descriptionKey: 'shell.menu.settings.description'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  t(key: TranslationKey): string {
    return this.languageService.translate(key);
  }

  setLanguage(language: SupportedLanguage): void {
    this.languageService.setLanguage(language);
  }

  currentLanguageLabel(): string {
    return this.languageService.getLanguageOption(this.currentLanguage()).nativeLabel;
  }

  get supportedLanguages() {
    return this.languageService.supportedLanguages;
  }

  get currentLanguage() {
    return this.languageService.currentLanguage;
  }

}
