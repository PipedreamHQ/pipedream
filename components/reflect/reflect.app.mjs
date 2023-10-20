import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "reflect",
  propDefinitions: {
    graphId: {
      type: "string",
      label: "GraphId",
      description: "The graph identifier",
      async options() {
        const { graph_ids: ids } = await this.getUser();
        return ids;
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://reflect.app/api";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    getUser(args = {}) {
      return this._makeRequest({
        path: "/users/me",
        ...args,
      });
    },
    listLinks({
      graphId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/graphs/${graphId}/links`,
        ...args,
      });
    },
    createLink({
      graphId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/graphs/${graphId}/links`,
        method: "POST",
        ...args,
      });
    },
    appendDailyNote({
      graphId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/graphs/${graphId}/daily-notes`,
        method: "PUT",
        ...args,
      });
    },
  },
};
