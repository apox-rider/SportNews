import type { Route } from "./+types/index";
import { Link } from "react-router";
import {
  getLiveScores,
  getMatchStats,
  isMatchLive,
  matchKickOff,
  matchStatusLabel,
  statLabel,
} from "~/api/isports/isports";
import PageContainer from "~/components/ui/PageContainer";
import EmptyState from "~/components/ui/EmptyState";

export const meta: Route.MetaFunction = ({ loaderData }) => [
  {
    title: loaderData?.match
      ? `${loaderData.match.homeName} vs ${loaderData.match.awayName} — SportPesa News`
      : "Match — SportPesa News",
  },
];

function StatBar({
  label,
  home,
  away,
}: {
  label: string;
  home: string;
  away: string;
}) {
  const homeNum = Number.parseFloat(home) || 0;
  const awayNum = Number.parseFloat(away) || 0;
  const total = homeNum + awayNum;
  const homePct = total > 0 ? (homeNum / total) * 100 : 50;

  return (
    <div className="py-3">
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <div className="flex items-center gap-3">
        <span className="w-10 text-right text-sm font-bold text-slate-800">
          {home}
        </span>
        <div className="flex h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full bg-emerald-600"
            style={{ width: `${homePct}%` }}
          />
          <div className="h-full flex-1 bg-rose-500" />
        </div>
        <span className="w-10 text-sm font-bold text-slate-800">{away}</span>
      </div>
    </div>
  );
}

export async function loader({ params }: Route.LoaderArgs) {
  const [stats, live] = await Promise.all([
    getMatchStats(params.matchId),
    getLiveScores(),
  ]);

  const match = live.find((m) => m.matchId === params.matchId);
  return { match, stats };
}

export default function MatchDetail({ loaderData }: Route.ComponentProps) {
  const { match, stats } = loaderData;

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {match ? (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
                {match.leagueName}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
                <span className="text-lg font-bold sm:text-xl">
                  {match.homeName}
                </span>
                <span className="text-3xl font-extrabold sm:text-4xl">
                  {match.homeScore} – {match.awayScore}
                </span>
                <span className="text-lg font-bold sm:text-xl">
                  {match.awayName}
                </span>
              </div>
              <p className="mt-3 text-center text-sm text-emerald-100">
                {isMatchLive(match) ? "Live now" : matchStatusLabel(match.status)}
                {" · "}
                {matchKickOff(match).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {match.location ? ` · ${match.location}` : ""}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
                Match details
              </h1>
              <p className="mt-2 text-emerald-100/90">
                Match not found in the current live feed.
              </p>
            </>
          )}
        </div>
      </section>

      <PageContainer>
        {stats.length > 0 ? (
          <section>
            <h2 className="mb-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Match stats
            </h2>
            <p className="mb-4 flex items-center gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                Home
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                Away
              </span>
            </p>
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white px-5">
              {stats.map((stat) => (
                <StatBar
                  key={stat.type}
                  label={statLabel(stat.type) ?? `Stat ${stat.type}`}
                  home={stat.home}
                  away={stat.away}
                />
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Only stats recognised by SportPesa are shown.
            </p>
            <Link
              to="/football"
              className="mt-6 inline-block text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              ← Back to football
            </Link>
          </section>
        ) : (
          <>
            <EmptyState
              title="No stats available"
              message="This match has no detailed statistics yet."
            />
            <div className="mt-6">
              <Link
                to="/football"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                ← Back to football
              </Link>
            </div>
          </>
        )}
      </PageContainer>
    </div>
  );
}
