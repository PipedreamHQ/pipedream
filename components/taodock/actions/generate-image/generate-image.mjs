import app from "../../taodock.app.mjs";

export default {
  key: "taodock-generate-image",
  name: "Generate Image",
  description:
    "Generate one or more images from a text prompt using a Taodock image model. [See the documentation](https://docs.taodock.com)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  ai: "optimized",
  type: "action",
  props: {
    app,
    model: {
      propDefinition: [
        app,
        "model",
      ],
      description: "The Taodock image model to use (must be image-capable).",
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Describe the image you want to generate.",
    },
    size: {
      type: "string",
      label: "Size",
      description: "Optional image size, e.g. `1024x1024`. Leave empty to use the model default.",
      optional: true,
    },
    aspectRatio: {
      type: "string",
      label: "Aspect Ratio",
      description: "Optional aspect ratio, e.g. `16:9`. Leave empty to use the model default.",
      optional: true,
    },
    quality: {
      type: "string",
      label: "Quality",
      description: "Optional quality setting supported by the model.",
      optional: true,
    },
    outputFormat: {
      type: "string",
      label: "Output Format",
      description: "The image output format.",
      options: [
        "png",
        "jpeg",
        "webp",
      ],
      optional: true,
    },
    negativePrompt: {
      type: "string",
      label: "Negative Prompt",
      description: "Optional description of what to avoid in the image.",
      optional: true,
    },
    referenceImageUrl: {
      type: "string",
      label: "Reference Image URL",
      description: "Optional URL of an image the model should reference.",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Number of Images",
      description: "How many images to generate.",
      min: 1,
      max: 10,
      optional: true,
    },
    seed: {
      type: "integer",
      label: "Seed",
      description: "Optional random seed for reproducible results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const settings = {
      size: this.size,
      aspectRatio: this.aspectRatio,
      quality: this.quality,
      outputFormat: this.outputFormat,
      negativePrompt: this.negativePrompt,
      referenceImageUrl: this.referenceImageUrl,
      count: this.count,
      seed: this.seed,
    };
    const response = await this.app.generateImage({
      $,
      model: this.model,
      prompt: this.prompt,
      settings,
    });

    const images = response?.data ?? [];
    if (images.length === 0) {
      throw new Error("Taodock returned no image data.");
    }

    $.export("$summary", `Successfully generated ${images.length} image(s) with \`${this.model}\``);
    return {
      model: this.model,
      images,
    };
  },
};
