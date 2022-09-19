import constants from "../../common/constants.mjs";
import commonWebhook from "../common-webhook.mjs";

export default {
  ...commonWebhook,
  key: "pagerduty-new-or-updated-incident",
  name: "New or Updated Incident",
  version: "0.0.1",
  description: "Emit new event each time an incident is created or updated",
  methods: {
    ...commonWebhook.methods,
    getMetadata(payload) {
      return {
        id: payload.id,
        summary: `Incident ${payload.id} has been created or updated`,
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
