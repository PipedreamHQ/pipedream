import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import cometapi from "../../cometapi.app.mjs";

export default {
  key: "cometapi-send-chat-completion-request",
  name: "Send Chat Completion Request",
  version: "0.0.1",
  description: "Send a chat completion request to any available CometAPI model. " +
    "Perfect for conversational AI, Q&A systems, and interactive applications. " +
    "Supports system messages, conversation history, and advanced parameters. " +
    "[See the documentation](https://api.cometapi.com/doc)",
  type: "action",
  props: {
    cometapi,
    model: {
      propDefinition: [
        cometapi,
        "model",
      ],
    },
    messages: {
      type: "object[]",
      label: "Messages",
      description: "A list of message objects with 'role' and 'content' properties. " +
        "Roles can be 'system', 'user', 'assistant', or 'function'. " +
        "Example: {\"role\":\"user\",\"content\":\"Hello, how are you?\"}. " +
        "[See docs](https://api.cometapi.com/doc).",
    },
    maxTokens: {
      propDefinition: [
        cometapi,
        "maxTokens",
      ],
    },
    temperature: {
      propDefinition: [
        cometapi,
        "temperature",
      ],
    },
    topP: {
      propDefinition: [
        cometapi,
        "topP",
      ],
    },
    topK: {
      propDefinition: [
        cometapi,
        "topK",
      ],
    },
    frequencyPenalty: {
      propDefinition: [
        cometapi,
        "frequencyPenalty",
      ],
    },
    presencePenalty: {
      propDefinition: [
        cometapi,
        "presencePenalty",
      ],
    },
    repetitionPenalty: {
      propDefinition: [
        cometapi,
        "repetitionPenalty",
      ],
    },
    seed: {
      propDefinition: [
        cometapi,
        "seed",
      ],
    },
    stop: {
      propDefinition: [
        cometapi,
        "stop",
      ],
    },
    stream: {
      propDefinition: [
        cometapi,
        "stream",
      ],
    },
  },
  async run({ $ }) {
    // Validate model is provided
    if (!this.model) {
      throw new ConfigurationError("Model is required");
    }

    // Validate and parse messages
    const messages = parseObject(this.messages);

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new ConfigurationError("Messages must be a non-empty array");
    }

    // Validate message format
    for (const [
      index,
      message,
    ] of messages.entries()) {
      if (!message.role || !message.content) {
        throw new ConfigurationError(
          `Message at index ${index} must have both 'role' and 'content' properties`,
        );
      }

      if (![
        "system",
        "user",
        "assistant",
        "function",
      ].includes(message.role)) {
        throw new ConfigurationError(
          `Message at index ${index} has invalid role '${message.role}'. ` +
          "Must be 'system', 'user', 'assistant', or 'function'",
        );
      }

      if (typeof message.content !== "string" || message.content.trim() === "") {
        throw new ConfigurationError(
          `Message at index ${index} must have non-empty string content`,
        );
      }
    }

    // Normalize and validate numeric parameters
    const toNum = (v) => (v === undefined || v === null || v === ""
      ? undefined
      : Number(v));
    const temperature = toNum(this.temperature);
    const topP = toNum(this.topP);
    const topK = toNum(this.topK);
    const frequencyPenalty = toNum(this.frequencyPenalty);
    const presencePenalty = toNum(this.presencePenalty);
    const repetitionPenalty = toNum(this.repetitionPenalty);
    const maxTokens = toNum(this.maxTokens);
    const seed = toNum(this.seed);

    // Validate numeric parameters
    if (temperature !== undefined &&
        (!Number.isFinite(temperature) || temperature < 0 || temperature > 2)) {
      throw new ConfigurationError("Temperature must be a number between 0.0 and 2.0");
    }
    if (topP !== undefined &&
        (!Number.isFinite(topP) || topP < 0 || topP > 1)) {
      throw new ConfigurationError("Top P must be a number between 0.0 and 1.0");
    }
    if (frequencyPenalty !== undefined &&
        (!Number.isFinite(frequencyPenalty) || frequencyPenalty < -2 || frequencyPenalty > 2)) {
      throw new ConfigurationError(
        "Frequency Penalty must be a number between -2.0 and 2.0",
      );
    }
    if (presencePenalty !== undefined &&
        (!Number.isFinite(presencePenalty) || presencePenalty < -2 || presencePenalty > 2)) {
      throw new ConfigurationError(
        "Presence Penalty must be a number between -2.0 and 2.0",
      );
    }
    if (topK !== undefined &&
        (!Number.isFinite(topK) || topK < 0)) {
      throw new ConfigurationError("Top K must be a non-negative number");
    }
    if (maxTokens !== undefined &&
        (!Number.isFinite(maxTokens) || maxTokens <= 0)) {
      throw new ConfigurationError("Max Tokens must be a positive number");
    }

    const data = {
      model: this.model,
      messages,
      stream: this.stream || false,
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      top_k: topK,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      repetition_penalty: repetitionPenalty,
      seed,
      stop: this.stop,
    };

    // Remove undefined values
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) {
        delete data[key];
      }
    });

    const response = await this.cometapi.sendChatCompletionRequest({
      $,
      data,
    });

    $.export("$summary", `Successfully sent chat completion request using model ${this.model}`);
    return response;
  },
};
