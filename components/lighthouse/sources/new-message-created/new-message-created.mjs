import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Message Created",
  version: "0.0.1",
  key: "lighthouse-new-message-created",
  description: "Emit new event for each new message created.",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    projectId: {
      propDefinition: [
        common.props.lighthouse,
        "projectId",
      ],
    },
  },
  methods: {
    ...common.methods,
    emitEvent({ message }) {
      this.$emit(message, {
        id: message.id,
        summary: `New message created with ID ${message.id}`,
        ts: Date.parse(message.created_at),
      });
    },
    async getResources(args = {}) {
      const { messages } = await this.lighthouse.getMessages({
        ...args,
        projectId: this.projectId,
      });

      return messages ?? [];
    },
    resourceKey() {
      return "message";
    },
  },
};
