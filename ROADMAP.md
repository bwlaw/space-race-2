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

## 1.3 – Satellites (target: early January 2027)
- Space Race: third metric "Satellites" with tabs Countries | Companies (SpaceX Starlink, Eutelsat OneWeb, Amazon Kuiper, Planet, Qianfan, Spire, Iridium, other companies).
- Maps, Earth: satellites layer with selected satellites at live positions (Hubble, weather, GPS, Galileo, BeiDou, GLONASS).
  - The three buttons below the Earth map become ISS | Tiangong | Satellites ("Both" is replaced).
  - Each button switches its layer on or off independently, so any combination can be shown.
  - While Satellites is on, the launch-site dots are hidden on the map.
  - Below the map: Launch Sites sorted by number of launches (busiest first) and showing the top 5 by default, with a "Show more launch sites" button for the rest, followed by a new list of the most important satellites.
  - Launch counts per site come from Launch Library 2 via the nightly job, so the order stays current.
- History: satellites in orbit per country over time.
- Data: CelesTrak satellite catalogue and constellation groups via the nightly job.

## Later ideas
- Launches by company (SpaceX, Rocket Lab, Arianespace, CASC, …).
- Re-enable "Last 12 months" for milestones once there is real data for it.
- Android release on Google Play.
- Astronaut portraits and mission images (after checking image rights).
