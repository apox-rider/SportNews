import type { Route } from "./+types/index";
import { useState } from "react";
import { getWweTalent, type WweTalent } from "~/api/wwe/wwe";
import PageContainer from "~/components/ui/PageContainer";
import EmptyState from "~/components/ui/EmptyState";
import WrestlerCard from "~/components/WrestlerCard";

export const meta: Route.MetaFunction = () => [
  { title: "WWE Roster — SportNews" },
  {
    name: "description",
    content: "Browse the full WWE talent roster with career stats, powered by WWE.com.",
  },
];

export async function loader() {
  const talents = await getWweTalent();
  return { talents };
}

function groupByLetter(talents: WweTalent[]): Map<string, WweTalent[]> {
  const groups = new Map<string, WweTalent[]>();
  for (const talent of talents) {
    const letter = talent.value.charAt(0).toUpperCase();
    const list = groups.get(letter) ?? [];
    list.push(talent);
    groups.set(letter, list);
  }
  return groups;
}

export default function Wrestling({ loaderData }: Route.ComponentProps) {
  const { talents } = loaderData;
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? talents.filter((t) =>
        t.value.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : talents;

  const groups = groupByLetter(filtered);

  return (
    <div>
      <section className="bg-gradient-to-br from-red-800 via-red-700 to-rose-600 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-red-200">
            Wrestling · WWE.com
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
            WWE superstars
          </h1>
          <p className="mt-3 max-w-xl text-red-50/90">
            The full {talents.length.toLocaleString()} talent roster, from
            legends to current champions. Tap a card for stats and career
            highlights.
          </p>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter superstars…"
            className="mt-6 w-full max-w-md rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-red-100/70 backdrop-blur focus:border-white focus:outline-none"
          />
        </div>
      </section>

      <PageContainer>
        {filtered.length > 0 ? (
          [...groups.entries()].map(([letter, list]) => (
            <section key={letter} className="mb-10">
              <h2 className="mb-4 flex items-baseline gap-2 text-sm font-bold uppercase tracking-widest text-slate-400">
                {letter}
                <span className="text-xs font-medium normal-case text-slate-300">
                  {list.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {list.map((talent) => (
                  <WrestlerCard key={talent.url} talent={talent} />
                ))}
              </div>
            </section>
          ))
        ) : (
          <EmptyState
            title={query ? "No matching superstars" : "Roster unavailable"}
            message={
              query
                ? `Nothing matches “${query}”.`
                : "The roster feed is temporarily unavailable."
            }
          />
        )}
      </PageContainer>
    </div>
  );
}
