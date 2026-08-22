import deepkeep from "../../deepkeep.app.mjs";

export default {
  key: "deepkeep-pre-model-check",
  name: "Pre-Model Check",
  description: "Check text with DeepKeep before sending it to an LLM. See the [DeepKeep documentation](https://deepkeep.ai/docs/api).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    deepkeep,
    baseUrl: {
      propDefinition: [
        deepkeep,
        "baseUrl",
      ],
    },
    model: {
      propDefinition: [
        deepkeep,
        "model",
      ],
    },
    input: {
      propDefinition: [
        deepkeep,
        "input",
      ],
    },
    title: {
      propDefinition: [
        deepkeep,
        "title",
      ],
    },
    chat: {
      propDefinition: [
        deepkeep,
        "chat",
      ],
    },
    stopOnBlock: {
      propDefinition: [
        deepkeep,
        "stopOnBlock",
      ],
    },
  },
  async run({ $ }) {
    const result = await this.deepkeep.preModerate({
      $,
      baseUrl: this.baseUrl,
      model: this.model,
      input: this.input,
      title: this.title || "",
      chat: this.chat || "",
    });
    const normalized = this.deepkeep.normalizeModerationResult(result, this.input);

    $.export("$summary", this.deepkeep.summary(normalized, "pre"));

    if (normalized.blocked && this.stopOnBlock) {
      throw new Error(this.deepkeep.blockReason(normalized));
    }

    return normalized;
  },
};
