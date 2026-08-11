import { fetchJson, safeArr } from "~/utils/fetcher";
import { ISPORTS_API_KEY, ISPORTS_BASE_URL } from "~/constants";
import type { FootballMatch, FootballStat } from "./isports-schema";

export type { FootballMatch, FootballStat } from "./isports-schema";

export function isMatchLive(match: FootballMatch): boolean {
  return match.status === 1;
}

export function isMatchFinished(match: FootballMatch): boolean {
  return match.status === 3;
}

export function isMatchUpcoming(match: FootballMatch): boolean {
  return match.status === 0;
}

export function matchStatusLabel(status: number): string {
  switch (status) {
    case 0:
      return "Upcoming";
    case 1:
      return "Live";
    case 3:
      return "Full time";
    case -1:
      return "Interrupted";
    case -10:
      return "Delayed";
    case -11:
      return "Postponed";
    case -14:
      return "Cancelled";
    default:
      return `Status ${status}`;
  }
}

export function matchKickOff(match: FootballMatch): Date {
  return new Date(match.matchTime * 1000);
}

const STAT_LABELS: Record<number, string> = {
  3: "Total shots",
  4: "Shots on target",
  5: "Shots off target",
  6: "Blocked shots",
  8: "Corner kicks",
  9: "Yellow cards",
  16: "Saves",
  14: "Possession",
  19: "Fouls",
  21: "Free kicks",
  24: "Offsides",
  41: "Passes",
  42: "Pass accuracy",
};

const STAT_ORDER: Record<number, number> = {
  14: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
  9: 6,
  16: 7,
  8: 8,
  19: 9,
  21: 10,
  24: 11,
  41: 12,
  42: 13,
};

export function statLabel(type: number): string | null {
  return STAT_LABELS[type] ?? null;
}

export function sortStats(stats: FootballStat[]): FootballStat[] {
  return stats
    .filter((s) => STAT_LABELS[s.type] != null)
    .sort((a, b) => (STAT_ORDER[a.type] ?? 99) - (STAT_ORDER[b.type] ?? 99));
}

interface Wrapped<T> {
  code?: number;
  message?: string;
  data: T;
}

export async function getLiveScores(): Promise<FootballMatch[]> {
  const res = await fetchJson<Wrapped<FootballMatch[] | null>>(
    `${ISPORTS_BASE_URL}/livescores?api_key=${ISPORTS_API_KEY}`,
  );
  return res.data ?? [];
}

export async function getSchedule(
  leagueId: string,
): Promise<FootballMatch[]> {
  const res = await fetchJson<Wrapped<FootballMatch[] | null>>(
    `${ISPORTS_BASE_URL}/schedule/basic?api_key=${ISPORTS_API_KEY}&leagueId=${leagueId}`,
  );
  return res.data ?? [];
}

export async function getMatchStats(
  matchId: string,
): Promise<FootballStat[]> {
  const res = await fetchJson<
    Wrapped<Array<{ matchId: string; stats: FootballStat[] }> | null>
  >(`${ISPORTS_BASE_URL}/stats?api_key=${ISPORTS_API_KEY}&matchId=${matchId}`);
  const stats = res.data?.[0]?.stats ?? [];
  return sortStats(stats);
}
