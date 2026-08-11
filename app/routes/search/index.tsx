import type { Route } from "./+types/index";
import {
  searchEventsByName,
  searchPlayersByName,
  searchTeamsByName,
  safeArr,
} from "~/api/sportsdb/sportsdb";
import SearchBar from "~/components/ui/SearchBar";
import PageContainer from "~/components/ui/PageContainer";
import CardGrid from "~/components/ui/CardGrid";
import TeamCard from "~/components/TeamCard";
import PlayerCard from "~/components/PlayerCard";
import EventCard from "~/components/EventCard";
import EmptyState from "~/components/ui/EmptyState";

export const meta: Route.MetaFunction = ({ loaderData }) => [
  { title: loaderData?.query ? `Search: ${loaderData.query} — SportNews` : "Search — SportNews" },
];

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();

  if (!query) {
    return { query: null, teams: [], players: [], events: [] };
  }

  const [teams, players, events] = await Promise.all([
    safeArr(searchTeamsByName(query)),
    safeArr(searchPlayersByName(query)),
    safeArr(searchEventsByName(query)),
  ]);

  return { query, teams, players, events };
}

function ResultBlock({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  if (count === 0) return null;
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">
        {title} <span className="text-sm font-medium text-slate-400">({count})</span>
      </h2>
      {children}
    </section>
  );
}

export default function Search({ loaderData }: Route.ComponentProps) {
  const { query, teams, players, events } = loaderData;

  return (
    <PageContainer>
      <div className="mx-auto mb-10 max-w-xl">
        <h1 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-slate-900">
          Search
        </h1>
        <SearchBar defaultValue={query ?? ""} size="lg" />
      </div>

      {query && (
        <ResultBlock title="Teams" count={teams.length}>
          <CardGrid cols={4}>
            {teams.map((team) => (
              <TeamCard
                key={team.idTeam}
                id={team.idTeam}
                name={team.strTeam}
                badge={team.strBadge}
                league={team.strLeague}
              />
            ))}
          </CardGrid>
        </ResultBlock>
      )}

      {query && (
        <ResultBlock title="Players" count={players.length}>
          <CardGrid cols={4}>
            {players.map((player) => (
              <PlayerCard
                key={player.idPlayer}
                id={player.idPlayer}
                name={player.strPlayer}
                thumb={player.strThumb || player.strCutout}
                position={player.strPosition}
                team={player.strTeam}
                nationality={player.strNationality}
              />
            ))}
          </CardGrid>
        </ResultBlock>
      )}

      {query && (
        <ResultBlock title="Events" count={events.length}>
          <CardGrid cols={2}>
            {events.map((event) => (
              <EventCard key={event.idEvent} event={event} showLeague />
            ))}
          </CardGrid>
        </ResultBlock>
      )}

      {query && teams.length === 0 && players.length === 0 && events.length === 0 && (
        <EmptyState
          title={`No results for "${query}"`}
          message="Try a different name, or check your spelling."
        />
      )}

      {!query && (
        <EmptyState
          title="Search the sports world"
          message="Find a team, a player, or a match by name."
        />
      )}
    </PageContainer>
  );
}
