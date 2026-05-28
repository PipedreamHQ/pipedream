import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "grafana",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return this.$auth.domain.replace(/\/+$/, "");
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.service_account_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}/api${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    getCurrentUser($) {
      return this._makeRequest({
        $,
        path: "/user",
      });
    },
    searchDashboards($, params) {
      return this._makeRequest({
        $,
        path: "/search",
        params,
      });
    },
    getDashboard($, uid) {
      return this._makeRequest({
        $,
        path: `/dashboards/uid/${uid}`,
      });
    },
    saveDashboard($, data) {
      return this._makeRequest({
        $,
        path: "/dashboards/db",
        method: "POST",
        data,
      });
    },
    deleteDashboard($, uid) {
      return this._makeRequest({
        $,
        path: `/dashboards/uid/${uid}`,
        method: "DELETE",
      });
    },
    listDatasources($) {
      return this._makeRequest({
        $,
        path: "/datasources",
      });
    },
    queryDatasource($, data) {
      return this._makeRequest({
        $,
        path: "/ds/query",
        method: "POST",
        data,
      });
    },
    getAlertRules($) {
      return this._makeRequest({
        $,
        path: "/v1/provisioning/alert-rules",
      });
    },
    createAnnotation($, data) {
      return this._makeRequest({
        $,
        path: "/annotations",
        method: "POST",
        data,
      });
    },
    listFolders($) {
      return this._makeRequest({
        $,
        path: "/folders",
      });
    },
  },
};
