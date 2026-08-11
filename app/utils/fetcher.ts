import { CACHE_TTL_MS, FETCH_TIMEOUT_MS } from "~/constants";

const cache = new Map<string, { value: unknown; expires: number }>();

export async function fetchJson<T>(url: string): Promise<T> {
  const cached = cache.get(url);
  if (cached && cached.expires > Date.now()) {
    return cached.value as T;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { accept: "application/json" },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) for ${url}`);
  }

  const value = (await res.json()) as T;
  cache.set(url, { value, expires: Date.now() + CACHE_TTL_MS });
  return value;
}

export async function fetchHtml(url: string): Promise<string> {
  const cached = cache.get(url);
  if (cached && cached.expires > Date.now()) {
    return cached.value as string;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        accept: "text/html",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) for ${url}`);
  }

  const value = await res.text();
  cache.set(url, { value, expires: Date.now() + CACHE_TTL_MS });
  return value;
}

export async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export async function safeArr<T>(promise: Promise<T[]>): Promise<T[]> {
  return safe(promise, []);
}
