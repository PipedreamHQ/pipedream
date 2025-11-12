import common from "../common/common.mjs";

export default {
  ...common,
  key: "dayschedule-new-event-updated",
  name: "New Event Updated",
  description: "Emit new event when an event is updated in the schedule.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      const events = await this.dayschedule.paginateResources();
      return events.slice(-25).reverse();
    },
    getTs(event) {
      return Date.parse(event.updated_at);
    },
    generateMeta(event) {
      const ts = this.getTs(event);
      return {
        id: `${event.id}${ts}`,
        summary: event.name,
        ts,
      };
    },
  },
  async run() {
    const lastUpdated = this._getLastTs();
    const events = await this.dayschedule.paginateResources();
    this.processEvents(events, lastUpdated);
  },
};
