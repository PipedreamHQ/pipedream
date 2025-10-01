import app from "../../eden_ai.app.mjs";

const options = [
  "deepai",
  "openai",
  "stabilityai",
  "replicate",
];

export default {
  key: "eden_ai-generate-image",
  name: "Generate Image",
  description: "Generates an image from the provided description. [See the documentation](https://docs.edenai.co/reference/image_generation_create)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    text: {
      propDefinition: [
        app,
        "text",
      ],
      description: "Description of the desired image(s) - the maximum length is 1000 characters.",
    },
    resolution: {
      type: "string",
      label: "Resolution",
      description: "Resolution of the image.",
      options: [
        "256x256",
        "512x512",
        "1024x1024",
      ],
    },
    numImages: {
      type: "integer",
      label: "Number of images",
      description: "The number of images to generate.",
      optional: true,
      default: 1,
      min: 1,
      max: 10,
    },
    providers: {
      propDefinition: [
        app,
        "providers",
      ],
      options,
    },
    fallbackProviders: {
      propDefinition: [
        app,
        "fallbackProviders",
      ],
      options,
    },
    showOriginalResponse: {
      propDefinition: [
        app,
        "showOriginalResponse",
      ],
    },
  },
  async run({ $ }) {
    const {
      text,
      resolution,
      numImages,
      providers,
      fallbackProviders,
      showOriginalResponse,
    } = this;

    const params = {
      $,
      data: {
        text,
        resolution,
        num_images: numImages,
        providers: providers.join(),
        fallback_providers: fallbackProviders?.join(),
        show_original_response: showOriginalResponse,
      },
    };

    const response = await this.app.generateImage(params);
    $.export("$summary", "Image generated successfully");
    return response;
  },
};
