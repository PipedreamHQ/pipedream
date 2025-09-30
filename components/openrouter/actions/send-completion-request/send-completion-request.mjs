import { ConfigurationError } from "@pipedream/platform";
import openrouter from "../../openrouter.app.mjs";

export default {
  key: "openrouter-send-completion-request",
  name: "Send Completion Request",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Send a completion request to a selected model (text-only format) [See the documentation](https://openrouter.ai/docs/api-reference/completions)",
  type: "action",
  props: {
    openrouter,
    model: {
      propDefinition: [
        openrouter,
        "model",
      ],
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The text prompt to complete.",
    },
    maxTokens: {
      propDefinition: [
        openrouter,
        "maxTokens",
      ],
    },
    temperature: {
      propDefinition: [
        openrouter,
        "temperature",
      ],
    },
    seed: {
      propDefinition: [
        openrouter,
        "seed",
      ],
    },
    topP: {
      propDefinition: [
        openrouter,
        "topP",
      ],
    },
    topK: {
      propDefinition: [
        openrouter,
        "topK",
      ],
    },
    frequencyPenalty: {
      propDefinition: [
        openrouter,
        "frequencyPenalty",
      ],
    },
    presencePenalty: {
      propDefinition: [
        openrouter,
        "presencePenalty",
      ],
    },
    repetitionPenalty: {
      propDefinition: [
        openrouter,
        "repetitionPenalty",
      ],
    },
    logitBias: {
      propDefinition: [
        openrouter,
        "logitBias",
      ],
    },
    togLogprobs: {
      propDefinition: [
        openrouter,
        "togLogprobs",
      ],
    },
    minP: {
      propDefinition: [
        openrouter,
        "minP",
      ],
    },
    topA: {
      propDefinition: [
        openrouter,
        "topA",
      ],
    },
    transforms: {
      propDefinition: [
        openrouter,
        "transforms",
      ],
    },
    models: {
      propDefinition: [
        openrouter,
        "model",
      ],
      type: "string[]",
      label: "Models",
      description: "Alternate list of models for routing overrides",
      optional: true,
    },
    sort: {
      propDefinition: [
        openrouter,
        "sort",
      ],
    },
    effort: {
      propDefinition: [
        openrouter,
        "effort",
      ],
    },
    reasoningMaxTokens: {
      propDefinition: [
        openrouter,
        "reasoningMaxTokens",
      ],
    },
    exclude: {
      propDefinition: [
        openrouter,
        "exclude",
      ],
    },
  },
  async run({ $ }) {
    if (this.effort && this.reasoningMaxTokens) {
      throw new ConfigurationError("**Reasoning Effort** and **Reasoning Max Tokens** cannot be used simultaneously.");
    }
    const data = {
      model: this.model,
      prompt: this.prompt,
      stream: false,
      maxTokens: this.maxTokens,
      temperature: this.temperature && parseFloat(this.temperature),
      seed: this.seed,
      topP: this.topP && parseFloat(this.topP),
      topK: this.topK,
      frequencyPenalty: this.frequencyPenalty && parseFloat(this.frequencyPenalty),
      presencePenalty: this.presencePenalty && parseFloat(this.presencePenalty),
      repetitionPenalty: this.repetitionPenalty && parseFloat(this.repetitionPenalty),
      logitBias: this.logitBias,
      togLogprobs: this.togLogprobs,
      minP: this.minP && parseFloat(this.minP),
      topA: this.topA && parseFloat(this.topA),
      transforms: this.transforms,
      models: this.models,
    };
    if (this.sort) {
      data.provider = {
        sort: this.sort,
      };
    }
    const reasoning = {};
    if (this.effort) {
      reasoning.effort =  this.effort;
    }
    if (this.reasoningMaxTokens) {
      reasoning.max_tokens = parseFloat(this.reasoningMaxTokens);
    }
    if (this.exclude) {
      reasoning.exclude =  this.exclude;
    }
    if (Object.entries(reasoning).length) {
      data.reasoning = reasoning;
    }
    const response = await this.openrouter.sendCompetionRequest({
      $,
      data,
      timeout: 1000 * 60 * 5,
    });
    if (response.error) {
      throw new ConfigurationError(response.error.message);
    }
    $.export("$summary", `A new completion request with Id: ${response.id} was successfully created!`);
    return response;
  },
};
