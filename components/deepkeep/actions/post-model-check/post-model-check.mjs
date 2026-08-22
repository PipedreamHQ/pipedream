import deepkeep from "../../deepkeep.app.mjs";

export default {
  key: "deepkeep-post-model-check",
  name: "Post-Model Check",
  description: "Check text with DeepKeep after an LLM generates a response. [See the documentation](https://deepkeep.ai/docs/api)",
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
    output: {
      propDefinition: [
        deepkeep,
        "output",
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
    const result = await this.deepkeep.moderatePostModel({
      $,
      baseUrl: this.baseUrl,
      model: this.model,
      output: this.output,
      title: this.title || "",
      chat: this.chat || "",
    });
    const normalized = this.deepkeep.normalizeModerationResult(result, this.output);

    $.export("$summary", this.deepkeep.summary(normalized, "post"));

    if (normalized.blocked && this.stopOnBlock) {
      throw new Error(this.deepkeep.blockReason(normalized));
    }

    return normalized;
  },
};
