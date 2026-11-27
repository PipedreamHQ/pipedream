import {
  axios, ConfigurationError,
} from "@pipedream/platform";

export default {
  type: "app",
  app: "groundsocial",
  propDefinitions: {
    endpoint: {
      type: "string",
      label: "Endpoint",
      description: "The endpoint to call, e.g. `reddit.search.posts`. Use the **Find Endpoints** action to find the `id` for a task. [See the endpoint reference](https://groundsocial.dev/docs/api)",
      async options() {
        const { endpoints } = await this.listEndpoints();
        return endpoints.map((endpoint) => ({
          label: `${endpoint.id}: ${endpoint.title} (${endpoint.credits} cr)`,
          value: endpoint.id,
        }));
      },
    },
    query: {
      type: "string",
      label: "Query",
      description: "Search words, e.g. `typescript narrowing`",
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Result order, e.g. `relevance`",
      default: "relevance",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return, from 1 to 100 (default 25), e.g. `10`",
      min: 1,
      max: 100,
      default: 25,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.groundsocial.dev";
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    listEndpoints(opts = {}) {
      return this._makeRequest({
        path: "/v1/utility/endpoints",
        ...opts,
      });
    },
    listPlatforms(opts = {}) {
      return this._makeRequest({
        path: "/v1/platforms",
        ...opts,
      });
    },
    findEndpoints(opts = {}) {
      return this._makeRequest({
        path: "/v1/utility/find",
        ...opts,
      });
    },
    async callEndpoint({
      $, endpointId, params = {},
    }) {
      const { endpoints } = await this.listEndpoints({
        $,
      });
      const endpoint = endpoints.find((e) => e.id === endpointId || e.tool === endpointId);
      if (!endpoint) {
        throw new ConfigurationError(`Unknown endpoint "${endpointId}". Use the Find Endpoints action to look it up.`);
      }
      const input = {
        ...params,
      };
      let path = endpoint.path;
      for (const [
        placeholder,
        name,
      ] of endpoint.path.matchAll(/\{([^}]+)\}/g)) {
        if (input[name] === undefined || input[name] === "") {
          throw new ConfigurationError(`The endpoint ${endpoint.id} needs the "${name}" parameter`);
        }
        path = path.replace(placeholder, encodeURIComponent(String(input[name])));
        delete input[name];
      }
      if (endpoint.method === "GET") {
        return this._makeRequest({
          $,
          path,
          params: input,
        });
      }
      return this._makeRequest({
        $,
        method: endpoint.method,
        path,
        data: input,
      });
    },
  },
};
