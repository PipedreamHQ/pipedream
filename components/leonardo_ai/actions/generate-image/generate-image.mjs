import app from "../../leonardo_ai.app.mjs";

export default {
  key: "leonardo_ai-generate-image",
  name: "Generate Image",
  description: "Generates new images using Leonardo AI's image generation API.",
  version: "0.0.5",
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
        const models = await this.app.getPlatformModels({});
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
      default: 512,
      min: 256,
      max: 1024,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "Height of the generated image in pixels.",
      default: 512,
      min: 256,
      max: 1024,
    },
    numImages: {
      type: "integer",
      label: "Number of Images",
      description: "Number of images to generate (1-4).",
      default: 1,
      min: 1,
      max: 4,
    },
    guidanceScale: {
      type: "string",
      label: "Guidance Scale",
      description: "How closely the model should follow the prompt. Must be between 1 and 20. Higher values = more adherence to prompt.",
      optional: true,
    },
    numInferenceSteps: {
      type: "integer",
      label: "Inference Steps",
      description: "Number of denoising steps. More steps = higher quality but slower generation.",
      default: 20,
      min: 10,
      max: 50,
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
    };

    if (modelId) {
      data.modelId = modelId;
    }
    if (guidanceScale) {
      data.guidance_scale = parseFloat(guidanceScale);
    }
    if (numInferenceSteps) {
      data.num_inference_steps = numInferenceSteps;
    }
    if (seed) {
      data.seed = seed;
    }

    const response = await this.app.post({
      $,
      path: "/generations",
      data,
    });

    $.export("$summary", `Successfully generated ${numImages} image(s) with prompt: "${prompt}"`);
    return response;
  },
};
