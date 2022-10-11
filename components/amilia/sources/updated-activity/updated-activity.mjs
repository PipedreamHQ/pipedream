import base from "../common/base.mjs";

export default {
  ...base,
  key: "amilia-updated-activity",
  name: "Updated Activity",
  description: "Emit new event for every updated activity in the organization",
  type: "source",
  version: "0.0.1",
  methods: {
    ...base.methods,
    getWebhookData() {
      return {
        Context: "Activity",
        Action: "Update",
        Name: "Pipedream Webhook for Updated Activities",
      };
    },
    processEvent(event) {
      const { Payload: activity } = event;
      this.$emit(activity, {
        id: activity.Id,
        summary: `Updated activity ${activity.Name} for program ${activity.ProgramName}`,
        ts: Date.parse(event.EventTime),
      });
    },
  },
};
