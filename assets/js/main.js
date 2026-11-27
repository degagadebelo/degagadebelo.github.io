/**
 * Site interactions
 * Navigation, typing effect, hero chart animation, button ripple, timeline
 * and filters, modals, certificate viewer, map loader and contact form.
 * Every module checks that its elements exist, so one file serves all pages.
 */
(() => {
  'use strict';

  /* =================================================================
     SETUP: type your email address between the quotes, then upload.
     It then appears in the footer, on the contact card and in the form.
     While this is empty, those email options stay hidden.
     ================================================================= */
  const CONTACT_EMAIL = '';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const notifyLayout = () => document.dispatchEvent(new CustomEvent('layoutchange'));

  const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(CONTACT_EMAIL.trim());

  /* ---------- Email links and footer year ---------- */
  const initContactDetails = () => {
    $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
    if (!hasEmail) return;
    const address = CONTACT_EMAIL.trim();
    $$('[data-email-link]').forEach((link) => { link.href = `mailto:${address}`; });
    $$('[data-email-text]').forEach((el) => { el.textContent = address; });
    $$('[data-email-item]').forEach((el) => { el.hidden = false; });
  };

  /* ---------- Loader: remember that it has been seen ---------- */
  const initLoader = () => {
    try { sessionStorage.setItem('dd-visited', '1'); } catch { /* ignore */ }
    window.setTimeout(() => document.documentElement.classList.remove('show-loader'), 1300);
  };

  /* ---------- Mobile navigation ---------- */
  const initNavigation = () => {
    const button = $('.nav-toggle');
    const menu = $('.nav-menu');
    const header = $('.site-header');
    if (!button || !menu) return;
    const outside = () => $$('main, .site-footer, .to-top');

    const setOpen = (open) => {
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.classList.toggle('is-open', open);
      header.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      outside().forEach((el) => { el.inert = open; });
    };
    const isOpen = () => button.getAttribute('aria-expanded') === 'true';

    button.addEventListener('click', () => setOpen(!isOpen()));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) { setOpen(false); button.focus(); }
    });
    window.matchMedia('(min-width: 1141px)').addEventListener?.('change', (e) => { if (e.matches) setOpen(false); });
    window.addEventListener('pageshow', () => setOpen(false));
  };

  /* ---------- Typing effect (text is complete in the HTML) ---------- */
  const initTyping = () => {
    const el = $('[data-typing]');
    if (!el || reducedMotion.matches) return;
    const text = el.textContent.trim();
    const done = document.createElement('span');
    const caret = document.createElement('span');
    const rest = document.createElement('span');
    caret.className = 'typing__caret';
    rest.className = 'typing__rest';       // invisible text keeps the layout stable
    rest.textContent = text;
    el.textContent = '';
    el.classList.add('typing');
    el.append(done, caret, rest);

    let i = 0;
    const type = () => {
      i += 1;
      done.textContent = text.slice(0, i);
      rest.textContent = text.slice(i);
      if (i < text.length) window.setTimeout(type, 42);
      else el.classList.add('is-done');
    };
    window.setTimeout(type, 500);
  };

  /* ---------- Hero: moving chart lines and particles on canvas ---------- */
  const initHeroCanvas = () => {
    const canvas = $('.hero__canvas');
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    const hero = canvas.parentElement;
    const toggle = $('.motion-toggle');

    // Decorative, randomly generated series. They do not represent market data.
    const SERIES = [
      { colour: '201,162,39', alpha: 0.85, base: 0.64, amp: 0.15, width: 1.8, speed: 15, fill: true },
      { colour: '110,152,210', alpha: 0.5, base: 0.74, amp: 0.11, width: 1.2, speed: 10 },
      { colour: '255,255,255', alpha: 0.16, base: 0.52, amp: 0.09, width: 1, speed: 6 }
    ];
    const GAP = 34;
    let width = 0, height = 0, particles = [];
    let frame = 0, last = 0, paused = false, visible = true, ready = false;

    const nextValue = (previous) => Math.max(-1, Math.min(1, previous * 0.96 + (Math.random() - 0.48) * 0.55));

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      SERIES.forEach((s) => {
        let v = 0;
        s.offset = 0;
        s.points = Array.from({ length: Math.ceil(width / GAP) + 3 }, () => (v = nextValue(v)));
      });
      const count = Math.min(46, Math.round(width / 28));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        r: Math.random() * 1.4 + 0.5, vx: (Math.random() - 0.5) * 7, vy: -Math.random() * 7 - 2
      }));
      draw(0);
    };

    const draw = (dt) => {
      ctx.clearRect(0, 0, width, height);

      SERIES.forEach((s) => {
        s.offset += s.speed * dt;
        while (s.offset >= GAP) {
          s.offset -= GAP;
          s.points.shift();
          s.points.push(nextValue(s.points[s.points.length - 1]));
        }
        const y = (v) => height * (s.base - v * s.amp);
        ctx.beginPath();
        s.points.forEach((v, i) => {
          const x = i * GAP - s.offset;
          if (i) ctx.lineTo(x, y(v)); else ctx.moveTo(x, y(v));
        });
        ctx.strokeStyle = `rgba(${s.colour},${s.alpha * 0.6})`;
        ctx.lineWidth = s.width;
        ctx.stroke();
        if (s.fill) {
          ctx.lineTo(width + GAP * 3, height);
          ctx.lineTo(-GAP, height);
          const gradient = ctx.createLinearGradient(0, height * 0.45, 0, height);
          gradient.addColorStop(0, `rgba(${s.colour},0.11)`);
          gradient.addColorStop(1, `rgba(${s.colour},0)`);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      ctx.fillStyle = 'rgba(226,194,90,0.5)';
      particles.forEach((p) => {
        p.x = (p.x + p.vx * dt + width) % width;
        p.y = (p.y + p.vy * dt + height) % height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const loop = (time) => {
      frame = window.requestAnimationFrame(loop);
      if (time - last < 33) return;                       // about 30 frames per second
      draw(Math.min((time - last) / 1000, 0.1));
      last = time;
    };
    const sync = () => {
      const shouldRun = ready && visible && !paused && !document.hidden && !reducedMotion.matches;
      if (shouldRun && !frame) { last = performance.now(); frame = window.requestAnimationFrame(loop); }
      if (!shouldRun && frame) { window.cancelAnimationFrame(frame); frame = 0; }
    };

    let timer = 0, lastWidth = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (ready && hero.clientWidth !== lastWidth) { lastWidth = hero.clientWidth; resize(); }
      }, 180);
    }, { passive: true });
    document.addEventListener('visibilitychange', sync);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(hero);
    }
    toggle?.addEventListener('click', () => {
      paused = !paused;
      toggle.setAttribute('aria-pressed', String(paused));
      hero.classList.toggle('motion-paused', paused);
      sync();
    });

    const start = () => { lastWidth = hero.clientWidth; resize(); ready = true; sync(); };
    if ('requestIdleCallback' in window) window.requestIdleCallback(start, { timeout: 1200 });
    else window.setTimeout(start, 300);
  };

  /* ---------- Button ripple ---------- */
  const initRipple = () => {
    document.addEventListener('pointerdown', (event) => {
      const button = event.target.closest('.btn, .chip');
      if (!button || reducedMotion.matches) return;
      const box = button.getBoundingClientRect();
      const size = Math.max(box.width, box.height) * 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${event.clientX - box.left - size / 2}px;top:${event.clientY - box.top - size / 2}px`;
      if (getComputedStyle(button).position === 'static') button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.append(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  };

  /* ---------- Experience timeline: expand and filter ---------- */
  const initTimeline = () => {
    const toggles = $$('.role__toggle');
    const setExpanded = (button, open) => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      button.setAttribute('aria-expanded', String(open));
      $('span', button).textContent = open ? 'Hide details' : 'Show details';
      panel.hidden = !open;
    };
    toggles.forEach((button, index) => {
      button.hidden = false;
      setExpanded(button, index === 0 || `#${button.closest('li').id}` === window.location.hash);
      button.addEventListener('click', () => {
        setExpanded(button, button.getAttribute('aria-expanded') !== 'true');
        notifyLayout();
      });
    });
    // Links such as #ecma open the matching role
    window.addEventListener('hashchange', () => {
      const button = toggles.find((b) => `#${b.closest('li').id}` === window.location.hash);
      if (button) { setExpanded(button, true); notifyLayout(); }
    });
  };

  const initFilters = () => {
    $$('[data-filter-group]').forEach((group) => {
      const items = $$('[data-category]', document.getElementById(group.dataset.filterGroup));
      const status = $('[data-filter-status]', group.parentElement);
      group.hidden = false;
      group.addEventListener('click', (event) => {
        const chip = event.target.closest('[data-filter]');
        if (!chip) return;
        const value = chip.dataset.filter;
        $$('[data-filter]', group).forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        let shown = 0;
        items.forEach((item) => {
          const match = value === 'all' || item.dataset.category === value;
          item.hidden = !match;
          if (match) { shown += 1; item.classList.remove('reveal'); }
        });
        if (status) status.textContent = `${shown} ${shown === 1 ? 'item' : 'items'} shown`;
        notifyLayout();
      });
    });
  };

  /* ---------- Modals (native <dialog>) ---------- */
  const openModal = (dialog) => {
    if (typeof dialog.showModal !== 'function') { dialog.setAttribute('open', ''); return; }
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
  };

  const initModals = () => {
    $$('dialog').forEach((dialog) => {
      dialog.addEventListener('close', () => { document.documentElement.style.overflow = ''; });
      dialog.addEventListener('click', (event) => {
        // A click on the dialog element itself is a click on the backdrop
        if (event.target === dialog || event.target.closest('[data-close]')) dialog.close();
      });
    });
    $$('[data-dialog]').forEach((button) => {
      button.hidden = false;
      button.addEventListener('click', () => openModal(document.getElementById(button.dataset.dialog)));
    });
  };

  /* ---------- Certificate viewer ---------- */
  const initCertificateViewer = () => {
    const dialog = $('#cert-viewer');
    const triggers = $$('[data-preview]');
    if (!dialog || !triggers.length) return;
    const image = $('img', dialog);
    const title = $('h2', dialog);
    const download = $('[data-download]', dialog);
    const counter = $('[data-counter]', dialog);
    let list = triggers;
    let current = 0;

    const show = (index) => {
      current = (index + list.length) % list.length;
      const data = list[current].dataset;
      image.width = Number(data.width);
      image.height = Number(data.height);
      image.src = data.preview;
      image.alt = data.alt;
      title.textContent = data.title;
      download.href = data.file;
      counter.textContent = `${current + 1} of ${list.length}`;
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        list = triggers.filter((t) => !t.closest('[data-category]')?.hidden);
        show(list.indexOf(trigger));
        openModal(dialog);
      });
    });
    $('[data-prev]', dialog).addEventListener('click', () => show(current - 1));
    $('[data-next]', dialog).addEventListener('click', () => show(current + 1));
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
    });
  };

  /* ---------- Map: load Google Maps only when asked ---------- */
  const initMap = () => {
    const button = $('[data-map]');
    if (!button) return;
    button.hidden = false;
    button.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = button.dataset.map;
      frame.title = 'Google map of Addis Ababa, Ethiopia';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.allowFullscreen = true;
      button.closest('.map').append(frame);
      frame.focus();
    });
  };

  /* ---------- Contact form ----------
     Static hosting has no server. The form prepares the message for the
     visitor's email app (once CONTACT_EMAIL is set) or for WhatsApp.
     To receive submissions directly, put a form service URL (for example
     Formspree) in the form's data-endpoint attribute in contact.html. */
  const initContactForm = () => {
    const form = $('#contact-form');
    if (!form) return;
    const status = $('.form__status', form);
    const statusText = $('p', status);
    const copyButton = $('[data-copy]', status);
    const send = $('[data-send]', form);
    const whatsapp = $('[data-whatsapp]', form);
    const recipient = hasEmail ? CONTACT_EMAIL.trim() : '';
    const endpoint = form.dataset.endpoint;
    let prepared = '';
    form.noValidate = true;

    // Offer only the delivery routes that are configured
    whatsapp.hidden = false;
    if (endpoint || recipient) {
      send.hidden = false;
      send.disabled = false;
      if (endpoint) $('span', send).textContent = 'Send message';
    } else {
      whatsapp.classList.add('btn--gold');
    }

    const messages = {
      name: 'Enter your name.',
      email: 'Enter an email address such as name@company.com.',
      topic: 'Choose a topic.',
      message: 'Write a message of at least 10 characters.'
    };

    const validate = (field) => {
      const value = field.value.trim();
      let ok = value !== '';
      if (field.name === 'email') ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      if (field.name === 'message') ok = value.length >= 10;
      field.setAttribute('aria-invalid', String(!ok));
      document.getElementById(`${field.id}-error`).textContent = ok ? '' : messages[field.name];
      return ok;
    };
    const fields = ['name', 'email', 'topic', 'message'].map((n) => form.elements[n]);
    fields.forEach((field) => {
      field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
    });

    const compose = () => {
      const data = Object.fromEntries(new FormData(form));
      return {
        data,
        subject: `${data.topic} from ${data.name.trim()}`,
        body: `${data.message.trim()}\n\n${data.name.trim()}\n${data.email.trim()}`
      };
    };
    const allValid = () => {
      const invalid = fields.filter((f) => !validate(f));
      invalid[0]?.focus();
      return invalid.length === 0;
    };
    const isSpam = () => form.elements.website.value !== '';
    const report = (text, canCopy) => {
      statusText.textContent = text;
      copyButton.hidden = !canCopy;
      status.hidden = false;
    };

    const sendWhatsApp = () => {
      const { subject, body } = compose();
      prepared = `${subject}\n\n${body}`;
      window.open(`https://wa.me/${whatsapp.dataset.whatsapp}?text=${encodeURIComponent(prepared)}`, '_blank', 'noopener');
      report('WhatsApp should open in a new tab with your message ready. Press send there to deliver it.', true);
    };

    const sendToEndpoint = async () => {
      const { data, subject, body } = compose();
      send.disabled = true;
      report('Sending your message…', false);
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, subject })
        });
        if (!response.ok) throw new Error(String(response.status));
        form.reset();
        report('Message sent.', false);
      } catch {
        prepared = `${subject}\n\n${body}`;
        report('The message was not sent. Check your connection and try again, or send it by WhatsApp.', true);
      } finally {
        send.disabled = false;
      }
    };

    const sendEmail = () => {
      const { subject, body } = compose();
      prepared = `To: ${recipient}\nSubject: ${subject}\n\n${body}`;
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      report(`Your email app should now open with the message ready. Press send there to deliver it. If nothing opened, copy the message and email ${recipient}.`, true);
    };

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!allValid() || isSpam()) return;
      if (endpoint) sendToEndpoint();
      else if (recipient) sendEmail();
      else sendWhatsApp();
    });

    whatsapp.addEventListener('click', () => {
      if (allValid() && !isSpam()) sendWhatsApp();
    });

    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(prepared);
        copyButton.textContent = 'Copied';
      } catch {
        statusText.textContent = prepared;
      }
      window.setTimeout(() => { copyButton.textContent = 'Copy message'; }, 2500);
    });
  };

  [initContactDetails, initLoader, initNavigation, initTyping, initHeroCanvas, initRipple, initTimeline,
    initFilters, initModals, initCertificateViewer, initMap, initContactForm].forEach((init) => init());
  notifyLayout();
})();
