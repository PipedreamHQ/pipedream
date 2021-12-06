import todoist from "../todoist.app.mjs";

export default {
  props: {
    todoist,
    timer: {
      type: "$.interface.timer",
      label: "Polling Interval",
      description: "Pipedream will poll the Todoist API on this schedule",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
    db: "$.service.db",
  },
  methods: {
    generateMeta(element) {
      const {
        id: elementId,
        summary,
        date_completed: dateCompleted,
      } = element;
      const ts = new Date(dateCompleted).getTime();
      const id = `${elementId}-${ts}`;
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
