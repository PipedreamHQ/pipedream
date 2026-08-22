import deepkeep from "../../deepkeep.app.mjs";
import { MODERATION_PHASES } from "../../common/constants.mjs";

export default {
  key: "deepkeep-moderate-text",
  name: "Moderate Text",
  description: "Check text with DeepKeep using either pre-model or post-model moderation. [See the documentation](https://deepkeep.ai/docs/api)",
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
    phase: {
      type: "string",
      label: "Moderation Phase",
      description: "The DeepKeep moderation phase. Use pre-model to check model input, or post-model to check model output.",
      options: MODERATION_PHASES,
      default: "pre",
    },
    model: {
      propDefinition: [
        deepkeep,
        "model",
      ],
    },
    text: {
      propDefinition: [
        deepkeep,
        "text",
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
    const request = {
      $,
      baseUrl: this.baseUrl,
      model: this.model,
      title: this.title || "",
      chat: this.chat || "",
    };
    const result = this.phase === "post"
      ? await this.deepkeep.moderatePostModel({
        ...request,
        output: this.text,
      })
      : await this.deepkeep.moderatePreModel({
        ...request,
        input: this.text,
      });
    const normalized = this.deepkeep.normalizeModerationResult(result, this.text);

    $.export("$summary", this.deepkeep.summary(normalized, this.phase));

    if (normalized.blocked && this.stopOnBlock) {
      throw new Error(this.deepkeep.blockReason(normalized));
    }

    return normalized;
  },
};
