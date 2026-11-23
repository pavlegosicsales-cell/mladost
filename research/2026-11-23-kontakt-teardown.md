# Teardown za kontakt stranicu, 23.11.2026.

Izvori skinuti curl-om, mere iz inline Framer stilova.

## arcclub.framer.website/contact, "Visit ArcClub" (.framer-boand6)
- Sekcija: slika/video preko cele sirine, padding 100px 30px, unutrasnji max 1296px.
- Kartica: backdrop-filter blur(13px), background #ffffff24 (bela 14%), radius 32px,
  padding 50px, max-width 392px, razmak naslov/kontakti 102px (tablet 60, telefon 32).
- Grupa naslova: gap 20px. Lista kontakata: gap 18px. Red: gap 16px, ikonica 24px
  u kvadratu sa padding 6px (36px ukupno), akcenat lime.

## arcclub.framer.website/contact, FAQ (.framer-BcoN5)
- Dve kolone, gap 24px, stavke u koloni gap 24px, nezavisne visine.
- Stavka: background rgb(244,240,237), radius 16px, padding 32px, gap pitanje/odgovor 16px.
- Pitanje Urbanist 20px, strelica 24px (chevron 12x6, stroke 2).
- Iznad: naslov centriran + podnaslov max 392px, siva rgb(97,97,97).

## qutenza.framer.website/contact, forma + kartice
- Red: forma (max 808px, radius 12, bg bela 8%) + kolona kartica (max 392px), gap 24px.
- Polja: dve kolone gap 24px, label gap 10px, poruka preko cele sirine, dugme preko cele sirine.
- Kartice: padding 24px, gap 32px, ikonica u kvadratu 52x52, naslov pa vrednost u akcentu.

## Kod nas (kontakt.html)
- Hero: fotka dnevnog terena umesto videa, kartica tamno staklo (lekcija: bez belih
  providnih slojeva), lime kvadrati sa forest ikonama.
- Forma: forest kartica, iste tamne kolone polja kao wizard na pocetnoj, nase lime dugme.
- Kartice desno NE ponavljaju telefon/email/adresu iz heroja: WhatsApp, radno vreme, Instagram.
- FAQ: sage stavke, forest tekst, <details> za pristupacnost.
