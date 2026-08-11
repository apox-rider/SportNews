export default function EmptyState({
  title = "No results",
  message = "There is nothing to show here yet.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-slate-500">
        <svg
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 12h16.5m-16.5 0a.75.75 0 110-1.5m16.5 1.5a.75.75 0 110-1.5M3.75 6.75h16.5M3.75 17.25h16.5"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
    </div>
  );
}
