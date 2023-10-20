import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dreamstudio",
  propDefinitions: {
    cfgScale: {
      type: "integer",
      label: "Cfg Scale",
      description: "How strictly the diffusion process adheres to the prompt text (higher values keep your image closer to your prompt).",
    },
    clipGuidancePreset: {
      type: "string",
      label: "Clip Guidance Preset",
      description: "Clip Guidance Preset",
      options: [
        "FAST_BLUE",
        "FAST_GREEN",
        "NONE",
        "SIMPLE",
        "SLOW",
        "SLOWER",
        "SLOWEST",
      ],
    },
    engineId: {
      type: "string",
      label: "Engine Id",
      description: "The id of the engine.",
      async options({ organizationId }) {
        const data = await this.listEngines({
          headers: {
            Organization: organizationId,
          },
        });

        const regex = new RegExp(/esrgan.+/, "g");
        return data.filter(({ id }) => !id.match(regex)).map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    extras: {
      type: "object",
      label: "Extras",
      description: "Extra parameters passed to the engine. These parameters are used for in-development or experimental features and may charge without werning, so please use with caution.",
    },
    height: {
      type: "integer",
      label: "Height",
      description: "Height of the image in pixels. Must be in increments of 64 and pass the following validation: For 512 engines: 262,144 ≤ `height * width` ≤ 1,048,576. For 768 engines: 589,824 ≤ `height * width` ≤ 1,048,576. For SDXL Beta: can be as low as 128 and as high as 896 as long as `width` is not greater than 512. If `width` is greater than 512 then this can be at most 512. For SDXL v0.9: valid dimensions are 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640, 640x1536, 768x1344, 832x1216, or 896x1152. For SDXL v1.0: valid dimensions are the same as SDXL v0.9",
    },
    organizationId: {
      type: "string",
      label: "Organization Id",
      description: "The id of the organization.",
      async options({ page }) {
        const { organizations: data } = await this.getUser({
          params: {
            page,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    sampler: {
      type: "string",
      label: "Sampler",
      description: "Which sampler to use for the diffusion process. If this value is omitted we'll automatically select an appropriate sampler for you.",
      options: [
        "DDIM",
        "DDPM",
        "K_DPMPP_2M",
        "K_DPMPP_2S_ANCESTRAL",
        "K_DPM_2",
        "K_DPM_2_ANCESTRAL",
        "K_EULER",
        "K_EULER_ANCESTRAL",
        "K_HEUN",
        "K_LMS",
      ],
    },
    samples: {
      type: "integer",
      label: "Samples",
      description: "Number of images to generate",
    },
    seed: {
      type: "integer",
      label: "Seed",
      description: "Random noise seed (omit this option or use `0` for a random seed).",
    },
    steps: {
      type: "integer",
      label: "Steps",
      description: "Number od diffusion steps to run.",
    },
    stylePreset: {
      type: "string",
      label: "Style Preset",
      description: "Pass in a style preset to guide the image model towards a particular style.",
      options: [
        "3d-model",
        "analog-film",
        "anime",
        "cinematic",
        "comic-book",
        "digital-art",
        "enhance",
        "fantasy-art",
        "isometric",
        "line-art",
        "low-poly",
        "modeling-compound",
        "neon-punk",
        "origami",
        "photographic",
        "pixel-art",
        "tile-texture",
      ],
    },
    textPrompts: {
      type: "string[]",
      label: "Text Prompts",
      description: "An array of valid JSON objects to use for generation. The JSON object must have the text and the weight. e.g.`{\"text\": \"A lighthouse on a cliff\", \"weight\": 0.5}`",
    },
    width: {
      type: "integer",
      label: "Width",
      description: "Width of the image in pixels. Must be in increments of 64 and pass the following validation: For 512 engines: 262,144 ≤ `height * width` ≤ 1,048,576. For 768 engines: 589,824 ≤ `height * width` ≤ 1,048,576. For SDXL Beta: can be as low as 128 and as high as 896 as long as `height` is not greater than 512. If `height` is greater than 512 then this can be at most 512. For SDXL v0.9: valid dimensions are 1024x1024, 1152x896, 1216x832, 1344x768, 1536x640, 640x1536, 768x1344, 832x1216, or 896x1152. For SDXL v1.0: valid dimensions are the same as SDXL v0.9",
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.stability.ai/v1";
    },
    _getHeaders(headers = {}) {
      return {
        ...headers,
        "Authorization": this.$auth.api_key,
        "Accept": "application/json",

      };
    },
    async _makeRequest({
      $ = this, headers, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(headers),
        ...opts,
      };

      return axios($, config);
    },
    generateImage({
      engineId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `generation/${engineId}/text-to-image`,
        ...args,
      });
    },
    getUser(args = {}) {
      return this._makeRequest({
        path: "user/account",
        ...args,
      });
    },
    listEngines(args = {}) {
      return this._makeRequest({
        path: "engines/list",
        ...args,
      });
    },
    modifyImage({
      engineId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `generation/${engineId}/image-to-image`,
        ...args,
      });
    },
    upscaleImage({
      engineId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `generation/${engineId}/image-to-image/upscale`,
        ...args,
      });
    },
  },
};
