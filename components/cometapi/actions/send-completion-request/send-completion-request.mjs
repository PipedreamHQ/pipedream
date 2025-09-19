import { ConfigurationError } from "@pipedream/platform";
import cometapi from "../../cometapi.app.mjs";

export default {
  key: "cometapi-send-completion-request",
  name: "Send Completion Request",
  version: "0.0.1",
  description: "Send a text completion request to any available CometAPI model using a simple prompt. " +
    "Ideal for content generation, creative writing, code completion, and text transformation tasks. " +
    "Supports all major model families including GPT, Claude, Gemini, and more. " +
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
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The text prompt to complete. This can be a question, partial sentence, " +
        "code snippet, or any text you want the AI to continue or respond to. " +
        "Examples: 'Write a story about...', 'Explain quantum physics', 'def fibonacci(n):'",
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

    // Validate prompt
    if (!this.prompt || typeof this.prompt !== "string" || this.prompt.trim() === "") {
      throw new ConfigurationError("Prompt is required and must be a non-empty string");
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
      prompt: this.prompt.trim(),
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

    const response = await this.cometapi.sendCompletionRequest({
      $,
      data,
    });

    $.export("$summary", `Successfully sent completion request using model ${this.model}`);
    return response;
  },
};
