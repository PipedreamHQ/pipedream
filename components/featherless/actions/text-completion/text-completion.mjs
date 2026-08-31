// x-pd-ai: optimized
import featherless from "../../featherless.app.mjs";

export default {
  key: "featherless-text-completion",
  name: "Create Text Completion",
  description: "Generate a text completion from a raw prompt using a Featherless-hosted model (POST /v1/completions). Returns a completion object whose `choices[0].text` holds the generated text, plus a `usage` token breakdown. This is a distinct legacy-style completion endpoint from **Create Chat Completion**. Use **List Models** first to discover valid model IDs. Example: `model=Qwen/Qwen3-0.6B`, `prompt=\"The capital of France is\"` returns ` Paris` in `choices[0].text`. [See the documentation](https://featherless.ai/docs/completions).",
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
      propDefinition: [
        featherless,
        "model",
      ],
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The prompt to complete. Accepts a plain string (e.g. `The capital of France is`) or a JSON array of strings (e.g. `[\"one\",\"two\"]`); parsed in run() to pass a string or array to the API.",
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
    // Featherless accepts `prompt` as a string or an array of strings. Only
    // treat the input as parsed JSON when it's an array (batch prompt); a bare
    // JSON scalar like `123`, `true`, `null`, or `"hello"` must stay the literal
    // string the user typed, not be coerced to a number/boolean/null.
    let prompt = this.prompt;
    try {
      const parsed = JSON.parse(this.prompt);
      if (Array.isArray(parsed)) {
        prompt = parsed;
      }
    } catch {
      prompt = this.prompt;
    }
    const response = await this.featherless.textCompletion({
      $,
      data: {
        model: this.model,
        prompt,
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
    $.export("$summary", `Successfully created text completion using model ${this.model}`);
    return response;
  },
};
