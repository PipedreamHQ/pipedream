const common = require("../common-polling.js");
const get = require("lodash/get");

module.exports = {
  ...common,
  key: "calendly-new-event",
  name: "New Event",
  description: "Emits an event for each new event created",
  version: "0.0.3",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    async getResults() {
      return await this.calendly.getEvents();
    },
    isRelevant(event, lastEvent) {
      const createdAt = this.getCreatedAt(event);
      return createdAt > lastEvent;
    },
    generateMeta(event) {
      const { id } = event;
      const createdAt = this.getCreatedAt(event);
      const startTime = new Date(get(event, "attributes.start_time"));
      return {
        id,
        summary: `New Event at ${startTime.toLocaleString()}`,
        ts: Date.parse(createdAt),
      };
    },
    getCreatedAt(event) {
      return Date.parse(get(event, "attributes.created_at"));
    },
  },
};
