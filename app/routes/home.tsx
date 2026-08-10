import type { Route } from "./+types/home";
import {
  getLeague,
  getLeagues,
  getLeagueNextEvents,
  getLeaguePastEvents,
  safe,
  safeArr,
} from "../lib/sportsdb";
import LeagueCard from "../components/LeagueCard";
import EventSection, { isFinished } from "../components/EventSection";
import { SectionHeader } from "../components/SectionHeader";
import PageContainer from "../components/PageContainer";
import CardGrid from "../components/CardGrid";
import EmptyState from "../components/EmptyState";

export const meta: Route.MetaFunction = () => [
  { title: "SportPesa News — Sports News, Leagues & Results" },
  {
    name: "description",
    content: "Browse leagues, teams, players and match results powered by TheSportsDB.",
  },
];

export async function loader() {
  const leagues = await safeArr(getLeagues());

  const featuredIds = leagues.slice(0, 4).map((l) => l.idLeague);
  const primaryId = featuredIds[0] ?? "4328";

  const featured = (
    await Promise.all(featuredIds.map((id) => safe(getLeague(id), undefined)))
  ).filter((l): l is NonNullable<typeof l> => Boolean(l));

  const [nextEvents, pastEvents] = await Promise.all([
    safeArr(getLeagueNextEvents(primaryId)),
    safeArr(getLeaguePastEvents(primaryId)),
  ]);

  return { featured, nextEvents, pastEvents };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { featured, nextEvents, pastEvents } = loaderData;

  const latestResults = pastEvents.filter(isFinished).slice(0, 3);
  const upcoming = nextEvents.filter((e) => !isFinished(e)).slice(0, 3);

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
         
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            All the sports news, leagues & results in one place.
          </h1>
          <p className="mt-4 max-w-xl text-base text-emerald-50 sm:text-lg">
            Explore competitions, teams and players from around the world —
            powered by TheSportsDB API.
          </p>
        </div>
      </section>

      <PageContainer>
        {featured.length > 0 && (
          <section className="mb-14">
            <SectionHeader title="Featured leagues" href="/leagues" />
            <CardGrid cols={4}>
              {featured.map((league) => (
                <LeagueCard
                  key={league.idLeague}
                  id={league.idLeague}
                  name={league.strLeague}
                  sport={league.strSport}
                  badge={league.strBadge}
                />
              ))}
            </CardGrid>
          </section>
        )}

        {(upcoming.length > 0 || latestResults.length > 0) && (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {upcoming.length > 0 && (
              <EventSection title="Upcoming matches" events={upcoming} showLeague />
            )}
            {latestResults.length > 0 && (
              <EventSection title="Latest results" events={latestResults} showLeague />
            )}
          </div>
        )}

        {featured.length === 0 && nextEvents.length === 0 && (
          <EmptyState
            title="No data loaded"
            message="Try refreshing or check back later."
          />
        )}
      </PageContainer>
    </div>
  );
}
