import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "kontent_ai-content-item-published",
  name: "New Content Item Published (Instant)",
  description: "Emit new event when a content item is published.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getWebhookName(uuid) {
      return `content-item-published-${uuid}`;
    },
    getTriggers() {
      return {
        delivery_api_content_changes: [
          {
            type: "content_item_variant",
            operations: [
              "publish",
            ],
          },
        ],
      };
    },
    getSummary(id) {
      return `The content item with Id: ${id} was published!`;
    },
  },
  sampleEmit,
};
