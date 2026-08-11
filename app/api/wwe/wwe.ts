import { fetchJson, fetchHtml } from "~/utils/fetcher";
import { WWE_BASE_URL } from "~/constants";
import type { WweProfile, WweTalent } from "./wwe-schema";

export type { WweProfile, WweTalent } from "./wwe-schema";

export function talentUrl(talent: WweTalent): string {
  return `${WWE_BASE_URL}${talent.url}`;
}

export function talentSlug(talent: WweTalent): string {
  return talent.url.split("/").filter(Boolean).pop() ?? talent.url;
}

export async function getWweTalent(): Promise<WweTalent[]> {
  const talents = await fetchJson<WweTalent[]>(
    "https://www.wwe.com/superstar/talent",
  );
  return talents.sort((a, b) =>
    a.value.localeCompare(b.value, "en", { sensitivity: "base" }),
  );
}

export async function findWweTalent(slug: string): Promise<WweTalent | null> {
  const lower = slug.toLowerCase();
  const talents = await getWweTalent();
  return (
    talents.find((t) => talentSlug(t).toLowerCase() === lower) ?? null
  );
}

export async function getWweProfile(talentUrlPath: string): Promise<WweProfile> {
  const html = await fetchHtml(`${WWE_BASE_URL}${talentUrlPath}`);
  return parseWweProfile(html);
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/gi, "'")
    .replace(/&#0*39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&#x2019;/gi, "\u2019")
    .replace(/&eacute;/gi, "\u00e9")
    .replace(/&ndash;/gi, "\u2013")
    .replace(/&mdash;/gi, "\u2014");
}

function metaContent(html: string, property: string): string | null {
  const tag = html.match(new RegExp(`<meta[^>]*property="${property}"[^>]*>`));
  const content = tag?.[0].match(/content="([^"]*)"/)?.[1];
  return content ? decodeEntities(content).trim() : null;
}

function statBlock(html: string, key: string): string | null {
  const open = html.indexOf(`class="wwe-talent__stats-profile--${key}"`);
  if (open === -1) return null;
  const end = html.indexOf("</div>", open);
  const block = end === -1 ? html.slice(open) : html.slice(open, end);
  const value = block.match(/class="data-(?:big|small)"[^>]*>(.*?)</)?.[1];
  return value ? decodeEntities(value).trim() : null;
}

function careerHighlights(html: string): string[] {
  const open = html.indexOf('class="wwe-talent__stats-profile--highlights"');
  if (open === -1) return [];
  const end = html.indexOf("</div>", open);
  const block = end === -1 ? html.slice(open) : html.slice(open, end);
  const paragraph = block.match(/<p[^>]*>(.*?)<\/p>/s)?.[1];
  if (!paragraph) return [];
  return paragraph
    .split(/<br\s*\/?>/i)
    .map((line) =>
      decodeEntities(line.replace(/<[^>]+>/g, "").replace(/\s+/g, " ")).trim(),
    )
    .filter(Boolean);
}

function parseWweProfile(html: string): WweProfile {
  const weight = statBlock(html, "weight");
  return {
    name: metaContent(html, "og:title") ?? "",
    image: metaContent(html, "og:image"),
    tagline: tagline(html),
    height: statBlock(html, "height"),
    weight: weight ? `${weight} lbs` : null,
    hometown: statBlock(html, "hometown"),
    signatureMove: statBlock(html, "signature"),
    careerHighlights: careerHighlights(html),
  };
}

function tagline(html: string): string | null {
  const open = html.indexOf("wwe-talent__bio");
  if (open === -1) return null;
  const paragraph = html
    .slice(open)
    .match(/<p[^>]*>(.*?)<\/p>/s)?.[1];
  if (!paragraph) return null;
  const text = decodeEntities(
    paragraph.replace(/<[^>]+>/g, " ").replace(/\s+/g, " "),
  ).trim();
  return text || null;
}
