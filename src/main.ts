import { initFederation } from '@angular-architects/native-federation';

/** 在 Angular bootstrap 前就把儲存的 palette 套上 CSS vars，避免初始閃爍白色預設 */
function applyStoredPalette(): void {
  try {
    const stored = localStorage.getItem('user-settings');
    if (!stored) return;
    const settings = JSON.parse(stored) as { workspacePreferences?: { palette?: Record<string, string> } };
    const palette = settings?.workspacePreferences?.palette;
    if (!palette) return;
    const root = document.documentElement;
    const toBrightness = (hex: string): number => {
      const c = hex.replace('#', '');
      return (parseInt(c.slice(0, 2), 16) * 299 + parseInt(c.slice(2, 4), 16) * 587 + parseInt(c.slice(4, 6), 16) * 114) / 1000;
    };
    const contrast = (hex: string): string => (toBrightness(hex) > 128 ? '#111827' : '#F8FAFC');
    if (palette['background']) root.style.setProperty('--workspace-bg-color', palette['background']);
    if (palette['surface'])     root.style.setProperty('--workspace-surface-color', palette['surface']);
    if (palette['toolbar'])     { root.style.setProperty('--workspace-toolbar-color', palette['toolbar']); root.style.setProperty('--workspace-toolbar-contrast', contrast(palette['toolbar'])); }
    if (palette['sidebar'])     { root.style.setProperty('--workspace-sidebar-color', palette['sidebar']); root.style.setProperty('--workspace-sidebar-contrast', contrast(palette['sidebar'])); }
    if (palette['accent'])      root.style.setProperty('--workspace-accent-color', palette['accent']);
    if (palette['textPrimary']) root.style.setProperty('--workspace-text-color', palette['textPrimary']);
  } catch { /* 忽略 localStorage 解析錯誤 */ }
}

applyStoredPalette();

initFederation('federation.manifest.json')
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
