import app from "../../x_ai.app.mjs";

export default {
  key: "x_ai-post-completion",
  name: "Post Completion",
  description: "Create a language model response for a given prompt. [See the documentation](https://docs.x.ai/api/endpoints#completions)",
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
    prompt: {
      propDefinition: [
        app,
        "prompt",
      ],
    },
    echo: {
      propDefinition: [
        app,
        "echo",
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
    suffix: {
      propDefinition: [
        app,
        "suffix",
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
    const response = await this.app.postCompletion({
      $,
      data: {
        model: this.model,
        prompt: this.prompt,
        echo: this.echo,
        frequency_penalty: Number(this.frequencyPenalty),
        logprobs: this.logprobs,
        max_tokens: this.maxTokens,
        n: this.n,
        presence_penalty: Number(this.presencePenalty),
        seed: this.seed,
        stream: this.stream,
        suffix: this.suffix,
        temperature: Number(this.temperature),
        top_p: Number(this.topP),
        user: this.user,
      },
    });
    $.export("$summary", `Successfully sent prompt to the model '${this.model}'`);
    return response;
  },
};
