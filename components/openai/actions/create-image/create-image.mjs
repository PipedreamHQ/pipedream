import openai from "../../openai.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "Create Image",
  version: "0.1.3",
  key: "openai-create-image",
  description: "Creates an image given a prompt. returns a URL to the image. [See docs here](https://platform.openai.com/docs/api-reference/images)",
  type: "action",
  props: {
    openai,
    prompt: {
      label: "Prompt",
      description: "A text description of the desired image(s). The maximum length is 1000 characters.",
      type: "string",
    },
    n: {
      label: "N",
      description: "The number of images to generate. Must be between 1 and 10.",
      type: "integer",
      optional: true,
      default: 1,
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
  async run({ $ }) {
    const response = await this.openai.createImage({
      $,
      args: {
        prompt: this.prompt,
        n: this.n,
        size: this.size,
        response_format: this.responseFormat,
      },
    });

    if (response.data.length) {
      $.export("$summary", `Successfully created ${response.data.length} images`);
    }

    return response;
  },
};
