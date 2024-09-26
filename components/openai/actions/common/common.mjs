import { ConfigurationError } from "@pipedream/platform";
import constants from "../../common/constants.mjs";
import { parse } from "../../common/helpers.mjs";

const CHAT_DOCS_MESSAGE_FORMAT_URL = "https://platform.openai.com/docs/guides/chat/introduction";

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
      description: "**Optional**. What [sampling temperature](https://towardsdatascience.com/how-to-sample-from-language-models-682bceb97277) to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.",
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
      description: "How many completions to generate for each prompt",
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
    user: {
      label: "User",
      description: "A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more here](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids).",
      type: "string",
      optional: true,
    },
  },
  methods: {
    _getCommonArgs() {
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
        user: this.user,
      };
    },
    _getUserMessageContent() {
      let content = [];
      if (this.images) {
        for (const image of this.images) {
          content.push({
            "type": "image_url",
            "image_url": {
              "url": image,
            },
          });
        }
      }

      content.push({
        "type": "text",
        "text": this.userMessage,
      });

      return content;
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
      } else {
        if (this.systemInstructions) {
          messages.push({
            "role": "system",
            "content": this.systemInstructions,
          });
        }
      }

      messages.push({
        "role": "user",
        "content": this._getUserMessageContent(),
      });

      const responseFormat = {};

      const jsonSchemaObj =
        this.responseFormat === constants.CHAT_RESPONSE_FORMAT.JSON_SCHEMA.value
          ? {
            json_schema: parse(this.jsonSchema),
          }
          : {};

      if (this.modelId != "gpt-4-vision-preview") {
        responseFormat["response_format"] = {
          type: this.responseFormat,
          ...jsonSchemaObj,
        };
      }

      return {
        ...this._getCommonArgs(),
        ...responseFormat,
        messages,
      };
    },
  },
};
