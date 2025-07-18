import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "joggai",
  propDefinitions: {
    avatarId: {
      type: "integer",
      label: "Avatar ID",
      description: "ID of the avatar.",
      async options({ avatarType }) {
        const fn = avatarType === "0"
          ? this.listJoggAvatars
          : this.listCustomAvatars;

        const { data: { avatars } } = await fn();

        return avatars.map(({
          avatar_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    voiceId: {
      type: "string",
      label: "Voice ID",
      description: "ID of the voice.",
      async options({ voiceType }) {
        const fn = voiceType === "0"
          ? this.listJoggVoices
          : this.listCustomVoices;

        const { data: { voices } } = await fn();

        return voices.map(({
          voice_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    name: {
      type: "string",
      label: "Product Name",
      description: "Name of the product to create.",
    },
    description: {
      type: "string",
      label: "Product Description",
      description: "Product introduction and selling points.",
      optional: true,
    },
    targetAudience: {
      type: "string",
      label: "Target Audience",
      description: "Target audience for the product.",
      optional: true,
    },
    mediaQuantity: {
      type: "integer",
      label: "Media Quantity",
      description: "Number of media to use for the product.",
      min: 3,
      reloadProps: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.jogg.ai/v1";
    },
    _headers(headers = {}) {
      return {
        "x-api-key": `${this.$auth.api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, url, path, headers, ...opts
    }) {
      return axios($, {
        url: url || (this._baseUrl() + path),
        headers: this._headers(headers),
        ...opts,
      });
    },
    createUrl(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/upload/asset",
        ...opts,
      });
    },
    createProduct(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/product",
        ...opts,
      });
    },
    updateProduct(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/product",
        ...opts,
      });
    },
    createAIAvatarPhoto(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/photo_avatar/photo/generate",
        ...opts,
      });
    },
    createAvatarVideo(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/create_video_from_talking_avatar",
        ...opts,
      });
    },
    listJoggAvatars() {
      return this._makeRequest({
        path: "/avatars",
      });
    },
    listCustomAvatars() {
      return this._makeRequest({
        path: "/avatars/custom",
      });
    },
    listJoggVoices() {
      return this._makeRequest({
        path: "/voices",
      });
    },
    listCustomVoices() {
      return this._makeRequest({
        path: "/voices/custom",
      });
    },

    async createProductFromInfo(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/product",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/endpoint",
        ...opts,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/endpoint/${hookId}`,
      });
    },
  },
};
