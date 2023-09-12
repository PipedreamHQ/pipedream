import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "kontent_ai-content-item-created",
  name: "New Content Item Created (Instant)",
  description: "Emit new event when a content item is created.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getWebhookName(uuid) {
      return `content-item-created-${uuid}`;
    },
    getTriggers() {
      return {
        management_api_content_changes: [
          {
            type: "content_item_variant",
            operations: [
              "create",
            ],
          },
        ],
      };
    },
    getSummary(id) {
      return `New content item created with Id: ${id}!`;
    },
  },
  sampleEmit,
};
