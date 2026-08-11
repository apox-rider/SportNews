import { Link, useSearchParams } from "react-router";
import type { Route } from "./+types/index";
import {
  CONTINENTS,
  getContinentById,
  getFlagUrl,
  type ContinentId,
} from "~/utils/continents";
import { getEnrichedLeagues, safeArr } from "~/api/sportsdb/sportsdb";
import type { LeagueSummary } from "~/api/sportsdb/sportsdb-schema";
import PageContainer from "~/components/ui/PageContainer";
import CardGrid from "~/components/ui/CardGrid";
import LeagueCard from "~/components/LeagueCard";
import EmptyState from "~/components/ui/EmptyState";

export const meta: Route.MetaFunction = () => [
  { title: "Worldwide Leagues — SportPesa News" },
  {
    name: "description",
    content:
      "Browse leagues from every continent — Europe, South America, North America, Africa, Asia and Oceania.",
  },
];

export async function loader() {
  const leagues = await safeArr(getEnrichedLeagues());
  return { leagues };
}

function continentLabel(id: ContinentId): string {
  return id === "unknown" ? "Other" : getContinentById(id).name;
}

export default function Leagues({ loaderData }: Route.ComponentProps) {
  const { leagues } = loaderData;
  const [searchParams] = useSearchParams();
  const sport = searchParams.get("sport");

  const sports = Array.from(
    new Set(leagues.map((l) => l.strSport).filter(Boolean)),
  ).sort();

  const filtered = sport
    ? leagues.filter((l) => l.strSport === sport)
    : leagues;

  const grouped = new Map<ContinentId, LeagueSummary[]>();
  for (const league of filtered) {
    const id: ContinentId = league.continent ?? "unknown";
    grouped.set(id, [...(grouped.get(id) ?? []), league]);
  }

  const allCounts = new Map<ContinentId, number>();
  for (const league of leagues) {
    const id: ContinentId = league.continent ?? "unknown";
    allCounts.set(id, (allCounts.get(id) ?? 0) + 1);
  }

  const filteredCounts = new Map<ContinentId, number>();
  for (const [id, list] of grouped) {
    filteredCounts.set(id, list.length);
  }

  const continentsCovered = CONTINENTS.filter(
    (c) => (allCounts.get(c.id) ?? 0) > 0,
  ).length;

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <PageContainer>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Worldwide Leagues
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          {leagues.length > 0
            ? `Browse ${leagues.length} competitions across ${continentsCovered} of 6 continents — from the giants of Europe to rising powers around the globe.`
            : "Browse competitions from across the world."}
        </p>
      </header>

      <nav
        aria-label="Continents"
        className="sticky top-16 z-30 -mx-4 mb-6 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Region
          </span>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="rounded-full border border-emerald-400 bg-emerald-50 px-3.5 py-1.5 text-sm font-medium text-emerald-700"
          >
            All
          </button>
          {CONTINENTS.filter((c) => (filteredCounts.get(c.id) ?? 0) > 0).map(
            (continent) => (
              <button
                key={continent.id}
                type="button"
                onClick={() => scrollTo(`continent-${continent.id}`)}
                className="rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
              >
                {continent.name}
                <span className="ml-1.5 text-xs font-semibold text-slate-400">
                  {filteredCounts.get(continent.id) ?? 0}
                </span>
              </button>
            ),
          )}
        </div>
      </nav>

      {sports.length > 0 && (
        <nav className="mb-10 flex flex-wrap gap-2" aria-label="Sports">
          <Link
            to="/leagues"
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              !sport
                ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                : "border-slate-300 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-700"
            }`}
          >
            All sports
          </Link>
          {sports.map((name) => (
            <Link
              key={name}
              to={`/leagues?sport=${encodeURIComponent(name)}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                sport === name
                  ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                  : "border-slate-300 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-700"
              }`}
            >
              {name}
            </Link>
          ))}
        </nav>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title="No leagues found"
          message="Try a different sport, or check back later."
        />
      ) : (
        <div className="space-y-14">
          {CONTINENTS.map((continent) => {
            const list = grouped.get(continent.id) ?? [];
            if (list.length === 0) return null;
            return (
              <section
                key={continent.id}
                id={`continent-${continent.id}`}
                className="scroll-mt-36"
              >
                <header className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900">
                      {continent.name}
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        {list.length}
                      </span>
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {continent.tagline}
                    </p>
                  </div>
                </header>

                <CardGrid cols={4}>
                  {list.map((league) => (
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
              </section>
            );
          })}

          {(grouped.get("unknown") ?? []).length > 0 && (
            <section id="continent-other" className="scroll-mt-36">
              <header className="mb-5">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Other
                </h2>
              </header>
              <CardGrid cols={4}>
                {(grouped.get("unknown") ?? []).map((league) => (
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
        </div>
      )}
    </PageContainer>
  );
}
