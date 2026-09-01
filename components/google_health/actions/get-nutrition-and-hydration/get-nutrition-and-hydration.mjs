// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../google_health.app.mjs";
import { DEFAULT_MAX_RANGE_DAYS } from "../../common/constants.mjs";
import {
  buildTimeFilter,
  pluck,
  resolveRange,
  round,
  sumInts,
} from "../../common/utils.mjs";

const ML_PER_LITRE = 1000;
const ML_PER_FL_OZ_US = 29.5735296;

const DEFAULT_FIELDS = [
  "time",
  "foodDisplayName",
  "mealType",
  "calories",
  "totalFatG",
  "totalCarbohydrateG",
  "servingAmount",
  "servingUnit",
];

export default {
  key: "google_health-get-nutrition-and-hydration",
  name: "Get Nutrition and Hydration Logs",
  description: "Get the user's logged food and water intake, with aggregate calorie, macro and water totals. Example: startDate=\"2026-08-24\" → `entries: [{ time, foodDisplayName: \"Greek yogurt\", mealType: \"BREAKFAST\", calories: 180, totalFatG: 4.5, totalCarbohydrateG: 9 }]`, `hydration: [{ time, milliliters: 500, liters: 0.5, flOz: 16.9 }]`, and `totals`. `totals` is **one object covering the whole requested range, not per-day figures** — call a single day at a time if daily breakdowns are wanted. Entries have no date-range limit, but `totals` are server-aggregated and cap the range at 90 days — set includeTotals=false to read entries over a longer span, which makes `totals` `null`. At most **1000 food entries and 1000 hydration entries** come back per call (five pages of 200); `truncated: true` means there were more, so check it before treating the entry list as complete and narrow the range if it is set. Only food the user **logged manually** appears here; nothing is inferred from activity, so an empty result means nothing was logged, not that nothing was eaten. [See the documentation](https://developers.google.com/health/data-types/nutrition)",
  version: "0.0.2",
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
    includeTotals: {
      type: "boolean",
      label: "Include Totals",
      description: "Include aggregated calorie, macro, and water totals for the range. Defaults to `true`. Totals are server-aggregated and cap the range at 90 days; set this to `false` to read entries over a longer span.",
      default: true,
      optional: true,
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
      description: "Field names to keep on each food entry. Defaults to a compact set: "
        + DEFAULT_FIELDS.join(", ")
        + ". Also available: `nutrients` (the full forty-nutrient breakdown), `energyFromFatKcal`, `foodResourceName`, `utcOffset`.",
    },
  },
  async run({ $ }) {
    const wantTotals = this.includeTotals !== false;

    // Listing entries is uncapped; only the roll-up that produces `totals` is.
    // Checked here rather than inside resolveRange so the message can name the
    // prop that lifts the limit.
    const {
      startDate,
      endDate,
      endExclusive,
      days,
    } = resolveRange({
      startDate: this.startDate,
      endDate: this.endDate,
    });
    if (wantTotals && days > DEFAULT_MAX_RANGE_DAYS) {
      throw new ConfigurationError(
        `Requested ${days} days (${startDate} to ${endDate}) but the Google Health API caps `
        + `aggregated queries at ${DEFAULT_MAX_RANGE_DAYS} days. Set includeTotals=false to read `
        + "the individual entries over this range, or narrow the dates to get totals as well.",
      );
    }

    const listRange = (dataType) => this.app.listAllDataPoints({
      $,
      dataType,
      filter: buildTimeFilter({
        dataType,
        startDate,
        endExclusive,
      }),
      pageSize: 200,
    });

    const [
      nutritionResponse,
      hydrationResponse,
      nutritionTotals,
      hydrationTotals,
    ] = await Promise.all([
      listRange("nutrition-log"),
      listRange("hydration-log"),
      wantTotals
        ? this.app.dailyRollUp({
          $,
          dataType: "nutrition-log",
          startDate,
          endExclusive,
        })
        : Promise.resolve([]),
      wantTotals
        ? this.app.dailyRollUp({
          $,
          dataType: "hydration-log",
          startDate,
          endExclusive,
        })
        : Promise.resolve([]),
    ]);

    const entries = (nutritionResponse?.dataPoints ?? []).map((point) => {
      const log = point?.nutritionLog;
      return {
        time: log?.interval?.startTime ?? null,
        utcOffset: log?.interval?.startUtcOffset ?? null,
        foodDisplayName: log?.foodDisplayName ?? null,
        foodResourceName: log?.food ?? null,
        mealType: log?.mealType ?? null,
        calories: round(log?.energy?.kcal, 0),
        energyFromFatKcal: round(log?.energyFromFat?.kcal, 0),
        totalFatG: round(log?.totalFat?.grams, 1),
        totalCarbohydrateG: round(log?.totalCarbohydrate?.grams, 1),
        servingAmount: log?.serving?.amount ?? null,
        servingUnit: log?.serving?.foodMeasurementUnitDisplayName
          ?? log?.serving?.foodMeasurementUnit
          ?? null,
        nutrients: (log?.nutrients ?? []).map((n) => ({
          nutrient: n?.nutrient ?? null,
          grams: round(n?.quantity?.grams, 2),
        })),
      };
    })
      .sort((a, b) => String(a.time)
        .localeCompare(String(b.time)));

    const hydration = (hydrationResponse?.dataPoints ?? []).map((point) => {
      const log = point?.hydrationLog;
      const ml = log?.amountConsumed?.milliliters ?? null;
      return {
        time: log?.interval?.startTime ?? null,
        milliliters: round(ml, 0),
        liters: round(ml === null
          ? null
          : ml / ML_PER_LITRE, 2),
        flOz: round(ml === null
          ? null
          : ml / ML_PER_FL_OZ_US, 1),
      };
    })
      .sort((a, b) => String(a.time)
        .localeCompare(String(b.time)));

    const selected = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    const trimmedEntries = entries.map((entry) => pluck(entry, selected));

    // Coerced through sumInts like every other total in this app: the roll-up
    // quantity fields are doubles today, but the int64-as-string convention is
    // pervasive enough that an uncoerced `+` is not worth the risk.
    const sumRollup = (points, pick) => sumInts(points.map(pick));

    const totals = wantTotals
      ? {
        calories: round(
          sumRollup(nutritionTotals, (p) => p?.nutritionLog?.energy?.kcalSum), 0,
        ),
        totalFatG: round(
          sumRollup(nutritionTotals, (p) => p?.nutritionLog?.totalFat?.gramsSum), 1,
        ),
        totalCarbohydrateG: round(
          sumRollup(nutritionTotals, (p) => p?.nutritionLog?.totalCarbohydrate?.gramsSum), 1,
        ),
        waterMl: round(
          sumRollup(hydrationTotals, (p) => p?.hydrationLog?.amountConsumed?.millilitersSum), 0,
        ),
      }
      : null;
    if (totals) {
      totals.waterLiters = totals.waterMl === null
        ? null
        : round(totals.waterMl / ML_PER_LITRE, 2);
    }

    $.export("$summary", (entries.length || hydration.length)
      ? `${entries.length} food log(s) and ${hydration.length} hydration log(s) from ${startDate} to ${endDate}`
        + (totals?.calories
          ? `; ${totals.calories} kcal total`
          : "")
      : `Nothing logged between ${startDate} and ${endDate}`);

    return {
      startDate,
      endDate,
      entryCount: entries.length,
      hydrationCount: hydration.length,
      totals,
      entries: trimmedEntries,
      hydration,
      truncated: Boolean(nutritionResponse?.truncated || hydrationResponse?.truncated),
    };
  },
};
