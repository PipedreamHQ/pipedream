// x-pd-ai: optimized
import app from "../../google_health.app.mjs";
import {
  civilDateToString,
  int,
  resolveRange,
  sumInts,
} from "../../common/utils.mjs";

export default {
  key: "google_health-get-daily-steps",
  name: "Get Daily Step Count",
  description: "Get the user's total step count per day — the tool for any \"how many steps\" question. Returns one pre-aggregated total per day, not raw samples. Use **Get Daily Activity Summary** instead when distance, calories, active minutes, or floors are wanted alongside steps. The range is inclusive and capped at 90 days, because these totals are server-aggregated. Example: startDate=\"2026-08-17\", endDate=\"2026-08-23\" → `days: [{ date, steps: 8432 }, ...]` plus `totalSteps`, `averageSteps`, `daysRequested` and `daysWithData`. Set dataSourceFamily=\"google-wearables\" to count only tracker-recorded steps, excluding manual entries. Days the tracker never reported are omitted from `days` entirely, so `daysWithData` can be lower than `daysRequested` and `averageSteps` is the mean over `daysWithData`. An empty `days` array means nothing synced, not zero steps — `totalSteps` and `averageSteps` are `null` in that case rather than 0. [See the documentation](https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints/dailyRollUp)",
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
    } = resolveRange({
      startDate: this.startDate,
      endDate: this.endDate,
      rollUpDataTypes: [
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
      date: civilDateToString(point?.civilStartTime),
      steps: int(point?.steps?.countSum),
    }))
      // A roll-up window can come back with no step payload at all. Keeping it
      // would count the day in `daysWithData` and drag `averageSteps` down with
      // a phantom zero, when the honest answer is that nothing synced that day.
      .filter((d) => d.steps !== null);

    // Null, not 0, when no day reported: "nothing has synced" and "the user
    // took zero steps" are different answers.
    const totalSteps = sumInts(days.map((d) => d.steps));
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
      // Averaged over days that actually reported, not over daysRequested.
      averageSteps,
      averageStepsBasis: "daysWithData",
      days,
    };
  },
};
