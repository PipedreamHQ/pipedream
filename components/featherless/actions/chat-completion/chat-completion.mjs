// x-pd-ai: optimized
import featherless from "../../featherless.app.mjs";

export default {
  key: "featherless-chat-completion",
  name: "Create Chat Completion",
  description: "Generate a chat completion using a Featherless-hosted model (POST /v1/chat/completions). Returns a completion object whose `choices[0].message.content` holds the model's reply, plus a `usage` token breakdown. Use **List Models** first to discover valid model IDs to pass to the `model` prop. Example: `model=Qwen/Qwen3-0.6B`, `messages=[{\"role\":\"user\",\"content\":\"What is 2 + 2?\"}]` returns a reply of `4` in `choices[0].message.content`. [See the documentation](https://featherless.ai/docs/completions).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    featherless,
    model: {
      type: "string",
      label: "Model",
      description: "The model ID to use, e.g. `Qwen/Qwen2.5-7B-Instruct`. Run **List Models** first to discover valid model IDs available to your account (do NOT guess).",
    },
    messages: {
      type: "string",
      label: "Messages",
      description: "A JSON array of message objects. Example: `[{\"role\":\"system\",\"content\":\"You are helpful.\"},{\"role\":\"user\",\"content\":\"What is 2 + 2?\"}]`. Parsed with JSON.parse in run().",
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "Maximum number of tokens to generate (maps to `max_tokens`).",
      optional: true,
    },
    minTokens: {
      type: "integer",
      label: "Min Tokens",
      description: "Minimum number of tokens to generate (maps to `min_tokens`).",
      optional: true,
    },
    temperature: {
      type: "string",
      label: "Temperature",
      description: "Sampling temperature as a float, e.g. `0.7`. Parsed to a number in run().",
      optional: true,
    },
    topP: {
      type: "string",
      label: "Top P",
      description: "Nucleus sampling probability as a float, e.g. `0.9` (maps to `top_p`).",
      optional: true,
    },
    topK: {
      type: "integer",
      label: "Top K",
      description: "Top-k sampling cutoff (maps to `top_k`).",
      optional: true,
    },
    minP: {
      type: "string",
      label: "Min P",
      description: "Minimum probability threshold as a float, e.g. `0.05` (maps to `min_p`).",
      optional: true,
    },
    presencePenalty: {
      type: "string",
      label: "Presence Penalty",
      description: "Presence penalty as a float, e.g. `0.0` (maps to `presence_penalty`).",
      optional: true,
    },
    frequencyPenalty: {
      type: "string",
      label: "Frequency Penalty",
      description: "Frequency penalty as a float, e.g. `0.0` (maps to `frequency_penalty`).",
      optional: true,
    },
    repetitionPenalty: {
      type: "string",
      label: "Repetition Penalty",
      description: "Repetition penalty as a float, e.g. `1.0` (maps to `repetition_penalty`).",
      optional: true,
    },
    seed: {
      type: "integer",
      label: "Seed",
      description: "Random seed for deterministic sampling.",
      optional: true,
    },
    stop: {
      type: "string[]",
      label: "Stop",
      description: "One or more strings that stop generation when encountered.",
      optional: true,
    },
  },
  async run({ $ }) {
    const messages = JSON.parse(this.messages);
    const response = await this.featherless.chatCompletion({
      $,
      data: {
        model: this.model,
        messages,
        max_tokens: this.maxTokens,
        min_tokens: this.minTokens,
        temperature: this.temperature
          ? parseFloat(this.temperature)
          : undefined,
        top_p: this.topP
          ? parseFloat(this.topP)
          : undefined,
        top_k: this.topK,
        min_p: this.minP
          ? parseFloat(this.minP)
          : undefined,
        presence_penalty: this.presencePenalty
          ? parseFloat(this.presencePenalty)
          : undefined,
        frequency_penalty: this.frequencyPenalty
          ? parseFloat(this.frequencyPenalty)
          : undefined,
        repetition_penalty: this.repetitionPenalty
          ? parseFloat(this.repetitionPenalty)
          : undefined,
        seed: this.seed,
        stop: this.stop,
      },
    });
    $.export("$summary", `Successfully created chat completion using model ${this.model}`);
    return response;
  },
};
