import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_chat-new-mention-received",
  name: "New Mention Received",
  description: "Emit new event when a new mention is received in a space. [See the documentation](https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.messages/list)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    memberId: {
      propDefinition: [
        common.props.googleChat,
        "memberId",
        (c) => ({
          spaceId: c.spaceId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    isRelevant(message) {
      if (!message.formattedText) {
        return false;
      }
      return message.formattedText.includes(`<users/${this.memberId}>`);
    },
    getSummary(message) {
      return `New Mention in Message: ${message.formattedText.slice(0, 50)}`;
    },
  },
};
