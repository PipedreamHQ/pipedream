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
  },
};
