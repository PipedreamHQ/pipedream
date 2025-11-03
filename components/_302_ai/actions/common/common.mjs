import constants from "./constants.mjs";

export default {
  props: {
    maxTokens: {
      label: "Max Tokens",
      description: "The maximum number of tokens to generate in the completion.",
      type: "string",
      optional: true,
    },
    temperature: {
      label: "Temperature",
      description: "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.",
      type: "string",
      optional: true,
    },
    topP: {
      label: "Top P",
      description: "An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.",
      type: "string",
      optional: true,
    },
    n: {
      label: "N",
      description: "How many completions to generate for each prompt",
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
    user: {
      label: "User",
      description: "A unique identifier representing your end-user, which can help monitor and detect abuse.",
      type: "string",
      optional: true,
    },
  },
  methods: {
    _getCommonArgs() {
      const args = {
        model: this.modelId,
        temperature: this.temperature
          ? parseFloat(this.temperature)
          : undefined,
        top_p: this.topP
          ? parseFloat(this.topP)
          : undefined,
        n: this.n
          ? parseInt(this.n)
          : undefined,
        stop: this.stop,
        presence_penalty: this.presencePenalty
          ? parseFloat(this.presencePenalty)
          : undefined,
        frequency_penalty: this.frequencyPenalty
          ? parseFloat(this.frequencyPenalty)
          : undefined,
        max_tokens: this.maxTokens
          ? parseInt(this.maxTokens)
          : undefined,
        user: this.user,
      };
      return args;
    },
    async _getChatArgs() {
      const messages = [];

      if (this.systemInstructions) {
        messages.push({
          "role": "system",
          "content": this.systemInstructions,
        });
      }

      messages.push({
        "role": "user",
        "content": this.userMessage,
      });

      const responseFormat = this.responseFormat
      === constants.CHAT_RESPONSE_FORMAT.JSON_SCHEMA.value && this.jsonSchema
        ? {
          response_format: {
            type: this.responseFormat,
            json_schema: typeof this.jsonSchema === "string"
              ? JSON.parse(this.jsonSchema)
              : this.jsonSchema,
          },
        }
        : this.responseFormat
          ? {
            response_format: {
              type: this.responseFormat,
            },
          }
          : {};

      return {
        ...this._getCommonArgs(),
        ...responseFormat,
        messages,
      };
    },
  },
};

