/* ==========================================================================
   Teniski Klub Mladost, v2
   Dugme: meri sirinu teksta i tamne pilule pa upisuje koliko svako od njih
   treba da klizne da bi zamenili mesta na hover. Bez toga bi `order` skakao
   bez animacije, a original to animira.
   ========================================================================== */

function izmeriDugmad(samo) {
  var jedan = samo && samo.nodeType === 1 && samo.querySelector;
  var lista = jedan ? [samo] : Array.prototype.slice.call(document.querySelectorAll('.btn'));

  lista.forEach(function (btn) {
    var label = btn.querySelector('.btn__label');
    var icon = btn.querySelector('.btn__icon');
    if (!label || !icon) return;

    /* mera se uzima u mirovanju, bez transforma */
    btn.style.setProperty('--swap-label', '0px');
    btn.style.setProperty('--swap-icon', '0px');

    var l = label.getBoundingClientRect();
    var i = icon.getBoundingClientRect();

    /* Original (ArcClub .framer-iM9JK) menja `order` pa tekst i pilula
       zamene mesta, a Framer to interpolira. Ovde se ista zamena radi
       transformom. Pomeraj se racuna iz STVARNIH pozicija, ne iz sirina,
       jer izmedju njih ume da bude vise praznog prostora nego sto je gap,
       pa bi po sirinama pilula stala na pola teksta. */
    var razmak = i.left - l.right;              /* stvarni razmak */
    var pomeriTekst = i.width + razmak;         /* tekst ide udesno */
    var pomeriPilulu = -(l.width + razmak);     /* pilula ide ulevo */

    btn.style.setProperty('--swap-label', pomeriTekst.toFixed(2) + 'px');
    btn.style.setProperty('--swap-icon', pomeriPilulu.toFixed(2) + 'px');
  });
}

/* Ne meri se na hover, jer bi se u tom trenutku citale pozicije usred
   animacije. Umesto toga ResizeObserver javi kad se dugme stvarno promeni. */
if (typeof ResizeObserver !== 'undefined') {
  var posmatrac = new ResizeObserver(function (unosi) {
    unosi.forEach(function (u) {
      if (!u.target.matches(':hover')) izmeriDugmad(u.target);
    });
  });
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.btn').forEach(function (b) { posmatrac.observe(b); });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  izmeriDugmad();

  /* fontovi menjaju sirinu teksta, pa se meri ponovo kad se ucitaju */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { izmeriDugmad(); });
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

    /* GET sa parametrima: Apps Script POST preusmerava i gubi telo.
       no-cors znaci da odgovor ne mozemo da procitamo, pa je svaki
       zavrseni zahtev uspeh; catch hvata samo pad mreze. */
    var upit = Object.keys(podaci).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(podaci[k]);
    }).join('&');

    fetch(ENDPOINT + (ENDPOINT.indexOf('?') === -1 ? '?' : '&') + upit, {
      method: 'GET',
      mode: 'no-cors'
    })
      .then(function () {
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


/* ==========================================================================
   Navigacija, hamburger meni na telefonu.
   Traka je preuzeta sa qutenza.framer.website, gde je otvoreno stanje zasebna
   varijanta. Kod nas je to klasa .is-open na .nav, CSS radi ostalo.
   ========================================================================== */
(function () {
  var nav = document.querySelector('.nav');
  if (!nav) return;

  var dugme = nav.querySelector('.nav__burger');
  var linkovi = nav.querySelectorAll('.nav__links a, .nav__cta a');
  if (!dugme) return;

  function postavi(otvoreno) {
    nav.classList.toggle('is-open', otvoreno);
    dugme.setAttribute('aria-expanded', otvoreno ? 'true' : 'false');
    dugme.setAttribute('aria-label', otvoreno ? 'Zatvori meni' : 'Otvori meni');

    /* Dugme se na telefonu rasteze na punu sirinu kad se meni otvori, pa se
       menja i rastojanje za swap. ResizeObserver iz gornjeg bloka to uhvati,
       ali tek po zavrsetku prelaza, zato se meri jos jednom posle animacije. */
    if (otvoreno) {
      setTimeout(function () { izmeriDugmad(); }, 520);
    }
  }

  dugme.addEventListener('click', function () {
    postavi(!nav.classList.contains('is-open'));
  });

  /* klik na link zatvara meni, inace ostane otvoren preko sadrzaja */
  linkovi.forEach(function (a) {
    a.addEventListener('click', function () { postavi(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      postavi(false);
      dugme.focus();
    }
  });

  /* prelaskom na desktop meni se vraca u normalu */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 767.98 && nav.classList.contains('is-open')) postavi(false);
  });
})();


/* ==========================================================================
   Parallax na heroju, sa expanded-priority-588823.framer.app.
   Video klizi sporije od stranice, pa se hero i sadrzaj ispod razdvajaju.
   ========================================================================== */
(function () {
  /* .hero na pocetnoj, .ohero na O nama. Kontakt nema hero na vrhu. */
  var hero = document.querySelector('.hero, .ohero');
  var pozadina = hero && hero.querySelector('.hero__bg, .ohero__bg');
  if (!pozadina) return;

  /* 0.4 znaci da se video u odnosu na ekran penje 60% brzine stranice.
     Vise od toga i razmimoilazenje pocne da deluje kao greska. */
  var BRZINA = 0.4;
  var ceka = false;
  var ukljucen = false;

  function dozvoljeno() {
    return window.matchMedia('(min-width: 1200px)').matches &&
           !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function pomeri() {
    ceka = false;
    if (!ukljucen) return;
    var visina = hero.offsetHeight;
    /* preko visine heroja nema sta da se pomera, hero je vec otisao sa ekrana */
    var skrol = Math.min(window.pageYOffset || 0, visina);
    pozadina.style.setProperty('--hero-parallax', (skrol * BRZINA).toFixed(1) + 'px');
  }

  function naSkrol() {
    if (ceka) return;
    ceka = true;
    window.requestAnimationFrame(pomeri);
  }

  function podesi() {
    var sada = dozvoljeno();
    if (sada === ukljucen) return;
    ukljucen = sada;
    if (ukljucen) {
      pomeri();
    } else {
      pozadina.style.removeProperty('--hero-parallax');
    }
  }

  window.addEventListener('scroll', naSkrol, { passive: true });
  window.addEventListener('resize', function () { podesi(); naSkrol(); });
  podesi();
})();


/* ==========================================================================
   Pojavljivanje sa qutenza.framer.website (vidi POJAVLJIVANJE u styles.css).
   Hero na vrhu svake stranice ulazi pri ucitavanju sa kasnjenjima kao na
   originalu, ostalo kad se vidi 20% elementa, redom na 0.15s u grupi.
   Elementi se obelezavaju ovde, po vrsti, pa HTML ne mora da se dira.
   ========================================================================== */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  var HERO = '.hero, .ohero, .shero, .mhero, .kforma__head, .ihero, .rhero, .thero, .bhero, .chero';
  /* [selektor, kasnjenje u sekundama], iz appear JSON-a: 0.9, 1.0, 1.1, 1.2 */
  var HERO_REDOM = [
    ['.hero .oznaka, .ohero .oznaka, .shero .oznaka, .mhero .oznaka, .kforma__head .oznaka, .ihero .oznaka, .rhero .oznaka, .thero .oznaka, .bhero .oznaka, .chero .oznaka, .chero__nazad', 0.9],
    ['.hero__h1, .ohero__h1, .shero .veliki-naslov, .mhero .veliki-naslov, .kforma__head .veliki-naslov, .ihero .veliki-naslov, .rhero .veliki-naslov, .thero .veliki-naslov, .bhero .veliki-naslov, .chero .veliki-naslov', 1.0],
    ['.hero__sub, .ohero__sub, .shero__sub, .shero__glavna, .kforma__lead, .ihero__sub, .ihero__plan, .rhero__sub, .thero__sub, .thero__foto, .bhero__sub, .chero__meta', 1.1],
    ['.hero .btn, .ohero__content .btn, .shero__dugmad, .shero__cinjenice, .shero__mala, .ohero__stat, .ohero__member, .mhero__palci, .kforma__kartica, .kforma__podaci, .ihero__dugmad, .rhero__dugmad, .rhero__brojke, .thero__dugmad, .thero__cinjenice', 1.2]
  ];
  /* [selektor, pomeraj u px]; natpisi 12, kartice 24, velike povrsine 40 */
  var SKROL = [
    ['.oznaka, .sekcija__naslov, .veliki-naslov, .kontakt__lead, .treneri__uvod, .faq__sub, .poziv__uvod, .cene__uvod', 12],
    ['.zakoga__k, .zakoga__uvod, .zakoga__dno, .poziv__dugmad, .poziv__podaci, .timovi__glava, .blog__k, .clanak__ukratko, .cene__karta, .cene__info, .broj, .bento__k, .obnova__k, .trener, .gal__item, .faq__k, .info-card, .put__stavka, .put__kondicija, .kforma .kontakt__inner, [data-reveal]', 24],
    ['.prica__foto, .slajder, .obnova__foto, .tim__kartica, .forma, .khero__kartica, .poziv__foto, .clanak__slika', 40]
  ];

  document.documentElement.classList.add('js-pojava');

  var heroEl = [];
  HERO_REDOM.forEach(function (par) {
    document.querySelectorAll(par[0]).forEach(function (el) {
      if (el.hasAttribute('data-pojava')) return;
      el.setAttribute('data-pojava', 'hero');
      el.style.setProperty('--p-y', '20px');
      el.style.setProperty('--p-delay', par[1] + 's');
      heroEl.push(el);
    });
  });

  var skrolEl = [];
  SKROL.forEach(function (par) {
    document.querySelectorAll(par[0]).forEach(function (el) {
      if (el.hasAttribute('data-pojava')) return;
      if (el.closest(HERO)) return;
      /* ne dupliraj: ako je roditelj vec obelezen, dete ide sa njim */
      if (el.parentElement && el.parentElement.closest('[data-pojava]')) return;
      el.setAttribute('data-pojava', 'skrol');
      el.style.setProperty('--p-y', par[1] + 'px');
      skrolEl.push(el);
    });
  });

  /* hero: posle prvog iscrtavanja, da tranzicija stvarno krene */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      heroEl.forEach(function (el) { el.classList.add('is-in'); });
    });
  });

  var posmatrac = new IntersectionObserver(function (unosi) {
    var novi = unosi.filter(function (u) { return u.isIntersecting; }).map(function (u) { return u.target; });
    novi.sort(function (a, b) {
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    novi.forEach(function (el, i) {
      el.style.setProperty('--p-delay', (Math.min(i, 5) * 0.15).toFixed(2) + 's');
      el.classList.add('is-in');
      posmatrac.unobserve(el);
    });
  }, { threshold: 0.2 });

  skrolEl.forEach(function (el) { posmatrac.observe(el); });
})();


/* ==========================================================================
   Popunjavanje teksta na skrol, preneto sa B-Steel sajta (tamo iz Konstre).
   Tekst se deli na reci pa na slova, i svako slovo dobija svoj deo opsega:

     opseg     od kad vrh bloka dodje na 70% visine ekrana do 30%
     po slovu  [i/n, (i+1)/n] unutar tog opsega
     opacity   0.2 -> 1, boja bleda -> forest (racuna CSS iz --t)

   Razlika od B-Steela: tamo blok ima samo tekst, ovde izjava ima slike u
   redu i lime oznake. Zato se idu cvorovi redom: tekst se deli na slova,
   slika je jedna jedinica na svom mestu, a <mark> ostaje omotac i dobija
   svoj --t (prosek svojih slova) da bi se i lime podloga punila.
   ========================================================================== */
(function () {
  var blokovi = document.querySelectorAll('[data-scroll-fill]');
  if (!blokovi.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var stavke = [];

  function podeliTekst(tekst, roditelj, jedinice) {
    tekst.split(/(\s+)/).forEach(function (deo) {
      if (!deo) return;
      if (/^\s+$/.test(deo)) {
        roditelj.appendChild(document.createTextNode(' '));
        return;
      }
      var rec = document.createElement('span');
      rec.className = 'fill-word';
      deo.split('').forEach(function (ch) {
        var c = document.createElement('span');
        c.className = 'fill-char';
        c.textContent = ch;
        rec.appendChild(c);
        jedinice.push(c);
      });
      roditelj.appendChild(rec);
    });
  }

  function obradi(blok) {
    var jedinice = [];
    var oznake = [];
    var cvorovi = Array.prototype.slice.call(blok.childNodes);
    blok.textContent = '';

    cvorovi.forEach(function (cvor) {
      if (cvor.nodeType === 3) {
        podeliTekst(cvor.nodeValue, blok, jedinice);
      } else if (cvor.nodeType === 1 && cvor.tagName === 'MARK') {
        var od = jedinice.length;
        var tekst = cvor.textContent;
        cvor.textContent = '';
        podeliTekst(tekst.trim(), cvor, jedinice);
        blok.appendChild(cvor);
        oznake.push({ el: cvor, od: od, do: jedinice.length, last: -1 });
      } else if (cvor.nodeType === 1) {
        blok.appendChild(cvor);
        jedinice.push(cvor);
      }
    });

    stavke.push({ el: blok, jedinice: jedinice, oznake: oznake, last: [] });
  }

  Array.prototype.forEach.call(blokovi, obradi);
  document.documentElement.classList.add('js-scroll-fill');

  var ceka = false;

  function oboji() {
    ceka = false;
    var vh = window.innerHeight;

    stavke.forEach(function (s) {
      var vrh = s.el.getBoundingClientRect().top;
      /* 0 kad je vrh na 70% ekrana, 1 kad dodje na 30% */
      var p = Math.max(0, Math.min(1, (0.7 * vh - vrh) / (0.4 * vh)));
      var n = s.jedinice.length;
      var vrednosti = [];

      for (var i = 0; i < n; i++) {
        var t = Math.max(0, Math.min(1, (p - i / n) * n));
        t = Math.round(t * 100) / 100;
        vrednosti[i] = t;
        if (s.last[i] === t) continue;
        s.last[i] = t;
        s.jedinice[i].style.setProperty('--t', t);
      }

      s.oznake.forEach(function (o) {
        var zbir = 0;
        for (var k = o.od; k < o.do; k++) zbir += vrednosti[k];
        var t = Math.round(zbir / Math.max(1, o.do - o.od) * 100) / 100;
        if (o.last === t) return;
        o.last = t;
        o.el.style.setProperty('--t', t);
      });
    });
  }

  window.addEventListener('scroll', function () {
    if (ceka) return;
    ceka = true;
    window.requestAnimationFrame(oboji);
  }, { passive: true });
  window.addEventListener('resize', oboji);
  oboji();
})();


/* ==========================================================================
   Slajder u kartici "Zasto Mladost": slike se smenjuju pretapanjem na
   4.5s, crtice menjaju sliku na klik. Bez automatike ako korisnik trazi
   manje pokreta, i dok slajder nije na ekranu.
   ========================================================================== */
(function () {
  document.querySelectorAll('.slajder').forEach(function (s) {
    var slike = s.querySelectorAll('.slajder__slika');
    var tacke = s.querySelectorAll('.slajder__tacka');
    if (slike.length < 2) return;

    var i = 0;
    var tajmer = null;
    var vidljiv = false;
    var mirno = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function prikazi(n) {
      i = (n + slike.length) % slike.length;
      slike.forEach(function (el, k) { el.classList.toggle('is-active', k === i); });
      tacke.forEach(function (el, k) {
        el.classList.toggle('is-active', k === i);
        el.setAttribute('aria-current', k === i ? 'true' : 'false');
      });
    }

    function kreni() {
      if (mirno || tajmer || !vidljiv) return;
      tajmer = window.setInterval(function () { prikazi(i + 1); }, 4500);
    }
    function stani() {
      window.clearInterval(tajmer);
      tajmer = null;
    }

    tacke.forEach(function (t, k) {
      t.addEventListener('click', function () { stani(); prikazi(k); kreni(); });
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (u) {
        vidljiv = u[0].isIntersecting;
        if (vidljiv) kreni(); else stani();
      }).observe(s);
    } else {
      vidljiv = true;
      kreni();
    }
  });
})();


/* ==========================================================================
   Cesta pitanja: dugme samo menja klasu is-open i aria-expanded.
   Animaciju radi CSS (grid-template-rows), pa nema stanja koja mogu da
   se zaglave kad se klikce brzo ili usred animacije.
   ========================================================================== */
(function () {
  document.querySelectorAll('.faq__q').forEach(function (dugme) {
    dugme.addEventListener('click', function () {
      var stavka = dugme.closest('.faq__k');
      var otvori = !stavka.classList.contains('is-open');
      stavka.classList.toggle('is-open', otvori);
      dugme.setAttribute('aria-expanded', otvori ? 'true' : 'false');
    });
  });
})();


/* ==========================================================================
   Galerija: uvecan prikaz fotke ili videa. Strelice i tasteri levo/desno
   menjaju stavku, Esc i klik van slike zatvaraju. Dok je otvoren, Lenis
   stoji da se stranica ne skroluje ispod.
   ========================================================================== */
(function () {
  var stavke = Array.prototype.slice.call(document.querySelectorAll('.gal__item'));
  var lb = document.getElementById('lb');
  if (!stavke.length || !lb) return;

  var scena = lb.querySelector('.lb__scena');
  var brojac = lb.querySelector('.lb__brojac');
  var zatvori = lb.querySelector('.lb__zatvori');
  var i = 0;
  var poslednjiFokus = null;

  function prikazi(n) {
    i = (n + stavke.length) % stavke.length;
    var s = stavke[i];
    scena.textContent = '';
    if (s.dataset.video) {
      var v = document.createElement('video');
      v.src = s.dataset.video;
      v.poster = s.querySelector('img').src;
      v.controls = true;
      v.autoplay = true;
      v.loop = true;
      v.playsInline = true;
      v.muted = true;
      v.setAttribute('aria-label', s.getAttribute('aria-label'));
      scena.appendChild(v);
    } else {
      var img = document.createElement('img');
      img.src = s.dataset.full;
      img.alt = s.querySelector('img').alt;
      scena.appendChild(img);
    }
    brojac.textContent = (i + 1) + ' / ' + stavke.length;
  }

  function otvori(n) {
    poslednjiFokus = document.activeElement;
    prikazi(n);
    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');
    if (window.lenis) window.lenis.stop();
    document.documentElement.style.overflow = 'hidden';
    zatvori.focus();
  }

  function zatvoriLb() {
    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');
    scena.textContent = '';
    if (window.lenis) window.lenis.start();
    document.documentElement.style.overflow = '';
    if (poslednjiFokus) poslednjiFokus.focus();
  }

  stavke.forEach(function (s, n) {
    s.addEventListener('click', function () { otvori(n); });
  });
  lb.querySelector('.lb__nazad').addEventListener('click', function () { prikazi(i - 1); });
  lb.querySelector('.lb__napred').addEventListener('click', function () { prikazi(i + 1); });
  zatvori.addEventListener('click', zatvoriLb);
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target === scena) zatvoriLb();
  });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') zatvoriLb();
    else if (e.key === 'ArrowLeft') prikazi(i - 1);
    else if (e.key === 'ArrowRight') prikazi(i + 1);
  });
})();


/* ==========================================================================
   GALERIJA, HERO: Morph Gallery (21st.dev), prepisan iz React-a u obican JS.
   Slajdovi prelaze jedan u drugi kroz sum (fbm) u WebGL shaderu: svaki
   piksel dobija prag, napredak prelazi preko pragova, pa stari kadar puca
   u krpice. Prag je pomeren svetlinom novog kadra, pa svetli delovi
   novog kadra probiju prvi. Shader, kriva i parametri su isti kao original:
   duration 1500, noiseScale 3.5, edge 0.15, drift 0.5, autoplay 4500.
   Bez WebGL-a (ili ako nijedna slika ne moze da se ucita) ide obicno
   pretapanje slika, galerija radi, samo bez morfa.
   ========================================================================== */
(function () {
  var koren = document.getElementById('mhero');
  if (!koren) return;

  var canvas = koren.querySelector('.mhero__canvas');
  var rezerva = koren.querySelector('.mhero__rezerva');
  var palcevi = Array.prototype.slice.call(koren.querySelectorAll('.mhero__palac'));
  var najava = koren.querySelector('.mhero__najava');
  var stavke = palcevi.map(function (b) {
    return { src: b.dataset.src, alt: b.dataset.alt || '' };
  });
  var n = stavke.length;
  if (!n) return;

  var PODESAVANJA = { duration: 1500, noiseScale: 3.5, edge: 0.15, drift: 0.5, autoplay: 4500 };
  var mirno = window.matchMedia('(prefers-reduced-motion: reduce)');

  var aktivan = 0;
  var zahtev = null;          /* { from, to } koji petlja preuzme */
  var pauza = false;
  var tajmer = null;
  var palo = false;

  function wrap(i) { return ((i % n) + n) % n; }
  function easeInOutQuint(t) {
    var x = Math.min(Math.max(t, 0), 1);
    return x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) / 2;
  }

  function oznaci() {
    palcevi.forEach(function (b, i) {
      b.classList.toggle('is-active', i === aktivan);
      b.setAttribute('aria-current', i === aktivan ? 'true' : 'false');
    });
    najava.textContent = stavke[aktivan].alt + ', ' + (aktivan + 1) + ' od ' + n;
    if (palo) {
      Array.prototype.forEach.call(rezerva.children, function (img, i) {
        img.classList.toggle('is-active', i === aktivan);
      });
    }
  }

  function idi(sledeci) {
    var w = wrap(sledeci);
    if (w === aktivan) return;
    zahtev = { from: aktivan, to: w };
    aktivan = w;
    oznaci();
  }

  /* ---- autoplay, staje na hover, fokus i kad je tab sakriven ---- */
  function kreni() {
    stani();
    if (mirno.matches || pauza || document.hidden || n < 2) return;
    tajmer = window.setInterval(function () { idi(aktivan + 1); }, Math.max(PODESAVANJA.autoplay, 600));
  }
  function stani() { if (tajmer) { window.clearInterval(tajmer); tajmer = null; } }
  function postaviPauzu(p) { pauza = p; kreni(); }

  koren.addEventListener('mouseenter', function () { postaviPauzu(true); });
  koren.addEventListener('mouseleave', function () { postaviPauzu(false); });
  koren.addEventListener('focusin', function () { postaviPauzu(true); });
  koren.addEventListener('focusout', function () { postaviPauzu(false); });
  document.addEventListener('visibilitychange', kreni);

  /* ---- strelice, palcevi, tastatura, prevlacenje ---- */
  koren.querySelector('.mhero__strelica--levo').addEventListener('click', function () { idi(aktivan - 1); kreni(); });
  koren.querySelector('.mhero__strelica--desno').addEventListener('click', function () { idi(aktivan + 1); kreni(); });
  palcevi.forEach(function (b, i) { b.addEventListener('click', function () { idi(i); kreni(); }); });
  koren.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); idi(aktivan - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); idi(aktivan + 1); }
  });
  var pocetakX = null;
  koren.addEventListener('pointerdown', function (e) { pocetakX = e.clientX; });
  koren.addEventListener('pointerup', function (e) {
    if (pocetakX === null) return;
    var dx = e.clientX - pocetakX;
    pocetakX = null;
    if (Math.abs(dx) > 48) { idi(aktivan + (dx < 0 ? 1 : -1)); kreni(); }
  });

  /* ---- rezerva bez shadera: obicno pretapanje slika ---- */
  function padni() {
    if (palo) return;
    palo = true;
    canvas.style.display = 'none';
    stavke.forEach(function (s, i) {
      var img = document.createElement('img');
      img.src = s.src;
      img.alt = s.alt;
      if (i === aktivan) img.classList.add('is-active');
      rezerva.appendChild(img);
    });
    rezerva.hidden = false;
  }

  /* ---- WebGL ---- */
  var VERT = [
    'attribute vec2 a_position;',
    'varying vec2 v_uv;',
    'void main() {',
    '  v_uv = a_position * 0.5 + 0.5;',
    '  gl_Position = vec4(a_position, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FRAG = [
    'precision highp float;',
    'uniform sampler2D u_from;',
    'uniform sampler2D u_to;',
    'uniform float u_progress;',
    'uniform vec2 u_resolution;',
    'uniform float u_fromAspect;',
    'uniform float u_toAspect;',
    'uniform float u_scale;',
    'uniform float u_direction;',
    'uniform float u_edge;',
    'uniform float u_drift;',
    'varying vec2 v_uv;',
    'vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }',
    'float snoise(vec2 v) {',
    '  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);',
    '  vec2 i  = floor(v + dot(v, C.yy));',
    '  vec2 x0 = v - i + dot(i, C.xx);',
    '  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);',
    '  vec4 x12 = x0.xyxy + C.xxzz;',
    '  x12.xy -= i1;',
    '  i = mod(i, 289.0);',
    '  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));',
    '  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);',
    '  m = m * m;',
    '  m = m * m;',
    '  vec3 x  = 2.0 * fract(p * C.www) - 1.0;',
    '  vec3 h  = abs(x) - 0.5;',
    '  vec3 ox = floor(x + 0.5);',
    '  vec3 a0 = x - ox;',
    '  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);',
    '  vec3 g;',
    '  g.x  = a0.x  * x0.x  + h.x  * x0.y;',
    '  g.yz = a0.yz * x12.xz + h.yz * x12.yw;',
    '  return 130.0 * dot(m, g);',
    '}',
    'float fbm(vec2 v) {',
    '  float value = 0.0;',
    '  float amplitude = 0.5;',
    '  for (int i = 0; i < 5; i++) { value += amplitude * snoise(v); v *= 2.0; amplitude *= 0.5; }',
    '  return value;',
    '}',
    /* odbijanje umesto razmazivanja ivice kad drift izgura UV van slike */
    'vec2 mirror(vec2 uv) { return 1.0 - abs(1.0 - mod(uv, 2.0)); }',
    'vec2 coverUV(vec2 uv, float imgAspect) {',
    '  float canvasAspect = u_resolution.x / u_resolution.y;',
    '  vec2 scale = (canvasAspect > imgAspect) ? vec2(1.0, imgAspect / canvasAspect) : vec2(canvasAspect / imgAspect, 1.0);',
    '  return mirror((uv - 0.5) * scale + 0.5);',
    '}',
    'void main() {',
    '  float adjusted = u_progress * (1.0 + 2.0 * u_edge) - u_edge;',
    '  float noise = fbm(v_uv * u_scale + vec2(0.0, u_progress * u_direction)) * 0.5 + 0.5;',
    '  noise = smoothstep(0.0, 2.0, length(texture2D(u_to, coverUV(v_uv, u_toAspect)).rgb) + noise);',
    '  float mixFactor = 1.0 - smoothstep(adjusted - u_edge, adjusted + u_edge, noise);',
    '  vec2 fromUV = coverUV(v_uv + vec2(0.0, noise * u_progress * u_drift * u_direction), u_fromAspect);',
    '  vec2 toUV = coverUV(v_uv + vec2(0.0, noise * (1.0 - u_progress) * -0.5 * u_drift * u_direction), u_toAspect);',
    '  gl_FragColor = mix(texture2D(u_from, fromUV), texture2D(u_to, toUV), mixFactor);',
    '}'
  ].join('\n');

  function kompajliraj(gl, tip, izvor) {
    var s = gl.createShader(tip);
    gl.shaderSource(s, izvor);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      var log = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error('shader: ' + log);
    }
    return s;
  }

  function pokreniGL() {
    var gl = canvas.getContext('webgl', { alpha: false, antialias: false }) ||
             canvas.getContext('experimental-webgl');
    if (!gl) { padni(); return; }

    var program;
    try {
      var vs = kompajliraj(gl, gl.VERTEX_SHADER, VERT);
      var fs = kompajliraj(gl, gl.FRAGMENT_SHADER, FRAG);
      program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('link');
    } catch (e) { padni(); return; }

    gl.useProgram(program);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var u = {};
    ['from', 'to', 'progress', 'resolution', 'fromAspect', 'toAspect', 'scale', 'direction', 'edge', 'drift']
      .forEach(function (ime) { u[ime] = gl.getUniformLocation(program, 'u_' + ime); });
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    var teksture = stavke.map(function () { return null; });
    var odnosi = stavke.map(function () { return 1; });
    var od = aktivan, ka = aktivan, napredak = 1, pocetak = 0, smer = 1;
    var radi = false, odbijeno = 0, raf = 0;

    function velicina() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.round(canvas.clientWidth * dpr);
      var h = Math.round(canvas.clientHeight * dpr);
      if (!w || !h || (canvas.width === w && canvas.height === h)) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    if ('ResizeObserver' in window) new ResizeObserver(velicina).observe(canvas);
    else window.addEventListener('resize', velicina);

    /* dok sve slike ne stignu, pokazi najblizu koja postoji umesto crnog */
    function uzmi(i) {
      if (teksture[i]) return teksture[i];
      for (var k = 0; k < teksture.length; k++) if (teksture[k]) return teksture[k];
      return null;
    }

    function crtaj() {
      if (zahtev) {
        var z = zahtev;
        zahtev = null;
        if (z.from !== z.to) {
          od = z.from;
          ka = z.to;
          napredak = 0;
          pocetak = performance.now();
          /* smer prati kraci put u krug, pa i skok sa poslednje na prvu ide napred */
          smer = (((z.to - z.from + n) % n) * 2 <= n) ? 1 : -1;
        }
      }
      if (napredak < 1) {
        var trajanje = mirno.matches ? 0 : Math.max(PODESAVANJA.duration, 1);
        napredak = trajanje === 0 ? 1 : easeInOutQuint(Math.min((performance.now() - pocetak) / trajanje, 1));
      }
      var tOd = uzmi(od), tKa = uzmi(ka);
      if (!tOd || !tKa) return;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tOd);
      gl.uniform1i(u.from, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tKa);
      gl.uniform1i(u.to, 1);
      gl.uniform1f(u.progress, napredak);
      gl.uniform2f(u.resolution, canvas.width, canvas.height);
      gl.uniform1f(u.fromAspect, odnosi[od] || 1);
      gl.uniform1f(u.toAspect, odnosi[ka] || 1);
      gl.uniform1f(u.scale, PODESAVANJA.noiseScale);
      gl.uniform1f(u.direction, smer);
      gl.uniform1f(u.edge, Math.max(PODESAVANJA.edge, 0.001));
      gl.uniform1f(u.drift, PODESAVANJA.drift);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    /* crta se samo dok je hero na ekranu, ostatak stranice ne placa shader */
    var vidljiv = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (u2) {
        vidljiv = u2[0].isIntersecting;
        if (vidljiv && radi && !raf) raf = requestAnimationFrame(petlja);
      }).observe(koren);
    }
    function petlja() {
      raf = 0;
      if (!vidljiv) return;
      crtaj();
      raf = requestAnimationFrame(petlja);
    }

    canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
      padni();
    });

    /* svaka slika ide u teksturu cim stigne, petlja krece na prvoj */
    stavke.forEach(function (s, i) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.onload = function () {
        if (palo) return;
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        teksture[i] = tex;
        odnosi[i] = img.naturalWidth / Math.max(img.naturalHeight, 1);
        if (!radi) {
          radi = true;
          velicina();
          koren.classList.add('is-ready');
          raf = requestAnimationFrame(petlja);
        }
      };
      img.onerror = function () {
        odbijeno += 1;
        if (odbijeno === n) padni();
      };
      img.src = s.src;
    });
  }

  oznaci();
  pokreniGL();
  kreni();
})();

/* ==========================================================================
   Pecat sa grbom: tekst po krugu se okrece dok se skroluje.
   0.25 stepena po pikselu skrola, preko CSS promenljive.
   ========================================================================== */
(function () {
  var krugovi = document.querySelectorAll('.pecat__krug');
  if (!krugovi.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var ceka = false;
  function okreni() {
    ceka = false;
    var ugao = ((window.pageYOffset || 0) * 0.25).toFixed(1) + 'deg';
    krugovi.forEach(function (k) { k.style.setProperty('--pecat-ugao', ugao); });
  }
  window.addEventListener('scroll', function () {
    if (ceka) return;
    ceka = true;
    window.requestAnimationFrame(okreni);
  }, { passive: true });
  okreni();
})();

/* ==========================================================================
   Put kroz skolu: traka svake stavke se puni (0 -> 1) dok gornja ivica
   stavke ide od sredine ekrana navise za jednu visinu stavke. Isto kao
   "Kako je posao rastao" na dekopro.rs (tamo izmereno na Konstri).
   Bez JS-a i uz manje pokreta trake su pune (CSS: --put podrazumevano 1).
   ========================================================================== */
(function () {
  var lista = document.querySelector('[data-put]');
  if (!lista || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var stavke = Array.prototype.slice.call(lista.querySelectorAll('.put__stavka'));
  var ceka = false, stanje = [];
  function oboji() {
    ceka = false;
    var pola = window.innerHeight / 2;
    stavke.forEach(function (s, i) {
      var r = s.getBoundingClientRect();
      var t = Math.max(0, Math.min(1, (pola - r.top) / r.height));
      t = Math.round(t * 1000) / 1000;
      if (stanje[i] === t) return;
      stanje[i] = t;
      s.style.setProperty('--put', t);
    });
  }
  window.addEventListener('scroll', function () { if (!ceka) { ceka = true; requestAnimationFrame(oboji); } }, { passive: true });
  window.addEventListener('resize', function () { stanje = []; oboji(); });
  oboji();
})();

/* ==========================================================================
   CENOVNIK (Rekreativci): linija "Sada" na traci dana
   Vreme u Beogradu bez obzira na zonu posetioca. Vikend = subota i nedelja.
   Polozaj linije je --sada (0 = 07h, 1 = 23h), termin koji vazi dobija
   klasu is-sada. Osvezava se svakog minuta.
   ========================================================================== */
(function () {
  var karta = document.querySelector('.cene__karta');
  if (!karta) return;
  var linija = karta.querySelector('.cene__sada');
  var natpis = linija.querySelector('span');

  function dvocif(n) { return (n < 10 ? '0' : '') + n; }

  function osvezi() {
    var d;
    try { d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Belgrade' })); }
    catch (e) { d = new Date(); }
    var h = d.getHours() + d.getMinutes() / 60;
    var vikend = d.getDay() === 0 || d.getDay() === 6;

    karta.querySelectorAll('.is-sada').forEach(function (el) { el.classList.remove('is-sada'); });
    var traka = karta.querySelector('.cene__traka[data-dani="' + (vikend ? 'vikend' : 'radni') + '"]');
    traka.classList.add('is-sada');
    if (traka.previousElementSibling) traka.previousElementSibling.classList.add('is-sada');
    traka.querySelectorAll('.cene__seg').forEach(function (seg) {
      if (h >= +seg.getAttribute('data-od') && h < +seg.getAttribute('data-do')) seg.classList.add('is-sada');
    });

    if (h >= 7 && h < 23) {
      karta.style.setProperty('--sada', ((h - 7) / 16).toFixed(4));
      natpis.textContent = 'Sada ' + dvocif(d.getHours()) + ':' + dvocif(d.getMinutes());
      linija.hidden = false;
    } else {
      linija.hidden = true;
    }
  }

  osvezi();
  setInterval(osvezi, 60000);
})();
