import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "contentstack-publish-entry-instant",
  name: "New Entry Published (Instant)",
  description: "Emit new event when an entry is published in ContentStack.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getChannels() {
      return [
        "content_types.entries.publish",
      ];
    },
    generateMeta(event) {
      const id = event.data.entry.uid;
      return {
        id,
        summary: `New entry published with ID: ${id}`,
        ts: Date.parse(event.triggered_at),
      };
    },
  },
  sampleEmit,
};
