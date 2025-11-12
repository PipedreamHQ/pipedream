import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "contentstack-new-entry-instant",
  name: "New Entry Created (Instant)",
  description: "Emit new event when a new entry is created in ContentStack.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getChannels() {
      return [
        "content_types.entries.create",
      ];
    },
    generateMeta(event) {
      const id = event.data.entry.uid;
      return {
        id,
        summary: `New entity created with ID: ${id}`,
        ts: Date.parse(event.triggered_at),
      };
    },
  },
  sampleEmit,
};
