import constants from "../../common/constants.mjs";
import commonWebhook from "../common-webhook.mjs";

export default {
  ...commonWebhook,
  type: "source",
  key: "pagerduty-new-or-updated-incident",
  name: "New or Updated Incident",
  version: "0.1.1",
  description: "Emit new event each time an incident is created or updated",
  methods: {
    ...commonWebhook.methods,
    getMetadata({
      id, occurred_at, data,
    }) {
      return {
        id,
        summary: `Incident ${data.incident?.id || data.id} has been created or updated`,
        ts: Date.parse(occurred_at),
      };
    },
    getEventTypes() {
      return constants.INCIDENT_EVENT_TYPES;
    },
    getHookName() {
      return "New or Updated Incident";
    },
  },
};
