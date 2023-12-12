import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "phantombuster",
  propDefinitions: {
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "An ID identifying the agent",
      async options() {
        const resp = await this.getAgents(); //no pagination info given in docs
        return resp.map((agent) => ({
          label: agent.name,
          value: agent.id,
        }));
      },
    },
  },
  methods: {
    _getUrl(path) {
      return `https://api.phantombuster.com/api/v2${path}`;
    },
    _getHeaders(headers) {
      return {
        ...headers,
        "X-Phantombuster-Key": this.$auth.api_key,
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
      };
    },
    async _makeRequest({
      $, path, headers, ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async getAgents({ ...args } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/agents/fetch-all",
        ...args,
      });
    },
    async launchPhantom({ ...args } = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/agents/launch",
        ...args,
      });
    },
    async getOutput({ ...args } = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/agents/fetch-output",
        ...args,
      });
    },
  },
};
