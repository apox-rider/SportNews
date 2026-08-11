import { fetchJson } from "~/utils/fetcher";
import { WWE_BASE_URL } from "~/constants";
import type { WweTalent } from "./wwe-schema";

export type { WweTalent } from "./wwe-schema";

export function talentUrl(talent: WweTalent): string {
  return `${WWE_BASE_URL}${talent.url}`;
}

export async function getWweTalent(): Promise<WweTalent[]> {
  const talents = await fetchJson<WweTalent[]>(
    "https://www.wwe.com/superstar/talent",
  );
  return talents.sort((a, b) =>
    a.value.localeCompare(b.value, "en", { sensitivity: "base" }),
  );
}
