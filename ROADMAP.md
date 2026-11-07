# Space Race 2.0 – Roadmap

Rhythm: one larger update about every two weeks after launch. Dates are targets, not promises; each update goes through TestFlight and Apple review (usually one to three days).

## 1.0 – Launch (target: mid-November 2026)
- First build with EAS, TestFlight testing, App Store listing, review and release.

## 1.1 – Crewed missions (target: end of November 2026)
- In Space: third toggle "Spacecraft" with every crewed spacecraft in space (docked or free-flying), crew helmets, days in space.
- In Space: "Missions on board now" with progress bars, and "Next crewed launches".
- Maps, Moon: Apollo landing sites with timeline (Apollo 11–17), Artemis target region from live data, crewed flybys (Apollo 8, 10, 13).
- One common font for all numbers across the app.
- Live altitude for the ISS on the In Space header.

## 1.2 – Solar system (target: mid-December 2026)
- Maps: fourth tab "Solar system" with live planet positions and active deep-space missions (Europa Clipper, Juice, BepiColombo, Psyche, Lucy, Tianwen-2, Parker, Solar Orbiter, Voyager 1 and 2).
- Spacecraft positions daily from NASA JPL Horizons via the nightly job; mission details as a hand-checked list.
- Optional time slider to move planets and probes forward to arrival dates.
- Moon and Mars: when an orbiter that is still in use is selected, a small dot marks it on the dashed orbit ring.
  - Each orbiter has its own place on the ring, so switching between them moves the dot around the planet.
  - Only the selected orbiter is shown; with nothing selected, or a past orbiter selected, the ring stays empty.

## 1.3 – Satellites (target: early January 2027)
- Space Race: third metric "Satellites" (countries: active satellites per country; companies: SpaceX Starlink, Eutelsat OneWeb, Amazon Kuiper, Planet, Qianfan, Spire, Iridium, other companies).
- Space Race: Countries | Companies switch for the whole race (Milestones, Launches and Satellites).
  - Design: a quiet grey word with a swap symbol in the top-right corner ("Countries ⇄" / "Companies ⇄"); the title stays "Space Race"; the "… leads" line names the leading country or company.
  - Company milestones: hand-checked commercial firsts (e.g. Falcon 1 to orbit 2008, Dragon at the ISS 2012, first private crewed orbital flight 2020, first private spacewalk 2024, commercial Moon landings 2024 and 2025, Landspace's methane rocket to orbit 2023), each company with its home-country flag.
  - Company launches: launch counts per provider from Launch Library 2 via the nightly job.
- Maps, Earth: satellites layer with selected satellites at live positions (Hubble, weather, GPS, Galileo, BeiDou, GLONASS).
  - The three buttons below the Earth map become ISS | Tiangong | Satellites ("Both" is replaced).
  - Each button switches its layer on or off independently, so any combination can be shown.
  - While Satellites is on, the launch-site dots are hidden on the map.
  - Constellations shown as moving swarms of dots, one colour each: Starlink, OneWeb, GPS, Galileo, BeiDou (and GLONASS); speed and spread follow the real orbits.
  - Chips below the map switch each constellation on and off; tapping a chip opens a short info card with the real total (e.g. "about 9,000 Starlink satellites, 300 shown").
  - "How high they fly": a small side view on a logarithmic scale, from Starlink (~550 km) to the navigation systems (20,000+ km), with the ISS and the geostationary ring as landmarks.
  - Data: the nightly job picks a representative sample per constellation from CelesTrak (a few hundred Starlink, all navigation satellites); the phone calculates live positions as for the ISS. Dots are drawn as one layer for performance.
  - Below the map: Launch Sites sorted by number of launches (busiest first) and showing the top 5 by default, with a "Show more launch sites" button for the rest, followed by a new list of the most important satellites.
  - Launch counts per site come from Launch Library 2 via the nightly job, so the order stays current.
- History: satellites in orbit per country over time.
- Data: CelesTrak satellite catalogue and constellation groups via the nightly job.

## 1.4 – Links and Time Machine playback (target: mid-January 2027)
- Official website for every mission, lander, rover, orbiter, launch site and station:
  - shown as a "Official site ↗" link at the bottom of each info card and dropdown, opening in the in-app browser;
  - agency pages from NASA, ESA, CNSA, ISRO, JAXA and Roscosmos where they exist;
  - for Soviet-era and ended missions without their own page, NASA's spacecraft archive (NSSDCA) as the official fallback;
  - every link checked by hand before release, and checked again automatically by the nightly job.
- History, Time Machine: play button next to the year.
  - Plays from the selected year to today (from 1957 if already at the end), about 0.4 seconds per year.
  - Bars and the milestone list update as it runs; tap again to pause; dragging the slider stops playback.
  - Respects the system "Reduce Motion" setting by moving in larger steps.

## Later ideas
- Launches by company (SpaceX, Rocket Lab, Arianespace, CASC, …).
- Re-enable "Last 12 months" for milestones once there is real data for it.
- Android release on Google Play.
- Astronaut portraits and mission images (after checking image rights).
