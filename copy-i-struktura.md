# Teniski Klub Mladost — copy i struktura sajta

**Jezik:** srpski (latinica)
**Obim:** samo tenis. Padel se ne pominje.
**Dizajn:** preuzet sa paddlez.framer.website (vidi `research/2026-08-21-paddlez-teardown.md`)
**Stranice:** `index.html`, `kontakt.html`, `politika-privatnosti.html`

---

## Paleta

Logo daje dve boje, i one nose ceo sajt. Paddlez stoji na jednoj jakoj boji preko vrlo
svetle hladne pozadine. Isti princip, samo tirkiz umesto plave.

| Token | Vrednost | Uloga |
|---|---|---|
| `--brand` | `#004050` | Primarna. Dugmad, eyebrow crtica, aktivna stanja. **Jedina CTA boja.** |
| `--brand-hover` | `#00596E` | Hover na dugmadima |
| `--lime` | `#B6E11F` | Akcenat. Kvačice, aktivan tab, sitni naglasci. Nikad kao CTA. |
| `--bg` | `#F4FAFA` | Pozadina stranice |
| `--card` | `#E4F1F2` | Pozadina kartica |
| `--ink` | `#04252C` | Naslovi |
| `--ink-2` | `#4E5F5F` | Body tekst |
| `--ink-3` | `rgba(4,37,44,.42)` | Neaktivan tekst |
| `--line` | `rgba(0,64,80,.16)` | Ivice sekcija (mreža kroz sajt) |
| `--dark` | `#012129` | Footer |

Terakota `#C25A2E` iz njegovih grafika se NE koristi kao UI boja. Ona već postoji na
fotografijama šljake i to je dovoljno.

**Font:** Plus Jakarta Sans (400/500/700/800). Satoshi sa originala nema pouzdanu podršku
za č ć ž š đ. Plus Jakarta Sans je najbliža zamena i ima punu srpsku latinicu.

---

# INDEX.HTML

## 1. Navigacija
Fiksna, 88px, providna preko heroja, tanka donja ivica.

Logo + **Mladost** | O klubu · Škola tenisa · Tereni · Cenovnik · Kontakt | `[ Rezerviši teren ]`

Telefon **061 500 50 51** stoji u headeru na desktopu, levo od dugmeta. To je glavni kanal.

---

## 2. Hero
Puna visina ekrana, foto terena, gradient odozdo, noise preko. Sadržaj poravnat na dno.

> **TENIS NA BANOVOM BRDU**
>
> # Tenis u srcu Banovog Brda.
>
> Tri šljakasta terena, škola tenisa za sve uzraste i ekipa koja te čeka.
> Lješka 82, svaki dan od 8 do 23.
>
> `[ Rezerviši teren ]`  `[ Upiši dete u školu ]`

Naslov se pojavljuje slovo po slovo. Podnaslov blur-in. Dugmad kasne 0.4s.

---

## 3. O klubu
Eyebrow + veliki paragraf sa istaknutim rečima u tirkiznoj, pa tri brojke.

> **O KLUBU**
>
> ## Teniski klub Mladost okuplja **rekreativce**, **decu** i **porodice** sa Banovog Brda na tri šljakasta terena, uz **školu tenisa** koju vode treneri koji rade sa decom svakog dana.

Tri kartice sa brojačima:

| Broj | Ispod |
|---|---|
| **3** | Šljakasta terena |
| **4.9** | Ocena na Google-u |
| **2024** | Godina osnivanja |

---

## 4. Zašto Mladost
Bento grid, asimetričan. Mešavina kartica sa slikom i kartica sa tekstom.

**Kartica 1 (široka, sa slikom terena):**
> ### Šljaka pod nogama
> Tri terena od prave šljake. Mekše za kolena, sporija lopta, duži poeni.

**Kartica 2:**
> ### Zimi se ne staje
> Teren ide pod balon i igra se cele godine. Bez pauze od novembra do marta.

**Kartica 3 (velika, akcenat):**
> ### Treneri koji objasne, pa pokažu
> „Greška nije problem. Problem je kada iz nje ništa ne naučimo."
>
> Rade na terenu izgleda ovako: primeti, objasni, ispravi, ponovi.
>
> `[ Upiši dete u školu ]`

**Kartica 4:**
> ### Termini do 23h
> Reflektori na svim terenima. Ako stižeš sa posla u devet uveče, teren te čeka.

**Kartica 5 (sa slikom dece):**
> ### Ekipa, ne samo trening
> „Gradimo teniski klub, radimo na motorici i koordinaciji, a uz sve to se i dobro zabavljamo."

---

## 5. Usluge
Tabovi levo, slika desno. Prvi tab otvoren.

> **ŠTA NUDIMO**
> # Sve što ti treba da izađeš na teren

**Tab 1 · Iznajmljivanje terena** *(aktivan)*
Rezervišeš teren, dođeš i igraš. Tri šljakasta terena, reflektori, termini od 8 do 23.

**Tab 2 · Škola tenisa**
Za sve uzraste, od prvih koraka do ozbiljnog treninga. Grupe se prave po uzrastu i nivou.

**Tab 3 · Školica za osnovce**
Poseban program za decu školskog uzrasta. Rad na tehnici, motorici i koordinaciji.
Upis je u toku.

**Tab 4 · Turniri i kampovi**
Interni turniri školice tokom sezone i letnji kamp na Zlatiboru.

---

## 6. Šta dobijaš (benefits)
Šest polja, ikonica + naslov + jedna rečenica. Grid 3×2.

1. **Šljakasti tereni** — Tri terena od prave šljake, održavana svakog dana.
2. **Reflektori do 23h** — Igra se i posle mraka, cele nedelje.
3. **Balon zimi** — Teren pod krovom kad padne temperatura.
4. **Stručni treneri** — Rad sa decom, korekcija tehnike, jasno objašnjenje.
5. **Rezervacija za minut** — Jedan poziv i termin je tvoj.
6. **Ekipa koja te čeka** — Turniri, druženja i ljudi koji igraju svake nedelje.

---

## 7. Cenovnik
Dve kartice jedna pored druge. Bez izmišljenih paketa i članarina, klub radi po satu.

> **CENOVNIK**
> # Termin od sat vremena

**Kartica A · Radnim danom**
| 08:00 – 17:00 | **1.000 RSD** |
| 17:00 – 20:00 | **1.200 RSD** |
| 20:00 – 23:00 | **1.400 RSD** |

**Kartica B · Vikendom** *(istaknuta)*
| 07:00 – 20:00 | **1.200 RSD** |
| 20:00 – 23:00 | **1.400 RSD** |

Ispod: *Cena je za teren, ne po igraču. Rezervacija na 061 500 50 51.*
`[ Rezerviši teren ]`

⚠️ **Cena škole tenisa se ne prikazuje** jer je nemamo. Umesto cene stoji
„Javi se za raspored i cenu" sa dugmetom ka kontaktu.

---

## 8. U klubu (foto grid)
Dve kolone, masonry raspored, četiri fotografije. Bez teksta preko slika.

> **ŽIVOT U KLUBU**
> # Ovako izgleda kod nas
>
> Teren, ekipa i loptice koje lete. Slike su sa treninga i turnira tokom sezone.

---

## 9. Kako do termina
Horizontalni akordeon, četiri koraka, brojevi 01–04.

**01 · Javi se**
Pozovi 061 500 50 51 ili pošalji upit preko sajta.

**02 · Biramo termin**
Kažeš kad ti odgovara, mi kažemo šta je slobodno.

**03 · Dođi na Lješku 82**
Banovo Brdo, ulaz sa ulice. Parking ispred.

**04 · Igraj**
Teren je spreman. Ti samo poneseš reket i patike.

---

## 10. Škola tenisa (velika sekcija)
Levo tekst, desno slika sa staklenim panelom preko.

> **ŠKOLA TENISA**
> # Dete izađe bolje nego što je ušlo
>
> „Cilj treninga nije da dete bude savršeno iz prvog pokušaja, već da svakog treninga
> izađe malo bolje nego što je ušlo."
>
> Tri stvari koje radimo na svakom treningu:

**Tehnika** — Postavka, zamah i kontakt sa lopticom. Korekcija odmah, ne posle mesec dana.
**Motorika i koordinacija** — Rad nogu, ravnoteža i brzina. Osnova za sve ostalo.
**Igra** — Poeni, mečevi i turniri. Dete uči kroz igru, ne kroz predavanje.

Stakleni panel preko slike:
| Upis | **U toku** | Uzrast | **Svi** | Trener | **Rade Poleksić** |

`[ Prijavi dete ]`

---

## 11. Ocena i utisci
⚠️ **VAŽNO:** klub nema nijednu **pisanu** recenziju. Google ima ocenu 4.9, dikidi ima
5.0 iz 17 ocena, ali tekst recenzije ne postoji nigde. Zato ovde **ne ide izmišljeni
carousel sa testimonijalima.** Umesto toga ide prava ocena i njegove prave reči.

Preko fotografije, sa staklenim panelom:

> # 4.9
> ★★★★★
> Ocena na Google-u
>
> „Priliku da vaša deca budu u zdravoj okolini, u krugu stručnih i iskusnih trenera.
> Kroz treninge i druženje da još više zavole sport kojim se bave."

`[ Pogledaj nas na Google-u ]`

Kad klijent skupi 3 do 5 pravih recenzija, ovde se ubacuje pravi slajder.

---

## 12. Česta pitanja
Akordeon, pet pitanja.

**Da li moram da budem član da bih igrao?**
Ne. Rezervišeš termin, platiš teren i igraš. Članstvo nije uslov.

**Šta ako pada kiša?**
Termin se prebacuje. Javi se na 061 500 50 51 i dogovorimo novi.

**Od koliko godina dete može da krene?**
Radimo sa svim uzrastima. Za najmlađe postoji školica, za osnovce poseban program.
Javi se pa ćemo naći grupu po uzrastu i nivou.

**Da li se igra zimi?**
Da. Teren ide pod balon i sezona traje cele godine.

**Koliko unapred treba rezervisati?**
Popodnevni termini od 17h idu najbrže. Za njih zovi dan ili dva ranije.
Prepodne se skoro uvek nađe mesto isti dan.

Levo od akordeona:
> **PITANJA**
> # Odgovori na najčešća pitanja.
>
> Nešto ti nije jasno?
> `[ Piši nam ]`

---

## 13. CTA banner
Foto terena, veliki naslov, ispod ogroman providan natpis **MLADOST**.

> # Vidimo se na terenu.
>
> Rezerviši termin ili upiši dete u školu tenisa. Jedan poziv je dovoljan.
>
> `[ Rezerviši teren ]`

---

## 14. Footer
Crna pozadina.

**Levo:** logo + Teniski Klub Mladost
Tenis na Banovom Brdu od 2024. Tri šljakasta terena, škola tenisa za sve uzraste.
Ikonice: Instagram, Facebook

**Kolona 1 · Sajt**
O klubu · Škola tenisa · Cenovnik · Česta pitanja

**Kolona 2 · Klub**
Kontakt · Politika privatnosti

**Kontakt blok**
Lješka 82, Banovo Brdo, Beograd
061 500 50 51
mladost.tenis@gmail.com

Dole: © 2026 Teniski Klub Mladost. Sva prava zadržana.

---

# KONTAKT.HTML

Forma je čarobnjak u četiri koraka. Prva tri su dugmad, kuca se samo na kraju.

**Korak 1 — Šta te zanima?**
Rezervacija termina · Upis u školu tenisa · Školica za osnovce · Turnir ili grupa

**Korak 2 — Za koga?**
Za sebe · Za dete · Za grupu ili firmu

**Korak 3 — Kada?**
Ove nedelje · Ovog meseca · Samo se raspitujem

**Korak 4 — Tvoji podaci**
Ime i prezime · Telefon · Email · Poruka (opciono)

Progres tačkice gore. Dugme „Nazad" na svakom koraku posle prvog.
Posle slanja: poruka na istoj stranici, bez redirekta.

Pored forme: adresa, telefon, mejl, radno vreme i Google mapa.

---

# POLITIKA-PRIVATNOSTI.HTML

⚠️ Skill 02 traži australijsku politiku privatnosti. To ovde ne važi.
Pišem po **Zakonu o zaštiti podataka o ličnosti Republike Srbije**.

Sadržaj: šta se prikuplja (ime, telefon, email preko forme), zašto (odgovor na upit),
koliko se čuva, da se ne prodaje trećim licima, pravo na brisanje uz kontakt mejl,
datum poslednje izmene.

---

# Otvoreno pred build

| # | Pitanje | Blokira? |
|---|---|---|
| 1 | Je li `mladost.tenis@gmail.com` pravi mejl za upite? | Ne, stavljam ga uz napomenu |
| 2 | Logo u SVG/PNG sa providnom pozadinom | Ne, koristim JPG privremeno |
| 3 | Fotografije u punoj rezoluciji | Ne, idu placeholderi sa komentarom |
| 4 | Cena škole tenisa | Ne, sajt kaže „javi se" |
| 5 | Facebook link | Ne, imam ga iz tvoje poruke |
