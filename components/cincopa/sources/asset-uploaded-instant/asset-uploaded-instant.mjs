import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "cincopa-asset-uploaded-instant",
  name: "New Asset Uploaded (Instant)",
  description: "Emit new event when a new asset is uploaded. [See the documentation](https://www.cincopa.com/media-platform/api-documentation-v2#webhook.set)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return events.ASSET_UPLOADED;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Asset: ${resource.filename}`,
        ts: Date.parse(resource.modified),
      };
    },
  },
};
