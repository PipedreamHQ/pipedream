import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "send_it",
  propDefinitions: {
    platforms: {
      type: "string[]",
      label: "Platforms",
      description: "Select platforms to publish to",
      options: constants.PLATFORMS,
    },
    text: {
      type: "string",
      label: "Post Text",
      description: "The text content of your post",
    },
    mediaUrl: {
      type: "string",
      label: "Media URL",
      description: "URL to an image or video (required for Instagram and TikTok)",
      optional: true,
    },
    mediaUrls: {
      type: "string[]",
      label: "Media URLs",
      description: "URLs for carousel posts (Instagram, Threads)",
      optional: true,
    },
    mediaType: {
      type: "string",
      label: "Media Type",
      description: "Specify the media type",
      options: constants.MEDIA_TYPES,
      default: "auto",
      optional: true,
    },
    scheduledTime: {
      type: "string",
      label: "Scheduled Time",
      description: "When to publish the post (ISO 8601 format)",
    },
    scheduleId: {
      type: "string",
      label: "Schedule ID",
      description: "The ID of the scheduled post",
    },
    platformFilter: {
      type: "string",
      label: "Platform Filter",
      description: "Filter by platform",
      options: constants.PLATFORM_FILTER_OPTIONS,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://sendit.infiniteappsai.com/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      method = "GET",
      data,
      params,
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        method,
        headers: this._headers(),
        data,
        params,
      });
    },
    async publishPost({
      $,
      platforms,
      text,
      mediaUrl,
      mediaUrls,
      mediaType,
    }) {
      return this._makeRequest({
        $,
        path: "/publish",
        method: "POST",
        data: {
          platforms,
          content: {
            text,
            mediaUrl,
            mediaUrls,
            mediaType,
          },
        },
      });
    },
    async schedulePost({
      $,
      platforms,
      text,
      mediaUrl,
      scheduledTime,
    }) {
      return this._makeRequest({
        $,
        path: "/schedule",
        method: "POST",
        data: {
          platforms,
          content: {
            text,
            mediaUrl,
          },
          scheduledTime,
        },
      });
    },
    async listScheduledPosts({
      $,
      platform,
    }) {
      return this._makeRequest({
        $,
        path: "/scheduled",
        params: platform ? { platform } : {},
      });
    },
    async cancelScheduledPost({
      $,
      scheduleId,
    }) {
      return this._makeRequest({
        $,
        path: `/scheduled/${scheduleId}`,
        method: "DELETE",
      });
    },
    async triggerScheduledPost({
      $,
      scheduleId,
    }) {
      return this._makeRequest({
        $,
        path: `/scheduled/${scheduleId}/trigger`,
        method: "POST",
      });
    },
    async listAccounts({ $ }) {
      return this._makeRequest({
        $,
        path: "/accounts",
      });
    },
    async validateContent({
      $,
      platforms,
      text,
      mediaUrl,
      mediaUrls,
      mediaType,
    }) {
      return this._makeRequest({
        $,
        path: "/validate",
        method: "POST",
        data: {
          platforms,
          content: {
            text,
            mediaUrl,
            mediaUrls,
            mediaType,
          },
        },
      });
    },
    async createWebhook({
      $,
      url,
      events,
    }) {
      return this._makeRequest({
        $,
        path: "/webhooks",
        method: "POST",
        data: {
          url,
          events,
        },
      });
    },
    async deleteWebhook({
      $,
      webhookId,
    }) {
      return this._makeRequest({
        $,
        path: `/webhooks/${webhookId}`,
        method: "DELETE",
      });
    },
  },
};
