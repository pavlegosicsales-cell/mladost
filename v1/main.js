/* ==========================================================================
   Teniski Klub Mladost, main.js
   Mobilni meni, reveal animacije, tabovi, FAQ, carobnjak forme
   ========================================================================== */

/* Apps Script URL se lepi ovde posle Skila 03 (Form Backend Setup) */
const ENDPOINT = '';

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------------
     1. Navigacija: pozadina na skrol + hamburger
     --------------------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');

  if (nav && !nav.classList.contains('nav--static')) {
    const onScroll = function () {
      nav.classList.toggle('is-solid', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (burger && menu) {
    const closeMenu = function () {
      menu.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Otvori meni');
    };

    burger.addEventListener('click', function () {
      const open = menu.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Zatvori meni' : 'Otvori meni');
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------------------------------------------------------------------
     2. Naslov slovo po slovo
     --------------------------------------------------------------------- */
  document.querySelectorAll('.split').forEach(function (el) {
    const words = el.textContent.trim().split(/\s+/);
    let i = 0;
    el.innerHTML = words.map(function (word) {
      const chars = Array.from(word).map(function (c) {
        return '<span class="c" style="--i:' + (i++) + '">' + c + '</span>';
      }).join('');
      return '<span class="w">' + chars + '</span>';
    }).join(' ');
  });

  /* ---------------------------------------------------------------------
     3. Reveal na skrol
     --------------------------------------------------------------------- */
  const targets = document.querySelectorAll('.reveal, .split, .blurin');

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (t) { io.observe(t); });

    /* Sigurnosna mreza: sve sto je vec u prvom ekranu prikazi odmah,
       da sadrzaj nikad ne ostane nevidljiv ako observer ne okine */
    window.setTimeout(function () {
      targets.forEach(function (t) {
        if (t.classList.contains('is-in')) return;
        const r = t.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          t.classList.add('is-in');
          io.unobserve(t);
        }
      });
    }, 900);
  } else {
    targets.forEach(function (t) { t.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------------------
     4. Brojaci u sekciji O klubu
     --------------------------------------------------------------------- */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    let started = false;

    const run = function () {
      if (started) return;
      started = true;
      const dur = 1100;
      const t0 = performance.now();
      const tick = function (now) {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if ('IntersectionObserver' in window) {
      const io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { run(); io2.disconnect(); } });
      }, { threshold: 0.5 });
      io2.observe(el);
    }
  });

  /* ---------------------------------------------------------------------
     5. Tabovi usluga
     --------------------------------------------------------------------- */
  const tabs = document.querySelectorAll('.tab');
  const medias = document.querySelectorAll('.tabs__media img');

  tabs.forEach(function (tab) {
    const btn = tab.querySelector('.tab__btn');
    btn.addEventListener('click', function () {
      const idx = tab.dataset.tab;
      tabs.forEach(function (t) {
        const on = t === tab;
        t.classList.toggle('is-active', on);
        t.querySelector('.tab__btn').setAttribute('aria-expanded', on ? 'true' : 'false');
      });
      medias.forEach(function (img) {
        img.classList.toggle('is-active', img.dataset.media === idx);
      });
    });
  });

  /* ---------------------------------------------------------------------
     6. Horizontalni akordeon procesa
     --------------------------------------------------------------------- */
  const proc = document.getElementById('proc');
  if (proc) {
    const items = Array.prototype.slice.call(proc.querySelectorAll('.proc__item'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const CYCLE = 7000;
    let current = 0;
    let timer = null;

    const setActive = function (index) {
      current = (index + items.length) % items.length;
      items.forEach(function (item, i) {
        const on = i === current;
        item.classList.toggle('is-active', on);
        item.setAttribute('aria-expanded', on ? 'true' : 'false');
        /* restart animacije trake */
        const fill = item.querySelector('.proc__rail i');
        if (fill) {
          fill.style.animation = 'none';
          void fill.offsetWidth;
          fill.style.animation = '';
        }
      });
    };

    const play = function () {
      if (reduced) return;
      stop();
      timer = window.setInterval(function () { setActive(current + 1); }, CYCLE);
    };
    const stop = function () {
      if (timer) { window.clearInterval(timer); timer = null; }
    };

    items.forEach(function (item, i) {
      item.addEventListener('click', function () { setActive(i); play(); });
      item.addEventListener('focus', function () { setActive(i); stop(); });
    });

    proc.addEventListener('mouseenter', stop);
    proc.addEventListener('mouseleave', play);

    if ('IntersectionObserver' in window) {
      const io3 = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.isIntersecting ? play() : stop(); });
      }, { threshold: 0.3 });
      io3.observe(proc);
    } else {
      play();
    }
  }

  /* ---------------------------------------------------------------------
     7. FAQ akordeon
     --------------------------------------------------------------------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const q = item.querySelector('.faq-item__q');
    q.addEventListener('click', function () {
      const open = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        item.classList.add('is-open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ---------------------------------------------------------------------
     8. Carobnjak kontakt forme
     --------------------------------------------------------------------- */
  const wizard = document.getElementById('wizard');
  if (!wizard) return;

  const panels = wizard.querySelectorAll('.step-panel');
  const dots = wizard.querySelectorAll('.wizard__dots span');
  const msg = document.getElementById('form-msg');
  const submitBtn = document.getElementById('submit-btn');
  const answers = {};
  let current = 0;

  const show = function (index) {
    current = Math.max(0, Math.min(index, panels.length - 1));
    panels.forEach(function (p, i) { p.classList.toggle('is-active', i === current); });
    dots.forEach(function (d, i) { d.classList.toggle('is-done', i <= current); });
    const active = panels[current];
    const focusable = active.querySelector('.choice, input, textarea');
    if (focusable && index !== 0) focusable.focus({ preventScroll: true });
  };

  wizard.querySelectorAll('.choice').forEach(function (choice) {
    choice.addEventListener('click', function () {
      const field = choice.dataset.field;
      answers[field] = choice.dataset.value;

      choice.closest('.choices').querySelectorAll('.choice').forEach(function (c) {
        c.classList.toggle('is-picked', c === choice);
      });

      setTimeout(function () { show(current + 1); }, 180);
    });
  });

  wizard.querySelectorAll('[data-back]').forEach(function (btn) {
    btn.addEventListener('click', function () { show(current - 1); });
  });

  const setMsg = function (text, ok) {
    msg.textContent = text;
    msg.classList.remove('is-ok', 'is-err');
    msg.classList.add(ok ? 'is-ok' : 'is-err');
  };

  wizard.addEventListener('submit', function (e) {
    e.preventDefault();

    const ime = wizard.querySelector('#ime');
    const telefon = wizard.querySelector('#telefon');
    const email = wizard.querySelector('#email');

    if (!ime.value.trim() || !telefon.value.trim() || !email.value.trim()) {
      setMsg('Popuni ime, telefon i email da bismo mogli da se javimo.', false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setMsg('Email adresa nije ispravna. Proveri je pa probaj ponovo.', false);
      return;
    }

    const payload = {
      usluga: answers.usluga || '',
      zaKoga: answers.zaKoga || '',
      kada: answers.kada || '',
      ime: ime.value.trim(),
      telefon: telefon.value.trim(),
      email: email.value.trim(),
      poruka: wizard.querySelector('#poruka').value.trim(),
      stranica: window.location.href
    };

    if (!ENDPOINT) {
      setMsg('Forma još nije povezana sa serverom. Pozovi 061 500 50 51 i javljamo se odmah.', false);
      console.warn('ENDPOINT je prazan. Pokreni Skill 03 i nalepi Apps Script URL u main.js.');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.6';

    fetch(ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    })
      .then(function (r) {
        if (!r.ok) throw new Error('Neuspesno slanje');
        wizard.querySelectorAll('.step-panel').forEach(function (p) { p.classList.remove('is-active'); });
        dots.forEach(function (d) { d.classList.add('is-done'); });
        setMsg('Hvala, upit je stigao. Javljamo se na telefon koji si ostavio, najčešće isti dan.', true);
      })
      .catch(function () {
        setMsg('Slanje nije uspelo. Pozovi 061 500 50 51 ili piši na mladost.tenis@gmail.com.', false);
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      });
  });

  show(0);
});
