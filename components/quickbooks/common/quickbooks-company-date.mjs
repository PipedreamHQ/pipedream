/**
 * Formats a calendar date as YYYY-MM-DD in an IANA time zone (e.g. CompanyInfo.DefaultTimeZone).
 * Falls back to UTC when the zone is missing or not accepted by Intl.
 */
export function formatYyyyMmDdInTimeZone(date, timeZone) {
  let tz = timeZone;
  if (typeof tz !== "string" || !tz.trim()) {
    tz = "UTC";
  } else {
    tz = tz.trim();
  }
  try {
    // eslint-disable-next-line no-undef -- Intl is provided by the Node runtime
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(date);
    const y = parts.find((p) => p.type === "year")?.value;
    const m = parts.find((p) => p.type === "month")?.value;
    const d = parts.find((p) => p.type === "day")?.value;
    if (!y || !m || !d) {
      throw new Error("incomplete date parts");
    }
    return `${y}-${m}-${d}`;
  } catch {
    if (tz === "UTC") {
      return date.toISOString().split("T")[0];
    }
    return formatYyyyMmDdInTimeZone(date, "UTC");
  }
}

/** Today's date (YYYY-MM-DD) in the connected company's DefaultTimeZone when available. */
export async function getCompanyLocalTodayYyyyMmDd(quickbooks, $) {
  try {
    const resp = await quickbooks.getMyCompany({
      $,
    });
    const tz = resp?.CompanyInfo?.DefaultTimeZone;
    return formatYyyyMmDdInTimeZone(new Date(), tz);
  } catch {
    return formatYyyyMmDdInTimeZone(new Date(), "UTC");
  }
}
