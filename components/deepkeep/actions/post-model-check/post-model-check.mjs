import deepkeep from "../../deepkeep.app.mjs";

export default {
  key: "deepkeep-post-model-check",
  name: "Post-Model Check",
  description: "Moderate model output with DeepKeep after an LLM generates a response and before returning it downstream. Provide the output text and DeepKeep firewall model ID, plus optional title/chat metadata. Returns allowed, blocked, flagged, action, processedText, and the raw result; `stopOnBlock` halts the workflow when DeepKeep blocks content. [See the documentation](https://deepkeep.ai/docs/api)",
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
