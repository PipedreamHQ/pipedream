import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cats-new-activity-instant",
  name: "New Activity (Instant)",
  description: "Emit new event when an activity related to a cat is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "activity.created",
      ];
    },
    generateMeta(body) {
      return {
        id: body.activity_id,
        summary: `New activity: ${body.activity_id}`,
        ts: Date.parse(body.date || new Date()),
      };
    },
  },
  sampleEmit,
};
