import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "cincopa-gallery-created-instant",
  name: "New Gallery Created (Instant)",
  description: "Emit new event when a new gallery is created. [See the documentation](https://www.cincopa.com/media-platform/api-documentation-v2#webhook.set)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvents() {
      return events.GALLERY_CREATED;
    },
    generateMeta(resource) {
      return {
        id: resource.fid,
        summary: `New Gallery: ${resource.name}`,
        ts: Date.parse(resource.modified),
      };
    },
  },
};
