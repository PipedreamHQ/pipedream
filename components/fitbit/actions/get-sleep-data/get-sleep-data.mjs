import fitbit from "../../fitbit.app.mjs";

export default {
  key: "fitbit-get-sleep-data",
  name: "Get Sleep Data",
  description: "Get sleep data for a date, including duration, stages, and sleep score when available. [See the Fitbit Web API documentation](https://dev.fitbit.com/build/reference/web-api/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    fitbit,
    date: {
      propDefinition: [
        fitbit,
        "date",
      ],
    },
  },
  async run({ $ }) {
    const date = this.fitbit._getDateOrToday(this.date);
    const response = await this.fitbit.getSleep({
      $,
      date,
    });

    const sleepEntries = response?.sleep ?? [];
    const mainSleep = sleepEntries.find((entry) => entry?.isMainSleep) ?? sleepEntries[0] ?? null;
    const levelsSummary = mainSleep?.levels?.summary ?? {};

    $.export("$summary", `Successfully retrieved Fitbit sleep data for ${date}.`);
    return {
      date,
      summary: response?.summary ?? null,
      mainSleep: mainSleep
        ? {
          durationMs: mainSleep.duration ?? null,
          startTime: mainSleep.startTime ?? null,
          endTime: mainSleep.endTime ?? null,
          minutesAsleep: mainSleep.minutesAsleep ?? null,
          timeInBed: mainSleep.timeInBed ?? null,
          efficiency: mainSleep.efficiency ?? null,
          stages: {
            deep: levelsSummary?.deep ?? null,
            light: levelsSummary?.light ?? null,
            rem: levelsSummary?.rem ?? null,
            wake: levelsSummary?.wake ?? null,
          },
          sleepScore: mainSleep?.levels?.shortData?.sleepScore
            ?? mainSleep?.score
            ?? mainSleep?.sleepScore
            ?? null,
        }
        : null,
      entries: sleepEntries,
      raw: response,
    };
  },
};
