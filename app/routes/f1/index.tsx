import type { Route } from "./+types/index";
import { Link } from "react-router";
import {
  getDrivers,
  getLatestSession,
  driverFlag,
  type OpenF1Driver,
} from "~/api/openf1/openf1";
import { safe } from "~/utils/fetcher";
import { countryFlagEmoji } from "~/utils/flags";
import SmartImage from "~/components/ui/SmartImage";
import PageContainer from "~/components/ui/PageContainer";
import EmptyState from "~/components/ui/EmptyState";

export const meta: Route.MetaFunction = () => [
  { title: "Formula 1 — SportNews" },
  {
    name: "description",
    content: "Latest Formula 1 sessions, drivers and top speeds, powered by OpenF1.",
  },
];

function formatRange(session: { date_start: string; date_end: string }) {
  const start = new Date(session.date_start);
  const end = new Date(session.date_end);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const sameDay =
    start.toDateString() === end.toDateString();
  return sameDay
    ? `${fmt(start)} · ${start.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })}–${end.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : `${fmt(start)} – ${fmt(end)}`;
}

export async function loader() {
  const session = await safe(getLatestSession(), undefined);
  if (!session) {
    return { session: undefined, drivers: [] as OpenF1Driver[] };
  }

  const drivers = await getDrivers(session.session_key);

  return { session, drivers };
}

export default function F1({ loaderData }: Route.ComponentProps) {
  const { session, drivers } = loaderData;

  return (
    <div>
      <section className="bg-slate-900 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Formula 1 · OpenF1
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              {session ? session.circuit_short_name : "Latest session"}
            </h1>
            {session && (
              <span className="text-2xl">
                {countryFlagEmoji(session.country_code)}
              </span>
            )}
          </div>
          {session ? (
            <p className="mt-3 text-emerald-100/90">
              {session.country_name} · {session.location} ·{" "}
              {session.session_name} · {formatRange(session)}
            </p>
          ) : (
            <p className="mt-3 text-emerald-100/90">
              Session data is temporarily unavailable.
            </p>
          )}
        </div>
      </section>

      <PageContainer>
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Drivers
            </h2>
            {session && (
              <Link
                to="/search"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Search →
              </Link>
            )}
          </div>

          {drivers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {drivers.map((driver) => (
                <div
                  key={driver.driver_number}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div
                    className="flex h-1.5"
                    style={{
                      backgroundColor: `#${driver.team_colour}`,
                    }}
                  />
                  <div className="flex items-start gap-3 p-4">
                    <SmartImage
                      src={driver.headshot_url}
                      alt={driver.full_name}
                      className="h-20 w-20 rounded-xl object-contain"
                    />
                    <div className="min-w-0">
                      <p className="text-2xl font-extrabold leading-none text-slate-300">
                        {driver.driver_number}
                      </p>
                      <p className="mt-1 truncate font-bold text-slate-900">
                        {driver.full_name}
                      </p>
                      <p className="truncate text-sm text-slate-500">
                        {driver.team_name}
                      </p>
                      <p className="mt-1 text-sm">
                        {driverFlag(driver)}{" "}
                        <span className="text-slate-400">
                          {driver.country_code}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Driver data unavailable"
              message="The session feed is warming up. Check back shortly."
            />
          )}
        </section>
      </PageContainer>
    </div>
  );
}
