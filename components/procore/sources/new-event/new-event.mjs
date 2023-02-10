import common from "../common/webhook.mjs";

export default {
  ...common,
  name: "New Event (Instant)",
  key: "procore-new-event",
  description: "Emit new event for each webhook notification.",
  version: "0.1.0",
  type: "source",
  props: {
    ...common.props,
    resourceName: {
      propDefinition: [
        common.props.app,
        "resourceName",
      ],
    },
    eventTypes: {
      propDefinition: [
        common.props.app,
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
