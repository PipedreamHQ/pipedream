import common from "../common/common.mjs";

export default {
  ...common,
  key: "wealthbox-new-event-created",
  name: "New Event Created",
  description: "Emit new event for each event created. [See the documentation](http://dev.wealthbox.com/#events-collection-get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getEvents({ params }) {
      params = {
        ...params,
        order: "created",
      };
      const { events } = await this.wealthbox.listEvents({
        params,
      });
      return events;
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New Event - ${event.title}`,
        ts: this.getCreatedAtTs(event),
      };
    },
  },
};
