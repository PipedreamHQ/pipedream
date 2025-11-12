import cerebras from "../../cerebras.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Create Completion",
  key: "cerebras-create-completion",
  description: "Create a completion with Cerebras AI. [See the documentation](https://inference-docs.cerebras.ai/api-reference/completions)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cerebras,
    model: {
      propDefinition: [
        cerebras,
        "model",
      ],
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The prompt(s) to generate completions for, encoded as a string, array of strings, array of tokens, or array of token arrays",
    },
    stream: {
      propDefinition: [
        cerebras,
        "stream",
      ],
    },
    returnRawTokens: {
      type: "boolean",
      label: "Return Raw Tokens",
      description: "Return raw tokens instead of text",
      optional: true,
      default: false,
    },
    maxTokens: {
      type: "integer",
      label: "Max Tokens",
      description: "The maximum number of tokens that can be generated in the completion. The total length of input tokens and generated tokens is limited by the model's context length",
      optional: true,
    },
    minTokens: {
      type: "integer",
      label: "Min Tokens",
      description: "The minimum number of tokens to generate for a completion. If not specified or set to 0, the model will generate as many tokens as it deems necessary. Setting to -1 sets to max sequence length",
      optional: true,
    },
    seed: {
      propDefinition: [
        cerebras,
        "seed",
      ],
    },
    stop: {
      propDefinition: [
        cerebras,
        "stop",
      ],
    },
    temperature: {
      propDefinition: [
        cerebras,
        "temperature",
      ],
    },
    topP: {
      propDefinition: [
        cerebras,
        "topP",
      ],
    },
    echo: {
      type: "boolean",
      label: "Echo",
      description: "Echo back the prompt in addition to the completion. Incompatible with return_raw_tokens=True",
      optional: true,
      default: false,
    },
    user: {
      propDefinition: [
        cerebras,
        "user",
      ],
    },
  },
  async run({ $ }) {
    const {
      model,
      prompt,
      stream,
      returnRawTokens,
      maxTokens,
      minTokens,
      seed,
      stop,
      temperature,
      topP,
      echo,
      user,
    } = this;

    if (returnRawTokens && echo) {
      throw new ConfigurationError("The 'echo' option is incompatible with 'returnRawTokens=true'. Please disable one of these options.");
    }

    const response = await this.cerebras.completion({
      $,
      data: {
        model,
        prompt: parseObject(prompt),
        stream,
        return_raw_tokens: returnRawTokens,
        max_tokens: maxTokens,
        min_tokens: minTokens,
        seed,
        stop,
        temperature,
        top_p: topP,
        echo,
        user,
      },
    });

    $.export("$summary", "Successfully created completion");
    return response;
  },
};
