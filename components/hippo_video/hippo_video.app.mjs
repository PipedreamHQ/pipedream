import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hippo_video",
  propDefinitions: {
    videoId: {
      type: "string",
      label: "Video ID",
      description: "The ID of the video to be personalized or to track analytics for.",
    },
    videoUrl: {
      type: "string",
      label: "Video URL",
      description: "The URL pointing to the video to be uploaded.",
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "The name of the contact to create.",
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email of the contact to create.",
    },
    contactPhoneNumber: {
      type: "string",
      label: "Contact Phone Number",
      description: "The phone number of the contact to create (optional).",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.hippovideo.io/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        data,
        params,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
          ...headers,
        },
        ...otherOpts,
      });
    },
    async createContact({
      contactName, contactEmail, contactPhoneNumber,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          name: contactName,
          email: contactEmail,
          phone: contactPhoneNumber,
        },
      });
    },
    async uploadVideo({ videoUrl }) {
      return this._makeRequest({
        method: "POST",
        path: "/videos/upload",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          url: videoUrl,
        },
      });
    },
    async personalizeVideo({ videoId }) {
      return this._makeRequest({
        method: "POST",
        path: `/videos/${videoId}/personalize`,
      });
    },
    async getVideoAnalytics({ videoId }) {
      return this._makeRequest({
        path: `/videos/${videoId}/analytics`,
      });
    },
    async emitNewLeadEvent(videoId) {
      // Method to handle new lead event for a specific video
      // This method needs to be implemented based on the event system in use
    },
    async emitNewPersonalizedVideoEvent() {
      // Method to handle new personalized video event
      // This method needs to be implemented based on the event system in use
    },
    async emitVideoWatchEvent(videoId) {
      // Method to handle video watch event for a specific video
      // This method needs to be implemented based on the event system in use
    },
  },
};
