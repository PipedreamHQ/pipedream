const common = require("../common.js");

module.exports = {
  ...common,
  key: "eventbrite-new-event-ended",
  name: "New Event Ended",
  description: "Emits an event when an event has ended",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  hooks: {
    async deploy() {
      const params = {
        orgId: this.organization,
        params: {
          status: "ended,completed",
        },
      };
      const events = await this.paginate(
        this.eventbrite.listEvents.bind(this),
        "events",
        params
      );
      for (const event of events) {
        this.emitEvent(event);
      }
    },
  },
  methods: {
    ...common.methods,
    generateMeta(event) {
      return this.generateEventMeta(event);
    },
  },
  async run(event) {
    const params = {
      orgId: this.organization,
      params: {
        status: "ended,completed",
      },
    };
    const events = await this.paginate(
      this.eventbrite.listEvents.bind(this),
      "events",
      params
    );
    for (const newEvent of events) {
      this.emitEvent(newEvent);
    }
  },
};