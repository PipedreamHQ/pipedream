import { axios } from "@pipedream/platform";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "google_photos",
  propDefinitions: {
    mediaItemId: {
      type: "string",
      label: "Media Item ID",
      description: "Media Item ID",
      async options({ prevContext }) {
        const { pageToken } = prevContext;
        return utils.asyncPropHandler({
          resourceFn: this.listMediaItems,
          pageToken,
          resourceKey: "mediaItems",
          labelVal: {
            label: "filename",
            value: "id",
          },
        });
      },
    },
    albumId: {
      type: "string",
      label: "Album ID",
      description: "Album ID",
      async options({ prevContext }) {
        const { pageToken } = prevContext;
        return utils.asyncPropHandler({
          resourceFn: this.listAlbums,
          pageToken,
          resourceKey: "albums",
          labelVal: {
            label: "title",
            value: "id",
          },
        });
      },
    },
  },
  methods: {
    _getUrl(path) {
      return `https://photoslibrary.googleapis.com/v1${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $, path, headers, ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async listMediaItems(args = {}) {
      return this._makeRequest({
        path: "/mediaItems",
        ...args,
      });
    },
    async listAlbums(args = {}) {
      return this._makeRequest({
        path: "/albums",
        ...args,
      });
    },
    async getMediaItem({
      itemId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/mediaItems/${itemId}`,
        ...args,
      });
    },
    async createAlbum(args = {}) {
      return this._makeRequest({
        path: "/albums",
        method: "POST",
        ...args,
      });
    },
    async addItemsToAlbum({
      albumId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/albums/${albumId}:batchAddMediaItems`,
        method: "POST",
        ...args,
      });
    },
    async shareAlbum({
      albumId,
      ...args
    } = {}) {
      return this._makeRequest({
        path: `/albums/${albumId}:share`,
        method: "POST",
        ...args,
      });
    },
    async uploadBytes(args = {}) {
      return this._makeRequest({
        path: "/uploads",
        method: "POST",
        ...args,
      });
    },
    async createItem(args = {}) {
      return this._makeRequest({
        path: "/mediaItems:batchCreate",
        method: "POST",
        ...args,
      });
    },
  },
};
