/* ==========================================================================
   Teniski Klub Mladost, v2
   Dugme: meri sirinu teksta i tamne pilule pa upisuje koliko svako od njih
   treba da klizne da bi zamenili mesta na hover. Bez toga bi `order` skakao
   bez animacije, a original to animira.
   ========================================================================== */

function izmeriDugmad() {
  var GAP = 14; /* isti gap kao u CSS-u */

  document.querySelectorAll('.btn').forEach(function (btn) {
    var label = btn.querySelector('.btn__label');
    var icon = btn.querySelector('.btn__icon');
    if (!label || !icon) return;

    /* mera se uzima u mirovanju, bez transforma */
    btn.style.setProperty('--swap-label', '0px');
    btn.style.setProperty('--swap-icon', '0px');

    var labelW = label.getBoundingClientRect().width;
    var iconW = icon.getBoundingClientRect().width;

    /* tekst ide udesno za sirinu pilule plus gap,
       pilula ide ulevo za sirinu teksta plus gap */
    btn.style.setProperty('--swap-label', (iconW + GAP).toFixed(2) + 'px');
    btn.style.setProperty('--swap-icon', (-(labelW + GAP)).toFixed(2) + 'px');
  });
}

document.addEventListener('DOMContentLoaded', function () {
  izmeriDugmad();

  /* fontovi menjaju sirinu teksta, pa se meri ponovo kad se ucitaju */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(izmeriDugmad);
  }

  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(izmeriDugmad, 150);
  });
});

/* ==========================================================================
   Sticky stack usluga: kartica koja je zaglavljena gore se smanjuje i bledi
   dok je sledeca prekriva. Na tennislove ovo radi Webflow IX2 interakcija,
   ovde je racunato iz pozicija na skrolu.
   ========================================================================== */
(function () {
  var items = Array.prototype.slice.call(document.querySelectorAll('.stack__item'));
  if (!items.length) return;

  /* Na tennislove se zaglavljena kartica smanji jako, otprilike na dve trecine,
     i pri tom NE bledi. Origin je gornja ivica, pa ostaje zalepljena za vrh. */
  var MAX_SCALE_DOWN = 0.32;   /* 1 -> 0.68 */
  var MAX_FADE = 0;            /* bez bledjenja */
  var ticking = false;

  function aktivno() {
    return window.matchMedia('(min-width: 992px)').matches;
  }

  function reset() {
    items.forEach(function (el) {
      el.style.transform = '';
      el.style.opacity = '';
    });
  }

  function update() {
    ticking = false;
    if (!aktivno()) return;

    for (var i = 0; i < items.length; i++) {
      var el = items[i];
      var next = items[i + 1];
      var p = 0;

      if (next) {
        var r = el.getBoundingClientRect();
        var nr = next.getBoundingClientRect();
        var h = r.height || 1;
        /* koliko je sledeca kartica presla preko donje ivice ove */
        p = (r.bottom - nr.top) / h;
        p = p < 0 ? 0 : p > 1 ? 1 : p;
      }

      el.style.transform = 'scale(' + (1 - MAX_SCALE_DOWN * p).toFixed(4) + ')';
      if (MAX_FADE) el.style.opacity = (1 - MAX_FADE * p).toFixed(3);
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () {
    if (!aktivno()) reset();
    onScroll();
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  update();
})();

/* ==========================================================================
   Smooth scroll, Lenis 1.3.4, iste postavke kao na tennislove.webflow.io:
   smooth true, lerp 0.1, wheelMultiplier 1, infinite false.
   Lenis skroluje prozor nativno, pa position sticky i scroll dogadjaji
   iznad nastavljaju da rade normalno.
   ========================================================================== */
(function () {
  if (typeof Lenis === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var lenis = new Lenis({
    smooth: true,
    lerp: 0.1,
    wheelMultiplier: 1,
    infinite: false
  });

  function raf(time) {
    lenis.raf(time);
    window.requestAnimationFrame(raf);
  }
  window.requestAnimationFrame(raf);

  /* linkovi na sidro idu kroz Lenis da bi i oni bili glatki */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var cilj = document.querySelector(id);
      if (!cilj) return;
      e.preventDefault();
      lenis.scrollTo(cilj, { offset: -20 });
    });
  });

  window.lenis = lenis;
})();

/* ==========================================================================
   WIZARD FORMA, pravila iz Skila 02
   Koraci 1 do 3 su samo dugmad, kuca se tek na cetvrtom. Tackice napretka,
   Nazad na svakom koraku posle prvog, dugme se zakljuca dok traje slanje,
   potvrda se ispisuje na istom mestu bez menjanja stranice.
   ========================================================================== */

/* Ovde se lepi Apps Script URL posle Skila 03 (Form Backend Setup) */
const ENDPOINT = '';

document.addEventListener('DOMContentLoaded', function () {
  var forma = document.getElementById('forma');
  if (!forma) return;

  var koraci = forma.querySelectorAll('.korak');
  var tackice = forma.querySelectorAll('.forma__dots span');
  var poruka = document.getElementById('forma-msg');
  var dugme = document.getElementById('posalji');
  var odgovori = {};
  var trenutni = 0;

  function prikazi(i) {
    trenutni = Math.max(0, Math.min(i, koraci.length - 1));

    koraci.forEach(function (k, n) { k.classList.toggle('is-active', n === trenutni); });
    tackice.forEach(function (t, n) { t.classList.toggle('is-done', n <= trenutni); });

    /* fokus na prvo polje ili prvu opciju, ali ne na ucitavanju */
    if (i !== 0) {
      var prvi = koraci[trenutni].querySelector('.choice, input, textarea');
      if (prvi) prvi.focus({ preventScroll: true });
    }
  }

  /* izbor: loptica uskoci u dugme, pa se posle kratke pauze ide dalje */
  forma.querySelectorAll('.choice').forEach(function (opcija) {
    opcija.addEventListener('click', function () {
      var polje = opcija.dataset.field;
      odgovori[polje] = opcija.dataset.value;

      opcija.closest('.choices').querySelectorAll('.choice').forEach(function (o) {
        o.classList.toggle('is-picked', o === opcija);
      });

      window.setTimeout(function () { prikazi(trenutni + 1); }, 420);
    });
  });

  forma.querySelectorAll('[data-back]').forEach(function (b) {
    b.addEventListener('click', function () { prikazi(trenutni - 1); });
  });

  function poruku(tekst, ok) {
    poruka.textContent = tekst;
    poruka.classList.remove('is-ok', 'is-err');
    poruka.classList.add(ok ? 'is-ok' : 'is-err');
  }

  forma.addEventListener('submit', function (e) {
    e.preventDefault();

    var ime = forma.querySelector('#ime');
    var telefon = forma.querySelector('#telefon');
    var email = forma.querySelector('#email');

    if (!ime.value.trim() || !telefon.value.trim() || !email.value.trim()) {
      poruku('Popuni ime, telefon i email da bismo mogli da se javimo.', false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      poruku('Email adresa nije ispravna. Proveri je pa probaj ponovo.', false);
      return;
    }

    var podaci = {
      usluga: odgovori.usluga || '',
      zaKoga: odgovori.zaKoga || '',
      kada: odgovori.kada || '',
      ime: ime.value.trim(),
      telefon: telefon.value.trim(),
      email: email.value.trim(),
      poruka: forma.querySelector('#poruka').value.trim(),
      stranica: window.location.href
    };

    if (!ENDPOINT) {
      poruku('Forma još nije povezana sa serverom. Pozovi 061 500 50 51 i javljamo se odmah.', false);
      console.warn('ENDPOINT je prazan. Pokreni Skill 03 i nalepi Apps Script URL u main.js.');
      return;
    }

    dugme.disabled = true;

    fetch(ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(podaci),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }
    })
      .then(function (r) {
        if (!r.ok) throw new Error('Neuspesno slanje');
        koraci.forEach(function (k) { k.classList.remove('is-active'); });
        tackice.forEach(function (t) { t.classList.add('is-done'); });
        poruku('Hvala, upit je stigao. Javljamo se na telefon koji si ostavio, najčešće isti dan.', true);
      })
      .catch(function () {
        poruku('Slanje nije uspelo. Pozovi 061 500 50 51 ili piši na mladost.tenis@gmail.com.', false);
        dugme.disabled = false;
      });
  });

  prikazi(0);
});

/* ==========================================================================
   Kartice usluga: lime podloga se pali kada kartica dodje na sredinu ekrana,
   ne na hover. Prag je cetvrtina visine ekrana oko sredine.
   ========================================================================== */
(function () {
  var kartice = Array.prototype.slice.call(document.querySelectorAll('.svc__card'));
  if (!kartice.length) return;

  var ceka = false;

  function proveri() {
    ceka = false;
    var sredinaEkrana = window.innerHeight / 2;
    var prag = window.innerHeight * 0.25;

    kartice.forEach(function (k) {
      var r = k.getBoundingClientRect();
      var sredinaKartice = r.top + r.height / 2;
      var uSredini = Math.abs(sredinaKartice - sredinaEkrana) < prag;
      k.classList.toggle('is-mid', uSredini);
    });
  }

  function naSkrol() {
    if (ceka) return;
    ceka = true;
    window.requestAnimationFrame(proveri);
  }

  window.addEventListener('scroll', naSkrol, { passive: true });
  window.addEventListener('resize', naSkrol);
  proveri();
})();
