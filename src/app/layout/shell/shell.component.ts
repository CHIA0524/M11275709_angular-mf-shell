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

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  description?: string;
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
      label: '資產總覽',
      icon: 'dashboard',
      route: '/dashboard',
      description: 'Dashboard - 圖表與統計'
    },
    {
      label: '快速記帳',
      icon: 'receipt_long',
      route: '/bookkeeping',
      description: 'Bookkeeping - 記帳功能'
    },
    {
      label: '匯率計算機',
      icon: 'currency_exchange',
      route: '/currency-converter',
      description: 'Currency Converter'
    },
    {
      label: '個人設定',
      icon: 'settings',
      route: '/settings',
      description: 'Settings - 主題與偏好'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

}
