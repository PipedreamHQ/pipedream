const procore = require("../../procore.app.js");
const common = require("../common.js");

module.exports = {
  ...common,
  name: "New Event (Instant)",
  key: "procore-new-event",
  description: "Emits an event for each webhook notification.",
  version: "0.0.1",
  props: {
    ...common.props,
    resourceName: { propDefinition: [procore, "resourceName"] },
    eventType: { propDefinition: [procore, "eventType"] },
  },
  methods: {
    getEventTypes() {
      return [ this.eventType ];
    },
    getResourceName() {
      return this.resourceName;
    },
    async getDataToEmit(body) {
      return body;
    },
    getMeta(body) {
      const { id, event_type } = body;
      return {
        id,
        summary: event_type,
        ts: Date.now(),
      }
    }
  },
};
