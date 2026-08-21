# Site Teardown: Paddle Z

**URL:** https://paddlez.framer.website/
**Platform:** Framer (generator meta `Framer c9b3949`, objavljeno 10.08.2026)
**Izvor analize:** kompletan HTML + inline CSS koji je korisnik nalepio (ne WebFetch — dakle sve je POTVRĐENO IZ IZVORA)
**Date analyzed:** 2026-08-21
**Svrha:** design blueprint za Teniski Klub Mladost sajt

---

## Tech Stack (potvrđeno iz izvora)

| Tehnologija | Dokaz | Uloga |
|---|---|---|
| Framer | `<meta name="generator" content="Framer">`, `framer-*` klase | Ceo sajt |
| Motion (Framer Motion) | `motion.CWqjSLwe.mjs` modulepreload | Sve animacije |
| Lenis | `html.lenis`, `.lenis-smooth`, `.lenis-stopped` u CSS-u | Smooth scroll |
| Fontshare | `framerusercontent.com/third-party-assets/fontshare/` | Satoshi font |
| Google Fonts | `fonts.gstatic.com/s/hedviglettersserif` | Hedvig Letters Serif (dekorativni) |

**Za našu rekonstrukciju:** ništa od ovoga nije obavezno. Sve se radi vanilla HTML/CSS/JS.
Framer Motion → CSS transitions + IntersectionObserver. Lenis → `scroll-behavior: smooth` (ili preskočiti).

---

## Design System

### Boje (Framer tokeni, sve potvrđene)

| Uloga | Vrednost |
|---|---|
| Pozadina stranice | `#f7fbff` (ledeno plavo-bela) |
| **Primarna / CTA** | `#0e5ccd` (jaka plava) |
| Svetla plava (akcenat) | `#70b4e8` |
| Tamna mornarska (h4/h6) | `#001632` |
| Skoro crna (h1/h3) | `#050703` |
| Body crna | `#080806` |
| Body crna 80% | `#080806cc` |
| Neaktivan tekst 40% | `#08080666` |
| **Pozadina kartice** | `#ebf6ff` (bledo plava) |
| Ivica sekcije | `#b4dcfa80` (providna svetlo plava) |
| Ivica siva | `#e5e7eb` |
| Bela 10% (ivica na tamnom) | `#ffffff1a` |
| Staklo (glassmorphism) | `#6fb4e833` |
| Ivica navigacije | `#cfcfcf33` |
| Zvezdice | `#f70` (narandžasta) |
| Zeleno / uspeh | `#0ecc21`, bledo `#d6ffe2` |
| Body paragraf tekst | `#454745` |
| Sitni caption | `#666` |
| Footer pozadina | `#000000` |

**Ključni uvid:** ceo sajt stoji na JEDNOJ jakoj boji (`#0e5ccd`) na vrlo svetloj hladnoj pozadini
(`#f7fbff`), sa karticama u još svetlijem tonu iste boje (`#ebf6ff`). Nema druge boje.
Narandžasta i zelena se pojavljuju samo kao sitni statusni signali (zvezdice, ikonice).

### Tipografija

| Uloga | Font | Težina | Letter-spacing | Veličina |
|---|---|---|---|---|
| H1 | Satoshi | 700 | -0.03em | 54px → 42px → 36px |
| Hero H1 | Satoshi | 400 | -0.2px | 60px, line-height 105% |
| H2 | Satoshi | 400 | 0em | 30px, line-height 1.2em |
| H3 | Satoshi | 700 | 0px | 24px → 18px |
| H4 | Satoshi | 500 | 0px | 18px, line-height 20px |
| H6 | Satoshi | 900 | 0px | 14px → 12px, line-height 20px |
| Body | Satoshi | 400 | 0px | 16px → 12px, line-height 150% |
| Sitni tekst | Satoshi | 400 | 0px | 12px, line-height 19px |
| Dugme | Satoshi | 400 | -0.02em | 12px, line-height 1.6em |
| Section indicator | Satoshi | 400 | **0.7px** | 12px, UPPERCASE, line-height 20px |
| Div wordmark (footer) | Satoshi | 900 | -0.06em | ~214px, line-height 0.9em |
| Dekorativni akcenat | Hedvig Letters Serif | 400 | — | 46px ("Since 2020") |

**Font fajlovi:** Satoshi sa Fontshare CDN-a (400/500/700/900 + italici).

⚠️ **Problem za nas:** Satoshi ima nepouzdanu podršku za Latin Extended-A
(č ć ž š đ). Zamena: **Plus Jakarta Sans** (Google Fonts) — geometrijski sans,
gotovo identičan Satoshi po proporcijama i karakteru, puna podrška za srpsku latinicu.

### Spacing sistem

- Max širina kontejnera: **1200px**, unutrašnji sadržaj **1128px / 1072px / 1160px**
- Padding sekcije: `100px 40px` desktop → `100px 20px` tablet/mobile
- Lakše sekcije: `80px 40px` → `40px 16px` mobile
- Razmak naslov ↔ sadržaj: **64px**
- Gridovi: gap `20px`, `24px`, `40px`, `60px`
- Border-radius skala: `30px` (velike kartice), `24px`, `20px`, `18px`, `16px`, `14px`, `12px`, `11px`, `8px`
- Dugme: visina **44px**, padding `10px 16px`, radius **40px** (pilula)

### Responsive

Tri breakpoint-a, potvrđena iz `@media`:
- Desktop: `min-width: 1200px`
- Tablet: `810px – 1199.98px`
- Mobile: `max-width: 809.98px`

Framer koristi `.ssr-variant` + `.hidden-*` klase da renderuje TRI verzije istog bloka
i sakriva dve. Mi to ne radimo, radimo pravi responsive CSS.

---

## Effects Breakdown

| Efekat | Implementacija | Složenost | Kloniramo? |
|---|---|---|---|
| Nav slide-down na load | opacity 0.001→1, translateY(-150px)→0, spring damping 30 / stiffness 175 | Low | Da |
| Hero bg scale-in | scale(1.05)→1, delay 1s, duration 2s, `cubic-bezier(0.12,0.23,0.5,1)` | Low | Da |
| Hero CTA fade-up | translateY(24px)→0, delay 0.4s, duration 1.5s | Low | Da |
| **Naslov slovo po slovo** | svako slovo u `<span>` sa `opacity:0.001; translateY(10px)`, stagger | Med | Da |
| **Body tekst blur-in** | svako slovo `opacity:0.001; filter:blur(10px); translateY(20px)`, stagger | Med | Da |
| Scroll reveal | `opacity:0; translateY(64px)` → 0, na IntersectionObserver | Low | Da |
| Stagger u gridu | susedni elementi 64/72/80/88/96/104px translateY | Low | Da |
| **Roll-up tekst na dugmetu** | dva identična teksta u koloni, `overflow:hidden`, hover menja `justify-content` | Low | **Da — potpis dizajna** |
| Noise/grain overlay | fixed div, PNG tekstura 153.5px, `opacity: 0.2` | Low | Da |
| Hero gradient overlay | `linear-gradient(rgba(0,0,0,0) 42%, rgba(0,0,0,0.7) 100%)` | Low | Da |
| Overlay na kartici sa slikom | `linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.9) 83%)` | Low | Da |
| Vertikalni ticker recenzija | ul translateY loop + mask gradient gore/dole | Med | Da |
| Brojač (odometer) | kolone cifara 0-9 naslagane, translateY, mask gradient | Med | Delimično |
| FAQ akordeon | closed/open varijanta, `+` ikonica rotira 90° | Low | Da |
| Tabovi za usluge | aktivan pokazuje opis, strelica rotira 45°, neaktivni `#08080666` | Low | Da |
| Horizontalni proces akordeon | aktivna kolona širi se, ostale opacity 0.5/0.7, 2px progress bar levo | Med | Da |
| Glassmorphism panel | `backdrop-filter: blur(16px)`, bg `#6fb4e833`, radius 18px | Low | Da |
| Stack avatara | preklopljeni krugovi `margin-right: -16px`, 2px bela ivica | Low | Da |
| Sticky nav | `position: fixed`, border-bottom `#cfcfcf33` | Low | Da |
| Div wordmark u footeru | 214px, `opacity:0.2`, mask `linear-gradient(0deg, transparent 0%, black 51%)` | Low | **Da — jak potpis** |
| Rotirana dekorativna slika | `translateX(60px) rotate(-45deg)` → animira se | Low | Opcionalno |
| Bordered sekcije | 1px `#b4dcfa80` sa sve 4 strane na kontejneru sekcije | Low | **Da — potpis dizajna** |

---

## Implementation Details

### 1. Roll-up dugme (najprepoznatljiviji detalj)

Struktura je duplirani tekst u kontejneru fiksne visine sa `overflow: hidden`:

```html
<a class="btn">
  <span class="btn__roll">
    <span class="btn__text">Rezerviši teren</span>
    <span class="btn__text">Rezerviši teren</span>
  </span>
</a>
```

```css
.btn { height:44px; padding:10px 16px; border-radius:40px; overflow:hidden; }
.btn__roll {
  display:flex; flex-direction:column; align-items:center;
  height:19px; gap:4px; overflow:hidden;
  justify-content:flex-start;
  transition: justify-content .3s;  /* Framer koristi flex align, ne transform */
}
.btn:hover .btn__roll { justify-content:flex-end; }
```

**Bolja verzija za nas** (`justify-content` se ne animira glatko u CSS-u —
Framer to radi kroz Motion). Koristimo `transform`:

```css
.btn__roll { transform: translateY(0); transition: transform .35s cubic-bezier(.2,.7,.3,1); }
.btn:hover .btn__roll { transform: translateY(calc(-50% - 2px)); }
```

### 2. Bordered sekcija (skelet celog sajta)

Svaka velika sekcija ima kontejner sa tankom ivicom sa sve četiri strane.
Ivice susednih sekcija se dodiruju i prave kontinuiranu mrežu niz stranicu.

```css
.section__inner {
  border: 1px solid rgba(180,220,250,0.5);
  padding: 100px 40px;
  display:flex; flex-direction:column; align-items:center; gap:64px;
}
```

### 3. Reveal slovo po slovo

Framer pre-renderuje svako slovo u span. Mi to radimo u JS-u pri učitavanju:
tekst se seče po rečima (`white-space:nowrap` wrapper po reči da se reč ne lomi),
pa po slovima unutar reči.

```js
function splitChars(el){
  const words = el.textContent.split(' ');
  el.innerHTML = words.map(w =>
    `<span class="w">${[...w].map(c=>`<span class="c">${c}</span>`).join('')}</span>`
  ).join(' ');
}
/* .c { opacity:0; transform:translateY(10px); transition:.6s } */
/* stagger preko transition-delay: calc(var(--i) * 18ms) */
```

Za body tekst isti postupak, samo `filter: blur(10px)` i `translateY(20px)`.

### 4. Noise overlay

```css
.noise{
  position:absolute; inset:0; opacity:.2; pointer-events:none;
  background-image:url("data:image/svg+xml,..."); /* ili PNG */
  background-size:153.5px auto; background-repeat:repeat;
}
```
Može se generisati SVG `feTurbulence` filterom, bez slike.

### 5. Section indicator (mali badge iznad svakog naslova)

```html
<div class="eyebrow"><span class="eyebrow__bar"></span>ZAŠTO MLADOST</div>
```
```css
.eyebrow{ display:flex; align-items:center; gap:8px;
  font-size:12px; letter-spacing:.7px; text-transform:uppercase; line-height:20px; }
.eyebrow__bar{ width:2px; height:12px; border-radius:1px; background:var(--brand); }
```

### 6. Hero

`height:100vh`, sadržaj poravnat na DNO (`place-content: center flex-end`),
padding `80px 40px 64px`. Preko bg slike idu tri sloja:
gradient overlay → noise → sadržaj. Sadržaj je u kontejneru sa ivicama
levo/desno/dole (`border-bottom`, `border-left`, `border-right` — bez gornje).

---

## Assets Needed to Recreate

1. **Hero foto terena** — širok kadar šljakastog terena, poželjno u zlatni sat. Iz klijentovog IG-a.
2. **6–10 fotografija** za photo grid i bento kartice: deca na treningu, balon iznutra, dron snimak, turnir, ekipa.
3. **Logo** — SVG ili PNG sa providnom pozadinom (trenutno imamo samo JPG 777×777 na beloj).
4. **Ikonice** — 6 linijskih ikonica za benefits sekciju. Generišu se kao inline SVG, bez biblioteke.
5. **Noise tekstura** — generiše se SVG `feTurbulence`, nije potreban fajl.

---

## Build Plan

### Recommended Stack
- **Vanilla HTML/CSS/JS** — Skill 02 to zahteva, i sajt ovog obima ne treba framework
- **CSS custom properties** za sve tokene u `:root`
- **IntersectionObserver** za scroll reveal umesto Framer Motion
- **Plus Jakarta Sans** (Google Fonts) umesto Satoshi, zbog srpske latinice

### Section-by-Section Build Order

1. **Nav** — fixed, 88px, transparentan preko heroja, border-bottom, hamburger na mobilnom
2. **Hero** — 100vh, bg slika + gradient + noise, eyebrow + H1 (slovo po slovo) + supporting (blur-in) + 2 CTA
3. **O klubu** — eyebrow + veliki paragraf sa istaknutim rečima + 3 stat kartice
4. **Zašto mi** — bento grid, asimetričan, mešavina slika i teksta
5. **Usluge** — tabovi levo, slika desno
6. **Benefits** — 3×2 grid, ikonica + naslov + opis
7. **Foto grid** — masonry 2 kolone
8. **Proces** — horizontalni akordeon sa brojevima
9. **Feature sekcija** — levo tekst + 3 reda, desno slika sa staklenim panelom
10. **Recenzije** — bg slika, levo naslov + slajder, desno kartica sa ocenom
11. **Cenovnik** — kartice
12. **FAQ** — levo naslov + CTA, desno akordeon
13. **CTA banner** — veliki naslov + div wordmark preko bg slike
14. **Footer** — crn, logo + opis + socials + 2 kolone linkova + copyright

---

## Notes

- **Framer `.ssr-variant` duplikati:** HTML sadrži po tri kopije svakog bloka (desktop/tablet/mobile)
  sa `.hidden-*` klasama. To je Framer-ov način. Ne kopirati taj pristup — pravi responsive CSS.
- **Sve animacije su suptilne.** Nema ničeg agresivnog: fade + 64px pomeraj naviše je 90% efekata.
  Ono što sajt čini skupim je **konzistentnost i prostor**, ne složenost animacija.
- **Ivice sekcija su potpis.** Tanka `#b4dcfa80` mreža kroz celu stranicu drži sve na okupu.
  Ako se to izostavi, sajt gubi karakter.
- **Jedna boja.** Disciplina u paleti je razlog zašto deluje profesionalno.
- **Framer badge** u footeru (`__framer-badge`) — ne kopirati, to je njihov watermark.
