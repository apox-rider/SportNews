import type { Route } from "./+types/index";
import { Link } from "react-router";
import {
  getEnrichedLeagues,
  getLeagueNextEvents,
  getLeaguePastEvents,
  safeArr,
} from "~/api/sportsdb/sportsdb";
import { getContinentById, getFlagUrl, type ContinentId } from "~/utils/continents";
import LeagueCard from "~/components/LeagueCard";
import EventSection, { isFinished } from "~/components/EventSection";
import { SectionHeader } from "~/components/ui/SectionHeader";
import PageContainer from "~/components/ui/PageContainer";
import CardGrid from "~/components/ui/CardGrid";
import EmptyState from "~/components/ui/EmptyState";

export const meta: Route.MetaFunction = () => [
  { title: "SportPesa News — Sports News, Leagues & Results" },
  {
    name: "description",
    content: "Browse leagues, teams, players and match results powered by TheSportsDB.",
  },
];

function continentLabel(id: ContinentId): string {
  return id === "unknown" ? "Other" : getContinentById(id).name;
}

const quickLinks = [
  {
    to: "/leagues",
    title: "Explore leagues",
    description: "Competitions from every continent — fixtures, tables and club pages.",
  },
  {
    to: "/football",
    title: "Football live",
    description: "Live scores, results and Premier League fixtures as they happen.",
  },
  {
    to: "/f1",
    title: "Formula 1",
    description: "Latest sessions, drivers and top speeds from the grid.",
  },
  {
    to: "/wrestling",
    title: "WWE roster",
    description: "Every superstar from legends to current champions.",
  },
];

export async function loader() {
  const leagues = await safeArr(getEnrichedLeagues());

  const featured = leagues.slice(0, 8);
  const primaryId = leagues[0]?.idLeague ?? "4328";

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
      <section className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            All the sports news, leagues & results in one place.
          </h1>
          <p className="mt-4 max-w-xl text-base text-emerald-50 sm:text-lg">
            Explore competitions, teams and players from around the world —
            powered by TheSportsDB API.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/leagues"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-50"
            >
              Browse leagues
            </Link>
            <Link
              to="/search"
              className="rounded-xl border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Search teams & players
            </Link>
          </div>
        </div>
      </section>

      <PageContainer>
        <CardGrid cols={4}>
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              to={link.to}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-300 hover:shadow-sm"
            >
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700">
                {link.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{link.description}</p>
            </Link>
          ))}
        </CardGrid>

        <section className="mt-14">
          <SectionHeader title="Around the world" href="/leagues" />
          {featured.length > 0 ? (
            <CardGrid cols={4}>
              {featured.map((league) => (
                <LeagueCard
                  key={league.idLeague}
                  id={league.idLeague}
                  name={league.strLeague}
                  sport={league.strSport}
                  badge={league.strBadge}
                  country={league.strCountry}
                  flagUrl={getFlagUrl(league.strCountry)}
                  continent={continentLabel(league.continent ?? "unknown")}
                  division={league.intDivision}
                  currentSeason={league.strCurrentSeason}
                  formedYear={league.intFormedYear}
                  gender={league.strGender}
                />
              ))}
            </CardGrid>
          ) : (
            <Link
              to="/leagues"
              className="block rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:border-emerald-300 hover:bg-emerald-50/50"
            >
              <h3 className="text-lg font-semibold text-slate-800">
                Leagues are loading
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                The sports feed is warming up. Head to the leagues page to see
                every competition we cover.
              </p>
            </Link>
          )}
        </section>

        {(upcoming.length > 0 || latestResults.length > 0) && (
          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2">
            {upcoming.length > 0 && (
              <EventSection title="Upcoming matches" events={upcoming} showLeague />
            )}
            {latestResults.length > 0 && (
              <EventSection title="Latest results" events={latestResults} showLeague />
            )}
          </div>
        )}

        {featured.length === 0 && nextEvents.length === 0 && (
          <div className="mt-14">
            <EmptyState
              title="Nothing to show yet"
              message="The live feed is temporarily unavailable. Try the leagues page or search instead."
            />
          </div>
        )}
      </PageContainer>
    </div>
  );
}
