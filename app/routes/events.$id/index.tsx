import { Link } from "react-router";
import type { Route } from "./+types/index";
import { getEvent, getLeague, safe } from "~/api/sportsdb/sportsdb";
import PageContainer from "~/components/ui/PageContainer";
import InfoGrid, { InfoItem } from "~/components/ui/InfoGrid";
import EmptyState from "~/components/ui/EmptyState";
import SmartImage from "~/components/ui/SmartImage";
import { isFinished } from "~/components/EventCard";

export const meta: Route.MetaFunction = ({ loaderData }) => [
  { title: loaderData?.event?.strEvent
      ? `${loaderData.event.strEvent} — SportNews`
      : "Event — SportNews" },
];

export async function loader({ params }: Route.LoaderArgs) {
  const eventId = params.id!;
  const event = await safe(getEvent(eventId), undefined);

  let leagueName: string | undefined;
  if (event?.idLeague) {
    const league = await safe(getLeague(event.idLeague), undefined);
    leagueName = league?.strLeague ?? event.strLeague ?? undefined;
  }

  return { event, leagueName };
}

function TeamBlock({
  name,
  badge,
  id,
  score,
  align,
}: {
  name?: string | null;
  badge?: string | null;
  id?: string | null;
  score?: string | null;
  align: "left" | "right";
}) {
  const content = (
    <div
      className={`flex flex-1 items-center gap-4 ${
        align === "right" ? "flex-row-reverse text-right" : ""
      }`}
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white p-3 shadow">
        <SmartImage src={badge} alt={name ?? "team"} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="min-w-0">
        <div
          className={`text-3xl font-extrabold tabular-nums text-slate-900 ${
            align === "right" ? "text-right" : ""
          }`}
        >
          {score ?? "–"}
        </div>
        <p className="mt-1 truncate text-sm font-semibold text-slate-700">{name ?? "TBD"}</p>
      </div>
    </div>
  );

  return id ? (
    <Link to={`/teams/${id}`} className="flex min-w-0 flex-1">
      {content}
    </Link>
  ) : (
    <div className="flex min-w-0 flex-1">{content}</div>
  );
}

export default function EventDetail({ loaderData }: Route.ComponentProps) {
  const { event, leagueName } = loaderData;

  if (!event) {
    return <PageContainer><EmptyState title="Event not found" /></PageContainer>;
  }

  const finished = isFinished(event);
  const dateLabel = event.dateEvent
    ? new Date(event.dateEvent + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const info: Array<[string, string | null | undefined]> = [
    ["Competition", leagueName],
    ["Season", event.strSeason],
    ["Round", event.intRound],
    ["Venue", event.strVenue],
    ["Country", event.strCountry],
    ["City", event.strCity],
    ["Spectators", event.intSpectators?.toLocaleString()],
    ["Official", event.strOfficial],
  ];

  const videoId = event.strVideo?.match(/[?&]v=([^&]+)/)?.[1];

  return (
    <PageContainer>
      <nav className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-emerald-600">Home</Link>
        <span className="mx-2">/</span>
        <span>{event.strSport}</span>
        {event.idLeague && (
          <>
            <span className="mx-2">/</span>
            <Link to={`/leagues/${event.idLeague}`} className="hover:text-emerald-600">
              {leagueName}
            </Link>
          </>
        )}
      </nav>

      {event.strThumb && (
        <div className="mb-8 h-64 overflow-hidden rounded-2xl sm:h-80">
          <SmartImage
            src={event.strThumb}
            alt={event.strEvent}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <section className="mb-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-slate-50 p-6 sm:p-10">
        <div className="mb-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
            {finished ? "Full time" : event.strTime ? "Upcoming" : "Match"}
          </p>
          {dateLabel && (
            <p className="mt-1 text-sm font-medium text-slate-500">{dateLabel}</p>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <TeamBlock
            name={event.strHomeTeam}
            badge={event.strHomeTeamBadge}
            id={event.idHomeTeam}
            score={event.intHomeScore}
            align="left"
          />
          <div className="shrink-0 rounded-xl bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400 shadow">
            vs
          </div>
          <TeamBlock
            name={event.strAwayTeam}
            badge={event.strAwayTeamBadge}
            id={event.idAwayTeam}
            score={event.intAwayScore}
            align="right"
          />
        </div>

        {event.strEventAlternate && (
          <p className="mt-4 text-center text-xs text-slate-400">
            {event.strEventAlternate}
          </p>
        )}

        {videoId && (
          <div className="mt-8">
            <h2 className="mb-3 text-lg font-bold text-slate-900">Highlights</h2>
            <div className="aspect-video overflow-hidden rounded-xl">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`${event.strEvent} highlights`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </section>

      <InfoGrid>
        {info.map(([label, value]) => (
          <InfoItem key={label} label={label} value={value} />
        ))}
      </InfoGrid>
    </PageContainer>
  );
}
