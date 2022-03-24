import schedule from "../../schedule.app.mjs";

export default {
  name: "Schedule based on a custom interval",
  version: "0.0.1",
  key: "schedule-custom-interval",
  type: "source",
  description: "Trigger your workflow every N hours, minutes or seconds.",
  props: {
    schedule,
    cron: {
      propDefinition: [
        schedule,
        "cron",
      ],
    },
  },
};
