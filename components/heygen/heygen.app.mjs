import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "heygen",
  propDefinitions: {
    customEvents: {
      type: "string[]",
      label: "Custom Events",
      description: "A custom set of event(s) that the user wants to trigger",
    },
    storageKey: {
      type: "string",
      label: "Storage Key",
      description: "A 'storage-key' prop which is generated from uploaded image file",
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "A 'template-id' prop as a required input, indicating the selected template",
    },
    videoId: {
      type: "string",
      label: "Video ID",
      description: "A 'video-id' prop referring to the specific heygen video",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.heygen.com";
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
          "user-agent": "@PipedreamHQ/pipedream v0.1",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async emitEvent(eventType, eventData) {
      return this._makeRequest({
        method: "POST",
        path: `/events/${eventType}`,
        data: eventData,
      });
    },
    async createTalkingPhoto(storageKey) {
      return this._makeRequest({
        method: "POST",
        path: "/talking-photo",
        data: {
          storageKey,
        },
      });
    },
    async generateVideo(templateId) {
      return this._makeRequest({
        method: "POST",
        path: "/generate-video",
        data: {
          templateId,
        },
      });
    },
    async fetchShareableLink(videoId) {
      return this._makeRequest({
        path: `/videos/${videoId}/shareable-link`,
      });
    },
  },
};
