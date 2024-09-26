import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "userflow-new-event-tracked-instant",
  name: "New Event Tracked (Instant)",
  description: "Emit new new event when an event is tracked in Userflow. [See the documentation](https://userflow.com/docs/api)",
  version: "0.0.1",
  type: "source",
  dedupe: "greatest",
  methods: {
    ...common.methods,
    getTopics() {
      return [
        events.TOPIC.EVENT_TRACKED,
      ];
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.created_at);
      return {
        id: ts,
        summary: `Event Tracked: ${resource.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
