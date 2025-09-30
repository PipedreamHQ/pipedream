import leap from "../../leap.app.mjs";

export default {
  key: "leap-create-image-generation-job",
  name: "Create Image Generation Job",
  description: "Queues an image generation job and returns the job details. [See the documentation](https://docs.tryleap.ai/reference/inferencescontroller_create-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    leap,
    model: {
      propDefinition: [
        leap,
        "model",
      ],
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Text description of the image you want to create",
    },
    negativePrompt: {
      type: "string",
      label: "Negative Prompt",
      description: "Text description of what should be avoided / not included in your generated image",
      optional: true,
    },
    numberOfImages: {
      type: "integer",
      label: "Number of Images",
      description: "The number of images to generate for the inference. Max batch size is 20.",
      optional: true,
      max: 20,
    },
    restoreFaces: {
      type: "boolean",
      label: "Restore Faces",
      description: "Optionally apply face restoration to the generated images. This will make images of faces look more realistic.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "An optional webhook URL that will be called when the model is trained",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.leap.createImageGenerationJob({
      modelId: this.model,
      data: {
        prompt: this.prompt,
        negativePrompt: this.negativePrompt,
        numberOfImages: this.numberOfImages,
        restoreFaces: this.restoreFaces,
        webhookUrl: this.webhookUrl,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created image generation job with id ${response.id}`);
    }

    return response;
  },
};
