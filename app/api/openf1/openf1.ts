import { fetchJson, safeArr } from "~/utils/fetcher";
import { countryFlagEmoji } from "~/utils/flags";
import { OPENF1_BASE_URL } from "~/constants";
import type { OpenF1Session, OpenF1Driver } from "./openf1-schema";

export type { OpenF1Session, OpenF1Driver } from "./openf1-schema";

export function driverFlag(driver: OpenF1Driver): string | null {
  return countryFlagEmoji(driver.country_code);
}

export async function getLatestSession(): Promise<OpenF1Session | undefined> {
  const sessions = await safeArr(
    fetchJson<OpenF1Session[]>(`${OPENF1_BASE_URL}/sessions?year=2026`),
  );

  const now = Date.now();
  const sortDesc = (a: OpenF1Session, b: OpenF1Session) =>
    Date.parse(b.date_start) - Date.parse(a.date_start);

  const past = sessions
    .filter((s) => Date.parse(s.date_end) < now)
    .sort(sortDesc);

  return (
    past.find((s) => s.session_type === "Race") ??
    past[0] ??
    sessions.filter((s) => s.session_type === "Race").sort(sortDesc)[0]
  );
}

export async function getDrivers(
  sessionKey: number,
): Promise<OpenF1Driver[]> {
  const params = new URLSearchParams({ session_key: String(sessionKey) });
  const drivers = await safeArr(
    fetchJson<OpenF1Driver[]>(`${OPENF1_BASE_URL}/drivers?${params.toString()}`),
  );
  return drivers.sort(
    (a, b) => a.driver_number - b.driver_number,
  );
}
