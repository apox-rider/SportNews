import { Link } from "react-router";
import type { Route } from "./+types/leagues";
import { getLeagues, safeArr } from "../lib/sportsdb";
import PageContainer from "../components/PageContainer";
import CardGrid from "../components/CardGrid";
import LeagueCard from "../components/LeagueCard";
import EmptyState from "../components/EmptyState";

export const meta: Route.MetaFunction = () => [
  { title: "Leagues — SportPesa News" },
];

export async function loader() {
  const leagues = await safeArr(getLeagues());
  return { leagues };
}

export default function Leagues({ loaderData }: Route.ComponentProps) {
  const { leagues } = loaderData;

  const sports = Array.from(new Set(leagues.map((l) => l.strSport).filter(Boolean))).sort();

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Leagues
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Browse competitions across {sports.length || "several"} sports.
        </p>
      </div>

      {sports.length > 0 && (
        <nav className="mb-8 flex flex-wrap gap-2">
          <Link
            to="/leagues"
            className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-emerald-400 hover:text-emerald-700"
          >
            All
          </Link>
          {sports.map((sport) => (
            <Link
              key={sport}
              to={`/leagues?sport=${encodeURIComponent(sport)}`}
              className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-emerald-400 hover:text-emerald-700"
            >
              {sport}
            </Link>
          ))}
        </nav>
      )}

      {leagues.length > 0 ? (
        <CardGrid cols={4}>
          {leagues.map((league) => (
            <LeagueCard
              key={league.idLeague}
              id={league.idLeague}
              name={league.strLeague}
              sport={league.strSport}
            />
          ))}
        </CardGrid>
      ) : (
        <EmptyState title="No leagues found" />
      )}
    </PageContainer>
  );
}
