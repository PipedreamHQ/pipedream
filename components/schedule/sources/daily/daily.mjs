import schedule from "../../schedule.app.mjs";

export default {
  name: "Daily schedule",
  version: "0.0.1",
  key: "schedule-daily",
  type: "source",
  description: "Trigger your workflow every day.",
  props: {
    schedule,
    cron: {
      propDefinition: [
        schedule,
        "cron",
      ],
      default: {
        cron: "0 11 * * *",
      },
    },
  },
};
