import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import letzai from "../../letzai.app.mjs";

export default {
  key: "letzai-create-image-edit",
  name: "Create Image Edit",
  description: "Creates an image edit task that modifies an existing image using inpainting or outpainting in LetzAI. [See the documentation](https://api.letz.ai/doc#/image-edit/image_edit_create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    letzai,
    mode: {
      propDefinition: [
        letzai,
        "mode",
      ],
      reloadProps: true,
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
  async additionalProps(props) {
    if (this.mode === "in") {
      props.mask.optional = false;
    }
    return {};
  },
  async run({ $ }) {
    if (!this.originalImageCompletionId && !this.imageUrl) {
      throw new ConfigurationError("Please provide either an original image completion ID or an image URL.");
    }

    const {
      letzai,
      settings,
      ...data
    } = this;

    const response = await letzai.createImageEditTask({
      $,
      data: {
        ...data,
        settings: settings && parseObject(settings),
      },
    });
    $.export("$summary", `Image edit task created successfully with request ID: ${response.id}`);
    return response;
  },
};
