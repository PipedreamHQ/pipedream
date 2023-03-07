import openai from "../../app/openai.app.mjs";

export default {
  name: "Create Completion (Send Prompt)",
  version: "0.1.0",
  key: "openai-send-prompt",
  description: "OpenAI recommends using the **Chat** action for the latest `gpt-3.5-turbo` API, since it's faster and 10x cheaper. This action creates a completion for the provided prompt and parameters using the older `/completions` API. [See docs here](https://beta.openai.com/docs/api-reference/completions/create)",
  type: "action",
  props: {
    openai,
    modelId: {
      propDefinition: [
        openai,
        "completionModelId",
      ],
    },
    prompt: {
      label: "Prompt",
      description: "The prompt to generate completions for",
      type: "string",
    },
    suffix: {
      label: "Suffix",
      description: "The suffix that comes after a completion of inserted text",
      type: "string",
      optional: true,
    },
    maxTokens: {
      label: "Max Tokens",
      description: "The maximum number of [tokens](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) to generate in the completion. Requests can use up to 4097 tokens shared between prompt and completion. If your prompt is 4000 tokens, your completion can be 97 tokens at most.",
      type: "integer",
      optional: true,
    },
    temperature: {
      label: "Temperature",
      description: "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or **Top P**, but not both.",
      type: "string",
      optional: true,
    },
    topP: {
      label: "Top P",
      description: "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or **Temperature** but not both.",
      type: "string",
      optional: true,
    },
    n: {
      label: "N",
      description: "How many completions to generate for each prompt. **Note**: Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for **Max Tokens** and **Stop**.",
      type: "integer",
      optional: true,
    },
    stop: {
      label: "Stop",
      description: "Up to 4 sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.",
      type: "string[]",
      optional: true,
    },
    presencePenalty: {
      label: "Presence Penalty",
      description: "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.",
      type: "string",
      optional: true,
    },
    frequencyPenalty: {
      label: "Frequency Penalty",
      description: "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.",
      type: "string",
      optional: true,
    },
    bestOf: {
      label: "Best Of",
      description: "Generates best_of completions server-side and returns the \"best\" (the one with the highest log probability per token). If set, results cannot be streamed.",
      type: "integer",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.openai.createCompletion({
      model: this.modelId,
      prompt: this.prompt,
      max_tokens: this.maxTokens,
      temperature: this.temperature
        ? +this.temperature
        : this.temperature,
      top_p: this.topP
        ? +this.topP
        : this.topP,
      n: this.n,
      stop: this.stop,
      presence_penalty: this.presencePenalty
        ? +this.presencePenalty
        : this.presencePenalty,
      frequency_penalty: this.frequencyPenalty
        ? +this.frequencyPenalty
        : this.frequencyPenalty,
      best_of: this.bestOf,
    });

    if (response) {
      $.export("$summary", `Successfully sent prompt with id ${response.id}`);
    }

    return response;
  },
};
