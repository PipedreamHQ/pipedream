import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "grain",
  propDefinitions: {
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the recording to fetch",
      async options({ prevContext: { nextPage } }) {
        const {
          recordings, cursor,
        } = await this.listRecordings({
          params: {
            cursor: nextPage,
          },
        });
        return {
          options: recordings.map(({
            id: value, title: label,
          }) => ({
            value,
            label,
          })),
          context: {
            nextPage: cursor,
          },
        };
      },
    },
    viewId: {
      type: "string",
      label: "View ID",
      description: "The ID of the view to fetch",
      async options({
        type, prevContext: { nextPage },
      }) {
        const {
          views, cursor,
        } = await this.listViews({
          params: {
            type_filter: type,
            cursor: nextPage,
          },
        });
        return {
          options: views.map(({
            id: value, name: label,
          }) => ({
            value,
            label,
          })),
          context: {
            nextPage: cursor,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://grain.com/_/public-api";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listRecordings(opts = {}) {
      return this._makeRequest({
        path: "/recordings",
        ...opts,
      });
    },
    listViews(opts = {}) {
      return this._makeRequest({
        path: "/views",
        ...opts,
      });
    },
    fetchRecording({
      recordId, ...opts
    }) {
      return this._makeRequest({
        path: `/recordings/${recordId}`,
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/hooks",
        ...opts,
      });
    },
    deleteWebhook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/hooks/${hookId}`,
      });
    },
  },
};
