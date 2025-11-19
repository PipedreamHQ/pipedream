import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "customgpt-new-message",
  name: "New Message",
  description: "Emit new event when a new message is created in a conversation. [See the documentation](https://docs.customgpt.ai/reference/get_api-v1-projects-projectid-conversations-sessionid-messages)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    conversationId: {
      propDefinition: [
        common.props.customgpt,
        "conversationId",
        ({ projectId }) => ({
          projectId,
          fieldId: "session_id",
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getFunction() {
      return this.customgpt.listMessages;
    },
    getOtherOpts() {
      return {
        conversationId: this.conversationId,
      };
    },
    getFieldData() {
      return "messages";
    },
    getSummary(item) {
      return `New Message: ${item.id}`;
    },
  },
  sampleEmit,
};
