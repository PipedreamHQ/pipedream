import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hippo_video",
  propDefinitions: {
    listIds: {
      type: "string[]",
      label: "List Ids",
      description: "A list of lists you want to add the prospect.",
      async options({ page }) {
        const { contacts_list: data } = await this.listLists({
          params: {
            page,
          },
        });

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
      label: "Video ID",
      description: "The ID of the video to be personalized.",
      async options({ page }) {
        const { videos } = await this.listVideos({
          params: {
            page: page + 1,
          },
        });

        return videos.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.hippovideo.io";
    },
    _params(params = {}) {
      return {
        ...params,
        email: `${this.$auth.email}`,
        api_key: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: this._params(params),
        headers: {
          "Accept": "*/*",
        },
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/contacts/names",
        ...opts,
      });
    },
    listVideos(opts = {}) {
      return this._makeRequest({
        path: "/api/v1/me/videos/list",
        ...opts,
      });
    },
    personalizeVideo(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/me/video/bulk_personalize",
        ...opts,
      });
    },
    uploadVideo(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/v1/me/video/import",
        ...opts,
      });
    },
    updateWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhook",
        ...opts,
      });
    },
  },
};
