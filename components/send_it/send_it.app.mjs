import { axios } from "@pipedream/platform";
import crypto from "crypto";
import {
  PLATFORMS,
  MEDIA_TYPES,
  PLATFORM_FILTER_OPTIONS,
  SIGNATURE_TOLERANCE_SECONDS,
  DEFAULT_TIMEOUT_MS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "send_it",
  propDefinitions: {
    platforms: {
      type: "string[]",
      label: "Platforms",
      description: "Select platforms to publish to",
      options: PLATFORMS,
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
      options: MEDIA_TYPES,
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
      options: PLATFORM_FILTER_OPTIONS,
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
      timeout = DEFAULT_TIMEOUT_MS,
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        method,
        headers: this._headers(),
        data,
        params,
        timeout,
      });
    },
    verifySignature(payload, signature, secret) {
      if (!signature || !secret) {
        return false;
      }

      // Parse signature header: t={timestamp},v1={signature}
      const parts = signature.split(",");
      const timestampPart = parts.find((p) => p.startsWith("t="));
      const signaturePart = parts.find((p) => p.startsWith("v1="));

      if (!timestampPart || !signaturePart) {
        return false;
      }

      const timestamp = timestampPart.slice(2);
      const expectedSignature = signaturePart.slice(3);

      // Check timestamp tolerance (5 minutes)
      const timestampSeconds = parseInt(timestamp, 10);
      const now = Math.floor(Date.now() / 1000);
      if (Math.abs(now - timestampSeconds) > SIGNATURE_TOLERANCE_SECONDS) {
        return false;
      }

      // Calculate expected signature
      const signedPayload = `${timestamp}.${payload}`;
      const computedSignature = crypto
        .createHmac("sha256", secret)
        .update(signedPayload)
        .digest("hex");

      // Constant-time comparison
      try {
        return crypto.timingSafeEqual(
          Buffer.from(expectedSignature),
          Buffer.from(computedSignature),
        );
      } catch {
        return false;
      }
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
      mediaUrls,
      mediaType,
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
            mediaUrls,
            mediaType,
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
        params: platform
          ? {
            platform,
          }
          : {},
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
