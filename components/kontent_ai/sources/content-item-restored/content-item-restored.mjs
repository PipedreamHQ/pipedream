import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "kontent_ai-content-item-restored",
  name: "New Content Item Restored (Instant)",
  description: "Emit new event when a content item is retored in a specific language after deletion.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getWebhookName(uuid) {
      return `content-item-restored-${uuid}`;
    },
    getTriggers() {
      return {
        management_api_content_changes: [
          {
            type: "content_item_variant",
            operations: [
              "restore",
            ],
          },
        ],
      };
    },
    getSummary(id) {
      return `The content item with Id: ${id} was restored!`;
    },
  },
  sampleEmit,
};
