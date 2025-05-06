import { axios } from "@pipedream/platform";

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
      description: "The Editing Mode. Can be 'in' for Inpainting or 'out' for Outpainting",
      options: [
        {
          label: "Inpainting",
          value: "in",
        },
        {
          label: "Outpainting",
          value: "out",
        },
      ],
    },
    width: {
      type: "integer",
      label: "Width",
      description: "The width of the image",
      optional: true,
      min: 520,
      max: 2160,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "The height of the image",
      optional: true,
      min: 520,
      max: 2160,
    },
    quality: {
      type: "integer",
      label: "Quality",
      description: "Defines how many steps the generation should take",
      optional: true,
      min: 1,
      max: 5,
    },
    creativity: {
      type: "integer",
      label: "Creativity",
      description: "Defines how strictly the prompt should be respected",
      optional: true,
      min: 1,
      max: 5,
    },
    hasWatermark: {
      type: "boolean",
      label: "Has Watermark",
      description: "Defines whether to set a watermark or not",
      optional: true,
    },
    systemVersion: {
      type: "integer",
      label: "System Version",
      description: "Use LetzAI V2, or V3 (newest)",
      optional: true,
      options: [
        {
          label: "Version 2",
          value: 2,
        },
        {
          label: "Version 3",
          value: 3,
        },
      ],
    },
    generationMode: {
      type: "string",
      label: "Generation Mode",
      description: "Select one of the different modes that offer different generation settings",
      optional: true,
      options: [
        {
          label: "Default",
          value: "default",
        },
        {
          label: "Sigma",
          value: "sigma",
        },
        {
          label: "Turbo",
          value: "turbo",
        },
      ],
    },
    originalImageCompletionId: {
      type: "string",
      label: "Original Image Completion ID",
      description: "The ID of the original image completion used for editing",
      optional: true,
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "The URL to the image you want to edit",
      optional: true,
    },
    promptEdit: {
      type: "string",
      label: "Prompt for Edits",
      description: "Your prompt for image edits",
      optional: true,
    },
    mask: {
      type: "string",
      label: "Mask",
      description: "Base64 encoded mask image",
      optional: true,
    },
    imageCompletionsCount: {
      type: "integer",
      label: "Image Completions Count",
      description: "Amount of images to generate",
      optional: true,
      min: 1,
      max: 3,
    },
    settings: {
      type: "object",
      label: "Settings",
      description: "Required for Outpainting. Format: {'panControls': {'up': false, 'right': false, 'down': false, 'left': false}, 'zoomSize': 1.5}",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook URL",
      description: "Webhook URL to be notified of updates",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.letz.ai";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async emitImageCreatedEvent() {
      // Placeholder for emitting new image created event
    },
    async emitImageEditCreatedEvent() {
      // Placeholder for emitting new image edit created event
    },
    async createImageGenerationTask(data = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/images",
        data,
      });
    },
    async retrieveImageInfo(imageId) {
      return this._makeRequest({
        path: `/images/${imageId}`,
      });
    },
    async createImageEditTask(data = {}) {
      const {
        mode, ...otherData
      } = data;
      return this._makeRequest({
        method: "POST",
        path: "/image-edits",
        data: {
          ...otherData,
          mode,
        },
      });
    },
  },
  version: "0.0.{{ts}}",
};
