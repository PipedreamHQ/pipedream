import acedatacloud from "../../acedatacloud.app.mjs";
import {
  apiError,
  normalizeImageInput,
  validateImageRequest,
} from "../../common/utils.mjs";

export default {
  key: "acedatacloud-edit-image",
  name: "Edit Image",
  description: "Submit one Seedream image edit and return its task ID. [See the documentation](https://platform.acedata.cloud/documents/seedream-images)",
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
    image: {
      type: "string",
      label: "Image URL",
      description: "A publicly accessible HTTP or HTTPS URL for the image to edit. E.g. `https://example.com/cube.png`.",
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
    const images = normalizeImageInput(this.image);
    validateImageRequest({
      ...this,
      images,
    });
    let response;
    try {
      response = await this.acedatacloud.submitImage({
        $,
        data: {
          model: this.model,
          prompt: this.prompt.trim(),
          image: images[0],
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
      throw new Error("Image edit returned no task ID. Check task history before submitting again.");
    }
    $.export("$summary", `Submitted image edit task ${response.task_id}; generation is pending`);
    return {
      ...response,
      state: "submitted",
    };
  },
};
