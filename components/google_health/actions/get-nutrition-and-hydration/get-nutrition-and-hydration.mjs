import app from "../../google_health.app.mjs";

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
  description: "Get the user's logged food and water intake for a date or range, with daily calorie and macro totals. This replaces Fitbit's nutrition and water logs action. Dates are `YYYY-MM-DD` in the user's own timezone and the range is inclusive. Example: to see what the user ate and drank yesterday, call with startDate=\"2026-08-24\" → returns `entries: [{ time, foodDisplayName: \"Greek yogurt\", mealType: \"BREAKFAST\", calories: 180, totalFatG: 4.5, totalCarbohydrateG: 9 }]`, `hydration: [{ time, milliliters: 500, liters: 0.5, flOz: 16.9 }]`, and `totals` for the whole range. Set includeTotals=false to skip the aggregate query when only individual entries matter. Notes worth passing on: only food the user **logged manually** appears here — nothing is inferred from activity, so an empty result means nothing was logged rather than nothing was eaten. `mealType` is one of BEFORE_BREAKFAST, BREAKFAST, BEFORE_LUNCH, LUNCH, BEFORE_DINNER, DINNER, AFTER_DINNER, SNACK, or ANYTIME. The full micronutrient breakdown is omitted by default because it spans forty nutrients — include `nutrients` in `fields` to get it. [See the documentation](https://developers.google.com/health/data-types/nutrition)",
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
    includeTotals: {
      type: "boolean",
      label: "Include Totals",
      description: "Include aggregated calorie, macro, and water totals for the range. Defaults to `true`.",
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
    const {
      startDate,
      endDate,
      endExclusive,
    } = this.app._resolveRange({
      startDate: this.startDate,
      endDate: this.endDate,
      dataTypes: [
        "nutrition-log",
        "hydration-log",
      ],
    });

    const listRange = (dataType) => this.app.listAllDataPoints({
      $,
      dataType,
      filter: this.app._buildTimeFilter({
        dataType,
        startDate,
        endExclusive,
      }),
      pageSize: 200,
    });

    const wantTotals = this.includeTotals !== false;

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
        calories: this.app._round(log?.energy?.kcal, 0),
        energyFromFatKcal: this.app._round(log?.energyFromFat?.kcal, 0),
        totalFatG: this.app._round(log?.totalFat?.grams, 1),
        totalCarbohydrateG: this.app._round(log?.totalCarbohydrate?.grams, 1),
        servingAmount: log?.serving?.amount ?? null,
        servingUnit: log?.serving?.foodMeasurementUnitDisplayName
          ?? log?.serving?.foodMeasurementUnit
          ?? null,
        nutrients: (log?.nutrients ?? []).map((n) => ({
          nutrient: n?.nutrient ?? null,
          grams: this.app._round(n?.quantity?.grams, 2),
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
        milliliters: this.app._round(ml, 0),
        liters: ml === null
          ? null
          : this.app._round(ml / ML_PER_LITRE, 2),
        flOz: ml === null
          ? null
          : this.app._round(ml / ML_PER_FL_OZ_US, 1),
      };
    })
      .sort((a, b) => String(a.time)
        .localeCompare(String(b.time)));

    const selected = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    const trimmedEntries = entries.map((entry) => this.app.pluck(entry, selected));

    const sumRollup = (points, pick) => {
      const values = points
        .map(pick)
        .filter((v) => v !== null && v !== undefined);
      return values.length
        ? values.reduce((a, b) => a + b, 0)
        : null;
    };

    const totals = wantTotals
      ? {
        calories: this.app._round(
          sumRollup(nutritionTotals, (p) => p?.nutritionLog?.energy?.kcalSum), 0,
        ),
        totalFatG: this.app._round(
          sumRollup(nutritionTotals, (p) => p?.nutritionLog?.totalFat?.gramsSum), 1,
        ),
        totalCarbohydrateG: this.app._round(
          sumRollup(nutritionTotals, (p) => p?.nutritionLog?.totalCarbohydrate?.gramsSum), 1,
        ),
        waterMl: this.app._round(
          sumRollup(hydrationTotals, (p) => p?.hydrationLog?.amountConsumed?.millilitersSum), 0,
        ),
      }
      : null;
    if (totals) {
      totals.waterLiters = totals.waterMl === null
        ? null
        : this.app._round(totals.waterMl / ML_PER_LITRE, 2);
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
      nextPageToken: nutritionResponse?.nextPageToken ?? null,
    };
  },
};
