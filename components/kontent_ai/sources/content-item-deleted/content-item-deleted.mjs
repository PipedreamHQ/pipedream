import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "kontent_ai-content-item-deleted",
  name: "New Content Item Deleted (Instant)",
  description: "Emit new event when a content item is deleted.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getWebhookName(uuid) {
      return `content-item-deleted-${uuid}`;
    },
    getTriggers() {
      return {
        management_api_content_changes: [
          {
            type: "content_item_variant",
            operations: [
              "archive",
            ],
          },
        ],
      };
    },
    getSummary(id) {
      return `The content item with Id: ${id} was deleted!`;
    },
  },
  sampleEmit,
};
