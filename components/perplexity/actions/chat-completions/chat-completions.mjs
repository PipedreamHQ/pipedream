import app from "../../perplexity.app.mjs";

export default {
  key: "perplexity-chat-completions",
  name: "Chat Completions",
  description: "Generates a model's response for the given chat conversation. [See the documentation](https://docs.perplexity.ai/reference/post_chat_completions)",
  version: "0.0.3",
  type: "action",
  props: {
    app,
    model: {
      propDefinition: [
        app,
        "model",
      ],
    },
    content: {
      propDefinition: [
        app,
        "content",
      ],
    },
    role: {
      propDefinition: [
        app,
        "role",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.chatCompletions({
      $,
      data: {
        model: this.model,
        messages: [
          {
            role: this.role,
            content: this.content,
          },
        ],
      },
    });

    $.export("$summary", "Successfully generated a response from the selected model");

    return response;
  },
};
