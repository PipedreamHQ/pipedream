import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "contentstack-new-asset-instant",
  name: "New Asset Created (Instant)",
  description: "Emit new event when a new asset is created in ContentStack.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getChannels() {
      return [
        "assets.create",
      ];
    },
    generateMeta(event) {
      const id = event.data.asset.uid;
      return {
        id,
        summary: `New asset created with ID: ${id}`,
        ts: Date.parse(event.triggered_at),
      };
    },
  },
  sampleEmit,
};
