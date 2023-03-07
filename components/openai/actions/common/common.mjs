export default {
  props: {
    maxTokens: {
      label: "Max Tokens",
      description: "The maximum number of [tokens](https://beta.openai.com/tokenizer) to generate in the completion.",
      type: "integer",
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
  },
  methods: {
    _getArgs() {
      return {
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
      };
    },
  },
};
