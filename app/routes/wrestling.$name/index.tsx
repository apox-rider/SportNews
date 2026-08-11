import type { Route } from "./+types/index";
import { Link } from "react-router";
import {
  findWweTalent,
  getWweProfile,
  talentUrl,
  type WweProfile,
  type WweTalent,
} from "~/api/wwe/wwe";
import { safe } from "~/utils/fetcher";
import PageContainer from "~/components/ui/PageContainer";
import EmptyState from "~/components/ui/EmptyState";
import SmartImage from "~/components/ui/SmartImage";
import InfoGrid, { InfoItem } from "~/components/ui/InfoGrid";

export const meta: Route.MetaFunction = ({ loaderData }) => [
  {
    title: loaderData?.profile?.name
      ? `${loaderData.profile.name} — SportNews`
      : "WWE Superstar — SportNews",
  },
  {
    name: "description",
    content:
      loaderData?.profile?.tagline ??
      (loaderData?.profile?.name
        ? `WWE Superstar ${loaderData.profile.name} profile with stats and career highlights.`
        : "WWE Superstar profile with stats and career highlights."),
  },
];

export async function loader({ params }: Route.LoaderArgs) {
  const slug = decodeURIComponent(params.name ?? "");
  const talent = await findWweTalent(slug);

  if (!talent) return { talent: null as WweTalent | null, profile: null };

  const profile = await safe(
    getWweProfile(talent.url),
    {
      name: talent.value,
      image: null,
      tagline: null,
      height: null,
      weight: null,
      hometown: null,
      signatureMove: null,
      careerHighlights: [],
    } satisfies WweProfile,
  );

  return { talent, profile };
}

export default function WrestlerDetail({ loaderData }: Route.ComponentProps) {
  const { talent, profile } = loaderData;

  if (!talent || !profile) {
    return (
      <PageContainer>
        <EmptyState
          title="Superstar not found"
          message="No WWE superstar matched that name. Try the full roster instead."
        />
      </PageContainer>
    );
  }

  return (
    <div>
      <section className="bg-gradient-to-br from-red-800 via-red-700 to-rose-600 py-14 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            to="/wrestling"
            className="text-xs font-semibold uppercase tracking-widest text-red-200 transition hover:text-white"
          >
            ← WWE roster
          </Link>
          <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="h-48 w-48 shrink-0 overflow-hidden rounded-2xl border-4 border-white/20 bg-white/10 shadow-2xl">
              <SmartImage
                src={profile.image}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-red-200">
                WWE Superstar
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
                {profile.name}
              </h1>
              {profile.tagline && (
                <p className="mt-3 max-w-2xl text-lg italic text-red-50/90">
                  “{profile.tagline}”
                </p>
              )}
              <a
                href={talentUrl(talent)}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
              >
                View on WWE.com
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <PageContainer>
        {profile.height ||
        profile.weight ||
        profile.hometown ||
        profile.signatureMove ? (
          <div className="mb-10">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">
              Superstar stats
            </h2>
            <InfoGrid>
              <InfoItem label="Height" value={profile.height} />
              <InfoItem label="Weight" value={profile.weight} />
              <InfoItem label="Hometown" value={profile.hometown} />
              <InfoItem label="Signature Move" value={profile.signatureMove} />
            </InfoGrid>
          </div>
        ) : null}

        {profile.careerHighlights.length > 0 ? (
          <div className="mb-10">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">
              Career highlights
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {profile.careerHighlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-700">
                    ★
                  </span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <Link
          to="/wrestling"
          className="text-sm font-semibold text-red-700 transition hover:text-red-500"
        >
          ← Back to full roster
        </Link>
      </PageContainer>
    </div>
  );
}
