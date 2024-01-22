import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "northflank",
  propDefinitions: {
    projectName: {
      type: "string",
      label: "Project Name",
      description: "The name of the project.",
    },
    projectDescription: {
      type: "string",
      label: "Project Description",
      description: "A description of the project.",
    },
    projectColor: {
      type: "string",
      label: "Project Color",
      description: "The color associated with the project, in hex format (e.g., #EF233C).",
    },
    projectRegion: {
      type: "string",
      label: "Project Region",
      description: "The region where the project will be hosted.",
    },
    clusterId: {
      type: "string",
      label: "Cluster ID",
      description: "The ID of your own cluster, if deploying to your own cluster.",
      optional: true,
    },
    domainName: {
      type: "string",
      label: "Domain Name",
      description: "The name of the domain to be created.",
    },
    paginationPage: {
      type: "integer",
      label: "Page",
      description: "The page number for pagination.",
      default: 1,
      optional: true,
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
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createProject({
      projectName, projectDescription, projectColor, projectRegion, clusterId,
    }) {
      const payload = {
        name: projectName,
        description: projectDescription,
        color: projectColor,
        ...(clusterId
          ? {
            clusterId,
          }
          : {
            region: projectRegion,
          }),
      };
      return this._makeRequest({
        method: "POST",
        path: "/projects",
        data: payload,
      });
    },
    async listProjects({ paginationPage }) {
      return this.paginate(this._makeRequest, {
        path: "/projects",
        params: {
          page: paginationPage,
        },
      });
    },
    async createDomain({ domainName }) {
      const payload = {
        name: domainName,
      };
      return this._makeRequest({
        method: "POST",
        path: "/domains",
        data: payload,
      });
    },
    async listDomains({ paginationPage }) {
      return this.paginate(this._makeRequest, {
        path: "/domains",
        params: {
          page: paginationPage,
        },
      });
    },
    async paginate(fn, opts) {
      let page = opts.params.page || 1;
      let hasMore = true;
      const results = [];
      while (hasMore) {
        const response = await fn.call(this, {
          ...opts,
          params: {
            ...opts.params,
            page,
          },
        });
        results.push(...response);
        hasMore = response.length > 0;
        page++;
      }
      return results;
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
