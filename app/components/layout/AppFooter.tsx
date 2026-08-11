import { Link } from "react-router";
import type { ReactNode } from "react";

const exploreLinks = [
  { to: "/", label: "Home" },
  { to: "/leagues", label: "Leagues" },
  { to: "/search", label: "Search" },
];

const sportsLinks = [
  { to: "/football", label: "Football live" },
  { to: "/f1", label: "Formula 1" },
  { to: "/wrestling", label: "WWE roster" },
];

const dataSources = [
  {
    label: "TheSportsDB",
    href: "https://www.thesportsdb.com",
    description: "Leagues, teams, players & results",
  },
  {
    label: "iSportsAPI",
    href: "https://www.isportsapi.com",
    description: "Football live scores, stats & fixtures",
  },
  {
    label: "OpenF1",
    href: "https://openf1.org",
    description: "Formula 1 sessions & car data",
  },
  {
    label: "WWE.com",
    href: "https://www.wwe.com",
    description: "Wrestling talent roster",
  },
];

function LinkColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
        {title}
      </h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

export default function AppFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <p className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-emerald-700">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm text-white">
                SP
              </span>
              Sport<span className="text-emerald-600">Pesa</span>
            </p>
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              Sports news, leagues, live scores and results from around the
              world.
            </p>
          </div>

          <LinkColumn title="Explore">
            {exploreLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-slate-600 hover:text-emerald-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </LinkColumn>

          <LinkColumn title="Sports">
            {sportsLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-slate-600 hover:text-emerald-700"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </LinkColumn>

          <LinkColumn title="Data sources">
            {dataSources.map((source) => (
              <li key={source.label}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm text-slate-600 hover:text-emerald-700"
                >
                  {source.label}
                  <span className="block text-xs text-slate-400">
                    {source.description}
                  </span>
                </a>
              </li>
            ))}
          </LinkColumn>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} SportPesa News. Built for sport fans.
          </p>
          <p className="text-xs text-slate-500">
            Built by{" "}
            <a
              href="https://github.com/apox-rider"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-emerald-600 hover:text-emerald-700"
            >
              Apox Rider
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
