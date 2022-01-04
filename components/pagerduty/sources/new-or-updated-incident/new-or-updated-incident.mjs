import constants from "../../common/constants.mjs";
import commonWebhook from "../common-webhook.mjs";

export default {
  ...commonWebhook,
  key: "pagerduty-new-or-updated-incident",
  name: "New or Updated Incident",
  version: "0.0.1",
  description: "Emits an event each time a new or updated incident is created",
  methods: {
    ...commonWebhook.methods,
    getMetadata(payload) {
      return {
        id: payload.id,
        summary: JSON.stringify(payload),
        ts: Date.parse(payload.occurred_at),
      };
    },
    getEventTypes() {
      return constants.INCIDENT_EVENT_TYPES;
    },
    getExtensionName() {
      return "New or Updated Incident";
    },
  },
};
