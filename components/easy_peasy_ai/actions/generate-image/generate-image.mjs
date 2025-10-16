import app from "../../easy_peasy_ai.app.mjs";

export default {
  key: "easy_peasy_ai-generate-image",
  name: "Generate Image",
  description: "Generates an AI image based on the given prompt. [See the documentation](https://easy-peasy.ai/ai-images)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The textual description of the image to be generated. Eg. `A cat sitting on a chair`.",
    },
    model: {
      type: "string",
      label: "Model",
      description: "The model to use for image generation.",
      options: [
        "DALL-E 3",
        "Stable Diffusion XL",
        "Stable Diffusion 3.0",
      ],
    },
    style: {
      type: "string",
      label: "Style",
      description: "The style of the generated image.",
      optional: true,
    },
    artist: {
      type: "string",
      label: "Artist",
      description: "The artist of the generated image.",
      optional: true,
    },
    dimensions: {
      type: "string",
      label: "Dimensions",
      description: "The dimensions of the generated image. Eg. `512x512`.",
      optional: true,
    },
    useHD: {
      type: "boolean",
      label: "Use HD",
      description: "Use high-definition image generation?",
      optional: true,
    },
    image: {
      type: "string",
      label: "Image",
      description: "Image URL for Image-to-Image generations.",
      optional: true,
    },
  },
  methods: {
    generateImage(args = {}) {
      return this.app.post({
        path: "/generate-image",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      generateImage,
      prompt,
      model,
      style,
      artist,
      dimensions,
      useHD,
      image,
    } = this;

    const response = await generateImage({
      $,
      data: {
        prompt,
        model,
        style,
        artist,
        dimensions,
        useHD,
        image,
      },
    });

    $.export("$summary", "Successfully generated an image.");
    return response;
  },
};
