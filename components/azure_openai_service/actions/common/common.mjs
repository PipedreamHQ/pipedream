import { ConfigurationError } from "@pipedream/platform";
const CHAT_DOCS_MESSAGE_FORMAT_URL = "https://platform.openai.com/docs/guides/chat/introduction";

export default {
  props: {
    temperature: {
      type: "string",
      label: "Temperature",
      description: "  What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.",
      optional: true,
    },
    n: {
      type: "integer",
      label: "N",
      description: "How many completions to generate",
      optional: true,
    },
    stream: {
      type: "boolean",
      label: "Stream",
      description: "If set, partial message deltas will be sent, like in ChatGPT. Tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a data: [DONE] message.",
      optional: true,
    },
    stop: {
      type: "string",
      label: "Stop",
      description: "Up to 4 sequences where the API will stop generating further tokens.",
      optional: true,
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "The maximum number of tokens allowed for the generated answer. By default, the number of tokens the model can return will be (4096 - prompt tokens).",
      optional: true,
    },
    presencePenalty: {
      type: "string",
      label: "Presence Penalty",
      description: "Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.",
      optional: true,
    },
    frequencyPenalty: {
      type: "string",
      label: "Frequency Penalty",
      description: "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.",
      optional: true,
    },
    user: {
      type: "string",
      label: "User",
      description: "A unique identifier representing your end-user, which can help Azure OpenAI to monitor and detect abuse.",
      optional: true,
    },
  },
  methods: {
    _getCommonArgs() {
      return {
        temperature: this.temperature
          ? +this.temperature
          : this.temperature,
        n: this.n,
        stream: this.stream,
        stop: this.stop,
        max_tokens: this.maxTokens,
        presence_penalty: this.presencePenalty
          ? +this.presencePenalty
          : this.presencePenalty,
        frequency_penalty: this.frequencyPenalty
          ? +this.frequencyPenalty
          : this.frequencyPenalty,
        user: this.user,
      };
    },
    _getChatArgs() {
      if (this.messages && this.messages.length && !this.userMessage) {
        throw new ConfigurationError(
          `When you provide previous messages, you must provide the next User Message for the assistant to answer. See the OpenAI Chat format docs here: ${CHAT_DOCS_MESSAGE_FORMAT_URL}`,
        );
      }
      let messages = [];
      if (this.messages) {
        for (const message of this.messages) {
          console.log(`Message: ${JSON.stringify(message)}`);
          let parsed;
          try {
            if (typeof message === "string") {
              parsed = JSON.parse(message);
            } else {
              parsed = message;
            }
          } catch (err) {
            throw new ConfigurationError(
              `Please provide a valid array of chat messages. See the docs here: ${CHAT_DOCS_MESSAGE_FORMAT_URL}`,
            );

          }
          if (!parsed.role) {
            throw new ConfigurationError(
              `The following message doesn't have a "role" property:\n\n${JSON.stringify(message, null, 2)}\n\nSee the docs here: ${CHAT_DOCS_MESSAGE_FORMAT_URL}`,
            );
          }
          if (!parsed.content) {
            throw new ConfigurationError(
              `The following message doesn't have a "content" property:\n\n${JSON.stringify(message, null, 2)}\n\nSee the docs here: ${CHAT_DOCS_MESSAGE_FORMAT_URL}`,
            );
          }
          messages.push(parsed);
        }
        // Finally, we want to append the user message to the end of the array
        if (this.userMessage) {
          messages.push({
            "role": "user",
            "content": this.userMessage,
          });
        }
      } else {
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
      }

      return {
        ...this._getCommonArgs(),
        messages,
      };
    },
  },
};
