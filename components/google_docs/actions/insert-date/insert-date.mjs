import { ConfigurationError } from "@pipedream/platform";
import common from "../common/insert-chip.mjs";

const {
  googleDocs, documentId, ...locationProps
} = common.props;

const DATE_REGEX =
  /^(\d{4})-(\d{2})-(\d{2})(?:[T ]([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d)(?:\.\d+)?)?([Zz]|[+-](?:[01]\d|2[0-3]):[0-5]\d)?)?$/;

const DATE_FORMATS = {
  month_day_year: "DATE_FORMAT_MONTH_DAY_YEAR_ABBREVIATED",
  month_day: "DATE_FORMAT_MONTH_DAY_ABBREVIATED",
  month_day_full: "DATE_FORMAT_MONTH_DAY_FULL",
  iso: "DATE_FORMAT_ISO8601",
};

// How far `timeZone`'s wall clock is ahead of UTC at instant `ms`.
function zoneOffsetMs(ms, timeZone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(ms))
    .map(({
      type, value,
    }) => [
      type,
      Number(value),
    ]));
  const wallClock = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return wallClock - ms;
}

export default {
  ...common,
  key: "google_docs-insert-date",
  name: "Insert Date Chip",
  description: "Insert a date smart chip into a Google Doc — a real date chip readers can click, not typed text. Use it for due dates, meeting dates, deadlines and timelines. Pass a calendar date (`2026-11-14`), or a date and time plus **Time Zone** to show the time as well (`2026-11-14T15:00` with `America/New_York` → `Nov 14, 2026 3:00 PM EST`). Place the chip with **Placeholder** (replace text such as `{{due}}` that you wrote with **Insert Text**) or with **Position**; in a multi-tab document either set **Tab ID** (from **List Tabs**) or use **Placeholder**. Use **Find Document** to resolve a document's name to its ID. Example: call with documentId=`1AbC...`, date=`2026-11-14`, placeholder=`{{due}}` → a chip reading `Nov 14, 2026`; returns `chipsInserted`, each chip's `tabId` and `index`, and the document `url`. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#InsertDateRequest)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    googleDocs,
    documentId,
    date: {
      type: "string",
      label: "Date",
      description: "The date as `YYYY-MM-DD` (e.g. `2026-11-14`), or a date and local time as `YYYY-MM-DDTHH:MM` (e.g. `2026-11-14T15:00`) to show a time too — a time needs **Time Zone**. A trailing `Z` or offset (`2026-11-14T20:00:00Z`) is read as that exact instant and shown in **Time Zone**.",
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "IANA time zone for a **Date** that includes a time, e.g. `America/New_York` or `Europe/London`. Required when there is a time; the chip shows the time with the zone's abbreviation. Ignored for a date without a time.",
      optional: true,
    },
    dateFormat: {
      type: "string",
      label: "Date Format",
      description: "How the chip displays the date: `month_day_year` → `Nov 14, 2026` (default), `month_day` → `Nov 14`, `month_day_full` → `November 14`, `iso` → `2026-11-14`.",
      options: Object.keys(DATE_FORMATS),
      default: "month_day_year",
      optional: true,
    },
    ...locationProps,
  },
  methods: {
    ...common.methods,
    // The chip's instant. A date with no time is pinned to noon UTC and shown
    // without a time (Google then renders it in UTC), so it reads as the same
    // calendar day wherever the reader is.
    dateElementProperties() {
      const match = DATE_REGEX.exec(String(this.date).trim());
      if (!match) {
        throw new ConfigurationError(`Invalid Date "${this.date}". Use YYYY-MM-DD (e.g. 2026-11-14) or YYYY-MM-DDTHH:MM (e.g. 2026-11-14T15:00).`);
      }
      const [
        , year,
        month,
        day,
        hour,
        minute,
        second = 0,
      ] = match.slice(0, 7).map((part) => part === undefined
        ? undefined
        : Number(part));
      const offset = match[7];
      const calendarDay = new Date(Date.UTC(year, month - 1, day));
      if (calendarDay.getUTCMonth() !== month - 1 || calendarDay.getUTCDate() !== day) {
        throw new ConfigurationError(`Invalid Date "${this.date}". That day does not exist.`);
      }
      const format = DATE_FORMATS[this.dateFormat ?? "month_day_year"];
      if (!format) {
        throw new ConfigurationError(`Invalid Date Format "${this.dateFormat}". Use one of: ${Object.keys(DATE_FORMATS).join(", ")}.`);
      }

      if (hour === undefined) {
        return {
          timestamp: new Date(Date.UTC(year, month - 1, day, 12)).toISOString(),
          dateFormat: format,
          timeFormat: "TIME_FORMAT_DISABLED",
        };
      }

      const timeZone = this.timeZone?.trim();
      if (!timeZone) {
        throw new ConfigurationError(`Date "${this.date}" includes a time, so set **Time Zone** (e.g. America/New_York) to say which zone it is in — or pass just the date.`);
      }
      try {
        zoneOffsetMs(Date.now(), timeZone);
      } catch {
        throw new ConfigurationError(`Invalid Time Zone "${timeZone}". Use an IANA time zone such as America/New_York, Europe/London or Asia/Tokyo.`);
      }

      let instant;
      if (offset) {
        instant = Date.parse(String(this.date).trim()
          .replace(" ", "T"));
      } else {
        // Treat the wall-clock time as UTC, then correct by the zone's offset;
        // the second pass settles times next to a daylight-saving change.
        const wallClock = Date.UTC(year, month - 1, day, hour, minute, second);
        instant = wallClock - zoneOffsetMs(wallClock, timeZone);
        instant = wallClock - zoneOffsetMs(instant, timeZone);
      }
      return {
        timestamp: new Date(instant).toISOString(),
        timeZoneId: timeZone,
        dateFormat: format,
        timeFormat: "TIME_FORMAT_HOUR_MINUTE_TIMEZONE",
      };
    },
    chipRequest() {
      return [
        "insertDate",
        {
          dateElementProperties: this.dateElementProperties(),
        },
      ];
    },
  },
  async run({ $ }) {
    const result = await this.insertChips();
    $.export("$summary", `Inserted ${result.chipsInserted} date chip${result.chipsInserted === 1
      ? ""
      : "s"} for ${this.date} into document ${this.documentId}`);
    return result;
  },
};
