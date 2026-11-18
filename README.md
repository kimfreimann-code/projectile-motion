# Kaströrelse

En interaktiv simulering av kaströrelse för gymnasiefysik. Bollen startar och landar på samma höjd; luftmotstånd försummas och tyngdaccelerationen är konstant.

## Användning

Öppna `index.html` i en webbläsare. Projektet har inga paket eller byggsteg. Google Fonts används om internetanslutning finns; annars används webbläsarens reservtypsnitt.

## Publicera på GitHub Pages

1. Lägg projektfilerna i ett GitHub-repository.
2. Öppna repositoryts **Settings → Pages**.
3. Välj **Deploy from a branch**, välj `main` och mappen `/ (root)`, och spara.
4. Öppna adressen som GitHub Pages visar.

## Ändra fysik och undervisningstext

- Ändra tyngdaccelerationen, startvärdena och reglagens gränser i [`js/physics.js`](js/physics.js). Beräkningarna för flygtid, räckvidd, höjd och position finns i samma fil.
- Ändra introduktion, elevuppgifter, reflektionsfråga, förklaring och modellantagande i [`js/content.js`](js/content.js).
- Sidans innehåll och struktur finns i `index.html`, och utseendet i `styles.css`.

Fysikmodellen använder

- `t_flykt = 2 v₀ sin(θ) / g`
- `R = v₀² sin(2θ) / g`
- `h_max = (v₀ sin(θ))² / (2g)`

Vid 0° rullar bollen på plan mark med rullfriktionskoefficient `μᵣ = 0,20`:

- `t_rull = v₀ / (μᵣ g)`
- `R_rull = v₀² / (2 μᵣ g)`

Ändra koefficienten i `js/physics.js`.
