import common from "../common/base.mjs";

export default {
  ...common,
  key: "google_chat-new-command-used",
  name: "New Command Used",
  description: "Emit new event when a new command is used in a space. [See the documentation](https://developers.google.com/workspace/chat/api/reference/rest/v1/spaces.messages/list)",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    command: {
      type: "string",
      label: "Command",
      description: "The command to emit events for.",
    },
  },
  methods: {
    ...common.methods,
    isRelevant(message) {
      if (!message.text) {
        return false;
      }
      const command = this.command.startsWith("/")
        ? this.command
        : `/${this.command}`;
      return message.text.startsWith(command);
    },
    getSummary(message) {
      return `New Command Used in Message: ${message.text.slice(0, 50)}`;
    },
  },
};
