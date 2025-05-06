import letzai from "../../letzai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "letzai-create-image-edit",
  name: "Create Image Edit",
  description: "Creates an image edit task that modifies an existing image using inpainting or outpainting in LetzAI. [See the documentation](https://letz.ai/docs/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    letzai,
    mode: {
      propDefinition: [
        letzai,
        "mode",
      ],
    },
    originalImageCompletionId: {
      propDefinition: [
        letzai,
        "originalImageCompletionId",
      ],
      optional: true,
    },
    imageUrl: {
      propDefinition: [
        letzai,
        "imageUrl",
      ],
      optional: true,
    },
    prompt: {
      propDefinition: [
        letzai,
        "promptEdit",
      ],
      optional: true,
    },
    mask: {
      propDefinition: [
        letzai,
        "mask",
      ],
      optional: true,
    },
    width: {
      propDefinition: [
        letzai,
        "width",
      ],
      optional: true,
    },
    height: {
      propDefinition: [
        letzai,
        "height",
      ],
      optional: true,
    },
    imageCompletionsCount: {
      propDefinition: [
        letzai,
        "imageCompletionsCount",
      ],
      optional: true,
    },
    settings: {
      propDefinition: [
        letzai,
        "settings",
      ],
      optional: true,
    },
    webhookUrl: {
      propDefinition: [
        letzai,
        "webhookUrl",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      mode: this.mode,
      original_image_completion_id: this.originalImageCompletionId,
      image_url: this.imageUrl,
      prompt: this.prompt,
      mask: this.mask,
      width: this.width,
      height: this.height,
      image_completions_count: this.imageCompletionsCount,
      settings: this.settings,
      webhook_url: this.webhookUrl,
    };

    const response = await this.letzai.createImageEditTask(data);
    $.export("$summary", `Image edit task created successfully with ID: ${response.id}`);
    return response;
  },
};
