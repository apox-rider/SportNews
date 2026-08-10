import type { Route } from "./+types/search.suggestions";
import {
  safeArr,
  searchEventsByName,
  searchPlayersByName,
  searchTeamsByName,
} from "../lib/sportsdb";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() ?? "";

  if (query.length === 0) {
    return { query, teams: [], players: [], events: [] };
  }

  const [teams, players, events] = await Promise.all([
    safeArr(searchTeamsByName(query)),
    safeArr(searchPlayersByName(query)),
    safeArr(searchEventsByName(query)),
  ]);

  return {
    query,
    teams: teams.slice(0, 3).map((t) => ({
      idTeam: t.idTeam,
      strTeam: t.strTeam,
      strLeague: t.strLeague,
      strBadge: t.strBadge,
    })),
    players: players.slice(0, 3).map((p) => ({
      idPlayer: p.idPlayer,
      strPlayer: p.strPlayer,
      strTeam: p.strTeam,
      strPosition: p.strPosition,
      strThumb: p.strThumb,
      strCutout: p.strCutout,
    })),
    events: events.slice(0, 3).map((e) => ({
      idEvent: e.idEvent,
      strEvent: e.strEvent,
      strHomeTeam: e.strHomeTeam,
      strAwayTeam: e.strAwayTeam,
      strThumb: e.strThumb,
    })),
  };
}
