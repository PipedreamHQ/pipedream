import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import cometapi from "../../cometapi.app.mjs";

export default {
  key: "cometapi-send-chat-completion-request",
  name: "Send Chat Completion Request",
  version: "0.0.1",
  description: "Send a chat completion request to any available CometAPI model. Perfect for conversational AI, Q&A systems, and interactive applications. Supports system messages, conversation history, and advanced parameters for fine-tuning responses. [See the documentation](https://api.cometapi.com/doc)",
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
      type: "string[]",
      label: "Messages",
      description: "A list of message objects with 'role' and 'content' properties. Roles can be 'system', 'user', or 'assistant'. Example: **{\"role\":\"user\", \"content\":\"Hello, how are you?\"}**. System messages set behavior, user messages are prompts, assistant messages are previous AI responses. [See the documentation](https://api.cometapi.com/doc) for more details.",
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
    // Validate messages format
    const messages = parseObject(this.messages);
    if (!Array.isArray(messages) || !messages.length) {
      throw new ConfigurationError("Messages must be a non-empty array");
    }

    // Validate each message has required properties
    for (const msg of messages) {
      if (!msg.role || !msg.content) {
        throw new ConfigurationError("Each message must have 'role' and 'content' properties");
      }

      if (![
        "system",
        "user",
        "assistant",
        "function",
      ].includes(msg.role)) {
        throw new ConfigurationError(`Invalid role: ${msg.role}. Valid roles are: system, user, assistant, function`);
      }
    }

    // Validate numeric parameters
    if (this.temperature &&
        (parseFloat(this.temperature) < 0 || parseFloat(this.temperature) > 2)) {
      throw new ConfigurationError("Temperature must be between 0.0 and 2.0");
    }

    if (this.topP && (parseFloat(this.topP) <= 0 || parseFloat(this.topP) > 1)) {
      throw new ConfigurationError("Top P must be between 0.0 and 1.0");
    }

    if (this.frequencyPenalty &&
        (parseFloat(this.frequencyPenalty) < -2 || parseFloat(this.frequencyPenalty) > 2)) {
      throw new ConfigurationError("Frequency Penalty must be between -2.0 and 2.0");
    }

    if (this.presencePenalty &&
        (parseFloat(this.presencePenalty) < -2 || parseFloat(this.presencePenalty) > 2)) {
      throw new ConfigurationError("Presence Penalty must be between -2.0 and 2.0");
    }

    const data = {
      model: this.model,
      messages,
      stream: this.stream || false,
      max_tokens: this.maxTokens,
      temperature: this.temperature && parseFloat(this.temperature),
      top_p: this.topP && parseFloat(this.topP),
      top_k: this.topK,
      frequency_penalty: this.frequencyPenalty && parseFloat(this.frequencyPenalty),
      presence_penalty: this.presencePenalty && parseFloat(this.presencePenalty),
      repetition_penalty: this.repetitionPenalty && parseFloat(this.repetitionPenalty),
      seed: this.seed,
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
      timeout: 1000 * 60 * 5, // 5 minutes timeout
    });

    if (response.error) {
      throw new ConfigurationError(response.error.message);
    }

    $.export("$summary", `A new chat completion request with Id: ${response.id} was successfully created!`);
    return response;
  },
};
