import base from "../common/base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...base,
  key: "amilia-new-activity",
  name: "New Activity",
  description: "Emit new event for every new activity in the organization",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  hooks: {
    ...base.hooks,
    deploy() {
      console.log("Skipping retrieval of historical events for new activities");
    },
  },
  methods: {
    ...base.methods,
    getWebhookData() {
      return {
        Context: constants.TRIGGERS.CONTEXT.ACTIVITY,
        Action: constants.TRIGGERS.ACTION.CREATE,
        Name: "Pipedream Webhook for New Activities",
      };
    },
    processEvent(event) {
      const { Payload: activity } = event;
      console.log(`Emitting event for ${activity.ProgramName} activity...`);
      this.$emit(activity, {
        id: activity.Id,
        summary: `New activity ${activity.Name} for program ${activity.ProgramName}`,
        ts: Date.parse(event.EventTime),
      });
    },
  },
};
