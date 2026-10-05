import acedatacloud, {
  apiError, validateImageRequest,
} from "../../acedatacloud.app.mjs";

export default {
  key: "acedatacloud-generate-image",
  name: "Generate Image",
  description: "Submit one Seedream image job and return its task ID. [See the documentation](https://platform.acedata.cloud/documents/seedream-images)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    acedatacloud,
    model: {
      propDefinition: [
        acedatacloud,
        "model",
      ],
    },
    prompt: {
      propDefinition: [
        acedatacloud,
        "prompt",
      ],
    },
    size: {
      propDefinition: [
        acedatacloud,
        "size",
      ],
    },
    watermark: {
      propDefinition: [
        acedatacloud,
        "watermark",
      ],
    },
  },
  async run({ $ }) {
    validateImageRequest(this);
    let response;
    try {
      response = await this.acedatacloud.submitImage({
        $,
        data: {
          model: this.model,
          prompt: this.prompt.trim(),
          size: this.size,
          ...(this.watermark !== undefined && {
            watermark: this.watermark,
          }),
        },
      });
    } catch (error) {
      throw apiError(error, true);
    }
    if (typeof response?.task_id !== "string" || !response.task_id) {
      throw new Error("Image submission returned no task ID. Check task history before submitting again.");
    }
    $.export("$summary", `Submitted image task ${response.task_id}; generation is pending`);
    return {
      ...response,
      state: "submitted",
    };
  },
};
