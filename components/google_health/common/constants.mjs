/**
 * GENERATED FILE — do not edit by hand.
 *
 * Regenerate with:
 *   node scripts/gen-google-health-constants.mjs
 *
 * Source: Google Health API discovery document, revision 20260824
 * (archived at mcp-exploration/google_health/discovery-v4-rev20260824.json).
 *
 * `unionKey` is the camelCase key under which a `DataPoint` carries this
 * type's payload (e.g. `dataPoint.heartRate`); `filterParam` is the
 * snake_case name used inside `filter` expressions. They differ, and mixing
 * them up produces a 400 rather than an empty result.
 *
 * Record types are derived from each payload schema's own time field, which is
 * what the `filter` grammar keys off. Note that this makes `nutrition-log`
 * a SESSION record even though the docs page labels it Sample — the schema has
 * `interval: SessionTimeInterval` and no `sampleTime` at all.
 */

export const BASE_URL = "https://health.googleapis.com/v4";

export const USER = "users/me";

/**
 * Aggregation window presets for `rollUp`, which takes a protobuf duration.
 * Fitbit's `detailLevel` equivalent. 1-second granularity is deliberately
 * absent: over a single day it is 86,400 windows.
 */
export const ROLLUP_WINDOWS = [
  {
    label: "1 minute",
    value: "60s",
  },
  {
    label: "5 minutes",
    value: "300s",
  },
  {
    label: "15 minutes",
    value: "900s",
  },
  {
    label: "1 hour",
    value: "3600s",
  },
  {
    label: "Whole day",
    value: "86400s",
  },
];

/**
 * Which data sources to aggregate over. `google-wearables` excludes manually
 * logged data, reproducing Fitbit's tracker-vs-logged distinction.
 */
export const DATA_SOURCE_FAMILIES = [
  {
    label: "All sources (default)",
    value: "all-sources",
  },
  {
    label: "Google and Fitbit wearables only (excludes manual logs)",
    value: "google-wearables",
  },
  {
    label: "All first-party Google sources (devices, manual logs, Health Connect)",
    value: "google-sources",
  },
];

/** Default rollup range cap, in days. Overridden per type below. */
export const DEFAULT_MAX_RANGE_DAYS = 90;

/**
 * The filter field for a time range, by record type. Closed-open: `>= start
 * AND < end`. Civil-time variants throughout, so no tool needs a timezone.
 *
 * SLEEP is deliberately keyed on civil END time: a session running 23:00->07:00
 * belongs to the waking date, which is what Fitbit's /sleep/date/{date}
 * returned. Filtering on start time attributes it to the wrong day.
 */
export const TIME_FILTER_FIELD = {
  INTERVAL: (p) => `${p}.interval.civil_start_time`,
  SAMPLE: (p) => `${p}.sample_time.civil_time`,
  SESSION: (p) => p === "sleep"
    ? "sleep.interval.civil_end_time"
    : `${p}.interval.civil_start_time`,
  DAILY: (p) => `${p}.date`,
  FOOD: () => null,
};

/**
 * int64 fields arrive as JSON strings. Coerce before any sum or division —
 * unguarded, "8432" + "7911" is "84327911".
 */
export const INT64_STRING_FIELDS = [
  "count",
  "countSum",
  "millimeters",
  "millimetersSum",
  "heightMillimeters",
  "beatsPerMinute",
  "activeZoneMinutes",
  "activeMinutesSum",
  "sumInFatBurnHeartZone",
  "sumInCardioHeartZone",
  "sumInPeakHeartZone",
  "minutesAsleep",
  "minutesAwake",
  "minutesInSleepPeriod",
  "minutesToFallAsleep",
  "minutesAfterWakeUp",
];

/** Every data type in the API, keyed by its kebab-case URL segment. */
export const DATA_TYPES = {
  "active-energy-burned": {
    recordType: "INTERVAL",
    filterParam: "active_energy_burned",
    unionKey: "activeEnergyBurned",
    schema: "ActiveEnergyBurned",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "list",
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
  },
  "active-minutes": {
    recordType: "INTERVAL",
    filterParam: "active_minutes",
    unionKey: "activeMinutes",
    schema: "ActiveMinutes",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "list",
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
    maxRangeDays: 14,
  },
  "active-zone-minutes": {
    recordType: "INTERVAL",
    filterParam: "active_zone_minutes",
    unionKey: "activeZoneMinutes",
    schema: "ActiveZoneMinutes",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "list",
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
  },
  "activity-level": {
    recordType: "INTERVAL",
    filterParam: "activity_level",
    unionKey: "activityLevel",
    schema: "ActivityLevel",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "list",
      "reconcile",
    ],
    note: "OQ-2: discovery lists rollup support too; we follow the docs (list/reconcile) as the conservative read",
  },
  "altitude": {
    recordType: "INTERVAL",
    filterParam: "altitude",
    unionKey: "altitude",
    schema: "Altitude",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "list",
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
  },
  "basal-energy-burned": {
    recordType: "INTERVAL",
    filterParam: "basal_energy_burned",
    unionKey: "basalEnergyBurned",
    schema: "BasalEnergyBurned",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "list",
      "reconcile",
    ],
    note: "In the discovery DataPoint union but absent from the docs table — newer than the docs page",
  },
  "blood-glucose": {
    recordType: "SAMPLE",
    filterParam: "blood_glucose",
    unionKey: "bloodGlucose",
    schema: "BloodGlucose",
    scope: "health_metrics_and_measurements",
    readable: true,
    ops: [
      "list",
      "get",
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
  },
  "body-fat": {
    recordType: "SAMPLE",
    filterParam: "body_fat",
    unionKey: "bodyFat",
    schema: "BodyFat",
    scope: "health_metrics_and_measurements",
    readable: true,
    ops: [
      "list",
      "get",
      "reconcile",
      "rollUp",
      "dailyRollUp",
      "create",
      "update",
      "batchDelete",
    ],
  },
  "calories-in-heart-rate-zone": {
    recordType: "INTERVAL",
    filterParam: "calories_in_heart_rate_zone",
    unionKey: "caloriesInHeartRateZone",
    schema: "(rollup-only)",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
    maxRangeDays: 14,
  },
  "core-body-temperature": {
    recordType: "SAMPLE",
    filterParam: "core_body_temperature",
    unionKey: "coreBodyTemperature",
    schema: "CoreBodyTemperature",
    scope: "health_metrics_and_measurements",
    readable: true,
    ops: [
      "list",
      "get",
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
  },
  "daily-heart-rate-variability": {
    recordType: "DAILY",
    filterParam: "daily_heart_rate_variability",
    unionKey: "dailyHeartRateVariability",
    schema: "DailyHeartRateVariability",
    scope: "health_metrics_and_measurements",
    readable: true,
    ops: [
      "list",
      "reconcile",
    ],
  },
  "daily-heart-rate-zones": {
    recordType: "DAILY",
    filterParam: "daily_heart_rate_zones",
    unionKey: "dailyHeartRateZones",
    schema: "DailyHeartRateZones",
    scope: "health_metrics_and_measurements",
    readable: true,
    ops: [
      "list",
      "reconcile",
    ],
  },
  "daily-oxygen-saturation": {
    recordType: "DAILY",
    filterParam: "daily_oxygen_saturation",
    unionKey: "dailyOxygenSaturation",
    schema: "DailyOxygenSaturation",
    scope: "health_metrics_and_measurements",
    readable: true,
    ops: [
      "list",
      "reconcile",
    ],
  },
  "daily-respiratory-rate": {
    recordType: "DAILY",
    filterParam: "daily_respiratory_rate",
    unionKey: "dailyRespiratoryRate",
    schema: "DailyRespiratoryRate",
    scope: "health_metrics_and_measurements",
    readable: true,
    ops: [
      "list",
      "reconcile",
    ],
  },
  "daily-resting-heart-rate": {
    recordType: "DAILY",
    filterParam: "daily_resting_heart_rate",
    unionKey: "dailyRestingHeartRate",
    schema: "DailyRestingHeartRate",
    scope: "health_metrics_and_measurements",
    readable: true,
    ops: [
      "list",
      "reconcile",
    ],
  },
  "daily-sleep-temperature-derivations": {
    recordType: "DAILY",
    filterParam: "daily_sleep_temperature_derivations",
    unionKey: "dailySleepTemperatureDerivations",
    schema: "DailySleepTemperatureDerivations",
    scope: "health_metrics_and_measurements",
    readable: true,
    ops: [
      "list",
      "reconcile",
    ],
  },
  "daily-vo2-max": {
    recordType: "DAILY",
    filterParam: "daily_vo2_max",
    unionKey: "dailyVo2Max",
    schema: "DailyVO2Max",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "list",
      "reconcile",
    ],
  },
  "distance": {
    recordType: "INTERVAL",
    filterParam: "distance",
    unionKey: "distance",
    schema: "Distance",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "list",
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
  },
  "electrocardiogram": {
    recordType: "SESSION",
    filterParam: "electrocardiogram",
    unionKey: "electrocardiogram",
    schema: "Electrocardiogram",
    scope: "ecg",
    readable: false,
    ops: [
      "list",
    ],
    unreachable: "needs googlehealth.ecg.readonly, which we do not request",
  },
  "exercise": {
    recordType: "SESSION",
    filterParam: "exercise",
    unionKey: "exercise",
    schema: "Exercise",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "list",
      "get",
      "reconcile",
      "create",
      "update",
      "batchDelete",
    ],
  },
  "floors": {
    recordType: "INTERVAL",
    filterParam: "floors",
    unionKey: "floors",
    schema: "Floors",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
  },
  "food": {
    recordType: "FOOD",
    filterParam: "food",
    unionKey: "food",
    schema: "Food",
    scope: "nutrition",
    readable: true,
    ops: [
      "list",
      "get",
    ],
  },
  "food-measurement-unit": {
    recordType: "FOOD",
    filterParam: "food_measurement_unit",
    unionKey: "foodMeasurementUnit",
    schema: "FoodMeasurementUnit",
    scope: "nutrition",
    readable: true,
    ops: [
      "list",
      "get",
    ],
  },
  "heart-rate": {
    recordType: "SAMPLE",
    filterParam: "heart_rate",
    unionKey: "heartRate",
    schema: "HeartRate",
    scope: "health_metrics_and_measurements",
    readable: true,
    ops: [
      "list",
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
    maxRangeDays: 14,
  },
  "heart-rate-variability": {
    recordType: "SAMPLE",
    filterParam: "heart_rate_variability",
    unionKey: "heartRateVariability",
    schema: "HeartRateVariability",
    scope: "health_metrics_and_measurements",
    readable: true,
    ops: [
      "list",
      "reconcile",
    ],
  },
  "height": {
    recordType: "SAMPLE",
    filterParam: "height",
    unionKey: "height",
    schema: "Height",
    scope: "health_metrics_and_measurements",
    readable: true,
    ops: [
      "list",
      "get",
      "reconcile",
      "create",
      "update",
      "batchDelete",
    ],
  },
  "hydration-log": {
    recordType: "SESSION",
    filterParam: "hydration_log",
    unionKey: "hydrationLog",
    schema: "HydrationLog",
    scope: "nutrition",
    readable: true,
    ops: [
      "list",
      "get",
      "reconcile",
      "rollUp",
      "dailyRollUp",
      "create",
      "update",
      "batchDelete",
    ],
  },
  "irregular-rhythm-notification": {
    recordType: "SESSION",
    filterParam: "irregular_rhythm_notification",
    unionKey: "irregularRhythmNotification",
    schema: "IrregularRhythmNotification",
    scope: "irn",
    readable: false,
    ops: [
      "list",
    ],
    unreachable: "needs googlehealth.irn.readonly, which we do not request",
  },
  "menstrual-period": {
    recordType: "INTERVAL",
    filterParam: "menstrual_period",
    unionKey: "menstrualPeriod",
    schema: "MenstrualPeriod",
    scope: "reproductive_health",
    readable: false,
    ops: [
      "create",
      "update",
      "batchDelete",
    ],
  },
  "moods": {
    recordType: "SAMPLE",
    filterParam: "moods",
    unionKey: "moods",
    schema: "Moods",
    scope: "mindfulness",
    readable: false,
    ops: [
      "create",
      "update",
      "batchDelete",
    ],
  },
  "nutrition-log": {
    recordType: "SESSION",
    filterParam: "nutrition_log",
    unionKey: "nutritionLog",
    schema: "NutritionLog",
    scope: "nutrition",
    readable: true,
    ops: [
      "list",
      "get",
      "reconcile",
      "rollUp",
      "dailyRollUp",
      "create",
      "update",
      "batchDelete",
    ],
    note: "OQ-1: docs say record type Sample, but the schema has interval:SessionTimeInterval and no sampleTime — built as SESSION",
  },
  "ovulation-test": {
    recordType: "SAMPLE",
    filterParam: "ovulation_test",
    unionKey: "ovulationTest",
    schema: "OvulationTest",
    scope: "reproductive_health",
    readable: false,
    ops: [
      "create",
      "update",
      "batchDelete",
    ],
  },
  "oxygen-saturation": {
    recordType: "SAMPLE",
    filterParam: "oxygen_saturation",
    unionKey: "oxygenSaturation",
    schema: "OxygenSaturation",
    scope: "health_metrics_and_measurements",
    readable: true,
    ops: [
      "list",
      "reconcile",
    ],
  },
  "respiratory-rate-sleep-summary": {
    recordType: "SAMPLE",
    filterParam: "respiratory_rate_sleep_summary",
    unionKey: "respiratoryRateSleepSummary",
    schema: "RespiratoryRateSleepSummary",
    scope: "health_metrics_and_measurements",
    readable: true,
    ops: [
      "list",
      "reconcile",
    ],
  },
  "run-vo2-max": {
    recordType: "SAMPLE",
    filterParam: "run_vo2_max",
    unionKey: "runVo2Max",
    schema: "RunVO2Max",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "list",
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
  },
  "sedentary-period": {
    recordType: "INTERVAL",
    filterParam: "sedentary_period",
    unionKey: "sedentaryPeriod",
    schema: "SedentaryPeriod",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "list",
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
  },
  "sleep": {
    recordType: "SESSION",
    filterParam: "sleep",
    unionKey: "sleep",
    schema: "Sleep",
    scope: "sleep",
    readable: true,
    ops: [
      "list",
      "get",
      "reconcile",
      "create",
      "update",
      "batchDelete",
    ],
    maxPageSize: 25,
  },
  "steps": {
    recordType: "INTERVAL",
    filterParam: "steps",
    unionKey: "steps",
    schema: "Steps",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "list",
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
  },
  "swim-lengths-data": {
    recordType: "INTERVAL",
    filterParam: "swim_lengths_data",
    unionKey: "swimLengthsData",
    schema: "SwimLengthsData",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "list",
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
  },
  "symptoms": {
    recordType: "SAMPLE",
    filterParam: "symptoms",
    unionKey: "symptoms",
    schema: "Symptoms",
    scope: "logged_symptoms",
    readable: false,
    ops: [
      "create",
      "update",
      "batchDelete",
    ],
  },
  "time-in-heart-rate-zone": {
    recordType: "INTERVAL",
    filterParam: "time_in_heart_rate_zone",
    unionKey: "timeInHeartRateZone",
    schema: "TimeInHeartRateZone",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "list",
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
  },
  "total-calories": {
    recordType: "INTERVAL",
    filterParam: "total_calories",
    unionKey: "totalCalories",
    schema: "(rollup-only)",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "reconcile",
      "rollUp",
      "dailyRollUp",
    ],
    maxRangeDays: 14,
    note: "Queries must include a time interval filter",
  },
  "vo2-max": {
    recordType: "SAMPLE",
    filterParam: "vo2_max",
    unionKey: "vo2Max",
    schema: "VO2Max",
    scope: "activity_and_fitness",
    readable: true,
    ops: [
      "list",
      "reconcile",
    ],
  },
  "weight": {
    recordType: "SAMPLE",
    filterParam: "weight",
    unionKey: "weight",
    schema: "Weight",
    scope: "health_metrics_and_measurements",
    readable: true,
    ops: [
      "list",
      "get",
      "reconcile",
      "rollUp",
      "dailyRollUp",
      "create",
      "update",
      "batchDelete",
    ],
  },
};

/**
 * The data types `list-data-points` offers: readable under the four scopes we
 * hold AND supporting `list`. 35 of 44.
 *
 * Excluded: the three rollup-only types (total-calories, floors,
 * calories-in-heart-rate-zone), the four write-only-scope types nobody can
 * read, and electrocardiogram / irregular-rhythm-notification, whose scopes we
 * deliberately do not request.
 */
export const LISTABLE_DATA_TYPES = [
  "active-energy-burned",
  "active-minutes",
  "active-zone-minutes",
  "activity-level",
  "altitude",
  "basal-energy-burned",
  "blood-glucose",
  "body-fat",
  "core-body-temperature",
  "daily-heart-rate-variability",
  "daily-heart-rate-zones",
  "daily-oxygen-saturation",
  "daily-respiratory-rate",
  "daily-resting-heart-rate",
  "daily-sleep-temperature-derivations",
  "daily-vo2-max",
  "distance",
  "exercise",
  "food",
  "food-measurement-unit",
  "heart-rate",
  "heart-rate-variability",
  "height",
  "hydration-log",
  "nutrition-log",
  "oxygen-saturation",
  "respiratory-rate-sleep-summary",
  "run-vo2-max",
  "sedentary-period",
  "sleep",
  "steps",
  "swim-lengths-data",
  "time-in-heart-rate-zone",
  "vo2-max",
  "weight",
];

/** Rollup-only types, mapped to the tool that does expose them. */
export const ROLLUP_ONLY_TOOL_HINT = {
  "total-calories": "Get Daily Activity Summary",
  "floors": "Get Daily Activity Summary",
  "calories-in-heart-rate-zone": "Get Daily Activity Summary",
};
