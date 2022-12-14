import openai from "../../openai.app.mjs";

export default {
  name: "Send Prompt",
  version: "0.0.1",
  key: "openai-send-prompt",
  description: "Creates a completion for the provided prompt and parameters. [See docs here](https://beta.openai.com/docs/api-reference/completions/create)",
  type: "action",
  props: {
    openai,
    modelId: {
      propDefinition: [
        openai,
        "modelId",
      ],
    },
    prompt: {
      label: "Prompt",
      description: "The prompt(s) to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays. Note that <|endoftext|> is the document separator that the model sees during training, so if a prompt is not specified the model will generate as if from the beginning of a new document.",
      type: "string[]",
      optional: true,
    },
    suffix: {
      label: "Suffix",
      description: "The prompt(s) to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays. Note that <|endoftext|> is the document separator that the model sees during training, so if a prompt is not specified the model will generate as if from the beginning of a new document.",
      type: "string",
      optional: true,
    },
    maxTokens: {
      label: "Max Tokens",
      description: "The maximum number of [tokens](https://beta.openai.com/tokenizer) to generate in the completion.",
      type: "string",
      optional: true,
    },
    temperature: {
      label: "Temperature",
      description: "What [sampling temperature](https://towardsdatascience.com/how-to-sample-from-language-models-682bceb97277) to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.",
      type: "string",
      optional: true,
    },
    topP: {
      label: "Top P",
      description: "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or `temperature` but not both.",
      type: "string",
      optional: true,
    },
    n: {
      label: "N",
      description: "How many completions to generate for each prompt.",
      type: "string",
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
      description: "Generates best_of completions server-side and returns the \"best\" (the one with the highest log probability per token). Results cannot be streamed.",
      type: "integer",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.openai.sendPrompt({
      $,
      data: {
        model: this.modelId,
        prompt: this.prompt,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        top_p: this.topP,
        n: this.n,
        stop: this.stop,
        presence_penalty: this.presencePenalty,
        frequency_penalty: this.frequencyPenalty,
        best_of: this.bestOf,
      },
    });

    if (response) {
      $.export("$summary", `Successfully sent prompt with id ${response.id}`);
    }

    return response;
  },
};
