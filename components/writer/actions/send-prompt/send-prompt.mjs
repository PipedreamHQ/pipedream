import app from "../../writer.app.mjs";

export default {
  key: "writer-send-prompt",
  name: "Send Prompt",
  description: "Generate a chat completion based on the provided messages. [See the documentation](https://dev.writer.com/api-guides/api-reference/completion-api/chat-completion)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    messages: {
      propDefinition: [
        app,
        "messages",
      ],
    },
    logprobs: {
      propDefinition: [
        app,
        "logprobs",
      ],
    },
    maxTokens: {
      propDefinition: [
        app,
        "maxTokens",
      ],
    },
    number: {
      propDefinition: [
        app,
        "number",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.sendPrompt({
      $,
      data: {
        model: "palmyra-x-004",
        messages: JSON.parse(this.messages),
        logprobs: this.logprobs,
        max_tokens: this.maxTokens,
        n: this.number,
      },
    });
    $.export("$summary", "Successfully generated chat completion");
    return response;
  },
};
