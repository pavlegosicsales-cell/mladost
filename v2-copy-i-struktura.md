# Teniski Klub Mladost, sajt v2

**Datum:** 5. septembar 2026.
**Status:** struktura cele stranice + copy SAMO za hero blok. Ostale sekcije su mapirane, copy dolazi u sledećem prolazu.
**Jezik:** srpski, latinica
**Obim:** samo tenis, padel se ne pominje
**Odnos prema v1:** ovo je nov sajt od nule, ne prepravka. v1 fajlovi ostaju netaknuti dok ne kažeš da se brišu.

---

## 1. Paleta

Tvoja paleta, pet vrednosti, bez dodavanja šeste.

| Token | Vrednost | Uloga |
|---|---|---|
| `--white` | `#FFFFFF` | Pozadina sajta, tekst na tamnom |
| `--sage` | `#D8DFD4` | Sekundarna pozadina, kartice, smena ritma između sekcija |
| `--lime` | `#B6E11F` | Jedina CTA boja. Dugmad, aktivna stanja, brojke |
| `--forest` | `#1A4339` | Tamna zelena. Naslovi, footer, gradient krugovi ikonica |
| `--black` | `#000000` | Body tekst, ivice, duboke senke |

Izvedeni tonovi (samo prozirnosti postojećih boja, ne nove boje):
`--line: rgba(26,67,57,.14)` · `--ink-2: rgba(0,0,0,.66)` · `--ink-3: rgba(0,0,0,.42)`

**Kontrast:** lime `#B6E11F` je previše svetla za beli tekst. Na lime dugmadima tekst je uvek `--forest` ili `--black`. Beli tekst ide isključivo na `--forest` i `--black`.

---

## 2. Tipografija

**Predlog: Archivo** (Google Fonts, težine 400 / 600 / 800).
Razlog: geometrijski grotesk sa uskim velikim slovima, sportski karakter, puna podrška za č ć ž š đ. Plus Jakarta Sans sa v1 je mekši i porodičniji, ovaj brend sa crnom i tamnozelenom traži nešto oštrije.

- H1: 800, `clamp(2.6rem, 7vw, 5rem)`, letter-spacing `-0.035em`, line-height `0.98`
- H2: 800, `clamp(2rem, 4.4vw, 3.2rem)`, letter-spacing `-0.03em`
- H3 (kartica usluge): 600, `1.35rem`
- Body: 400, 17px, line-height 1.6
- Eyebrow: 600, 12px, uppercase, letter-spacing `1px`

---

## 3. Mapa assetа

Šta gde ide od onoga što si ubacio u `images + videos/`.

| Asset | Gde se koristi |
|---|---|
| `assets/slazzer-preview-clpf5.png` | Logo u navigaciji, na beloj i sage pozadini (lime prsten se vidi) |
| `assets/Group 131.png` | Logo u footeru, monohrom, ide preko lime ili bele podloge |
| `assets/coach.png` | Ikonica kartice **Školica tenisa** |
| `assets/tennis-racket.png` | Ikonica kartice **Individualni treninzi** |
| `assets/tennis.png` | Ikonica kartice **Rekreativci** |
| `assets/tennis-ball.png` | Rezerva, sitni dekorativni element uz brojke |
| `reference/dron snimak tereni 1.mp4` | Pozadina heroja, video u loop-u |
| `reference/dron slika1.jpeg` | Poster za hero video, fallback na mobilnom |
| `reference/skolica tenisa slika.jpeg` | Slika u kartici Školica tenisa |
| `reference/teren zoomed.jpeg` | Slika u kartici Individualni treninzi |
| `reference/tereni1.jpeg` ili `dron tereni 3.jpeg` | Slika u kartici Rekreativci |
| `reference/svlacionica*.jpeg`, `tusevi.jpeg`, `hodnik.jpeg`, `basta.jpeg` | Sekcija sa brojkama i benefitima, dokaz da klub ima sadržaj |
| `reference/balon.jpeg` | Blog ili sekcija o zimskoj sezoni |

Ikonice `coach`, `tennis-racket`, `tennis` su već krugovi sa `--forest` gradijentom i belim crtežom, 256x256 PNG. Idu direktno, bez prepravke, 56px na kartici.

Fotke sa vidljivim padel terenom (`padel + balon`, `padel + tereni`, `balon + padel zimi`) se **ne koriste**, isto pravilo kao na v1.

---

## 4. Struktura stranice

Redosled sekcija, ceo sajt:

```
1  NAV                     fiksna, providna preko heroja
2  HERO                    puna visina, dron video
3  USLUGE, kartice 1 2 3   tri kartice odmah ispod heroja, preklapaju dno heroja
4  BROJKE I BENEFITI       traka sa ciframa preko sage pozadine
5  USLUGA 1, detaljno      Školica tenisa, tekst + slika
6  USLUGA 2, detaljno      Individualni treninzi, obrnut raspored
7  USLUGA 3, detaljno      Rekreativci i iznajmljivanje terena
8  TRENERI                 kartice sa fotkama, ime, uloga
9  BLOG                    tri poslednja teksta
10 FOOTER                  teniski teren kao grafika preko gradijenta
```

Sekcija 3 je deo hero bloka vizuelno: kartice sede na dnu heroja i preklapaju ga za oko 120px, tako da se prvi ekran čita kao jedna celina. To je ono što si tražio.

---

# 5. HERO BLOK, copy i struktura

Ovo je jedini deo koji sada dobija pun copy.

## 5.1 Navigacija

Visina 88px na desktopu, 72px na mobilnom. Providna preko heroja, na skrol dobija belu podlogu i tanku ivicu `--line`.

```
[logo] Mladost   |   Škola tenisa · Treninzi · Tereni · Treneri · Blog   |   061 500 50 51   [ Rezerviši teren ]
```

- Logo: `slazzer-preview-clpf5.png`, 44px, krug
- Dugme je lime sa `--forest` tekstom, jedino dugme u navigaciji
- Telefon je vidljiv od 992px naviše, na mobilnom ulazi u hamburger meni

## 5.2 Hero

**Pozadina:** `dron snimak tereni 1.mp4`, autoplay, muted, loop, playsinline. Poster `dron slika1.jpeg`. Na mobilnom i uz `prefers-reduced-motion` ide samo slika, video se ne učitava.

**Slojevi odozdo naviše:** video → gradient `--forest` od 0% providnosti na vrhu do 88% na dnu → sitni noise → sadržaj.

**Poravnanje:** sadržaj na dnu levo, jer kartice usluga ulaze u desnu donju trećinu.

### Copy

> **eyebrow**
> BANOVO BRDO, OD 2024.

> **H1**
> Teren je spreman.
> Ti samo dođi.

> **podnaslov**
> Tri šljakasta terena, škola tenisa za sve uzraste i treninzi koji se rade jedan na jedan. Lješka 82, svakog dana od 8 do 23.

> **dugmad**
> `[ Rezerviši teren ]` lime, vodi na kontakt
> `[ Upiši dete ]` providno sa belom ivicom, vodi na sekciju Školica

> **sitna traka na dnu heroja, levo od kartica**
> 4.9 na Google-u · 3 šljakasta terena · Reflektori do 23h

**Alternativa za H1** ako ti se prva čini prekratka:
„Tenis na Brdu, bez izgovora."

### Animacija

- H1 slovo po slovo, stagger 16ms
- Podnaslov blur-in sa 0.35s zakašnjenja
- Dugmad fade-up sa 0.6s
- Video se pojačava iz `scale(1.06)` u `scale(1)` tokom 2.4s
- Kartice usluga ulaze odozdo, stagger 90ms, kad hero uđe u vidno polje

## 5.3 Tri kartice usluga

Tri jednake kartice u redu na desktopu, horizontalni skrol sa snap tačkama na mobilnom. Sede preko dna heroja, bela pozadina, radius 24px, tanka `--line` ivica, bez senke.

Svaka kartica ima: ikonicu (krug 56px), naslov, jednu rečenicu, fotku 4:3 i tekstualni link sa strelicom.

---

**Kartica 1**

- **Ikonica:** `coach.png`
- **Naslov:** Školica tenisa
- **Tekst:** Grupe po uzrastu i nivou, od prvih koraka do prvog turnira. Upis je u toku.
- **Slika:** `skolica tenisa slika.jpeg`
- **Link:** Vidi program →

**Kartica 2**

- **Ikonica:** `tennis-racket.png`
- **Naslov:** Individualni treninzi
- **Tekst:** Jedan na jedan sa trenerom. Rad na tehnici, servisu i kretanju, tempom koji ti odgovara.
- **Slika:** `teren zoomed.jpeg`
- **Link:** Zakaži termin →

**Kartica 3**

- **Ikonica:** `tennis.png`
- **Naslov:** Rekreativci
- **Tekst:** Rezervišeš teren, dolaziš i igraš. Bez članarine, bez uslova, termini do 23h.
- **Slika:** `tereni1.jpeg`
- **Link:** Pogledaj cene →

---

**Hover na kartici:** slika se uveća za 4%, strelica u linku klizne 6px udesno, ivica pređe u `--forest`. Bez podizanja kartice i bez senke.

---

## 6. Šta je ostalo otvoreno

| # | Pitanje | Blokira? |
|---|---|---|
| 1 | Referentni sajt za izgled kartica usluga, treba mi URL da bih pokrenuo teardown | Da, za precizan raspored kartica |
| 2 | Fajl sa rasporedom elemenata u footeru, nema ga u folderu | Ne za hero, da za sekciju 10 |
| 3 | Imena i fotografije trenera za sekciju 8 | Ne sada |
| 4 | Da li blog ima prave tekstove ili idu placeholderi | Ne sada |
| 5 | Cena individualnih treninga i školice | Ne, sajt kaže „javi se" kao na v1 |
