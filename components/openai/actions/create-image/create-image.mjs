import openai from "../../openai.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  name: "Create Image (Dall-E)",
  version: "0.1.14",
  key: "openai-create-image",
  description: "Creates an image given a prompt returning a URL to the image. [See the documentation](https://platform.openai.com/docs/api-reference/images)",
  type: "action",
  props: {
    openai,
    model: {
      label: "Model",
      description: "Choose the DALL·E models to generate image(s) with.",
      type: "string",
      options: constants.IMAGE_MODELS,
      reloadProps: true,
    },
    prompt: {
      label: "Prompt",
      description: "A text description of the desired image(s). The maximum length is 1000 characters for dall-e-2 and 4000 characters for dall-e-3.",
      type: "string",
    },
    responseFormat: {
      label: "Response Format",
      description: "The format in which the generated images are returned.",
      type: "string",
      optional: true,
      options: constants.IMAGE_RESPONSE_FORMATS,
      default: "url",
    },
    size: {
      label: "Size",
      description: "The size of the generated images.",
      type: "string",
      optional: true,
      options: constants.IMAGE_SIZES,
      default: "1024x1024",
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.model) {
      return props;
    }
    if (this.model !== "dall-e-3") {
      props.n = {
        type: "integer",
        label: "N",
        description: "The number of images to generate. Must be between 1 and 10.",
        optional: true,
        default: 1,
      };
    } else {
      props.quality = {
        type: "string",
        label: "Quality",
        description: "The quality of the image",
        options: constants.IMAGE_QUALITIES,
        optional: true,
        default: "standard",
      };
      props.style = {
        type: "string",
        label: "Style",
        description: "The style of the image",
        options: constants.IMAGE_STYLES,
        optional: true,
        default: "natural",
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.openai.createImage({
      $,
      data: {
        prompt: this.prompt,
        n: this.n,
        size: this.size,
        response_format: this.responseFormat,
        model: this.model,
        quality: this.quality,
        style: this.style,
      },
    });

    if (response.data.length) {
      $.export("$summary", `Successfully created ${response.data.length} images`);
    }

    return response;
  },
};
