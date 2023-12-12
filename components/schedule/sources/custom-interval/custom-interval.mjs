import schedule from "../../schedule.app.mjs";

export default {
  name: "Custom Interval",
  version: "0.0.2",
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
