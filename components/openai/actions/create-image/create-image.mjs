import openai from "../../openai.app.mjs";
import constants from "../common/constants.mjs"

export default {
  name: "Create Image",
  version: "0.0.3",
  key: "openai-create-image",
  description: "Creates an image given a prompt. [See docs here](https://beta.openai.com/docs/api-reference/images/create)",
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
    },
    size: {
      label: "Size",
      description: "The size of the generated images.",
      type: "string",
      optional: true,
      options: constants.IMAGE_SIZES
    },
    responseFormat: {
      label: "Response Format",
      description: "The format in which the generated images are returned.",
      type: "string",
      optional: true,
      options: constants.RESPONSE_FORMATS
    },
  },
  async run({ $ }) {
    const response = await this.openai.createImage({
      $,
      data: {
        prompt: this.prompt,
        n: this.n,
        size: this.size,
        response_format: this.responseFormat
      },
    });

    if (response) {
      $.export("$summary", `Successfully created image with id ${response.id}`);
    }

    return response;
  },
};
