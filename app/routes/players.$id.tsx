import { useState } from "react";
import type { Route } from "./+types/players.$id";
import { getPlayer, getTeam, safe } from "../lib/sportsdb";
import DetailHero from "../components/DetailHero";
import InfoGrid, { InfoItem } from "../components/InfoGrid";
import PageContainer from "../components/PageContainer";
import SmartImage from "../components/SmartImage";
import EmptyState from "../components/EmptyState";

export const meta: Route.MetaFunction = ({ loaderData }) => [
  { title: loaderData?.player?.strPlayer
      ? `${loaderData.player.strPlayer} — SportPesa News`
      : "Player — SportPesa News" },
];

export async function loader({ params }: Route.LoaderArgs) {
  const playerId = params.id!;
  const player = await safe(getPlayer(playerId), undefined);

  let teamName: string | undefined;
  let teamId: string | undefined;
  if (player?.idTeam) {
    const team = await safe(getTeam(player.idTeam), undefined);
    teamName = team?.strTeam ?? player.strTeam ?? undefined;
    teamId = team?.idTeam ?? undefined;
  }

  return { player, teamName, teamId };
}

export default function PlayerDetail({ loaderData }: Route.ComponentProps) {
  const { player, teamName, teamId } = loaderData;
  const [imgFailed, setImgFailed] = useState(false);

  if (!player) {
    return <PageContainer><EmptyState title="Player not found" /></PageContainer>;
  }

  const facts: Array<[string, string | null | undefined]> = [
    ["Position", player.strPosition],
    ["Nationality", player.strNationality],
    ["Born", player.dateBorn],
    ["Birth place", player.strBirthLocation],
    ["Number", player.strNumber],
    ["Height", player.strHeight],
    ["Weight", player.strWeight],
    ["Status", player.strStatus],
    ["Gender", player.strGender],
    ["Signed", player.dateSigned],
    ["Signing type", player.strSigning],
    ["Team", teamName],
  ];

  const socials = [
    { label: "Twitter", value: player.strTwitter },
    { label: "Instagram", value: player.strInstagram },
    { label: "Facebook", value: player.strFacebook },
    { label: "Website", value: player.strWebsite },
  ].filter((s) => s.value);

  const cutout = player.strCutout || player.strRender || player.strThumb;

  return (
    <div>
      <DetailHero
        banner={player.strBanner}
        title={player.strPlayer}
        subtitle={[teamName, player.strPosition, player.strNationality]
          .filter(Boolean)
          .join(" · ")}
      />

      <PageContainer>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <InfoGrid>
              {facts.map(([label, value]) => (
                <InfoItem key={label} label={label} value={value} />
              ))}
            </InfoGrid>

            {player.strDescriptionEN && (
              <section className="mt-8">
                <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900">
                  Biography
                </h2>
                <p className="whitespace-pre-line leading-relaxed text-slate-600">
                  {player.strDescriptionEN}
                </p>
              </section>
            )}

            {socials.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-3 text-xl font-bold tracking-tight text-slate-900">
                  Links
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
          </div>

          <div>
            <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {cutout && !imgFailed ? (
                <SmartImage
                  src={cutout}
                  alt={player.strPlayer}
                  className="h-96 w-full object-cover"
                />
              ) : (
                <div className="flex h-96 items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100">
                  <div className="text-6xl font-extrabold tracking-tight text-emerald-600/80">
                    {player.strPlayer
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                </div>
              )}
              {teamId && (
                <div className="border-t border-slate-100 p-4">
                  <a
                    href={`/teams/${teamId}`}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    View {teamName} →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
