// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../google_health.app.mjs";
import {
  DATA_TYPES,
  LISTABLE_DATA_TYPES,
  ROLLUP_ONLY_TOOL_HINT,
} from "../../common/constants.mjs";
import {
  buildTimeFilter,
  pluck,
  resolveRange,
  supportsDateFilter,
} from "../../common/utils.mjs";

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGES = 2;

/**
 * Ceiling on `pageSize`, regardless of what the caller asks for.
 *
 * The API itself allows up to 10,000 per page, which across MAX_PAGES would be
 * 20,000 raw records — far past the MCP response-size limit for record types as
 * heavy as exercise sessions. 500 x MAX_PAGES lands on the same 1000-record
 * ceiling the other list-backed actions in this app already use.
 */
const MAX_PAGE_SIZE = 500;

const DATA_TYPE_OPTIONS = LISTABLE_DATA_TYPES.map((value) => ({
  label: value,
  value,
}));

export default {
  key: "google_health-list-data-points",
  name: "List Data Points",
  description: "Read raw data points for any Google Health data type the dedicated tools do not cover — blood oxygen (`oxygen-saturation`), heart rate variability, respiratory rate, VO2 max, body temperature, exercise sessions, sedentary periods, altitude, swim lengths and more; see the `dataType` options for the full list. **Prefer a dedicated tool where one exists**, since those return compact pre-aggregated results while this returns raw records and can be large: **Get Daily Step Count** (steps), **Get Daily Activity Summary** (calories, distance, active minutes, floors), **Get Heart Rate**, **Get Sleep Data**, **Get Body Measurements** (weight, body fat), **Get Nutrition and Hydration Logs** (food, water). Example: dataType=\"oxygen-saturation\", startDate=\"2026-08-24\" → `dataPoints` with each reading's value and timestamp, newest first. Two pages of `pageSize` come back (default 50 → 100 records) and `pageSize` is capped at 500, so **one call returns at most 1000 records**; `truncated: true` means there were more — narrow the date range or raise `pageSize` up to that cap. `food` and `food-measurement-unit` are reference catalogues, not time series — the date range does not apply, the response sets `dateFilterApplied: false`, and you must not describe those results as belonging to a particular day. Not available here: `total-calories`, `floors`, and `calories-in-heart-rate-zone` are aggregate-only (use **Get Daily Activity Summary**); ECG and irregular-rhythm data need OAuth scopes this app does not request. [See the documentation](https://developers.google.com/health/data-types)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    dataType: {
      type: "string",
      label: "Data Type",
      description: "The Google Health data type to read, e.g. `oxygen-saturation`, `heart-rate-variability`, `exercise`, `blood-glucose`, `vo2-max`, `sedentary-period`.",
      options: DATA_TYPE_OPTIONS,
    },
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
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Records to request per page, up to 2 pages. Defaults to 50, which keeps the response small enough to reason over. Values above 500 are clamped to 500, so a single call returns at most 1000 records. `sleep` and `exercise` are capped at 25 per page by the API regardless of what is passed, and are large per record — leave this low for them.",
      default: 50,
      optional: true,
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
      description: "Top-level field names to keep on each record's payload, e.g. `[\"sampleTime\", \"percentage\"]` for `oxygen-saturation` or `[\"interval\", \"exerciseType\"]` for `exercise`. Omit to return the full payload, which is the usual choice here since the shape differs per data type — call once without this to see the available keys, then narrow on a follow-up if the response was large.",
    },
  },
  async run({ $ }) {
    const { dataType } = this;
    const meta = DATA_TYPES[dataType];

    if (!meta) {
      throw new ConfigurationError(
        `Unknown data type \`${dataType}\`. Valid values: ${LISTABLE_DATA_TYPES.join(", ")}.`,
      );
    }
    if (!meta.ops.includes("list")) {
      const hint = ROLLUP_ONLY_TOOL_HINT[dataType];
      throw new ConfigurationError(
        `\`${dataType}\` cannot be listed — the Google Health API exposes it only in `
        + `aggregated form.${hint
          ? ` Use the \`${hint}\` action instead.`
          : ""}`,
      );
    }
    if (!meta.readable) {
      throw new ConfigurationError(
        `\`${dataType}\` is not readable with this app's OAuth scopes`
        + `${meta.unreachable
          ? ` — it ${meta.unreachable}`
          : ""}.`,
      );
    }

    // No `rollUpDataTypes`: this action only ever calls `list`, which has no
    // documented range cap. Output size is bounded by MAX_PAGES instead.
    const {
      startDate,
      endDate,
      endExclusive,
    } = resolveRange({
      startDate: this.startDate,
      endDate: this.endDate,
    });

    // `food` and `food-measurement-unit` are catalogues; the filter grammar has
    // no time field for them, so the range silently would not apply. Say so
    // instead of echoing dates that did nothing.
    const dateFilterApplied = supportsDateFilter(dataType);

    const response = await this.app.listAllDataPoints({
      $,
      dataType,
      filter: buildTimeFilter({
        dataType,
        startDate,
        endExclusive,
      }),
      pageSize: Math.min(
        this.pageSize ?? DEFAULT_PAGE_SIZE,
        MAX_PAGE_SIZE,
        // The API silently caps sleep and exercise at 25 regardless.
        meta.maxPageSize ?? MAX_PAGE_SIZE,
      ),
      // Deliberately lower than the other list-backed actions: this tool can be
      // pointed at record types (exercise sessions especially) that are orders
      // of magnitude larger per record than a step count, and an unbounded
      // sweep would exceed the MCP response-size limit.
      maxPages: MAX_PAGES,
    });

    // Lift each record's payload out from under its union key, so callers get
    // `{ oxygenSaturation: {...} }` flattened to the measurement itself rather
    // than having to know the key name.
    const dataPoints = (response?.dataPoints ?? []).map((point) => {
      const payload = point?.[meta.unionKey] ?? point;
      return {
        ...point?.name
          ? {
            name: point.name,
          }
          : {},
        ...this.fields?.length
          ? pluck(payload, this.fields)
          : payload,
        ...point?.dataSource
          ? {
            dataSource: {
              recordingMethod: point.dataSource.recordingMethod ?? null,
              platform: point.dataSource.platform ?? null,
            },
          }
          : {},
      };
    });

    const rangeLabel = dateFilterApplied
      ? `from ${startDate} to ${endDate}`
      : "(catalogue — not filtered by date)";

    $.export("$summary", dataPoints.length
      ? `${dataPoints.length} \`${dataType}\` record(s) ${rangeLabel}`
        + (response?.truncated
          ? " (more available — narrow the date range)"
          : "")
      : `No \`${dataType}\` data has synced ${rangeLabel}`);

    return {
      dataType,
      recordType: meta.recordType,
      dateFilterApplied,
      // Null rather than an echo when the filter was never applied — reporting
      // the requested dates here would imply a narrowing that did not happen.
      startDate: dateFilterApplied
        ? startDate
        : null,
      endDate: dateFilterApplied
        ? endDate
        : null,
      count: dataPoints.length,
      dataPoints,
      truncated: response?.truncated ?? false,
      pagesFetched: response?.pagesFetched ?? 0,
    };
  },
};
