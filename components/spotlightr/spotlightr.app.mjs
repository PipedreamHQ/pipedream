import axiosPipedream from "@pipedream/platform";
import axios from "axios";

export default {
  type: "app",
  app: "spotlightr",
  propDefinitions: {
    videoGroup: {
      type: "string",
      label: "Video Group",
      description: "The ID of the project.",
      async options() {
        const { data } = await this.listGroups();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    videoId: {
      type: "string",
      label: "Video Id",
      description: "The ID of the video.",
      async options() {
        const { videos: { data } } = await this.listVideos();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.spotlightr.com/api";
    },
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getParams(params = {}) {
      return {
        ...params,
        "vooKey": this._getApiKey(),
      };
    },
    _makeRequest({
      $ = this, params, path, formDataRequest = false, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        params: this._getParams(params),
        ...opts,
      };

      if (formDataRequest) return axios(config);
      return axiosPipedream.axios($, config);
    },
    createVideo(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "createVideo",
        ...args,
      });
    },
    deleteVideo(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "deleteVideo",
        ...args,
      });
    },
    getViews(args = {}) {
      return this._makeRequest({
        path: "views/getViews",
        ...args,
      });
    },
    listGroups(args = {}) {
      return this._makeRequest({
        path: "groups",
        ...args,
      });
    },
    listVideos(args = {}) {
      return this._makeRequest({
        path: "videos",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          data,
          current_page: currentPage,
          last_page: lastPage,
        } = await fn({
          params,
        });

        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = currentPage != lastPage;

      } while (hasMore);
    },
  },
};
