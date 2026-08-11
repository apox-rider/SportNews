import { Link } from "react-router";
import type { WweTalent } from "~/api/wwe/wwe";

const palettes = [
  "from-red-600 to-rose-500",
  "from-orange-600 to-amber-500",
  "from-violet-600 to-purple-500",
  "from-sky-600 to-blue-500",
  "from-emerald-600 to-teal-500",
  "from-fuchsia-600 to-pink-500",
  "from-amber-600 to-orange-500",
  "from-indigo-600 to-blue-500",
];

function paletteFor(name: string): string {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return palettes[hash % palettes.length];
}

function initialsFor(name: string): string {
  const parts = name
    .replace(/[^a-zA-Z0-9'\u2019 .-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return (name.trim().slice(0, 2) || "??").toUpperCase();
}

export default function WrestlerCard({ talent }: { talent: WweTalent }) {
  const slug = talent.url.split("/").filter(Boolean).pop();
  return (
    <Link
      to={`/wrestling/${slug}`}
      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-lg"
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${paletteFor(talent.value)} text-base font-extrabold text-white`}
        aria-hidden
      >
        {initialsFor(talent.value)}
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-red-700">
          {talent.value}
        </h3>
        <p className="mt-0.5 text-xs text-slate-400 transition group-hover:text-red-500">
          View profile →
        </p>
      </div>
    </Link>
  );
}
