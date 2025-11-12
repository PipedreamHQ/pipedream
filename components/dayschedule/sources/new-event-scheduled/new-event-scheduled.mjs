import common from "../common/common.mjs";

export default {
  ...common,
  key: "dayschedule-new-event-scheduled",
  name: "New Event Scheduled",
  description: "Emit new event when a new event is added to the schedule.",
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
      return Date.parse(event.created_at);
    },
    generateMeta(event) {
      const ts = this.getTs(event);
      return {
        id: event.id,
        summary: event.name,
        ts,
      };
    },
  },
  async run() {
    const lastCreated = this._getLastTs();
    const events = await this.dayschedule.paginateResources({
      params: {
        start: new Date(lastCreated).toISOString()
          .slice(0, 10),
      },
    });
    this.processEvents(events, lastCreated);
  },
};
