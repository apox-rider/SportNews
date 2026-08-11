import { useMemo, useState } from "react";
import type { Route } from "./+types/index";
import {
  getLeague,
  getLeagueEvents,
  getLeagueSeasons,
  getLeagueStandings,
  getLeagueTeams,
  safe,
  safeArr,
} from "~/api/sportsdb/sportsdb";
import { getContinentById, getContinentOf, getFlagUrl } from "~/utils/continents";
import DetailHero from "~/components/DetailHero";
import InfoGrid, { InfoItem } from "~/components/ui/InfoGrid";
import PageContainer from "~/components/ui/PageContainer";
import CardGrid from "~/components/ui/CardGrid";
import TeamCard from "~/components/TeamCard";
import TabNav from "~/components/ui/TabNav";
import EventSection, { isFinished } from "~/components/EventSection";
import EmptyState from "~/components/ui/EmptyState";
import SmartImage from "~/components/ui/SmartImage";

export const meta: Route.MetaFunction = ({ loaderData }) => [
  { title: loaderData?.league?.strLeague
      ? `${loaderData.league.strLeague} — SportNews`
      : "League — SportNews" },
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

  const continentId = getContinentOf(league.strCountry);
  const continentName =
    continentId === "unknown" ? null : getContinentById(continentId).name;

  const socials = [
    { label: "Website", value: league.strWebsite },
    { label: "Facebook", value: league.strFacebook },
    { label: "Twitter / X", value: league.strTwitter },
    { label: "Instagram", value: league.strInstagram },
    { label: "YouTube", value: league.strYoutube },
  ].filter((s) => s.value);

  const gallery = [
    league.strLogo,
    league.strPoster,
    league.strTrophy,
    league.strFanart1,
    league.strFanart2,
  ].filter((src): src is string => Boolean(src));

  return (
    <div>
      <DetailHero
        badge={league.strBadge}
        flag={getFlagUrl(league.strCountry)}
        banner={league.strFanart1 || league.strBanner}
        title={league.strLeague}
        subtitle={[league.strCountry, continentName, league.strGender, league.strSport]
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
          <div className="space-y-10">
            <InfoGrid>
              <InfoItem label="Country" value={league.strCountry} />
              <InfoItem label="Continent" value={continentName} />
              <InfoItem label="Sport" value={league.strSport} />
              <InfoItem label="Gender" value={league.strGender} />
              <InfoItem label="Division" value={league.intDivision} />
              <InfoItem
                label="Alternate name"
                value={league.strLeagueAlternate}
              />
              <InfoItem label="Formed" value={league.intFormedYear} />
              <InfoItem label="Current season" value={league.strCurrentSeason} />
              <InfoItem label="First event" value={league.dateFirstEvent} />
              <InfoItem
                label="Cup competition"
                value={
                  league.idCup
                    ? league.idCup === "0"
                      ? "No"
                      : "Yes"
                    : undefined
                }
              />
            </InfoGrid>

            {gallery.length > 0 && (
              <section>
                <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900">
                  Branding
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {gallery.map((src) => (
                    <div
                      key={src}
                      className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <SmartImage
                        src={src}
                        alt={`${league.strLeague} imagery`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {league.strDescriptionEN && (
              <section>
                <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900">About</h2>
                <p className="whitespace-pre-line leading-relaxed text-slate-600">
                  {league.strDescriptionEN}
                </p>
              </section>
            )}

            {socials.length > 0 && (
              <section>
                <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900">
                  Official links
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={`https://${s.value!.replace(/^https?:\/\//, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:border-emerald-400 hover:text-emerald-700"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {league.strTvRights && (
              <section>
                <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900">
                  Broadcast & TV rights
                </h2>
                <div className="whitespace-pre-line rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-600">
                  {league.strTvRights}
                </div>
              </section>
            )}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
