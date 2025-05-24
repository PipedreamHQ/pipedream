import apipieAi from "../../apipie_ai.app.mjs";

export default {
  name: "Create Image",
  version: "0.0.1",
  key: "apipie_ai-create-image",
  description: "Creates an image given a prompt returning a URL to the image. [See the documentation](https://apipie.ai/docs/Features/Images)",
  type: "action",
  props: {
    apipieAi,
    model: {
      propDefinition: [
        apipieAi,
        "modelId",
        { modelType: "image" },
      ],
      label: "Image Model",
      description: "The image generation model to use.",
    },
    prompt: {
      propDefinition: [
        apipieAi,
        "prompt",
      ],
    },
    responseFormat: {
      propDefinition: [
        apipieAi,
        "imageResponseFormat",
      ],
    },
    size: {
      propDefinition: [
        apipieAi,
        "size",
      ],
    },
    n: {
      propDefinition: [
        apipieAi,
        "n",
      ],
    },
    quality: {
      propDefinition: [
        apipieAi,
        "quality",
      ],
    },
    style: {
      propDefinition: [
        apipieAi,
        "style",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.apipieAi.createImage({
      $,
      data: {
        prompt: this.prompt,
        n: this.n,
        size: this.size,
        ...(this.responseFormat && { response_format: this.responseFormat }),
        model: this.model,
        quality: this.quality,
        style: this.style,
      },
    });

    if (response.data.length) {
      $.export("$summary", `Successfully created ${response.data.length} image${response.data.length === 1
        ? ""
        : "s"}`);
    }

    return response;
  },
};
