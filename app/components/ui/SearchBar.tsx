import { Form, Link, useFetcher, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import type { Player, SportEvent, Team } from "~/api/sportsdb/sportsdb-schema";
import SmartImage from "./SmartImage";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 250;

type SuggestionData = {
  query: string;
  teams: Team[];
  players: Player[];
  events: SportEvent[];
};

type SuggestionItem = {
  id: string;
  type: "team" | "player" | "event";
  title: string;
  subtitle?: string | null;
  thumb?: string | null;
  to: string;
};

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-sm bg-emerald-100 px-0.5 text-emerald-900">
        {text.slice(idx, idx + q.length)}
      </mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function ItemIcon({ item }: { item: SuggestionItem }) {
  if (item.type === "team") {
    return (
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 p-1.5">
        <SmartImage
          src={item.thumb}
          alt=""
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  }
  if (item.type === "player" && item.thumb) {
    return (
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <SmartImage
          src={item.thumb}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
      {item.type === "player" ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
          />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001a2.628 2.628 0 00-2.715-2.528 2.628 2.628 0 00-2.715 2.528v.001h-4.992a2.628 2.628 0 00-2.715-2.528c-1.5 0-2.715 1.178-2.715 2.528 0 1.35 1.214 2.528 2.715 2.528h4.992a2.628 2.628 0 002.715 2.528c1.5 0 2.715-1.178 2.715-2.528"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h3.486a1.5 1.5 0 011.5 1.5v6.351a1.5 1.5 0 01-1.5 1.5h-13.5a1.5 1.5 0 01-1.5-1.5V10.848a1.5 1.5 0 011.5-1.5h3.486M6.023 12.348h.008M9.023 12.348h.008M12.023 12.348h.008"
          />
        </svg>
      )}
    </div>
  );
}

const TYPE_LABEL: Record<SuggestionItem["type"], string> = {
  team: "Team",
  player: "Player",
  event: "Match",
};

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin text-emerald-600"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export default function SearchBar({
  defaultValue = "",
  size = "sm",
  onSubmitted,
}: {
  defaultValue?: string;
  size?: "sm" | "lg";
  onSubmitted?: () => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fetcher = useFetcher<SuggestionData>();
  const navigate = useNavigate();

  const query = value.trim();
  const hasQuery = query.length >= MIN_QUERY_LENGTH;
  const showDropdown = open && hasQuery;

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (!hasQuery) return;
    const timer = setTimeout(() => {
      fetcher.load(`/search/suggestions?q=${encodeURIComponent(query)}`);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, hasQuery]);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const suggestions: SuggestionItem[] = (() => {
    const data = fetcher.data;
    if (!data || data.query !== query) return [];
    return [
      ...data.teams.map(
        (t): SuggestionItem => ({
          id: t.idTeam,
          type: "team",
          title: t.strTeam,
          subtitle: t.strLeague,
          thumb: t.strBadge,
          to: `/teams/${t.idTeam}`,
        }),
      ),
      ...data.players.map(
        (p): SuggestionItem => ({
          id: p.idPlayer,
          type: "player",
          title: p.strPlayer,
          subtitle: p.strTeam || p.strPosition || null,
          thumb: p.strThumb || p.strCutout,
          to: `/players/${p.idPlayer}`,
        }),
      ),
      ...data.events.map(
        (e): SuggestionItem => ({
          id: e.idEvent,
          type: "event",
          title: e.strEvent,
          subtitle: [e.strHomeTeam, e.strAwayTeam].filter(Boolean).join(" vs ") || null,
          thumb: e.strThumb,
          to: `/events/${e.idEvent}`,
        }),
      ),
    ];
  })();

  const total = suggestions.length;
  const stale = fetcher.data !== undefined && fetcher.data.query !== query;
  const isLoading = (fetcher.state === "loading" || stale) && hasQuery;

  function select(to: string) {
    setOpen(false);
    setActiveIndex(-1);
    navigate(to);
  }

  function clear() {
    setValue("");
    setActiveIndex(-1);
    setOpen(false);
    inputRef.current?.focus();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    setOpen(false);
    setActiveIndex(-1);
    onSubmitted?.();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (!showDropdown) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % (total + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? total : i - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < total) {
        e.preventDefault();
        select(suggestions[activeIndex].to);
      } else if (activeIndex === total) {
        e.preventDefault();
        select(`/search?q=${encodeURIComponent(query)}`);
      }
    }
  }

  const inputClass =
    size === "lg"
      ? "w-full rounded-xl border-2 py-3 pl-11 pr-12 text-base"
      : "w-56 rounded-full border py-2 pl-9 pr-9 text-sm sm:w-64";

  return (
    <div ref={wrapperRef} className="relative">
      <Form
        action="/search"
        method="get"
        role="search"
        onSubmit={handleSubmit}
        className="relative"
      >
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg
            className={size === "lg" ? "h-5 w-5" : "h-4 w-4"}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="search"
          name="q"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setActiveIndex(-1);
            if (e.target.value) setOpen(true);
          }}
          onFocus={() => {
            if (hasQuery) setOpen(true);
          }}
          placeholder="Search teams, players, events..."
          required
          autoComplete="off"
          spellCheck={false}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 && activeIndex < total
              ? `search-suggestion-${activeIndex}`
              : undefined
          }
          className={`${inputClass} [&::-webkit-search-cancel-button]:hidden border-slate-300 bg-white text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30`}
        />

        {value && (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="absolute right-9 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg
              className={size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5"}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-600"
        >
          <svg
            className={size === "lg" ? "h-5 w-5" : "h-4 w-4"}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
            />
          </svg>
        </button>
      </Form>

      {showDropdown && (
        <div
          id="search-suggestions"
          role="listbox"
          className={`absolute right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 ${
            size === "lg" ? "w-full" : "w-[min(100%,24rem)]"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2.5 px-4 py-4 text-sm text-slate-500">
              <Spinner /> Searching…
            </div>
          ) : total === 0 ? (
            <div className="px-4 py-4 text-sm text-slate-500">
              No suggestions for <span className="font-medium text-slate-700">“{query}”</span>.
            </div>
          ) : (
            <>
              <div className="max-h-80 overflow-y-auto py-1">
                {(
                  [
                    { type: "team", label: "Teams" },
                    { type: "player", label: "Players" },
                    { type: "event", label: "Matches" },
                  ] as const
                ).map((group) => {
                  const items = suggestions.filter((s) => s.type === group.type);
                  if (items.length === 0) return null;
                  return (
                    <div key={group.type}>
                      <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        {group.label}
                      </p>
                      {items.map((item) => {
                        const index = suggestions.indexOf(item);
                        const active = index === activeIndex;
                        return (
                          <Link
                            key={item.id}
                            id={`search-suggestion-${index}`}
                            role="option"
                            aria-selected={active}
                            to={item.to}
                            onClick={() => {
                              setOpen(false);
                              setActiveIndex(-1);
                            }}
                            onMouseEnter={() => setActiveIndex(index)}
                            className={`flex items-center gap-3 px-4 py-2.5 transition ${
                              active ? "bg-emerald-50" : "hover:bg-slate-50"
                            }`}
                          >
                            <ItemIcon item={item} />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-900">
                                <Highlight text={item.title} query={query} />
                              </p>
                              {item.subtitle && (
                                <p className="truncate text-xs text-slate-500">
                                  <Highlight text={item.subtitle} query={query} />
                                </p>
                              )}
                            </div>
                            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                              {TYPE_LABEL[item.type]}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              <Link
                role="option"
                aria-selected={activeIndex === total}
                to={`/search?q=${encodeURIComponent(query)}`}
                onClick={() => {
                  setOpen(false);
                  setActiveIndex(-1);
                }}
                onMouseEnter={() => setActiveIndex(total)}
                className={`flex items-center justify-center gap-2 border-t border-slate-100 px-4 py-3 text-sm font-medium transition ${
                  activeIndex === total
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-emerald-700"
                }`}
              >
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
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </svg>
                See all results for “{query}”
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
