import openai from "../../openai.app.mjs";

export default {
  key: "openai-modify-message",
  name: "Modify Message (Assistants)",
  description: "Modifies an existing message in a thread. [See the documentation](https://platform.openai.com/docs/api-reference/messages/modifyMessage)",
  version: "0.0.7",
  type: "action",
  props: {
    openai,
    threadId: {
      propDefinition: [
        openai,
        "threadId",
      ],
    },
    messageId: {
      propDefinition: [
        openai,
        "messageId",
      ],
    },
    metadata: {
      type: "string",
      label: "Metadata",
      description: "Metadata for the message in JSON string format",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.openai.modifyMessage({
      threadId: this.threadId,
      messageId: this.messageId,
      metadata: this.metadata
        ? JSON.parse(this.metadata)
        : undefined,
    });

    $.export("$summary", `Successfully modified message ${this.messageId} in thread ${this.threadId}`);
    return response;
  },
};
