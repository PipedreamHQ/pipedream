import { axios } from "@pipedream/platform";

export default {
  key: "eden_ai-generate-image",
  name: "Generate Image",
  description: "Generates an image using the Eden AI app.",
  version: "0.0.1",
  type: "action",
  props: {
    eden_ai: {
      type: "app",
      app: "eden_ai",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text to generate the image from",
    },
    model: {
      type: "string",
      label: "Model",
      description: "The model to use for image generation",
      optional: true,
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The width of the generated image",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The height of the generated image",
      optional: true,
    },
    cfg_scale: {
      type: "integer",
      label: "CFG Scale",
      description: "The scale of the generated image",
      optional: true,
    },
    steps: {
      type: "integer",
      label: "Steps",
      description: "The number of steps to use for image generation",
      optional: true,
    },
    samples: {
      type: "integer",
      label: "Samples",
      description: "The number of samples to use for image generation",
      optional: true,
    },
    textPrompts: {
      type: "string",
      label: "Text Prompts",
      description: "The text prompts to use for image generation",
      optional: true,
    },
    weights: {
      type: "integer",
      label: "Weights",
      description: "The weights to use for image generation",
      optional: true,
    },
  },
  methods: {
    async generateImage({
      $, ...params
    }) {
      return axios($, {
        method: "POST",
        url: "https://api.edenai.run/v2/image-generation/create",
        headers: {
          "Authorization": `Bearer ${this.eden_ai.$auth.api_key}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        data: params,
      });
    },
  },
  async run({ $ }) {
    const textPrompts = this.textPrompts
      ? [
        {
          text: this.textPrompts,
          weight: this.weights,
        },
      ]
      : undefined;

    const response = this.generateImage({
      text: this.text,
      model: this.model,
      width: this.width,
      height: this.height,
      cfg_scale: this.cfg_scale,
      steps: this.steps,
      samples: this.samples,
      text_prompts: textPrompts,
    });

    $.export("$summary", "Image generated successfully");
    return response;
  },
};
