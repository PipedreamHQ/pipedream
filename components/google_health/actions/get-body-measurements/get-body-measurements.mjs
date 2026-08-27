// x-pd-ai: optimized
import app from "../../google_health.app.mjs";
import {
  addDays,
  buildTimeFilter,
  int,
  pluck,
  resolveRange,
  round,
} from "../../common/utils.mjs";

const GRAMS_PER_KG = 1000;
const LB_PER_KG = 2.20462262;
const MM_PER_CM = 10;
const MM_PER_INCH = 25.4;

const DEFAULT_FIELDS = [
  "time",
  "weightKg",
  "weightLb",
  "bmi",
];

export default {
  key: "google_health-get-body-measurements",
  name: "Get Body Measurements",
  description: "Get the user's weight logs with **computed BMI**, their body-fat percentage logs, and their current height. Raw logs, so there is no date cap; at most 1000 weigh-ins per call, with `truncated` set when there were more. Example: startDate=\"2026-08-01\", endDate=\"2026-08-25\" → `weightLogs: [{ time, weightKg: 74.2, weightLb: 163.6, bmi: 22.9, notes }]`, `bodyFatLogs: [{ time, percentage }]`, and `height: { heightCm, heightIn, measuredAt }`. Two things to tell the user rather than guess: the API has **no BMI field**, so BMI is computed here as kg ÷ height in m² and is `null` when no height is on record. Body fat is measured separately from weight, so a weigh-in on a scale without body composition appears in `weightLogs` with no matching `bodyFatLogs` entry. [See the documentation](https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints/list)",
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
    includeBodyFat: {
      type: "boolean",
      label: "Include Body Fat",
      description: "Include body-fat percentage logs. Defaults to `true`.",
      default: true,
      optional: true,
    },
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
      description: "Field names to keep on each weight log. Defaults to a compact set: "
        + DEFAULT_FIELDS.join(", ")
        + ". Available: time, utcOffset, weightGrams, weightKg, weightLb, bmi, notes.",
    },
  },
  async run({ $ }) {
    // No `rollUpDataTypes`: every read below is a `list` call, which the API
    // does not range-cap. Weight and body fat do support roll-up, but this
    // action does not use it.
    const {
      startDate,
      endDate,
      endExclusive,
    } = resolveRange({
      startDate: this.startDate,
      endDate: this.endDate,
    });

    const listRange = (dataType, pageSize = 200) => this.app.listAllDataPoints({
      $,
      dataType,
      filter: buildTimeFilter({
        dataType,
        startDate,
        endExclusive,
      }),
      pageSize,
    });

    const [
      weightResponse,
      bodyFatResponse,
      heightResponse,
    ] = await Promise.all([
      listRange("weight"),
      this.includeBodyFat === false
        ? Promise.resolve(null)
        : listRange("body-fat"),
      // Height is a standing measurement, not a daily one — it may have been
      // recorded years before the requested window, so it is fetched over a
      // wide lookback rather than the caller's range. Without it there is no
      // BMI at all.
      this.app.listAllDataPoints({
        $,
        dataType: "height",
        filter: buildTimeFilter({
          dataType: "height",
          startDate: addDays(startDate, -3650),
          endExclusive,
        }),
        pageSize: 10,
        maxPages: 1,
      }),
    ]);

    // Data points come back newest-first, so the head is the current height.
    const heightPoint = heightResponse?.dataPoints?.[0]?.height;
    const heightMm = int(heightPoint?.heightMillimeters);
    const height = heightMm === null
      ? null
      : {
        heightCm: round(heightMm / MM_PER_CM, 1),
        heightIn: round(heightMm / MM_PER_INCH, 1),
        measuredAt: heightPoint?.sampleTime?.physicalTime ?? null,
      };
    const heightMetres = heightMm === null
      ? null
      : heightMm / 1000;

    const weightLogs = (weightResponse?.dataPoints ?? []).map((point) => {
      const payload = point?.weight;
      const grams = int(payload?.weightGrams);
      const kg = grams === null
        ? null
        : grams / GRAMS_PER_KG;
      return {
        time: payload?.sampleTime?.physicalTime ?? null,
        utcOffset: payload?.sampleTime?.utcOffset ?? null,
        weightGrams: grams,
        weightKg: round(kg, 2),
        weightLb: kg === null
          ? null
          : round(kg * LB_PER_KG, 1),
        bmi: (kg === null || !heightMetres)
          ? null
          : round(kg / (heightMetres * heightMetres), 1),
        notes: payload?.notes ?? null,
      };
    });

    const bodyFatLogs = (bodyFatResponse?.dataPoints ?? []).map((point) => ({
      time: point?.bodyFat?.sampleTime?.physicalTime ?? null,
      percentage: round(point?.bodyFat?.percentage, 1),
    }));

    const selected = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    const trimmedWeightLogs = weightLogs.map((log) => pluck(log, selected));

    const latest = weightLogs[0] ?? null;

    $.export("$summary", weightLogs.length
      ? `${weightLogs.length} weight log(s) from ${startDate} to ${endDate}`
        + (latest?.weightKg
          ? `; latest ${latest.weightKg} kg`
          : "")
        + (latest?.bmi
          ? ` (BMI ${latest.bmi})`
          : height
            ? ""
            : " — no height on record, so BMI could not be computed")
      : `No weight logs between ${startDate} and ${endDate}`);

    return {
      startDate,
      endDate,
      height,
      bmiComputable: Boolean(heightMetres),
      weightLogCount: weightLogs.length,
      weightLogs: trimmedWeightLogs,
      bodyFatLogs,
      truncated: Boolean(weightResponse?.truncated || bodyFatResponse?.truncated),
    };
  },
};
