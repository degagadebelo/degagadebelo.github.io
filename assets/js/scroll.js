/**
 * Scroll behaviour
 * Header state and progress bar, back-to-top, scroll reveals, animated
 * counters, timeline progress and gentle parallax.
 */
(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canObserve = 'IntersectionObserver' in window;

  /* ---------- Header, progress, back to top, timeline, parallax ---------- */
  const header = $('.site-header');
  const toTop = $('.to-top');
  const timeline = $('.timeline');
  const parallax = reduced ? [] : $$('[data-parallax]');
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    header?.classList.toggle('is-scrolled', y > 24);
    header?.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1).toFixed(4) : 0);
    toTop?.classList.toggle('is-visible', y > 600);

    if (timeline) {
      const marker = window.innerHeight * 0.7;
      const box = timeline.getBoundingClientRect();
      const atEnd = max - y < 4;
      const fill = atEnd ? 1 : Math.min(Math.max((marker - box.top) / box.height, 0), 1);
      timeline.style.setProperty('--fill', fill.toFixed(4));
      $$('.timeline__item', timeline).forEach((item) => {
        item.classList.toggle('is-active', atEnd || item.getBoundingClientRect().top < marker);
      });
    }

    if (y < window.innerHeight * 1.2) {
      parallax.forEach((el) => {
        el.style.transform = `translate3d(0, ${(y * Number(el.dataset.parallax)).toFixed(1)}px, 0)`;
      });
    }
    ticking = false;
  };

  const requestUpdate = () => {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  document.addEventListener('layoutchange', requestUpdate);
  update();

  toTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    $('#main')?.focus({ preventScroll: true });
  });

  /* ---------- Reveal on scroll ---------- */
  if (canObserve && !reduced) {
    const reveal = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((entry, index) => {
        const el = entry.target;
        el.style.setProperty('--delay', `${Math.min(index * 90, 360)}ms`);
        el.classList.add('is-in');
        reveal.unobserve(el);
        // Hand the element back to its own hover transitions afterwards
        window.setTimeout(() => el.classList.remove('reveal', 'is-in'), 1300);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    // Only hide what is still below the fold, so nothing flashes on load
    $$('[data-reveal]')
      .filter((el) => el.getBoundingClientRect().top > window.innerHeight)
      .forEach((el) => { el.classList.add('reveal'); reveal.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  const counters = $$('[data-count]');
  if (canObserve && !reduced && counters.length) {
    const run = (el) => {
      const target = Number(el.dataset.count);
      const duration = 1400;
      let start;
      const step = (time) => {
        start ??= time;
        const t = Math.min((time - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
        if (t < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };
    const counterObserver = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((entry) => {
        run(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) el.textContent = '0';
      counterObserver.observe(el);
    });
  }
})();
