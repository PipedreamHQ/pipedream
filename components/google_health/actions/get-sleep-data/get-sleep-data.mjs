// x-pd-ai: optimized
import app from "../../google_health.app.mjs";
import {
  buildTimeFilter,
  int,
  pluck,
  resolveRange,
  round,
  sumInts,
} from "../../common/utils.mjs";

const DEFAULT_FIELDS = [
  "startTime",
  "endTime",
  "type",
  "isMainSleep",
  "isNap",
  "minutesAsleep",
  "minutesAwake",
  "minutesInSleepPeriod",
  "minutesToFallAsleep",
  "efficiency",
  "stageTotals",
];

export default {
  key: "google_health-get-sleep-data",
  name: "Get Sleep Data",
  description: "Get the user's sleep sessions with per-stage totals, time asleep and awake, and a derived efficiency figure. A session is attributed to the date the user **woke up**, matching Fitbit — asking for 2026-08-24 returns the night of the 23rd into the 24th. Example: startDate=\"2026-08-24\" → `sessions: [{ startTime, endTime, type: \"STAGES\", isMainSleep: true, minutesAsleep: 431, minutesAwake: 48, efficiency: 0.9, stageTotals: { LIGHT: 240, DEEP: 71, REM: 120, AWAKE: 48 } }]`, plus `mainSleep` and `totalMinutesAsleep`. Three things to tell the user rather than invent: this API has **no sleep score**, so none is returned, and `efficiency` is computed here as time asleep over time in bed — not the figure Fitbit showed. Stage names depend on `type`, so read `stageTotals` rather than assuming a fixed set: `STAGES` sessions report LIGHT/DEEP/REM/AWAKE, older `CLASSIC` ones only ASLEEP/AWAKE/RESTLESS. Naps are separate sessions with `isNap: true`. At most 125 sessions per call; `truncated: true` means narrow the range. [See the documentation](https://developers.google.com/health/reference/rest/v4/users.dataTypes.dataPoints/list)",
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
    fields: {
      propDefinition: [
        app,
        "fields",
      ],
      description: "Field names to keep on each session. Defaults to a compact set: "
        + DEFAULT_FIELDS.join(", ")
        + ". Also available (excluded by default because they are verbose): `stages` (every individual stage segment), `shortAwakenings`, `outOfBedSegments`, `stagesStatus`, `minutesAfterWakeUp`, `utcOffset`.",
    },
  },
  async run({ $ }) {
    // No `rollUpDataTypes`: `sleep` has no roll-up operation at all, so this is
    // a pure `list` call and the roll-up range caps do not apply. The 5-page
    // ceiling below is what bounds the response.
    const {
      startDate,
      endDate,
      endExclusive,
    } = resolveRange({
      startDate: this.startDate,
      endDate: this.endDate,
    });

    // The API caps `sleep` page size at 25 — that is a truncation point, not a
    // guarantee of completeness, so this follows the cursor and reports if it
    // still ran out of pages.
    const response = await this.app.listAllDataPoints({
      $,
      dataType: "sleep",
      filter: buildTimeFilter({
        dataType: "sleep",
        startDate,
        endExclusive,
      }),
      pageSize: 25,
      maxPages: 5,
    });

    const sessions = (response?.dataPoints ?? []).map((point) => {
      const sleep = point?.sleep;
      const summary = sleep?.summary ?? {};
      const metadata = sleep?.metadata ?? {};

      // Stage totals are keyed off whatever this session actually contains.
      // A CLASSIC session has no LIGHT/DEEP/REM at all, so a fixed shape would
      // report four zeros next to a non-zero minutesAsleep — a contradiction
      // the caller has no way to resolve.
      const stageTotals = {};
      for (const stage of summary.stagesSummary ?? []) {
        if (!stage?.type) {
          continue;
        }
        stageTotals[stage.type] = int(stage.minutes);
      }

      const minutesAsleep = int(summary.minutesAsleep);
      const minutesInBed = int(summary.minutesInSleepPeriod);

      return {
        startTime: sleep?.interval?.startTime ?? null,
        endTime: sleep?.interval?.endTime ?? null,
        utcOffset: sleep?.interval?.startUtcOffset ?? null,
        // CLASSIC or STAGES — the caller needs this to know which stage
        // vocabulary stageTotals is using.
        type: sleep?.type ?? null,
        isMainSleep: metadata.mainSleep ?? null,
        isNap: metadata.nap ?? null,
        stagesStatus: metadata.stagesStatus ?? null,
        minutesAsleep,
        minutesAwake: int(summary.minutesAwake),
        minutesInSleepPeriod: minutesInBed,
        minutesToFallAsleep: int(summary.minutesToFallAsleep),
        minutesAfterWakeUp: int(summary.minutesAfterWakeUp),
        // Derived, not native. Fitbit's own efficiency figure used a different
        // formula, so this will not match it exactly.
        efficiency: (minutesAsleep !== null && minutesInBed)
          ? round(minutesAsleep / minutesInBed, 2)
          : null,
        stageTotals,
        stages: sleep?.stages ?? [],
        shortAwakenings: sleep?.shortAwakenings ?? [],
        outOfBedSegments: sleep?.outOfBedSegments ?? [],
      };
    })
      .sort((a, b) => String(b.startTime)
        .localeCompare(String(a.startTime)));

    const selected = this.fields?.length
      ? this.fields
      : DEFAULT_FIELDS;
    const trimmed = sessions.map((session) => pluck(session, selected));

    const mainSleep = sessions.find((s) => s.isMainSleep) ?? sessions[0] ?? null;
    const totalMinutesAsleep = sumInts(sessions.map((s) => s.minutesAsleep));

    $.export("$summary", sessions.length
      ? `${sessions.length} sleep session(s) from ${startDate} to ${endDate}`
        + (mainSleep?.minutesAsleep
          ? `; main sleep ${Math.floor(mainSleep.minutesAsleep / 60)}h ${mainSleep.minutesAsleep % 60}m asleep`
          : "")
      : `No sleep data has synced for ${startDate} to ${endDate}`);

    return {
      startDate,
      endDate,
      sessionCount: sessions.length,
      totalMinutesAsleep,
      mainSleep: mainSleep
        ? pluck(mainSleep, selected)
        : null,
      sessions: trimmed,
      sleepScoreAvailable: false,
      truncated: response?.truncated ?? false,
    };
  },
};
