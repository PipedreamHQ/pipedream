import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "kontent_ai-content-item-moved",
  name: "New Content Item Moved (Instant)",
  description: "Emit new event when a content item is moved to another workflow step.",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    workflowStepId: {
      propDefinition: [
        common.props.kontentAi,
        "workflowStepId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getWebhookName(uuid) {
      return `content-item-moved-${uuid}`;
    },
    getTriggers() {
      return {
        workflow_step_changes: [
          {
            type: "content_item_variant",
            transitions_to: [
              {
                id: this.workflowStepId,
              },
            ],
          },
        ],
      };
    },
    getSummary(id) {
      return `The content item with Id: ${id} was moved!`;
    },
  },
  sampleEmit,
};
