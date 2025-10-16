import app from "../../x_ai.app.mjs";

export default {
  key: "x_ai-post-chat-completion",
  name: "Post Chat Completion",
  description: "Create a language model response for a chat conversation. [See the documentation](https://docs.x.ai/api/endpoints#chat-completions)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    frequencyPenalty: {
      propDefinition: [
        app,
        "frequencyPenalty",
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
    n: {
      propDefinition: [
        app,
        "n",
      ],
    },
    presencePenalty: {
      propDefinition: [
        app,
        "presencePenalty",
      ],
    },
    seed: {
      propDefinition: [
        app,
        "seed",
      ],
    },
    stream: {
      propDefinition: [
        app,
        "stream",
      ],
    },
    temperature: {
      propDefinition: [
        app,
        "temperature",
      ],
    },
    topP: {
      propDefinition: [
        app,
        "topP",
      ],
    },
    user: {
      propDefinition: [
        app,
        "user",
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
        frequency_penalty: Number(this.frequencyPenalty),
        logprobs: this.logprobs,
        max_tokens: this.maxTokens,
        n: this.n,
        presence_penalty: Number(this.presencePenalty),
        seed: this.seed,
        stream: this.stream,
        temperature: Number(this.temperature),
        top_p: Number(this.topP),
        user: this.user,
      },
    });
    $.export("$summary", `Successfully sent message to the model '${this.model}'`);
    return response;
  },
};
