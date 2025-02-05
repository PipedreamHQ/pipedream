import deepseek from "../../deepseek.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "deepseek-create-chat-completion",
  name: "Create Chat Completion",
  description: "Creates a chat completion using the DeepSeek API. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    deepseek,
    messages: {
      propDefinition: [
        "deepseek",
        "messages",
      ],
    },
    model: {
      propDefinition: [
        "deepseek",
        "model",
      ],
    },
    frequencyPenalty: {
      propDefinition: [
        "deepseek",
        "frequencyPenalty",
      ],
      optional: true,
    },
    maxTokens: {
      propDefinition: [
        "deepseek",
        "maxTokens",
      ],
      optional: true,
    },
    presencePenalty: {
      propDefinition: [
        "deepseek",
        "presencePenalty",
      ],
      optional: true,
    },
    responseFormat: {
      propDefinition: [
        "deepseek",
        "responseFormat",
      ],
      optional: true,
    },
    stop: {
      propDefinition: [
        "deepseek",
        "stop",
      ],
      optional: true,
    },
    stream: {
      propDefinition: [
        "deepseek",
        "stream",
      ],
      optional: true,
    },
    streamOptions: {
      propDefinition: [
        "deepseek",
        "streamOptions",
      ],
      optional: true,
    },
    temperature: {
      propDefinition: [
        "deepseek",
        "temperature",
      ],
      optional: true,
    },
    topP: {
      propDefinition: [
        "deepseek",
        "topP",
      ],
      optional: true,
    },
    tools: {
      propDefinition: [
        "deepseek",
        "tools",
      ],
      optional: true,
    },
    toolChoice: {
      propDefinition: [
        "deepseek",
        "toolChoice",
      ],
      optional: true,
    },
    logprobs: {
      propDefinition: [
        "deepseek",
        "logprobs",
      ],
      optional: true,
    },
    topLogprobs: {
      propDefinition: [
        "deepseek",
        "topLogprobs",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.deepseek.createModelResponse();
    $.export("$summary", `Chat completion created: ${response.choices[0].message.content}`);
    return response;
  },
};
