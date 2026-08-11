export type ContinentId =
  | "africa"
  | "asia"
  | "europe"
  | "north-america"
  | "oceania"
  | "south-america"
  | "unknown";

export interface Continent {
  id: Exclude<ContinentId, "unknown">;
  name: string;
  tagline: string;
}

export const CONTINENTS: Continent[] = [
  { id: "europe", name: "Europe", tagline: "The powerhouse leagues of the old continent." },
  { id: "south-america", name: "South America", tagline: "Passion, flair and the Copa Libertadores." },
  { id: "north-america", name: "North America", tagline: "MLS, Liga MX and a growing football culture." },
  { id: "africa", name: "Africa", tagline: "The rising talent hotbeds of the world game." },
  { id: "asia", name: "Asia", tagline: "Giant markets and the fast-growing AFC." },
  { id: "oceania", name: "Oceania", tagline: "Island football and the A-League." },
];

export function getContinentById(id: Exclude<ContinentId, "unknown">): Continent {
  return CONTINENTS.find((c) => c.id === id) ?? CONTINENTS[0];
}

const COUNTRY_CONTINENT: Record<string, Exclude<ContinentId, "unknown">> = {
  england: "europe",
  scotland: "europe",
  wales: "europe",
  "northern ireland": "europe",
  ireland: "europe",
  "united kingdom": "europe",
  germany: "europe",
  italy: "europe",
  france: "europe",
  spain: "europe",
  greece: "europe",
  netherlands: "europe",
  belgium: "europe",
  portugal: "europe",
  switzerland: "europe",
  austria: "europe",
  denmark: "europe",
  sweden: "europe",
  norway: "europe",
  finland: "europe",
  iceland: "europe",
  poland: "europe",
  "czech republic": "europe",
  czechia: "europe",
  slovakia: "europe",
  hungary: "europe",
  romania: "europe",
  bulgaria: "europe",
  serbia: "europe",
  croatia: "europe",
  slovenia: "europe",
  "bosnia and herzegovina": "europe",
  "north macedonia": "europe",
  montenegro: "europe",
  kosovo: "europe",
  albania: "europe",
  ukraine: "europe",
  russia: "europe",
  belarus: "europe",
  lithuania: "europe",
  latvia: "europe",
  estonia: "europe",
  moldova: "europe",
  cyprus: "europe",
  luxembourg: "europe",
  malta: "europe",
  turkey: "europe",
  georgia: "europe",
  azerbaijan: "europe",
  armenia: "europe",
  "san marino": "europe",
  andorra: "europe",
  monaco: "europe",
  liechtenstein: "europe",

  brazil: "south-america",
  argentina: "south-america",
  colombia: "south-america",
  chile: "south-america",
  peru: "south-america",
  uruguay: "south-america",
  paraguay: "south-america",
  bolivia: "south-america",
  ecuador: "south-america",
  venezuela: "south-america",
  guyana: "south-america",
  suriname: "south-america",

  "united states": "north-america",
  usa: "north-america",
  canada: "north-america",
  mexico: "north-america",
  "costa rica": "north-america",
  panama: "north-america",
  honduras: "north-america",
  guatemala: "north-america",
  "el salvador": "north-america",
  nicaragua: "north-america",
  cuba: "north-america",
  jamaica: "north-america",
  "trinidad and tobago": "north-america",
  haiti: "north-america",
  "dominican republic": "north-america",

  "south africa": "africa",
  egypt: "africa",
  nigeria: "africa",
  morocco: "africa",
  tunisia: "africa",
  algeria: "africa",
  ghana: "africa",
  senegal: "africa",
  cameroon: "africa",
  "ivory coast": "africa",
  kenya: "africa",
  tanzania: "africa",
  ethiopia: "africa",
  angola: "africa",
  "dr congo": "africa",
  zambia: "africa",
  zimbabwe: "africa",
  uganda: "africa",
  mali: "africa",
  guinea: "africa",
  "cape verde": "africa",
  botswana: "africa",
  namibia: "africa",
  sudan: "africa",
  libya: "africa",
  mozambique: "africa",
  madagascar: "africa",

  japan: "asia",
  "south korea": "asia",
  china: "asia",
  india: "asia",
  "saudi arabia": "asia",
  qatar: "asia",
  "united arab emirates": "asia",
  iran: "asia",
  iraq: "asia",
  israel: "asia",
  jordan: "asia",
  syria: "asia",
  lebanon: "asia",
  kuwait: "asia",
  bahrain: "asia",
  oman: "asia",
  yemen: "asia",
  uzbekistan: "asia",
  kazakhstan: "asia",
  thailand: "asia",
  vietnam: "asia",
  indonesia: "asia",
  malaysia: "asia",
  singapore: "asia",
  philippines: "asia",

  australia: "oceania",
  "new zealand": "oceania",
  fiji: "oceania",
  "papua new guinea": "oceania",
  samoa: "oceania",
  tonga: "oceania",
  "american samoa": "oceania",
  "solomon islands": "oceania",
  vanuatu: "oceania",
};

function normalizeCountry(country?: string | null): string {
  return (country ?? "")
    .trim()
    .toLowerCase()
    .replace(/^the\s+/, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "");
}

export function getContinentOf(country?: string | null): ContinentId {
  return COUNTRY_CONTINENT[normalizeCountry(country)] ?? "unknown";
}

export function getFlagUrl(country?: string | null): string | undefined {
  const normalized = normalizeCountry(country);
  if (!normalized) return undefined;
  const dashed = normalized.replace(/\s+/g, "-");
  return `https://www.thesportsdb.com/images/icons/flags/shiny/32/${dashed}.png`;
}
