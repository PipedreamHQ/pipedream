import azureOpenAI from "../../azure_openai_service.app.mjs";
import constants from "../common/constants.mjs";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default {
  key: "azure_openai_service-create-image",
  name: "Create Image",
  description: "Creates an image given a prompt, and returns a URL to the image. [See the documentation](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference#image-generation)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    azureOpenAI,
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
    const { id: operationId } = await this.azureOpenAI.createImage({
      data: {
        prompt: this.prompt,
        n: this.n,
        size: this.size,
      },
      $,
    });

    let response;
    do {
      response = await this.azureOpenAI.getImageResult({
        operationId,
        $,
      });
      if (response?.status === "succeeded") {
        break;
      }
      await delay(5000);
    } while (true);

    if (response.id) {
      $.export("$summary", `Successfully created image with ID ${response.id}.`);
    }

    return response;
  },
};
