import app from "../../leonardo_ai.app.mjs";

export default {
  key: "leonardo_ai-generate-image",
  name: "Generate Image",
  description: "Generates new images using Leonardo AI's image generation API.  [See the documentation](https://docs.leonardo.ai/reference/creategeneration)",
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
      description: "The text prompt describing the image you want to generate.",
    },
    modelId: {
      type: "string",
      label: "Model",
      description: "The model to use for generation. Leave empty to use the default model.",
      async options() {
        const models = await this.app.getPlatformModels();
        return models.map((model) => ({
          label: model.name || model.id,
          value: model.id,
        }));
      },
      optional: true,
    },
    width: {
      type: "integer",
      label: "Width",
      description: "Width of the generated image in pixels.",
      default: 1024,
      min: 32,
      max: 1536,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "Height of the generated image in pixels.",
      default: 768,
      min: 32,
      max: 1536,
    },
    numImages: {
      type: "integer",
      label: "Number of Images",
      description: "Number of images to generate (1-8). If either width or height is over 768, must be between 1 and 4.",
      default: 1,
      min: 1,
      max: 8,
    },
    guidanceScale: {
      type: "integer",
      label: "Guidance Scale",
      description: "How closely the model should follow the prompt. Must be between 1 and 20. Higher values = more adherence to prompt.",
      default: 7,
      min: 1,
      max: 20,
      optional: true,
    },
    numInferenceSteps: {
      type: "integer",
      label: "Inference Steps",
      description: "Number of denoising steps. More steps = higher quality but slower generation.",
      default: 15,
      min: 10,
      max: 60,
      optional: true,
    },
    seed: {
      type: "integer",
      label: "Seed",
      description: "Random seed for reproducible generation. Leave empty for random generation.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      prompt,
      modelId,
      width,
      height,
      numImages,
      guidanceScale,
      numInferenceSteps,
      seed,
    } = this;

    const data = {
      prompt,
      width,
      height,
      num_images: numImages,
      modelId,
      guidance_scale: guidanceScale,
      num_inference_steps: numInferenceSteps,
      seed,
    };

    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/generations",
      data,
    });

    $.export("$summary", `Successfully generated ${numImages} image(s)`);
    return response;
  },
};
