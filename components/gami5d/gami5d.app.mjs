import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gami5d",
  methods: {
    _baseUrl() {
      return "https://app.gami5d.com";
    },
    _getAuth() {
      return {
        username: `${this.$auth.access_key}`,
        password: `${this.$auth.secret_access_key}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;

      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        auth: this._getAuth(),
      });
    },
    listAttributes(opts = {}) {
      const {
        client_id: clientId, project_id: projectId,
      } = this.$auth;
      return this._makeRequest({
        path: `/attribute/${clientId}/${projectId}/list/basic`,
        ...opts,
      });
    },
    recordObservation(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/observation",
        ...opts,
      });
    },
  },
};
