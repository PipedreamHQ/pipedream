import airtable from "../airtable.app.mjs";

export default {
  props: {
    airtable,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
    baseId: {
      propDefinition: [
        airtable,
        "baseId",
      ],
    },
  },
  hooks: {
    activate() {
      const startTimestamp = new Date().toISOString();
      this.db.set("lastTimestamp", startTimestamp);
    },
    deactivate() {
      this.db.set("lastTimestamp", null);
    },
  },
  methods: {
    updateLastTimestamp(event) {
      const { timestamp } = event;
      const timestampMillis = timestamp
        ? timestamp * 1000
        : Date.now();
      const formattedTimestamp = new Date(timestampMillis).toISOString();
      this.db.set("lastTimestamp", formattedTimestamp);
    },
  },
};
