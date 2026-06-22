import muapi from "../../muapi.app.mjs";

const T2I_MODELS = {
  "flux-schnell": "flux-schnell-image",
  "flux-dev": "flux-dev-image",
  "flux-kontext-dev": "flux-kontext-dev-t2i",
  "flux-kontext-pro": "flux-kontext-pro-t2i",
  "flux-kontext-max": "flux-kontext-max-t2i",
  "hidream-fast": "hidream_i1_fast_image",
  "hidream-dev": "hidream_i1_dev_image",
  "hidream-full": "hidream_i1_full_image",
  "midjourney": "midjourney-v7-text-to-image",
  "gpt4o": "gpt4o-text-to-image",
  "imagen4": "google-imagen4",
  "seedream": "bytedance-seedream-v4.5",
  "wan2.1": "wan2.1-text-to-image",
  "reve": "reve-text-to-image",
  "ideogram": "ideogram-v3-t2i",
  "hunyuan": "hunyuan-image-2.1",
};

export default {
  name: "Generate Image",
  version: "0.1.0",
  key: "muapi-generate-image",
  description: "Generate an image from a text prompt using 15+ models including Flux, Midjourney, GPT-4o, Imagen 4, and more. [See the documentation](https://docs.muapi.ai)",
  type: "action",
  props: {
    muapi,
    model: {
      type: "string",
      label: "Model",
      description: "The image generation model to use.",
      options: Object.keys(T2I_MODELS).map((m) => ({
        label: m,
        value: m,
      })),
      default: "flux-schnell",
    },
    prompt: {
      propDefinition: [
        muapi,
        "prompt",
      ],
    },
    aspectRatio: {
      propDefinition: [
        muapi,
        "aspectRatio",
      ],
    },
  },
  async run({ $ }) {
    const endpoint = T2I_MODELS[this.model];
    if (!endpoint) throw new Error(`Unknown model: ${this.model}`);

    const { request_id } = await this.muapi.post($, endpoint, {
      prompt: this.prompt,
      aspect_ratio: this.aspectRatio,
    });

    const outputs = await this.muapi.pollResult($, request_id);
    $.export("$summary", `Successfully generated ${outputs.length} image(s) with ${this.model}`);
    return {
      request_id,
      outputs,
    };
  },
};
