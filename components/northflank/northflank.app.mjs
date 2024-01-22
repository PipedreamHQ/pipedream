import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "northflank",
  propDefinitions: {
    name: {
      type: "string",
      label: "Project name",
      description: "Name of the project",
    },
    description: {
      type: "string",
      label: "Project description",
      description: "Description of the project",
      optional: true,
    },
    color: {
      type: "string",
      label: "Color",
      description: "The color code of the project in the Northflank App, i.e. `#EF233C`",
      optional: true,
    },
    region: {
      type: "string",
      label: "Region",
      description: "The region the project will be hosted in",
      options: constants.REGIONS,
    },
    perPage: {
      type: "integer",
      label: "Results per page",
      description: "The number of results to display per request. Maximum of 100 results per page",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to access",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain name",
      description: "The domain name to register",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.northflank.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createProject(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        ...args,
      });
    },
    async createDomain(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/domains",
        ...args,
      });
    },
    async listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    async listDomains(args = {}) {
      return this._makeRequest({
        path: "/domains",
        ...args,
      });
    },
  },
};
