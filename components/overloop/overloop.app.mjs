import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "overloop",
  propDefinitions: {},
  methods: {
    _baseUrl() {
      return "https://api.overloop.com/public/v1";
    },
    _headers() {
      return {
        Authorization: `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      };
      return axios($, config);
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    listDeals(args = {}) {
      return this._makeRequest({
        path: "/deals",
        ...args,
      });
    },
    listLists(args = {}) {
      return this._makeRequest({
        path: "/lists",
        ...args,
      });
    },
    listPipelines(args = {}) {
      return this._makeRequest({
        path: "/pipelines",
        ...args,
      });
    },
    listStages(args = {}) {
      return this._makeRequest({
        path: "/stages",
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        ...args,
      });
    },
    listOrganizations(args = {}) {
      return this._makeRequest({
        path: "/organizations",
        ...args,
      });
    },
    listAutomations(args = {}) {
      return this._makeRequest({
        path: "/automations",
        ...args,
      });
    },
    listExclusingListItems(args = {}) {
      return this._makeRequest({
        path: "/exclusion_list_items",
        ...args,
      });
    },
  },
};
