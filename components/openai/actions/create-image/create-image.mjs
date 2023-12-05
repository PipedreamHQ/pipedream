import openai from "../../openai.app.mjs";

export default {
  name: "Create Image",
  version: "0.1.11",
  key: "openai-create-image",
  description: "Creates an image given a prompt. returns a URL to the image. [See docs here](https://platform.openai.com/docs/api-reference/images)",
  type: "action",
  props: {
    openai,
    model: {
      label: "Model",
      description: "Choose the DALL·E models to generate image(s) with.",
      type: "string",
      options: [
        {
          label: "dall-e-2",
          value: "dall-e-2",
        },
        {
          label: "dall-e-3",
          value: "dall-e-3",
        },
      ],
      default: "dall-e-3",
    },
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
    quality: {
      label: "Quality",
      description: "The quality of the image",
      type: "string",
      optional: true,
      options: [
        {
          label: "Standard",
          value: "standard",
        },
        {
          label: "HD",
          value: "hd",
        },
      ],
      default: "standard",
    },
    style: {
      label: "Style",
      description: "The style of the image",
      type: "string",
      optional: true,
      options: [
        {
          label: "Natural",
          value: "natural",
        },
        {
          label: "Vivid",
          value: "vivid",
        },
      ],
      default: "natural",
    },
    responseFormat: {
      label: "Response Format",
      description: "The format in which the generated images are returned.",
      type: "string",
      optional: true,
      options: [
        {
          label: "URL",
          value: "url",
        },
        {
          label: "Base64 JSON",
          value: "b64_json",
        },
      ],
      default: "url",
    },
    size: {
      label: "Size",
      description: "The size of the generated images.",
      type: "string",
      optional: true,
      options: [
        {
          label: "256x256",
          value: "256x256",
        },
        {
          label: "512x512",
          value: "512x512",
        },
        {
          label: "1024x1024",
          value: "1024x1024",
        },
        {
          label: "1792x1024",
          value: "1792x1024",
        },
        {
          label: "1024x1792",
          value: "1024x1792",
        },
      ],
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
