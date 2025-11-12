import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cloze-project-change-instant",
  name: "Project Change (Instant)",
  description: "Emit new event when a significant change occurs in a project. [See the documentation](https://api.cloze.com/api-docs/#!/Webhooks/post_v1_subscribe).",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return events.PROJECT_CHANGE;
    },
    generateMeta(event) {
      return {
        id: event?.project.syncKey,
        summary: "New Project Change",
        ts: event?.project.lastChanged,
      };
    },
  },
  sampleEmit,
};
