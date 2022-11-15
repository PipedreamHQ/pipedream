const procore = require("../../procore.app.js");
const common = require("../common.js");

module.exports = {
  ...common,
  name: "New Event (Instant)",
  key: "procore-new-event",
  description: "Emits an event for each webhook notification.",
  version: "0.0.2",
  type: "source",
  props: {
    ...common.props,
    resourceName: {
      propDefinition: [
        procore,
        "resourceName",
      ],
    },
    eventTypes: {
      propDefinition: [
        procore,
        "eventTypes",
      ],
    },
  },
  methods: {
    ...common.methods,
    getComponentEventTypes() {
      return this.eventTypes;
    },
    getResourceName() {
      return this.resourceName;
    },
    async getDataToEmit(body) {
      return body;
    },
    getMeta(body) {
      const {
        id,
        event_type: eventType,
        resource_name: resourceName,
        timestamp,
      } = body;
      const ts = new Date(timestamp).getTime();
      return {
        id,
        summary: `${eventType} ${resourceName}`,
        ts,
      };
    },
  },
};
