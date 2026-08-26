import app from "../../google_health.app.mjs";

export default {
  key: "google_health-get-daily-steps",
  name: "Get Daily Step Count",
  description: "Get the user's total step count per day, for a single date or a date range. This is the tool for any \"how many steps\" question. It returns one pre-aggregated total per day, not raw samples, so it stays small even over long ranges. Use **Get Daily Activity Summary** instead when the user wants distance, calories, active minutes, or floors alongside steps. Dates are `YYYY-MM-DD` and are interpreted in the user's own timezone. The range is inclusive on both ends and capped at 90 days. Example: to get last week's steps, call with startDate=\"2026-08-17\" and endDate=\"2026-08-23\" → returns `days: [{ date: \"2026-08-17\", steps: 8432 }, ...]` plus `totalSteps` and `averageSteps` across the range. Set dataSourceFamily=\"google-wearables\" to count only what a Fitbit tracker or Pixel Watch recorded, excluding manually entered steps. An empty `days` array means no step data has synced for those dates — report that, rather than reporting zero steps. [See the documentation](https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints/dailyRollUp)",
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
      dataTypes: [
        "steps",
      ],
    });

    const rollups = await this.app.dailyRollUp({
      $,
      dataType: "steps",
      startDate,
      endExclusive,
      dataSourceFamily: this.dataSourceFamily,
    });

    const days = rollups.map((point) => ({
      date: this.app._civilDateToString(point?.civilStartTime),
      steps: this.app._int(point?.steps?.countSum) ?? 0,
    }));

    const totalSteps = this.app._sumInts(days.map((d) => d.steps)) ?? 0;
    const averageSteps = days.length
      ? Math.round(totalSteps / days.length)
      : null;

    $.export("$summary", days.length
      ? `${totalSteps.toLocaleString("en-US")} steps across ${days.length} day(s) from ${startDate} to ${endDate}`
      : `No step data has synced for ${startDate} to ${endDate}`);

    return {
      startDate,
      endDate,
      daysRequested: dayCount,
      daysWithData: days.length,
      totalSteps,
      averageSteps,
      days,
    };
  },
};
