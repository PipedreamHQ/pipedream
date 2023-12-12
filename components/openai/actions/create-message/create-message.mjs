import openai from "../../openai.app.mjs";

export default {
  key: "openai-create-message",
  name: "Create Message (Assistants)",
  description: "Create a message in a thread. [See the documentation](https://platform.openai.com/docs/api-reference/messages/createMessage)",
  version: "0.0.6",
  type: "action",
  props: {
    openai,
    threadId: {
      propDefinition: [
        openai,
        "threadId",
      ],
    },
    content: {
      propDefinition: [
        openai,
        "content",
      ],
    },
    role: {
      propDefinition: [
        openai,
        "role",
      ],
      default: "user",
    },
    fileIds: {
      propDefinition: [
        openai,
        "fileIds",
      ],
      optional: true,
    },
    metadata: {
      propDefinition: [
        openai,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const fileIdsArray = this.fileIds
      ? this.fileIds.map((fileId) => fileId.trim())
      : undefined;
    const metadataObject = this.metadata
      ? JSON.parse(this.metadata)
      : undefined;

    const response = await this.openai.createMessage({
      threadId: this.threadId,
      content: this.content,
      role: this.role,
      fileIds: fileIdsArray,
      metadata: metadataObject,
    });

    $.export("$summary", `Successfully created a message in thread ${this.threadId}`);
    return response;
  },
};
