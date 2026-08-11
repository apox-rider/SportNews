import type {
  League,
  LeagueSummary,
  Player,
  Season,
  SportEvent,
  StandingRow,
  Team,
} from "./sportsdb-schema";
import { getContinentOf } from "~/utils/continents";
import { CACHE_TTL_MS, FETCH_TIMEOUT_MS } from "~/constants";

export const API_KEY = process.env.SPORTSDB_API_KEY ?? "3";
export const BASE_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

const cache = new Map<string, { value: unknown; expires: number }>();

function clean<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

async function fetchJson(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      headers: { accept: "application/json" },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function getJson<T>(endpoint: string): Promise<T> {
  const cached = cache.get(endpoint);
  if (cached && cached.expires > Date.now()) {
    return cached.value as T;
  }

  const res = await fetchJson(`${BASE_URL}/${endpoint}`);

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get("retry-after")) || 1;
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    const retry = await fetchJson(`${BASE_URL}/${endpoint}`);
    if (!retry.ok) {
      throw new Error(`SportsDB request failed (${retry.status})`);
    }
    const value = (await retry.json()) as T;
    cache.set(endpoint, { value, expires: Date.now() + CACHE_TTL_MS });
    return value;
  }

  if (!res.ok) {
    throw new Error(`SportsDB request failed (${res.status})`);
  }
  const value = (await res.json()) as T;
  cache.set(endpoint, { value, expires: Date.now() + CACHE_TTL_MS });
  return value;
}

export async function getLeagues(): Promise<LeagueSummary[]> {
  const data = await getJson<{ leagues: LeagueSummary[] | null }>(
    "all_leagues.php",
  );
  return clean(data.leagues);
}

export async function getEnrichedLeagues(): Promise<LeagueSummary[]> {
  const leagues = await getLeagues();

  const enriched: Array<LeagueSummary | null> = await Promise.all(
    leagues.map(async (summary) => {
      const detail = await safe(getLeague(summary.idLeague), undefined);
      if (!detail) return null;
      return {
        ...detail,
        ...summary,
        continent: getContinentOf(detail.strCountry),
      };
    }),
  );

  return enriched.filter((l): l is LeagueSummary => l !== null);
}

export async function getLeague(id: string): Promise<League | undefined> {
  const data = await getJson<{ leagues: League[] | null }>(
    `lookupleague.php?id=${encodeURIComponent(id)}`,
  );
  return clean(data.leagues)[0];
}

export async function getLeagueTeams(
  id: string,
): Promise<Team[]> {
  const data = await getJson<{ teams: Team[] | null }>(
    `lookup_all_teams.php?id=${encodeURIComponent(id)}`,
  );
  return clean(data.teams);
}

export async function searchTeamsByLeague(
  leagueName: string,
): Promise<Team[]> {
  const data = await getJson<{ teams: Team[] | null }>(
    `search_all_teams.php?l=${encodeURIComponent(leagueName)}`,
  );
  return clean(data.teams);
}

export async function searchTeamsBySportCountry(
  sport: string,
  country: string,
): Promise<Team[]> {
  const params = new URLSearchParams({ s: sport, c: country });
  const data = await getJson<{ teams: Team[] | null }>(
    `search_all_teams.php?${params}`,
  );
  return clean(data.teams);
}

export async function searchTeamsByName(name: string): Promise<Team[]> {
  const data = await getJson<{ teams: Team[] | null }>(
    `searchteams.php?t=${encodeURIComponent(name)}`,
  );
  return clean(data.teams);
}

export async function getTeam(id: string): Promise<Team | undefined> {
  const data = await getJson<{ teams: Team[] | null }>(
    `lookupteam.php?id=${encodeURIComponent(id)}`,
  );
  return clean(data.teams)[0];
}

export async function getTeamPlayers(id: string): Promise<Player[]> {
  const data = await getJson<{ player: Player[] | null }>(
    `lookup_all_players.php?id=${encodeURIComponent(id)}`,
  );
  return clean(data.player);
}

export async function getTeamNextEvents(id: string): Promise<SportEvent[]> {
  const data = await getJson<{ events: SportEvent[] | null }>(
    `eventsnext.php?id=${encodeURIComponent(id)}`,
  );
  return clean(data.events);
}

export async function getTeamLastEvents(id: string): Promise<SportEvent[]> {
  const data = await getJson<{ results: SportEvent[] | null }>(
    `eventslast.php?id=${encodeURIComponent(id)}`,
  );
  return clean(data.results);
}

export async function searchEventsByName(
  name: string,
  season?: string,
): Promise<SportEvent[]> {
  const params = new URLSearchParams({ e: name });
  if (season) params.set("s", season);
  const data = await getJson<{ event: SportEvent[] | null }>(
    `searchevents.php?${params}`,
  );
  return clean(data.event);
}

export async function getLeagueEvents(
  leagueId: string,
  season: string,
): Promise<SportEvent[]> {
  const params = new URLSearchParams({ id: leagueId, s: season });
  const data = await getJson<{ events: SportEvent[] | null }>(
    `eventsseason.php?${params}`,
  );
  return clean(data.events);
}

export async function getLeagueNextEvents(
  leagueId: string,
): Promise<SportEvent[]> {
  const data = await getJson<{ events: SportEvent[] | null }>(
    `eventsnextleague.php?id=${encodeURIComponent(leagueId)}`,
  );
  return clean(data.events);
}

export async function getLeaguePastEvents(
  leagueId: string,
): Promise<SportEvent[]> {
  const data = await getJson<{ events: SportEvent[] | null }>(
    `eventspastleague.php?id=${encodeURIComponent(leagueId)}`,
  );
  return clean(data.events);
}

export async function getLeagueStandings(
  leagueId: string,
  season: string,
): Promise<StandingRow[]> {
  const params = new URLSearchParams({ l: leagueId, s: season });
  const data = await getJson<{ table: StandingRow[] | null }>(
    `lookuptable.php?${params}`,
  );
  return clean(data.table);
}

export async function getLeagueSeasons(
  leagueId: string,
): Promise<Season[]> {
  const data = await getJson<{ seasons: Season[] | null }>(
    `search_all_seasons.php?id=${encodeURIComponent(leagueId)}`,
  );
  return clean(data.seasons);
}

export async function searchPlayersByName(name: string): Promise<Player[]> {
  const data = await getJson<{ player: Player[] | null }>(
    `searchplayers.php?p=${encodeURIComponent(name)}`,
  );
  return clean(data.player);
}

export async function getPlayer(id: string): Promise<Player | undefined> {
  const data = await getJson<{ players: Player[] | null }>(
    `lookupplayer.php?id=${encodeURIComponent(id)}`,
  );
  return clean(data.players)[0];
}

export async function getEvent(id: string): Promise<SportEvent | undefined> {
  const data = await getJson<{ events: SportEvent[] | null }>(
    `lookupevent.php?id=${encodeURIComponent(id)}`,
  );
  return clean(data.events)[0];
}

export async function rawGet<T>(
  endpoint: string,
  params?: Record<string, string>,
): Promise<T> {
  const qs = new URLSearchParams(params ?? {});
  const query = qs.toString();
  return getJson<T>(`${endpoint}${query ? `?${query}` : ""}`);
}

export async function safe<T>(
  promise: Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export async function safeArr<T>(
  promise: Promise<T[]>,
): Promise<T[]> {
  return safe(promise, []);
}
