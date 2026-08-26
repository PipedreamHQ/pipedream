import app from "../../google_health.app.mjs";

/**
 * The data types the summary aggregates. `total-calories` and `floors` have no
 * `list` operation at all in this API — roll-up is the only way to read them,
 * which is why this action exists rather than callers assembling it themselves.
 */
const SUMMARY_DATA_TYPES = [
  "steps",
  "distance",
  "total-calories",
  "active-energy-burned",
  "active-minutes",
  "active-zone-minutes",
  "floors",
];

const MM_PER_KM = 1000000;
const MM_PER_MILE = 1609344;

export default {
  key: "google_health-get-daily-activity-summary",
  name: "Get Daily Activity Summary",
  description: "Get a complete daily activity summary: steps, distance, calories burned, active minutes by intensity, active zone minutes by heart rate zone, and floors climbed. This is the replacement for Fitbit's daily activity summary and the right tool whenever the user wants an overall picture of a day rather than one metric. Use **Get Daily Step Count** if steps alone are wanted, or **Get Heart Rate** for heart rate detail. Dates are `YYYY-MM-DD` in the user's own timezone; the range is inclusive and **capped at 14 days** (calories and active minutes impose that limit). Example: to summarize yesterday, call with startDate=\"2026-08-24\" → returns `days: [{ date, steps: 8432, distanceKm: 6.1, totalCalories: 2380, activeCalories: 620, activeMinutes: { light, moderate, vigorous, total }, activeZoneMinutes: { fatBurn, cardio, peak, total }, floors: 12 }]`. Set dataSourceFamily=\"google-wearables\" to exclude manually logged activity. Two caveats worth passing on to the user: this API has no concept of daily goals, so no targets are returned; and `activeZoneMinutes.total` follows Fitbit's convention of double-weighting cardio and peak minutes (`fatBurn + 2×cardio + 2×peak`). An empty `days` array means nothing has synced for those dates — say so rather than reporting zeros. [See the documentation](https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints/dailyRollUp)",
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
    dataSourceFamily: {
      propDefinition: [
        app,
        "dataSourceFamily",
      ],
    },
  },
  async run({ $ }) {
    const {
      startDate,
      endDate,
      endExclusive,
      days: dayCount,
    } = this.app._resolveRange({
      startDate: this.startDate,
      endDate: this.endDate,
      dataTypes: SUMMARY_DATA_TYPES,
    });

    // A bounded fan-out, not an N+1: seven concurrent roll-ups regardless of
    // how many days were requested.
    const responses = await Promise.all(SUMMARY_DATA_TYPES.map((dataType) =>
      this.app.dailyRollUp({
        $,
        dataType,
        startDate,
        endExclusive,
        dataSourceFamily: this.dataSourceFamily,
      })));

    // Merge by civil date — each roll-up returns its own day list, and a day
    // may be present in some and absent from others.
    const byDate = new Map();
    const dayFor = (point) => {
      const date = this.app._civilDateToString(point?.civilStartTime);
      if (!date) {
        return null;
      }
      if (!byDate.has(date)) {
        byDate.set(date, {
          date,
          steps: null,
          distanceKm: null,
          distanceMiles: null,
          totalCalories: null,
          activeCalories: null,
          activeMinutes: {
            light: null,
            moderate: null,
            vigorous: null,
            total: null,
          },
          activeZoneMinutes: {
            fatBurn: null,
            cardio: null,
            peak: null,
            total: null,
          },
          floors: null,
        });
      }
      return byDate.get(date);
    };

    SUMMARY_DATA_TYPES.forEach((dataType, index) => {
      for (const point of responses[index]) {
        const day = dayFor(point);
        if (!day) {
          continue;
        }

        if (dataType === "steps") {
          day.steps = this.app._int(point?.steps?.countSum);
        } else if (dataType === "distance") {
          const mm = this.app._int(point?.distance?.millimetersSum);
          day.distanceKm = mm === null
            ? null
            : this.app._round(mm / MM_PER_KM);
          day.distanceMiles = mm === null
            ? null
            : this.app._round(mm / MM_PER_MILE);
        } else if (dataType === "total-calories") {
          day.totalCalories = this.app._round(point?.totalCalories?.kcalSum, 0);
        } else if (dataType === "active-energy-burned") {
          day.activeCalories = this.app._round(point?.activeEnergyBurned?.kcalSum, 0);
        } else if (dataType === "active-minutes") {
          const byLevel = point?.activeMinutes?.activeMinutesRollupByActivityLevel ?? [];
          for (const entry of byLevel) {
            const minutes = this.app._int(entry?.activeMinutesSum);
            if (entry?.activityLevel === "LIGHT") day.activeMinutes.light = minutes;
            if (entry?.activityLevel === "MODERATE") day.activeMinutes.moderate = minutes;
            if (entry?.activityLevel === "VIGOROUS") day.activeMinutes.vigorous = minutes;
          }
          day.activeMinutes.total = this.app._sumInts([
            day.activeMinutes.light,
            day.activeMinutes.moderate,
            day.activeMinutes.vigorous,
          ]);
        } else if (dataType === "active-zone-minutes") {
          const azm = point?.activeZoneMinutes;
          day.activeZoneMinutes.fatBurn = this.app._int(azm?.sumInFatBurnHeartZone);
          day.activeZoneMinutes.cardio = this.app._int(azm?.sumInCardioHeartZone);
          day.activeZoneMinutes.peak = this.app._int(azm?.sumInPeakHeartZone);
          // The API returns no total. Fitbit's Active Zone Minutes convention
          // counts cardio and peak minutes double, so a plain sum would not
          // match the figure a Fitbit user recognises.
          const weighted = this.app._sumInts([
            day.activeZoneMinutes.fatBurn,
            day.activeZoneMinutes.cardio,
            day.activeZoneMinutes.cardio,
            day.activeZoneMinutes.peak,
            day.activeZoneMinutes.peak,
          ]);
          day.activeZoneMinutes.total = weighted;
        } else if (dataType === "floors") {
          day.floors = this.app._int(point?.floors?.countSum);
        }
      }
    });

    const days = [
      ...byDate.values(),
    ].sort((a, b) => a.date.localeCompare(b.date));

    const totals = {
      steps: this.app._sumInts(days.map((d) => d.steps)),
      distanceKm: this.app._round(
        days.reduce((sum, d) => sum + (d.distanceKm ?? 0), 0),
      ),
      totalCalories: this.app._sumInts(days.map((d) => d.totalCalories)),
      activeCalories: this.app._sumInts(days.map((d) => d.activeCalories)),
      activeMinutes: this.app._sumInts(days.map((d) => d.activeMinutes.total)),
      activeZoneMinutes: this.app._sumInts(days.map((d) => d.activeZoneMinutes.total)),
      floors: this.app._sumInts(days.map((d) => d.floors)),
    };

    $.export("$summary", days.length
      ? `Activity summary for ${days.length} day(s) from ${startDate} to ${endDate}: `
        + `${(totals.steps ?? 0).toLocaleString("en-US")} steps, ${totals.distanceKm ?? 0} km, `
        + `${(totals.totalCalories ?? 0).toLocaleString("en-US")} kcal`
      : `No activity data has synced for ${startDate} to ${endDate}`);

    return {
      startDate,
      endDate,
      daysRequested: dayCount,
      daysWithData: days.length,
      totals,
      days,
      activeZoneMinutesFormula: "fatBurn + 2 x cardio + 2 x peak (Fitbit's Active Zone Minutes convention)",
    };
  },
};
