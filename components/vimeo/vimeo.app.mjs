import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "vimeo",
  propDefinitions: {
    videoId: {
      type: "string",
      label: "Video ID",
      description: "The ID of the video",
      async options({ page }) {
        const { data } = await this.listVideos({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({
          uri, name: label,
        }) => ({
          value: uri.split("/").pop(),
          label,
        })) || [];
      },
    },
    albumUri: {
      type: "string",
      label: "Album URI",
      description: "The URI of the album to add the video to",
      async options({ page }) {
        const { data } = await this.listAlbums({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({
          uri: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.vimeo.com";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    listVideos(opts = {}) {
      return this._makeRequest({
        path: "/me/videos",
        ...opts,
      });
    },
    listAlbums(opts = {}) {
      return this._makeRequest({
        path: "/me/albums",
        ...opts,
      });
    },
    listLikedVideos(opts = {}) {
      return this._makeRequest({
        path: "/me/likes",
        ...opts,
      });
    },
    searchVideos(opts = {}) {
      return this._makeRequest({
        path: "/videos",
        ...opts,
      });
    },
    uploadVideo(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/me/videos",
        headers: {
          Accept: "application/vnd.vimeo.*+json;version=3.4",
        },
        ...opts,
      });
    },
    addVideoToAlbum({
      videoId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/videos/${videoId}/albums`,
        ...opts,
      });
    },
    deleteVideo({
      videoId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/videos/${videoId}`,
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      params = {},
      max,
    }) {
      params = {
        ...params,
        page: 1,
        per_page: constants.DEFAULT_LIMIT,
      };
      let total, count = 0;
      do {
        const { data } = await resourceFn({
          params,
        });
        for (const item of data) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        total = data?.length;
        params.page++;
      } while (total === params.per_page);
    },
  },
};
