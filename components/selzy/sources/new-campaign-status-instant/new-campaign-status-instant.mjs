import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "selzy-new-campaign-status-instant",
  name: "New Campaign Status (Instant)",
  description: "Emit new event when the status of a campaign changes.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return {
        "events[campaign_status]": "*",
      };
    },
    getSummary(body) {
      return `Campaign status updated to ${body.status}`;
    },
  },
  sampleEmit,
};
