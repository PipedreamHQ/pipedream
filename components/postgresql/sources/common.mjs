import postgresql from "../postgresql.app.mjs";

export default {
  props: {
    postgresql,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
      label: "Polling Interval",
      description: "Pipedream will poll the API on this schedule",
    },
  },
  methods: {
    _getPreviousValues() {
      return this.db.get("previousValues");
    },
    _setPreviousValues(previousValues) {
      this.db.set("previousValues", previousValues);
    },
    generateMeta(result) {
      return {
        id: result,
        summary: result,
        ts: Date.now(),
      };
    },
  },
};
