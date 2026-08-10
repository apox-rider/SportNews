import { useMemo, useState } from "react";
import type { Route } from "./+types/leagues.$id";
import {
  getLeague,
  getLeagueEvents,
  getLeagueSeasons,
  getLeagueStandings,
  getLeagueTeams,
  safe,
  safeArr,
} from "../lib/sportsdb";
import DetailHero from "../components/DetailHero";
import InfoGrid, { InfoItem } from "../components/InfoGrid";
import PageContainer from "../components/PageContainer";
import CardGrid from "../components/CardGrid";
import TeamCard from "../components/TeamCard";
import TabNav from "../components/TabNav";
import EventSection, { isFinished } from "../components/EventSection";
import EmptyState from "../components/EmptyState";

export const meta: Route.MetaFunction = ({ loaderData }) => [
  { title: loaderData?.league?.strLeague
      ? `${loaderData.league.strLeague} — SportPesa News`
      : "League — SportPesa News" },
];

export async function loader({ params, request }: Route.LoaderArgs) {
  const leagueId = params.id!;
  const url = new URL(request.url);
  const requestedSeason = url.searchParams.get("s") || undefined;

  const [league, seasons, teams] = await Promise.all([
    safe(getLeague(leagueId), undefined),
    safeArr(getLeagueSeasons(leagueId)),
    safeArr(getLeagueTeams(leagueId)),
  ]);

  const season = requestedSeason ?? league?.strCurrentSeason ?? seasons[0]?.strSeason;

  const [events, standings] = season
    ? await Promise.all([
        safeArr(getLeagueEvents(leagueId, season)),
        safeArr(getLeagueStandings(leagueId, season)),
      ])
    : [[], []];

  return { league, seasons, teams, season, events, standings };
}

const tabs = [
  { id: "matches", label: "Matches" },
  { id: "teams", label: "Teams" },
  { id: "standings", label: "Standings" },
  { id: "info", label: "About" },
];

export default function LeagueDetail({ loaderData }: Route.ComponentProps) {
  const { league, seasons, teams, season, events, standings } = loaderData;
  const [active, setActive] = useState("matches");

  const results = useMemo(() => events.filter(isFinished), [events]);
  const fixtures = useMemo(() => events.filter((e) => !isFinished(e)), [events]);

  if (!league) {
    return <PageContainer><EmptyState title="League not found" /></PageContainer>;
  }

  return (
    <div>
      <DetailHero
        badge={league.strBadge}
        banner={league.strFanart1 || league.strBanner}
        title={league.strLeague}
        subtitle={[league.strCountry, league.strGender, league.strSport]
          .filter(Boolean)
          .join(" · ")}
      >
        {season && (
          <form method="get" className="inline-flex items-center gap-2">
            <label htmlFor="season" className="text-xs font-semibold uppercase tracking-wide text-slate-300">
              Season
            </label>
            <select
              id="season"
              name="s"
              defaultValue={season}
              onChange={(e) => {
                const url = new URL(window.location.href);
                url.searchParams.set("s", e.target.value);
                window.location.href = url.toString();
              }}
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-white focus:border-emerald-400 focus:outline-none"
            >
              {seasons.map((s) => (
                <option key={s.idSeason ?? s.strSeason} value={s.strSeason ?? ""}>
                  {s.strSeason}
                </option>
              ))}
            </select>
          </form>
        )}
      </DetailHero>

      <PageContainer>
        <TabNav tabs={tabs} active={active} onChange={setActive} />

        {active === "matches" && (
          <div className="space-y-10">
            {fixtures.length > 0 && (
              <EventSection title="Fixtures" events={fixtures.slice(0, 24)} />
            )}
            <EventSection title="Results" events={results.slice(0, 24)} />
          </div>
        )}

        {active === "teams" && (
          teams.length > 0 ? (
            <CardGrid cols={4}>
              {teams.map((team) => (
                <TeamCard
                  key={team.idTeam}
                  id={team.idTeam}
                  name={team.strTeam}
                  badge={team.strBadge}
                />
              ))}
            </CardGrid>
          ) : (
            <EmptyState title="No teams found" />
          )
        )}

        {active === "standings" && (
          standings.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Team</th>
                    <th className="px-4 py-3 text-center">P</th>
                    <th className="px-4 py-3 text-center">W</th>
                    <th className="px-4 py-3 text-center">D</th>
                    <th className="px-4 py-3 text-center">L</th>
                    <th className="px-4 py-3 text-center">GD</th>
                    <th className="px-4 py-3 text-center">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {standings.map((row) => (
                    <tr key={row.idStanding ?? row.idTeam} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-400">{row.intRank}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{row.strTeam}</td>
                      <td className="px-4 py-3 text-center">{row.intPlayed}</td>
                      <td className="px-4 py-3 text-center">{row.intWin}</td>
                      <td className="px-4 py-3 text-center">{row.intDraw}</td>
                      <td className="px-4 py-3 text-center">{row.intLoss}</td>
                      <td className="px-4 py-3 text-center">{row.intGoalDifference}</td>
                      <td className="px-4 py-3 text-center font-bold text-emerald-700">{row.intPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No standings" message="Standings are unavailable for this league or season." />
          )
        )}

        {active === "info" && (
          <div className="space-y-8">
            <InfoGrid>
              <InfoItem label="Country" value={league.strCountry} />
              <InfoItem label="Sport" value={league.strSport} />
              <InfoItem label="Gender" value={league.strGender} />
              <InfoItem label="Formed" value={league.intFormedYear} />
              <InfoItem label="Current season" value={league.strCurrentSeason} />
              <InfoItem label="First event" value={league.dateFirstEvent} />
            </InfoGrid>
            {league.strDescriptionEN && (
              <section>
                <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900">About</h2>
                <p className="whitespace-pre-line leading-relaxed text-slate-600">
                  {league.strDescriptionEN}
                </p>
              </section>
            )}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
