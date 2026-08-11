import type { Route } from "./+types/index";
import { Link } from "react-router";
import {
  getLiveScores,
  getSchedule,
  isMatchFinished,
  isMatchLive,
  isMatchUpcoming,
  matchKickOff,
  matchStatusLabel,
  type FootballMatch,
} from "~/api/isports/isports";
import PageContainer from "~/components/ui/PageContainer";
import EmptyState from "~/components/ui/EmptyState";

export const meta: Route.MetaFunction = () => [
  { title: "Football — Live Scores & Fixtures — SportNews" },
  {
    name: "description",
    content: "Live football scores, results and fixtures powered by iSportsAPI.",
  },
];

import { EPL_LEAGUE_ID } from "~/constants";

function formatTime(date: Date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MatchRow({ match }: { match: FootballMatch }) {
  return (
    <Link
      to={`/football/${match.matchId}`}
      className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-emerald-300 hover:bg-emerald-50/40"
    >
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <span className="truncate text-sm font-semibold text-slate-800">
          {match.homeName}
        </span>
        <span
          className={`shrink-0 rounded-md px-2 py-0.5 text-sm font-extrabold ${
            isMatchLive(match)
              ? "bg-emerald-600 text-white"
              : "text-slate-900"
          }`}
        >
          {match.homeScore} – {match.awayScore}
        </span>
        <span className="truncate text-right text-sm font-semibold text-slate-800">
          {match.awayName}
        </span>
      </div>
      <div className="hidden shrink-0 flex-col items-end gap-0.5 text-right sm:flex">
        <span className="text-xs text-slate-500">{formatTime(matchKickOff(match))}</span>
        {isMatchLive(match) && (
          <span className="text-xs font-semibold text-emerald-600">
            Live
            {match.homeRed + match.awayRed > 0 &&
              ` · ${match.homeRed + match.awayRed} red`}
            {match.homeYellow + match.awayYellow > 0 &&
              ` · ${match.homeYellow + match.awayYellow} yellow`}
            {match.homeCorner + match.awayCorner > 0 &&
              ` · ${match.homeCorner + match.awayCorner} corners`}
          </span>
        )}
        {isMatchFinished(match) && (
          <span className="text-xs text-slate-400">
            {matchStatusLabel(match.status)}
          </span>
        )}
      </div>
    </Link>
  );
}

function LeagueGroup({
  leagueName,
  leagueColor,
  matches,
}: {
  leagueName: string;
  leagueColor?: string;
  matches: FootballMatch[];
}) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
        {leagueColor && (
          <span
            className="inline-block h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: leagueColor }}
          />
        )}
        {leagueName}
      </h3>
      <div className="space-y-2">
        {matches.map((m) => (
          <MatchRow key={m.matchId} match={m} />
        ))}
      </div>
    </div>
  );
}

export async function loader() {
  const [live, schedule] = await Promise.all([
    getLiveScores(),
    getSchedule(EPL_LEAGUE_ID),
  ]);

  const liveNow = live.filter(isMatchLive);
  const finished = live.filter(isMatchFinished);
  const fixtures = schedule
    .filter(isMatchUpcoming)
    .sort((a, b) => a.matchTime - b.matchTime)
    .slice(0, 20);

  const liveByLeague = new Map<string, FootballMatch[]>();
  for (const match of liveNow) {
    const list = liveByLeague.get(match.leagueName) ?? [];
    list.push(match);
    liveByLeague.set(match.leagueName, list);
  }

  const finishedByLeague = new Map<string, FootballMatch[]>();
  for (const match of finished) {
    const list = finishedByLeague.get(match.leagueName) ?? [];
    list.push(match);
    finishedByLeague.set(match.leagueName, list);
  }

  return { liveByLeague, finishedByLeague, fixtures };
}

export default function Football({ loaderData }: Route.ComponentProps) {
  const { liveByLeague, finishedByLeague, fixtures } = loaderData;

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
            Football · iSportsAPI
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Live scores & fixtures
          </h1>
          <p className="mt-3 max-w-xl text-emerald-50/90">
            Scores from {liveByLeague.size} leagues today, plus English Premier
            League fixtures.
          </p>
        </div>
      </section>

      <PageContainer>
        {liveByLeague.size > 0 && (
          <section className="mb-14">
            <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Live now
              <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                LIVE
              </span>
            </h2>
            <div className="space-y-8">
              {[...liveByLeague.entries()].map(([league, matches]) => (
                <LeagueGroup
                  key={league}
                  leagueName={league}
                  leagueColor={matches[0]?.leagueColor}
                  matches={matches}
                />
              ))}
            </div>
          </section>
        )}

        {fixtures.length > 0 && (
          <section className="mb-14">
            <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              English Premier League — fixtures
            </h2>
            <div className="space-y-2">
              {fixtures.map((m) => (
                <MatchRow key={m.matchId} match={m} />
              ))}
            </div>
          </section>
        )}

        {finishedByLeague.size > 0 && (
          <section className="mb-14">
            <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Finished today
            </h2>
            <div className="space-y-8">
              {[...finishedByLeague.entries()]
                .slice(0, 6)
                .map(([league, matches]) => (
                  <LeagueGroup
                    key={league}
                    leagueName={league}
                    leagueColor={matches[0]?.leagueColor}
                    matches={matches.slice(0, 10)}
                  />
                ))}
            </div>
          </section>
        )}

        {liveByLeague.size === 0 &&
          finishedByLeague.size === 0 &&
          fixtures.length === 0 && (
            <EmptyState
              title="No football data"
              message="The live feed is temporarily unavailable. Check back shortly."
            />
          )}
      </PageContainer>
    </div>
  );
}
