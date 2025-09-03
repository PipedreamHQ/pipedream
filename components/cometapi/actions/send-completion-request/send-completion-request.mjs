import { ConfigurationError } from "@pipedream/platform";
import cometapi from "../../cometapi.app.mjs";

export default {
  key: "cometapi-send-completion-request",
  name: "Send Completion Request",
  version: "0.0.1",
  description: "Send a text completion request to any available CometAPI model using a simple prompt. Ideal for content generation, creative writing, code completion, and text transformation tasks. Supports all major model families including GPT, Claude, Gemini, and more. [See the documentation](https://api.cometapi.com/doc)",
  type: "action",
  props: {
    cometapi,
    model: {
      propDefinition: [
        cometapi,
        "model",
      ],
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The text prompt to complete. This can be a question, partial sentence, code snippet, or any text you want the AI to continue or respond to. Examples: 'Write a story about...', 'Explain quantum physics', 'def fibonacci(n):'",
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
    // Validate prompt is provided
    if (!this.prompt || this.prompt.trim().length === 0) {
      throw new ConfigurationError("Prompt is required and cannot be empty");
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
      prompt: this.prompt.trim(),
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

    const response = await this.cometapi.sendCompletionRequest({
      $,
      data,
      timeout: 1000 * 60 * 5, // 5 minutes timeout
    });

    if (response.error) {
      throw new ConfigurationError(response.error.message);
    }

    $.export("$summary", `A new completion request with Id: ${response.id} was successfully created!`);
    return response;
  },
};
