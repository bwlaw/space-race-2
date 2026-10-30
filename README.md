# Space Race 2.0

A mobile app (iOS and Android) that tracks the space programmes of the USA, China, Russia, Europe, India and Japan: a race of milestones and launches, upcoming launches, people in space, maps of Earth, Moon and Mars, and history.

Built with Expo (React Native, TypeScript, Expo Router).

## Status

- Step 1: app shell with five tabs, dark space theme, and the full **The Race** screen.
- Step 2: the **Launches** screen.
- Step 3: the **In Space** screen.
- Step 4: the **Maps** screen.
- Step 5 (this version): the **History** screen. All five screens done; next is live data.
- Step 6 (this version): live data. Upcoming and latest launches and the crews in space come from Launch Library 2 (The Space Devs), station positions are calculated from CelesTrak orbital elements. Everything is cached on the device.
- Step 7 (this version): daily data job. `.github/workflows/update-stats.yml` runs `scripts/update-stats.mjs` every night, which writes `data/stats.json` (launch counts and success rates per country). The app reads it from GitHub and falls back to sample figures until the first run.
- Next: App Store preparation.

Data marked "Sample data" in the app is placeholder data; screens marked "Live" use real data. Milestones and their years are real; the points per milestone are the app's own weighting.

## Run it on your iPhone

1. Install Node.js LTS from https://nodejs.org (once).
2. Install **Expo Go** from the App Store on your iPhone (once).
3. In this folder:

   ```bash
   npm install
   npx expo start
   ```

4. Scan the QR code shown in the terminal with the iPhone camera. The app opens in Expo Go.
   Computer and iPhone must be on the same Wi-Fi. If that doesn't work, use `npx expo start --tunnel`.

## Checks

```bash
npx tsc --noEmit
npx expo lint
```

## Licences

Code MIT. Flag images drawn for this project.

## Data sources

- Launches, crews: [Launch Library 2](https://thespacedevs.com/llapi) by The Space Devs (free tier, cached on the device).
- Station positions: orbital elements from [CelesTrak](https://celestrak.org).
- Launch statistics: `data/stats.json`, rebuilt daily by GitHub Actions. To run it by hand: GitHub → Actions → "Update launch statistics" → Run workflow. A run takes about two hours because requests are spaced out to respect the free API limit.
