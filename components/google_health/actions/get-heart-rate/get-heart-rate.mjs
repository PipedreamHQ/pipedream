// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../google_health.app.mjs";
import { ROLLUP_WINDOWS } from "../../common/constants.mjs";
import {
  buildTimeFilter,
  civilDateToString,
  durationToSeconds,
  int,
  resolveRange,
  round,
  utcRangeForDates,
} from "../../common/utils.mjs";

/**
 * Ceiling on windows returned in one call. Beyond roughly this many, the
 * response stops being something an agent can reason over and starts risking
 * the MCP output-size limit.
 */
const MAX_WINDOWS = 1000;

export default {
  key: "google_health-get-heart-rate",
  name: "Get Heart Rate",
  description: "Get the user's heart rate aggregated into time windows, plus their daily resting heart rate. Each window reports average, minimum, and maximum BPM; pick the window size with `granularity`. The range is inclusive and capped at **14 days**, because the windows are server-aggregated. Example: startDate=\"2026-08-24\", granularity=\"900s\" → 96 fifteen-minute windows as `{ startTime, endTime, avgBpm, minBpm, maxBpm }`, plus `restingHeartRate: [{ date, bpm }]` and an overall `summary`. Use granularity=\"86400s\" for one figure per day. Resting heart rate comes back from this tool too — there is no separate resting-HR tool. For active zone minutes, which are heart-rate derived but reported as activity, use **Get Daily Activity Summary**. [See the documentation](https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints/rollUp)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
      ],
    },
    granularity: {
      type: "string",
      label: "Granularity",
      description: "Size of each aggregation window. Defaults to 1 hour, which gives 24 windows for a single day. Use `86400s` for one figure per day, or `300s`/`60s` for fine intraday detail — but note that finer windows over a longer range produce far more output, and this action rejects any combination exceeding 1000 windows rather than returning a truncated series. A day at `60s` is 1440 windows, so narrow the date range when asking for minute-level detail.",
      options: ROLLUP_WINDOWS,
      default: "3600s",
      optional: true,
    },
    includeRestingHeartRate: {
      type: "boolean",
      label: "Include Resting Heart Rate",
      description: "Include the daily resting heart rate alongside the windows. Defaults to `true`.",
      default: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      startDate,
      endDate,
      endExclusive,
      days: dayCount,
    } = resolveRange({
      startDate: this.startDate,
      endDate: this.endDate,
      rollUpDataTypes: [
        "heart-rate",
      ],
    });

    // Refuse an over-wide query instead of quietly returning a partial series.
    // The agent can act on "use a coarser window"; it cannot detect a series
    // that stopped early, and a few thousand windows would blow the response
    // size limit anyway. Checked before any request goes out.
    const granularity = this.granularity ?? "3600s";
    const windowSeconds = durationToSeconds(granularity);
    if (windowSeconds <= 0) {
      throw new ConfigurationError(`Invalid granularity \`${granularity}\`. Use one of: ${ROLLUP_WINDOWS.map(({ value }) => value).join(", ")}.`);
    }
    const expectedWindows = Math.ceil((dayCount * 86400) / windowSeconds);
    if (expectedWindows > MAX_WINDOWS) {
      const suggestion = ROLLUP_WINDOWS
        .map(({ value }) => value)
        .find((v) => Math.ceil((dayCount * 86400) / durationToSeconds(v)) <= MAX_WINDOWS);
      throw new ConfigurationError(
        `A ${dayCount}-day range at ${granularity} granularity would produce about `
        + `${expectedWindows} windows, over the ${MAX_WINDOWS}-window limit for one call. `
        + (suggestion
          ? `Use granularity="${suggestion}" for this range, or narrow the dates.`
          : "Narrow the date range."),
      );
    }

    // `rollUp` takes physical-time instants, so the user's civil dates have to
    // be anchored to their actual UTC offset. Assuming UTC would shift the
    // window by hours for anyone not on UTC and return the wrong data without
    // any error to signal it. Costs one extra read, and only this action needs
    // it — every other tool here is on a civil-time endpoint.
    const {
      utcOffset,
      offsetSeconds,
      offsetSource,
    } = await this.app.resolveUtcOffset({
      $,
      dataType: "heart-rate",
      startDate,
      endExclusive,
    });

    const range = utcRangeForDates({
      startDate,
      endExclusive,
      offsetSeconds,
    });

    const [
      rollUpResponse,
      restingResponse,
    ] = await Promise.all([
      this.app.rollUpAllDataPoints({
        $,
        dataType: "heart-rate",
        data: {
          range,
          windowSize: granularity,
          // Ask for the whole series in one page where possible; the helper
          // still follows the cursor if the server returns less.
          pageSize: Math.min(expectedWindows + 10, 10000),
        },
      }),
      this.includeRestingHeartRate === false
        ? Promise.resolve(null)
        : this.app.listAllDataPoints({
          $,
          dataType: "daily-resting-heart-rate",
          filter: buildTimeFilter({
            dataType: "daily-resting-heart-rate",
            startDate,
            endExclusive,
          }),
          pageSize: 100,
        }),
    ]);

    const windows = (rollUpResponse?.rollupDataPoints ?? [])
      .map((point) => ({
        startTime: point?.startTime ?? null,
        endTime: point?.endTime ?? null,
        avgBpm: round(point?.heartRate?.beatsPerMinuteAvg, 1),
        minBpm: round(point?.heartRate?.beatsPerMinuteMin, 1),
        maxBpm: round(point?.heartRate?.beatsPerMinuteMax, 1),
      }))
      .filter((w) => w.avgBpm !== null || w.minBpm !== null || w.maxBpm !== null);

    const restingHeartRate = (restingResponse?.dataPoints ?? [])
      .map((point) => {
        const payload = point?.dailyRestingHeartRate;
        const date = payload?.date;
        return {
          date: date
            ? civilDateToString({
              date,
            })
            : null,
          bpm: int(payload?.beatsPerMinute),
        };
      })
      .filter((r) => r.bpm !== null)
      .sort((a, b) => String(a.date)
        .localeCompare(String(b.date)));

    const avgValues = windows
      .map((w) => w.avgBpm)
      .filter((v) => v !== null);
    const minValues = windows
      .map((w) => w.minBpm)
      .filter((v) => v !== null);
    const maxValues = windows
      .map((w) => w.maxBpm)
      .filter((v) => v !== null);

    const summary = {
      avgBpm: avgValues.length
        ? round(avgValues.reduce((a, b) => a + b, 0) / avgValues.length, 1)
        : null,
      minBpm: minValues.length
        ? Math.min(...minValues)
        : null,
      maxBpm: maxValues.length
        ? Math.max(...maxValues)
        : null,
    };

    $.export("$summary", windows.length
      ? `${windows.length} heart rate window(s) from ${startDate} to ${endDate}: `
        + `avg ${summary.avgBpm} bpm, range ${summary.minBpm}-${summary.maxBpm} bpm`
        + (offsetSource === "utc-assumed"
          ? " (no offset data found; day boundaries assumed UTC)"
          : "")
      : `No heart rate data has synced for ${startDate} to ${endDate}`);

    return {
      startDate,
      endDate,
      daysRequested: dayCount,
      granularity,
      windowsTruncated: rollUpResponse?.truncated ?? false,
      // Surfaced so a caller can tell a timezone-correct window from an assumed
      // one, rather than having to trust it silently.
      utcOffset,
      offsetSource,
      queriedRange: range,
      summary,
      windowCount: windows.length,
      windows,
      restingHeartRate,
      restingHeartRateTruncated: restingResponse?.truncated ?? false,
    };
  },
};
