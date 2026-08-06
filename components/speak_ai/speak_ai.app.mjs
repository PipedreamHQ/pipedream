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
      description: "A Speak AI media ID, e.g. `f8eb3c22bec3`. Returned as `mediaId` by **Upload Media** and by every media trigger in this app",
      options(opts) {
        return this.listMediaOptions(opts);
      },
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The instruction or question to run against the selected media, e.g. `Summarize the key action items from this transcript`. Be as descriptive as possible to get an accurate answer",
    },
    mediaIds: {
      type: "string[]",
      label: "Media IDs",
      description: "One or more Speak AI media IDs to answer the prompt from, e.g. `f8eb3c22bec3`. Returned as `mediaId` by **Upload Media** and by every media trigger in this app",
      options(opts) {
        return this.listMediaOptions(opts);
      },
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
     * Retrieves the transcript of a processed media file.
     * @param {object} [opts={}] - Options for the request.
     * @param {string} opts.mediaId - The ID of the media file to transcribe.
     * @returns {Promise<object>} The response wrapping the transcript in `data`.
     */
    getTranscript({
      mediaId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/media/transcript/${mediaId}`,
        ...args,
      });
    },
    /**
     * Exports a media file in the requested format (e.g. `srt`, `vtt`, `pdf`).
     * @param {object} [opts={}] - Options for the request.
     * @param {string} opts.mediaId - The ID of the media file to export.
     * @param {string} opts.fileType - The export format to generate.
     * @returns {Promise<string|object>} The exported file contents.
     */
    exportMedia({
      mediaId, fileType, ...args
    } = {}) {
      return this.post({
        path: `/media/export/${mediaId}/${fileType}`,
        ...args,
      });
    },
    /**
     * Lists the AI Chat prompts that have already run in the account.
     * @param {object} [args={}] - Request options such as `$`.
     * @returns {Promise<object>} The response wrapping the prompt history in `data.history`.
     */
    listPrompts(args = {}) {
      return this._makeRequest({
        path: "/prompt",
        ...args,
      });
    },
    /**
     * Runs a Speak AI Chat prompt against one or more media files.
     * @param {object} [args={}] - Request options; `data` carries the prompt payload.
     * @returns {Promise<object>} The API response containing the answer in `data`.
     */
    runPrompt(args = {}) {
      return this.post({
        path: "/prompt",
        ...args,
      });
    },
    /**
     * Lists the media files in the account as prop options.
     * @param {object} [opts={}] - The options context provided by the prop.
     * @param {number} opts.page - The page of media files to list.
     * @param {string} [opts.folderId] - Restricts the list to a single folder.
     * @param {string} [opts.mediaType] - Restricts the list to `audio`, `video` or `text`.
     * @returns {Promise<object[]>} Label/value pairs for each media file.
     */
    async listMediaOptions({
      page, folderId, mediaType,
    } = {}) {
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
};
