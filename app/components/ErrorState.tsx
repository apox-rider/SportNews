export default function ErrorState({
  message = "Something went wrong while loading this data.",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-16 text-center">
      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
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
            d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM12 21a9 9 0 100-18 9 9 0 000 18z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-red-800">Error</h3>
      <p className="mt-1 max-w-sm text-sm text-red-600">{message}</p>
    </div>
  );
}
