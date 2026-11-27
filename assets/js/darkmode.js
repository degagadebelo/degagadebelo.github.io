/**
 * Dark mode
 * The initial theme is applied by a tiny inline script in <head> (prevents a
 * flash). This file handles the toggle button, remembers the choice in
 * localStorage and follows the system setting until a choice is made.
 */
(() => {
  'use strict';

  const KEY = 'dd-theme';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const store = {
    get() { try { return localStorage.getItem(KEY); } catch { return null; } },
    set(value) { try { localStorage.setItem(KEY, value); } catch { /* private mode */ } }
  };

  const syncButtons = () => {
    const dark = root.dataset.theme === 'dark';
    document.querySelectorAll('.theme-toggle').forEach((button) => {
      button.setAttribute('aria-pressed', String(dark));
      button.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    });
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#050B16' : '#081B33');
  };

  const apply = (theme) => {
    root.dataset.theme = theme;
    syncButtons();
    document.dispatchEvent(new CustomEvent('themechange', { detail: theme }));
  };

  /** Cross-fade between themes where supported, otherwise transition colours. */
  const applyAnimated = (theme) => {
    if (reduced.matches) { apply(theme); return; }
    if (document.startViewTransition) {
      root.classList.add('theme-switching');
      const transition = document.startViewTransition(() => apply(theme));
      // A skipped transition (for example during a resize) still applies the theme
      transition.ready.catch(() => {});
      transition.updateCallbackDone.catch(() => {});
      transition.finished.catch(() => {}).finally(() => root.classList.remove('theme-switching'));
      return;
    }
    root.classList.add('theme-fade');
    apply(theme);
    window.setTimeout(() => root.classList.remove('theme-fade'), 500);
  };

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.theme-toggle')) return;
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    store.set(next);
    applyAnimated(next);
  });

  media.addEventListener?.('change', (event) => {
    if (!store.get()) apply(event.matches ? 'dark' : 'light');
  });

  // Keep several open tabs in step
  window.addEventListener('storage', (event) => {
    if (event.key === KEY && event.newValue) apply(event.newValue);
  });

  syncButtons();
})();
