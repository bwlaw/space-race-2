/** Which map site a Launch Library location belongs to. */
export const SITE_MATCHERS: [RegExp, string][] = [
  [/kennedy|cape canaveral/i, 'Cape Canaveral'],
  [/vandenberg/i, 'Vandenberg'],
  [/starbase|boca chica/i, 'Starbase'],
  [/guiana|kourou/i, 'Kourou'],
  [/baikonur/i, 'Baikonur'],
  [/satish dhawan|sriharikota/i, 'Sriharikota'],
  [/wenchang|hainan/i, 'Wenchang'],
  [/jiuquan/i, 'Jiuquan'],
  [/xichang/i, 'Xichang'],
  [/taiyuan/i, 'Taiyuan'],
  [/plesetsk/i, 'Plesetsk'],
  [/vostochny/i, 'Vostochny'],
  [/wallops|mid-atlantic/i, 'Wallops'],
  [/uchinoura/i, 'Uchinoura'],
  [/tanegashima/i, 'Tanegashima'],
  [/mahia|rocket lab launch complex/i, 'Mahia'],
];

export function siteFor(location: string): string | null {
  return SITE_MATCHERS.find(([re]) => re.test(location))?.[1] ?? null;
}

export type Fact = { title: string; text: string };

const CHINA_INLAND: Fact = {
  title: 'China’s inland sites',
  text: 'Jiuquan, Xichang and Taiyuan lie far inland, so spent stages sometimes land near villages. The coastal Wenchang site lets them fall into the sea instead.',
};

/** One fact per launch site, shown with the next launch from there. */
export const SITE_FACTS: Record<string, Fact> = {
  'Cape Canaveral': { title: 'Over the sea', text: 'Most launch sites sit on an east-facing coast, so spent rocket stages fall into the ocean instead of on towns. Cape Canaveral launches out over the Atlantic.' },
  Vandenberg: { title: 'Polar orbits', text: 'Satellites that pass over the poles launch north or south instead of east. Vandenberg sends its rockets south over the Pacific for exactly that reason.' },
  Starbase: { title: 'At the edge of Texas', text: 'Starbase sits at the southern tip of Texas, right by the border with Mexico, so Starship launches out over the Gulf of Mexico.' },
  Kourou: { title: 'The equator boost', text: 'At the equator, Earth’s surface moves east at about 1,670 km/h. Rockets launched eastwards from Kourou get that speed for free and can carry heavier satellites.' },
  Baikonur: { title: 'A borrowed spaceport', text: 'Baikonur was built in Soviet times and has been in Kazakhstan since 1991. Russia leases it, and built Vostochny so it could launch from its own soil.' },
  Vostochny: { title: 'Home soil', text: 'Russia built Vostochny in its Far East so it would no longer depend on Baikonur, which it leases from Kazakhstan.' },
  Wenchang: { title: 'Too big for trains', text: 'China’s largest rockets are too wide to travel by rail, so they are shipped by sea to Wenchang. That’s one reason the site was built on Hainan island.' },
  Jiuquan: CHINA_INLAND,
  Xichang: CHINA_INLAND,
  Taiyuan: CHINA_INLAND,
  Sriharikota: { title: 'Avoiding a neighbour', text: 'Rockets from Sriharikota heading for polar orbits make a dog-leg turn in flight to avoid flying over Sri Lanka.' },
  Tanegashima: { title: 'Fishing seasons', text: 'For decades, launches from Tanegashima were limited to certain months of the year to protect local fishing.' },
  Uchinoura: { title: 'Fourth in orbit', text: 'Japan’s first satellite, Ohsumi, launched from Uchinoura in 1970, making Japan the fourth country to reach orbit with its own rocket.' },
  Plesetsk: { title: 'Far to the north', text: 'Plesetsk lies so far north that it suits polar orbits, but reaching the high orbits of TV and weather satellites from there takes extra fuel.' },
  Wallops: { title: 'Seen along the coast', text: 'Wallops launches out over the Atlantic, and on clear nights its rockets can be seen from much of the US East Coast.' },
  Mahia: { title: 'A spaceport on a farm', text: 'Rocket Lab’s Mahia site is so remote that it is licensed for a launch as often as every 72 hours.' },
};

/** Used when the next launch is from a site without its own fact; one per day. */
export const GENERAL_FACTS: Fact[] = [
  SITE_FACTS.Kourou,
  { title: 'Geostationary costs', text: 'The further a site is from the equator, the more fuel a rocket needs to reach the high orbits used by TV and weather satellites.' },
  SITE_FACTS['Cape Canaveral'],
  SITE_FACTS.Vandenberg,
];
