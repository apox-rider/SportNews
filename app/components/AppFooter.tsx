export default function AppFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm font-semibold text-slate-700">
            SportPesa News
          </p>
          <p className="text-xs text-slate-500">
            Data powered by{" "}
            <a
              href="https://www.thesportsdb.com"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-emerald-600"
            >
              TheSportsDB API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
