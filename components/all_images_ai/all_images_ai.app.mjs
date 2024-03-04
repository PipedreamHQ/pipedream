import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "all_images_ai",
  propDefinitions: {
    imageId: {
      type: "string",
      label: "Image ID",
      description: "Enter the unique ID of the image.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Enter the name for the image generation.",
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Enter the mode for the image generation.",
      options: [
        {
          label: "Default",
          value: "default",
        },
        {
          label: "Custom",
          value: "custom",
        },
      ],
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Enter the prompt for the image generation.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.all-images.ai/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "api-key": `${this.$auth.api_key}`,
        },
      });
    },
    async generateImage({
      name, mode, prompt,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/image-generations",
        data: {
          name,
          mode,
          prompt,
        },
      });
    },
    async getImage({ imageId }) {
      return this._makeRequest({
        path: `/image-generations/${imageId}`,
      });
    },
    async purchaseImage({ imageId }) {
      return this._makeRequest({
        method: "POST",
        path: "/images/buy",
        data: {
          id: imageId,
        },
      });
    },
    async subscribeToWebhook({
      url, events,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/api-keys/webhook/subscribe",
        data: {
          url,
          events,
        },
      });
    },
    async unsubscribeFromWebhook({ apiWebhookId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/api-keys/webhook/unsubscribe/${apiWebhookId}`,
      });
    },
    async emitImageUpdateEvent() {
      // This method is a placeholder for emitting events when an image's generation status is updated.
      // Implement the logic to subscribe to the webhook and emit the event.
      console.log("Emitting image update event. This method should be implemented based on specific event handling logic.");
    },
  },
};
