import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "blotato",
  propDefinitions: {},
  methods: {
    _makeRequest({
      $ = this, path, method = "GET", data, headers = {}, ...opts
    }) {
      return axios($, {
        url: `https://backend.blotato.com${path}`,
        method,
        headers: {
          "blotato-api-key": `${this.$auth.api_key}`,
          "accept": "*/*",
          ...headers,
        },
        data,
        ...opts,
      });
    },
    createPost({
      title, content, media, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v2/posts",
        data: {
          title,
          content,
          media,
          ...args,
        },
      });
    },
    createVideoFromTemplate({
      $, templateId, inputs, isDraft, render, ...args
    } = {}) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/v2/videos/from-templates",
        data: {
          templateId,
          inputs,
          isDraft,
          render,
        },
        ...args,
      });
    },
    deleteVideo({
      $, videoId, ...args
    } = {}) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/v2/videos/${videoId}`,
        ...args,
      });
    },
    getVideo({
      $, videoId, ...args
    } = {}) {
      return this._makeRequest({
        $,
        path: `/v2/videos/creations/${videoId}`,
        ...args,
      });
    },
    uploadMedia({
      file, mediaType, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/v2/media",
        data: {
          file,
          mediaType,
          ...args,
        },
      });
    },
    listTemplates({
      fields, search, id, ...args
    } = {}) {
      return this._makeRequest({
        path: "/v2/videos/templates",
        params: {
          fields,
          search,
          id,
        },
        ...args,
      });
    },
  },
};
