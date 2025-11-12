import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "actitime-updated-time-track-instant",
  name: "Updated Time Track (Instant)",
  description: "Emit new event when the user's working time is updated. [See the documentation](https://www.actitime.com/api-documentation/rest-hooks).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.TIME_TRACK_UPDATE;
    },
    generateMeta(resource) {
      const ts = Date.now();
      return {
        id: `${resource.id}-${ts}`,
        summary: `Time Track Updated: ${resource.taskName}`,
        ts,
      };
    },
  },
  sampleEmit,
};
