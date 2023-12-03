import openai from "../../openai.app.mjs";

export default {
  key: "openai-create-thread",
  name: "Create Thread",
  description: "Creates a thread with optional messages and metadata. [See the documentation](https://platform.openai.com/docs/api-reference/threads/createThread)",
  version: "0.0.3",
  type: "action",
  props: {
    openai,
    messages: {
      propDefinition: [
        openai,
        "messages",
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
    const response = await this.openai.createThread({
      $,
      messages: this.messages,
      metadata: this.metadata,
    });

    $.export("$summary", `Successfully created a thread with ID: ${response.id}`);
    return response;
  },
};
