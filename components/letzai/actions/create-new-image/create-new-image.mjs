import letzai from "../../letzai.app.mjs";

export default {
  key: "letzai-create-new-image",
  name: "Create New Image",
  description: "Creates a new image generation task from a text prompt in LetzAI. [See the documentation](https://api.letz.ai/doc#/images/images_create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    letzai,
    info: {
      type: "alert",
      alertType: "info",
      content: "**Note:** You can monitor the generation status using the Action \"Get Image Information\".",
    },
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
      optional: true,
    },
    height: {
      propDefinition: [
        letzai,
        "height",
      ],
      optional: true,
    },
    quality: {
      propDefinition: [
        letzai,
        "quality",
      ],
      optional: true,
    },
    creativity: {
      propDefinition: [
        letzai,
        "creativity",
      ],
      optional: true,
    },
    hasWatermark: {
      propDefinition: [
        letzai,
        "hasWatermark",
      ],
      optional: true,
    },
    systemVersion: {
      propDefinition: [
        letzai,
        "systemVersion",
      ],
      optional: true,
    },
    mode: {
      propDefinition: [
        letzai,
        "generationMode",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      letzai,
      ...data
    } = this;

    const response = await letzai.createImage({
      $,
      data,
    });
    $.export("$summary", `Created image with ID: ${response.id}`);
    return response;
  },
};
