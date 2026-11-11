import { ConfigurationError } from "@pipedream/platform";
import featherless from "../../featherless.app.mjs";
import { parseDecimalProp } from "../../common/utils.mjs";

export default {
  key: "featherless-create-chat-completion",
  name: "Create Chat Completion",
  description: "Generate a chat completion using a Featherless-hosted model (POST /v1/chat/completions). Returns a completion object whose `choices[0].message.content` holds the model's reply, plus a `usage` token breakdown. Use **List Models** first to discover valid model IDs to pass to the `model` prop. Example: `model=Qwen/Qwen3-0.6B`, `messages=[{\"role\":\"user\",\"content\":\"What is 2 + 2?\"}]` returns a reply of `4` in `choices[0].message.content`. [See the documentation](https://featherless.ai/docs/completions).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    featherless,
    model: {
      propDefinition: [
        featherless,
        "model",
      ],
    },
    messages: {
      type: "string",
      label: "Messages",
      description: "A JSON array of message objects. Example: `[{\"role\":\"system\",\"content\":\"You are helpful.\"},{\"role\":\"user\",\"content\":\"What is 2 + 2?\"}]`. Parsed with JSON.parse in run().",
    },
    maxTokens: {
      propDefinition: [
        featherless,
        "maxTokens",
      ],
    },
    minTokens: {
      propDefinition: [
        featherless,
        "minTokens",
      ],
    },
    temperature: {
      propDefinition: [
        featherless,
        "temperature",
      ],
    },
    topP: {
      propDefinition: [
        featherless,
        "topP",
      ],
    },
    topK: {
      propDefinition: [
        featherless,
        "topK",
      ],
    },
    minP: {
      propDefinition: [
        featherless,
        "minP",
      ],
    },
    presencePenalty: {
      propDefinition: [
        featherless,
        "presencePenalty",
      ],
    },
    frequencyPenalty: {
      propDefinition: [
        featherless,
        "frequencyPenalty",
      ],
    },
    repetitionPenalty: {
      propDefinition: [
        featherless,
        "repetitionPenalty",
      ],
    },
    seed: {
      propDefinition: [
        featherless,
        "seed",
      ],
    },
    stop: {
      propDefinition: [
        featherless,
        "stop",
      ],
    },
  },
  async run({ $ }) {
    let messages;
    try {
      messages = JSON.parse(this.messages);
    } catch {
      throw new ConfigurationError("**Messages** must be a valid JSON array of message objects, e.g. `[{\"role\":\"user\",\"content\":\"Hello\"}]`.");
    }
    if (!Array.isArray(messages)) {
      throw new ConfigurationError("**Messages** must be a valid JSON array of message objects, e.g. `[{\"role\":\"user\",\"content\":\"Hello\"}]`.");
    }
    const response = await this.featherless.createChatCompletion({
      $,
      data: {
        model: this.model,
        messages,
        max_tokens: this.maxTokens,
        min_tokens: this.minTokens,
        temperature: parseDecimalProp(this.temperature, "Temperature"),
        top_p: parseDecimalProp(this.topP, "Top P"),
        top_k: this.topK,
        min_p: parseDecimalProp(this.minP, "Min P"),
        presence_penalty: parseDecimalProp(this.presencePenalty, "Presence Penalty"),
        frequency_penalty: parseDecimalProp(this.frequencyPenalty, "Frequency Penalty"),
        repetition_penalty: parseDecimalProp(this.repetitionPenalty, "Repetition Penalty"),
        seed: this.seed,
        stop: this.stop,
      },
    });
    $.export("$summary", `Successfully created chat completion using model ${this.model}`);
    return response;
  },
};
