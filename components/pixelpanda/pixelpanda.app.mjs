import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pixelpanda",
  propDefinitions: {
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "Public URL of the image (JPEG/PNG/WebP, max 10MB)",
    },
    jobId: {
      type: "string",
      label: "Job ID",
      description: "The ID of the job to fetch",
    },
  },
  methods: {
    _baseUrl() {
      return "https://pixelpanda.ai/api/v2";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    async makeRequest({
      $ = this, path, ...args
    } = {}) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    async removeBackground(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/remove-background",
        ...args,
      });
    },
    async upscaleImage(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/upscale",
        ...args,
      });
    },
    async enhancePhoto(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/enhance",
        ...args,
      });
    },
    async editImage(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/edit",
        ...args,
      });
    },
    async imageToPrompt(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/image-to-prompt",
        ...args,
      });
    },
    async generateProductPhotos(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/generate/scenes-from-url",
        ...args,
      });
    },
    async createAdPack(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/ad-pack",
        ...args,
      });
    },
    async generateUgcVideo(args = {}) {
      return this.makeRequest({
        method: "post",
        path: "/generate/video",
        ...args,
      });
    },
    async getJob({
      jobId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/jobs/${jobId}`,
        ...args,
      });
    },
    async getAdPack({
      jobId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/ad-pack/${jobId}`,
        ...args,
      });
    },
    async getVideoJob({
      jobId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/jobs/video/${jobId}`,
        ...args,
      });
    },
  },
};
