import { axios } from "@pipedream/platform";
import {
  GENERATION_MODE_OPTIONS,
  LIMIT,
  MODE_OPTIONS,
  SYSTEM_VERSION_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "letzai",
  propDefinitions: {
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The input prompt for image generation",
    },
    imageId: {
      type: "string",
      label: "Image ID",
      description: "The unique identifier for the image",
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "The Editing Mode. Can be 'in' for Inpainting (modify within image) or 'out' for Outpainting (extend image)",
      options: MODE_OPTIONS,
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The width of the image",
      min: 480,
      max: 2160,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The height of the image",
      min: 480,
      max: 2160,
    },
    quality: {
      type: "integer",
      label: "Quality",
      description: "Defines how many steps the generation should take",
      min: 1,
      max: 6,
    },
    creativity: {
      type: "integer",
      label: "Creativity",
      description: "Defines how strictly the prompt should be respected",
      min: 1,
      max: 6,
    },
    hasWatermark: {
      type: "boolean",
      label: "Has Watermark",
      description: "Defines whether to set a watermark or not",
    },
    systemVersion: {
      type: "integer",
      label: "System Version",
      description: "Use LetzAI V2, or V3 (newest)",
      options: SYSTEM_VERSION_OPTIONS,
    },
    generationMode: {
      type: "string",
      label: "Generation Mode",
      description: "Select one of the different modes that offer different generation settings",
      options: GENERATION_MODE_OPTIONS,
    },
    originalImageCompletionId: {
      type: "string",
      label: "Original Image Completion ID",
      description: "The ID of the original image completion used for editing",
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The URL to the image you want to edit",
    },
    promptEdit: {
      type: "string",
      label: "Prompt",
      description: "Text description of the desired modifications",
    },
    mask: {
      type: "string",
      label: "Mask",
      description: "Base64 encoded image mask (required for inpainting)",
    },
    imageCompletionsCount: {
      type: "integer",
      label: "Image Completions Count",
      description: "Number of variations to generate",
      min: 1,
      max: 5,
    },
    settings: {
      type: "object",
      label: "Settings",
      description: "Required for Outpainting. Format: {'panControls': {'up': false, 'right': false, 'down': false, 'left': false}, 'zoomSize': 1.5}",
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "Optional URL to receive a POST notification when upscale is complete",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.letz.ai";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createImage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/images",
        ...opts,
      });
    },
    retrieveImageInfo({
      imageId, ...opts
    }) {
      return this._makeRequest({
        path: `/images/${imageId}`,
        ...opts,
      });
    },
    listImages(opts = {}) {
      return this._makeRequest({
        path: "/images",
        ...opts,
      });
    },
    listImageEdits(opts = {}) {
      return this._makeRequest({
        path: "/image-edits",
        ...opts,
      });
    },
    createImageEditTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/image-edits",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        params.limit = LIMIT;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
