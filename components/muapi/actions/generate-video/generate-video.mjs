import muapi from "../../muapi.app.mjs";

const T2V_MODELS = {
  "veo3": "veo3-text-to-video",
  "veo3-fast": "veo3-fast-text-to-video",
  "veo4": "veo-4-text-to-video",
  "kling-master": "kling-v2.1-master-t2v",
  "kling-v3-pro": "kling-v3.0-pro-text-to-video",
  "wan2.1": "wan2.1-text-to-video",
  "wan2.2": "wan2.2-text-to-video",
  "wan2.5": "wan2.5-text-to-video",
  "seedance-pro": "seedance-pro-t2v",
  "runway": "runway-text-to-video",
  "pixverse": "pixverse-v4.5-t2v",
  "sora": "openai-sora",
  "sora-2": "openai-sora-2-text-to-video",
  "hunyuan": "hunyuan-text-to-video",
};

export default {
  name: "Generate Video",
  version: "0.0.1",
  key: "muapi-generate-video",
  description: "Generate a video from a text prompt using 14+ models including Veo3, Veo4, Kling, Wan, Seedance, Runway, Sora, and more. [See the documentation](https://muapi.ai/docs/api-reference/video-generation)",
  type: "action",
  annotations: {
    openWorldHint: true,
    readOnlyHint: false,
    destructiveHint: false,
  },
  props: {
    muapi,
    model: {
      type: "string",
      label: "Model",
      description: "The video generation model to use.",
      options: Object.keys(T2V_MODELS).map((m) => ({
        label: m,
        value: m,
      })),
      default: "veo3-fast",
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
      default: "16:9",
    },
    duration: {
      type: "integer",
      label: "Duration (seconds)",
      description: "Length of the generated video in seconds.",
      optional: true,
      default: 5,
      min: 3,
      max: 60,
    },
  },
  async run({ $ }) {
    const endpoint = T2V_MODELS[this.model];
    if (!endpoint) throw new Error(`Unknown model: ${this.model}`);

    const { request_id } = await this.muapi.post($, endpoint, {
      prompt: this.prompt,
      aspect_ratio: this.aspectRatio,
      duration: this.duration,
    });

    const outputs = await this.muapi.pollResult($, request_id, 4000);
    $.export("$summary", `Successfully generated video with ${this.model}`);
    return {
      request_id,
      video_url: outputs[0],
      outputs,
    };
  },
};
