import schedule from "../../schedule.app.mjs";

export default {
  name: "Weekly schedule",
  version: "0.0.1",
  key: "schedule-weekly",
  type: "source",
  description: "Trigger your workflow on one or more days each week at a specific time (with timezone support).",
  props: {
    schedule,
    cron: {
      propDefinition: [
        schedule,
        "cron",
      ],
      default: {
        cron: "0 10 * * 1",
      },
    },
  },
};

