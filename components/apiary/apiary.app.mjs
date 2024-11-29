import { axios } from "@pipedream/platform";
import contants from "./common/contants.mjs";

export default {
  type: "app",
  app: "apiary",
  propDefinitions: {
    apiSubdomain: {
      type: "string",
      label: "API Subdomain",
      description: "Subdomain of the API",
      async options() {
        const response = await this.listApis();
        const apisSubdomains = response.apis;
        return apisSubdomains.map(({
          apiSubdomain, apiName,
        }) => ({
          value: apiSubdomain,
          label: apiName,
        }));
      },
    },
    type: {
      type: "string",
      label: "Type of the API",
      description: "Name of the organization",
      options: contants.API_TYPES,
    },
    public: {
      type: "boolean",
      label: "Public",
      description: "Defines if the API is public or private",
    },
    desiredName: {
      type: "string",
      label: "Desired Name",
      description: "If the desiredName is already taken, a different domain will be generated for your API Project. It can be later changed in the settings",
    },
    code: {
      type: "string",
      label: "Code",
      description: "`FORMAT: 1`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.apiary.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.token}`,
        },
      });
    },
    async createApiProject(args = {}) {
      return this._makeRequest({
        path: "/blueprint/create",
        method: "post",
        ...args,
      });
    },
    async fetchBlueprint({
      apiSubdomain, ...args
    }) {
      return this._makeRequest({
        path: `/blueprint/get/${apiSubdomain}`,
        ...args,
      });
    },
    async publishBlueprint({
      apiSubdomain, ...args
    }) {
      return this._makeRequest({
        path: `/blueprint/get/${apiSubdomain}`,
        ...args,
      });
    },
    async listApis(args = {}) {
      return this._makeRequest({
        path: "/me/apis",
        ...args,
      });
    },
  },
};
