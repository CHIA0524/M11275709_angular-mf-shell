import { Injectable, signal } from '@angular/core';

export type SupportedLanguage = 'zh-TW' | 'en-US' | 'ja-JP';
export type TranslationKey = string;

interface LanguageChangedDetail {
  sourceId: string;
  language: SupportedLanguage;
}

const translations: Record<SupportedLanguage, Record<string, string>> = {
  'zh-TW': {
    'shell.appName': '財務管理',
    'shell.systemTitle': '財務管理系統',
    'shell.versionMicrofrontends': 'v1.0.0 Microfrontends',
    'shell.architectureMicrofrontends': 'Native Federation 微前端',
    'shell.language.button': '語言',
    'shell.menu.dashboard.label': '資產總覽',
    'shell.menu.dashboard.description': 'Dashboard - 圖表與統計',
    'shell.menu.bookkeeping.label': '快速記帳',
    'shell.menu.bookkeeping.description': 'Bookkeeping - 記帳功能',
    'shell.menu.currency.label': '匯率計算機',
    'shell.menu.currency.description': 'Currency Converter',
    'shell.menu.settings.label': '個人設定',
    'shell.menu.settings.description': 'Settings - 主題與偏好'
  },
  'en-US': {
    'shell.appName': 'Finance Workspace',
    'shell.systemTitle': 'Financial Operations Hub',
    'shell.versionMicrofrontends': 'v1.0.0 Microfrontends',
    'shell.architectureMicrofrontends': 'Native Federation microfrontends',
    'shell.language.button': 'Language',
    'shell.menu.dashboard.label': 'Portfolio Overview',
    'shell.menu.dashboard.description': 'Dashboard - charts and analytics',
    'shell.menu.bookkeeping.label': 'Quick Bookkeeping',
    'shell.menu.bookkeeping.description': 'Bookkeeping - daily transaction flow',
    'shell.menu.currency.label': 'FX Converter',
    'shell.menu.currency.description': 'Currency Converter',
    'shell.menu.settings.label': 'Preferences',
    'shell.menu.settings.description': 'Settings - themes and preferences'
  },
  'ja-JP': {
    'shell.appName': '財務ワークスペース',
    'shell.systemTitle': '財務オペレーションハブ',
    'shell.versionMicrofrontends': 'v1.0.0 Microfrontends',
    'shell.architectureMicrofrontends': 'Native Federation マイクロフロントエンド',
    'shell.language.button': '言語',
    'shell.menu.dashboard.label': '資産ダッシュボード',
    'shell.menu.dashboard.description': 'Dashboard - チャートと分析',
    'shell.menu.bookkeeping.label': 'クイック記帳',
    'shell.menu.bookkeeping.description': 'Bookkeeping - 日次取引フロー',
    'shell.menu.currency.label': '為替コンバーター',
    'shell.menu.currency.description': 'Currency Converter',
    'shell.menu.settings.label': '個人設定',
    'shell.menu.settings.description': 'Settings - テーマと設定'
  }
};

export interface LanguageOption {
  code: SupportedLanguage;
  nativeLabel: string;
  englishLabel: string;
}

const supportedLanguages: LanguageOption[] = [
  { code: 'zh-TW', nativeLabel: '繁體中文', englishLabel: 'Traditional Chinese' },
  { code: 'en-US', nativeLabel: 'English', englishLabel: 'English' },
  { code: 'ja-JP', nativeLabel: '日本語', englishLabel: 'Japanese' }
];

const storageKey = 'workspace.language';
const languageChangedEvent = 'microfrontends:language-changed';

const isSupportedLanguage = (value: string | null | undefined): value is SupportedLanguage =>
  value === 'zh-TW' || value === 'en-US' || value === 'ja-JP';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly supportedLanguages = supportedLanguages;
  readonly currentLanguage = signal<SupportedLanguage>(this.resolveInitialLanguage());
  private readonly sourceId = Math.random().toString(36).slice(2);

  constructor() {
    this.applyLanguage(this.currentLanguage(), false);

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageChange);
      window.addEventListener(languageChangedEvent, this.handleLanguageChanged as EventListener);
    }
  }

  translate(key: TranslationKey): string {
    return translations[this.currentLanguage()][key] ?? translations['zh-TW'][key] ?? key;
  }

  setLanguage(language: SupportedLanguage): void {
    this.applyLanguage(language, true);
  }

  getLanguageOption(language: SupportedLanguage): LanguageOption {
    return this.supportedLanguages.find((option) => option.code === language) ?? this.supportedLanguages[0];
  }

  private resolveInitialLanguage(): SupportedLanguage {
    if (typeof localStorage !== 'undefined') {
      const storedLanguage = localStorage.getItem(storageKey);
      if (isSupportedLanguage(storedLanguage)) {
        return storedLanguage;
      }
    }

    return 'zh-TW';
  }

  private applyLanguage(language: SupportedLanguage, shouldBroadcast: boolean): void {
    this.currentLanguage.set(language);

    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(storageKey, language);
    }

    if (shouldBroadcast && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent<LanguageChangedDetail>(languageChangedEvent, {
          detail: {
            sourceId: this.sourceId,
            language
          }
        })
      );
    }
  }

  private handleStorageChange = (event: StorageEvent): void => {
    if (event.key !== storageKey || !isSupportedLanguage(event.newValue)) {
      return;
    }

    this.applyLanguage(event.newValue, false);
  };

  private handleLanguageChanged = (event: Event): void => {
    const customEvent = event as CustomEvent<LanguageChangedDetail>;

    if (!customEvent.detail || customEvent.detail.sourceId === this.sourceId) {
      return;
    }

    this.applyLanguage(customEvent.detail.language, false);
  };
}