import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_chat-new-message-in-space",
  name: "New Message in Space",
  description: "Emit new event when a new message is posted in a space. [See the documentation](https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.messages/list)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getSummary(message) {
      return `New Message: ${message.text.slice(0, 50)}`;
    },
  },
};
