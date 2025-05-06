import letzai from "../../letzai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "letzai-create-new-image",
  name: "Create New Image",
  description: "Creates a new image generation task from a text prompt in LetzAI. [See the documentation](https://letz.ai/docs/api#createImages)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    letzai,
    prompt: {
      propDefinition: [
        letzai,
        "prompt",
      ],
    },
    width: {
      propDefinition: [
        letzai,
        "width",
      ],
    },
    height: {
      propDefinition: [
        letzai,
        "height",
      ],
    },
    quality: {
      propDefinition: [
        letzai,
        "quality",
      ],
    },
    creativity: {
      propDefinition: [
        letzai,
        "creativity",
      ],
    },
    hasWatermark: {
      propDefinition: [
        letzai,
        "hasWatermark",
      ],
    },
    systemVersion: {
      propDefinition: [
        letzai,
        "systemVersion",
      ],
    },
    mode: {
      propDefinition: [
        letzai,
        "generationMode",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      prompt: this.prompt,
      width: this.width,
      height: this.height,
      quality: this.quality,
      creativity: this.creativity,
      hasWatermark: this.hasWatermark,
      systemVersion: this.systemVersion,
      mode: this.mode,
    };

    const response = await this.letzai.createImageGenerationTask(data);
    $.export("$summary", `Created image with ID: ${response.id}`);
    return response;
  },
};
