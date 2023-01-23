import base from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "amilia-updated-activity",
  name: "Updated Activity",
  description: "Emit new event for every updated activity in the organization",
  type: "source",
  version: "0.0.2",
  hooks: {
    ...base.hooks,
    deploy() {
      console.log("Skipping retrieval of historical events for updated activities");
    },
  },
  methods: {
    ...base.methods,
    getWebhookData() {
      return {
        Context: constants.TRIGGERS.CONTEXT.ACTIVITY,
        Action: constants.TRIGGERS.ACTION.UPDATE,
        Name: "Pipedream Webhook for Updated Activities",
      };
    },
    processEvent(event) {
      const { Payload: activity } = event;
      console.log(`Emitting event for ${activity.ProgramName} activity...`);
      this.$emit(activity, {
        id: activity.Id,
        summary: `Updated activity ${activity.Name} for program ${activity.ProgramName}`,
        ts: Date.parse(event.EventTime),
      });
    },
  },
};
