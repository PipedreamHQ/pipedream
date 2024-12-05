import app from "../../x_ai.app.mjs";

export default {
  key: "x_ai-post-chat-completion",
  name: "Post Chat Completion",
  description: "Create a language model response for a chat conversation. [See the documentation](https://docs.x.ai/api/endpoints#chat-completions)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    model: {
      propDefinition: [
        app,
        "model",
      ],
    },
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.postChatCompletion({
      $,
      data: {
        model: this.model,
        messages: [
          {
            role: "user",
            content: this.message,
          },
        ],
      },
    });

    $.export("$summary", `Successfully sent message to the model '${this.model}'`);

    return response;
  },
};
