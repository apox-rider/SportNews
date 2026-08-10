import { useMemo, useState } from "react";
import type { Route } from "./+types/teams.$id";
import {
  getTeam,
  getTeamLastEvents,
  getTeamNextEvents,
  getTeamPlayers,
  safe,
  safeArr,
} from "../lib/sportsdb";
import DetailHero from "../components/DetailHero";
import InfoGrid, { InfoItem } from "../components/InfoGrid";
import PageContainer from "../components/PageContainer";
import CardGrid from "../components/CardGrid";
import PlayerCard from "../components/PlayerCard";
import TabNav from "../components/TabNav";
import EventSection, { isFinished } from "../components/EventSection";
import EmptyState from "../components/EmptyState";

export const meta: Route.MetaFunction = ({ loaderData }) => [
  { title: loaderData?.team?.strTeam
      ? `${loaderData.team.strTeam} — SportPesa News`
      : "Team — SportPesa News" },
];

export async function loader({ params }: Route.LoaderArgs) {
  const teamId = params.id!;
  const [team, nextEvents, lastEvents, players] = await Promise.all([
    safe(getTeam(teamId), undefined),
    safeArr(getTeamNextEvents(teamId)),
    safeArr(getTeamLastEvents(teamId)),
    safeArr(getTeamPlayers(teamId)),
  ]);
  return { team, nextEvents, lastEvents, players };
}

const tabs = [
  { id: "matches", label: "Matches" },
  { id: "squad", label: "Squad" },
  { id: "info", label: "About" },
];

export default function TeamDetail({ loaderData }: Route.ComponentProps) {
  const { team, nextEvents, lastEvents, players } = loaderData;
  const [active, setActive] = useState("matches");

  const results = useMemo(() => lastEvents.filter(isFinished), [lastEvents]);
  const fixtures = useMemo(() => nextEvents.filter((e) => !isFinished(e)), [nextEvents]);

  if (!team) {
    return <PageContainer><EmptyState title="Team not found" /></PageContainer>;
  }

  return (
    <div>
      <DetailHero
        badge={team.strBadge}
        banner={team.strFanart1 || team.strBanner}
        title={team.strTeam}
        subtitle={[team.strLeague, team.strCountry].filter(Boolean).join(" · ")}
      />

      <PageContainer>
        <TabNav tabs={tabs} active={active} onChange={setActive} />

        {active === "matches" && (
          <div className="space-y-10">
            {fixtures.length > 0 && (
              <EventSection title="Upcoming" events={fixtures} />
            )}
            <EventSection title="Recent results" events={results} />
          </div>
        )}

        {active === "squad" && (
          players.length > 0 ? (
            <CardGrid cols={4}>
              {players.map((player) => (
                <PlayerCard
                  key={player.idPlayer}
                  id={player.idPlayer}
                  name={player.strPlayer}
                  thumb={player.strThumb || player.strCutout}
                  position={player.strPosition}
                  nationality={player.strNationality}
                />
              ))}
            </CardGrid>
          ) : (
            <EmptyState title="No squad data" />
          )
        )}

        {active === "info" && (
          <div className="space-y-8">
            <InfoGrid>
              <InfoItem label="League" value={team.strLeague} />
              <InfoItem label="Country" value={team.strCountry} />
              <InfoItem label="Stadium" value={team.strStadium} />
              <InfoItem label="Capacity" value={team.intStadiumCapacity?.toLocaleString()} />
              <InfoItem label="Location" value={team.strLocation} />
              <InfoItem label="Founded" value={team.intFormedYear} />
              <InfoItem label="Website" value={team.strWebsite} />
              <InfoItem label="Facebook" value={team.strFacebook} />
              <InfoItem label="Twitter" value={team.strTwitter} />
              <InfoItem label="Instagram" value={team.strInstagram} />
            </InfoGrid>
            {team.strDescriptionEN && (
              <section>
                <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900">About</h2>
                <p className="whitespace-pre-line leading-relaxed text-slate-600">
                  {team.strDescriptionEN}
                </p>
              </section>
            )}
          </div>
        )}
      </PageContainer>
    </div>
  );
}
