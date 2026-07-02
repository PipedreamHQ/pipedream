import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "speak_ai",
  propDefinitions: {
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder to upload or retrieve files from",
      async options({ page }) {
        const { data: { folders } } = await this.listFolders({
          params: {
            page,
            pageSize: constants.DEFAULT_LIMIT,
          },
        });
        return folders.map(({
          folderId: value,
          name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    mediaType: {
      type: "string",
      label: "Media Type",
      description: "Type of media file (audio or video)",
      options: [
        "audio",
        "video",
      ],
    },
    mediaId: {
      type: "string",
      label: "Media ID",
      description: "The ID of the media file to retrieve the full transcription for",
      async options({
        page, folderId, mediaType,
      }) {
        const { data: { mediaList } } = await this.listMedia({
          params: {
            page,
            pageSize: constants.DEFAULT_LIMIT,
            folderId,
            mediaType,
          },
        });
        return mediaList.map(({
          mediaId: value,
          name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The instruction or question to run against your selected folder and/or media, e.g. `Summarize the key action items from this transcript`.",
    },
    mediaIds: {
      type: "string[]",
      label: "Media IDs",
      description: "One or more Speak AI media IDs to include as context for the prompt. Each is the media item's unique ID — get it from the **Find Media** action, the `mediaId` field on a media webhook event, or the media item in the Speak AI app.",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      const {
        api_key: apiKey,
        oauth_access_token: accessToken,
      } = this.$auth;
      return {
        ...headers,
        "x-speakai-key": apiKey,
        "x-access-token": accessToken,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "delete",
        ...args,
      });
    },
    listFolders(args = {}) {
      return this._makeRequest({
        path: "/folder",
        ...args,
      });
    },
    listMedia(args = {}) {
      return this._makeRequest({
        path: "/media",
        ...args,
      });
    },
    getInsight({
      mediaId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/media/insight/${mediaId}`,
        ...args,
      });
    },
    getTextInsight({
      mediaId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/text/insight/${mediaId}`,
        ...args,
      });
    },
    /**
     * Subscribes a Speak AI webhook so events are delivered to the given callback URL.
     * @param {object} [opts={}] - Options for the request.
     * @param {object} opts.data - Subscription payload merged over the defaults
     * (`source`, `description`); must include `callbackUrl` and `events`.
     * @returns {Promise<object>} The API response containing the created `webhookId`.
     */
    subscribeWebhook({
      data, ...args
    } = {}) {
      return this.post({
        path: "/webhook",
        data: {
          source: "pipedream",
          description: "Pipedream integration",
          ...data,
        },
        ...args,
      });
    },
    /**
     * Removes a previously created Speak AI webhook subscription.
     * @param {object} [opts={}] - Options for the request.
     * @param {string} opts.webhookId - The ID of the webhook to delete.
     * @returns {Promise<object>} The API response for the delete request.
     */
    unsubscribeWebhook({
      webhookId, ...args
    } = {}) {
      return this.delete({
        path: `/webhook/${webhookId}`,
        ...args,
      });
    },
    /**
     * Retrieves media insights (transcripts, sentiment, media items) from the apps endpoint.
     * @param {object} [args={}] - Request options such as `params` and `$`.
     * @returns {Promise<object|object[]>} The insights response for the requested media.
     */
    getInsights(args = {}) {
      return this._makeRequest({
        path: "/apps/insights",
        ...args,
      });
    },
    /**
     * Retrieves exported media assets (e.g. SRT/VTT captions) from the apps endpoint.
     * @param {object} [args={}] - Request options such as `params`, `headers`, and `$`.
     * @returns {Promise<object|object[]>} The export response for the requested media.
     */
    getExport(args = {}) {
      return this._makeRequest({
        path: "/apps/export",
        ...args,
      });
    },
    /**
     * Retrieves the Magic Prompt response history from the apps endpoint.
     * @param {object} [args={}] - Request options such as `params`, `headers`, and `$`.
     * @returns {Promise<object>} The response containing the prompt history list.
     */
    getPromptsHistory(args = {}) {
      return this._makeRequest({
        path: "/apps/prompts/history",
        ...args,
      });
    },
    /**
     * Runs a Speak AI Magic Prompt against a folder and/or specific media.
     * @param {object} [args={}] - Request options; `data` carries the prompt payload.
     * @returns {Promise<object>} The API response for the submitted prompt.
     */
    runPrompt(args = {}) {
      return this.post({
        path: "/prompt",
        ...args,
      });
    },
    /**
     * Normalizes an apps-endpoint response (insights/export) to a single resource.
     * These endpoints may return either an array of results or a single object.
     * @param {object|object[]} results - The raw response from an apps endpoint.
     * @param {object} [fallback] - Value returned when no result is present.
     * @returns {object} The first available result, or `fallback` when none exists.
     */
    firstResult(results, fallback) {
      const first = Array.isArray(results)
        ? results[0]
        : results;
      return first || fallback;
    },
  },
};
