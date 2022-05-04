import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zerotier",
  propDefinitions: {
    networkId: {
      label: "Network",
      description: "Select a network",
      type: "string",
      async options() {
        const networks = await this.getNetworks();

        return networks.map((network) => ({
          label: network.config.name,
          value: network.id,
        }));
      },
    },
    nodeId: {
      label: "Node",
      description: "Select a node",
      type: "string",
      async options({ networkId }) {
        const nodes = await this.getNetworkNodes({
          networkId,
        });

        return nodes.map((node) => ({
          label: node.name,
          value: node.nodeId,
        }));
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://my.zerotier.com/api/v1";
    },
    async _makeRequest(path, options = {}, $ = this) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...options,
      });
    },
    async getNetworks({ $ } = {}) {
      return this._makeRequest("network", {}, $);
    },
    async getNetwork({
      networkId, $,
    } = {}) {
      return this._makeRequest(`network/${networkId}`, {}, $);
    },
    async getNetworkNodes({
      networkId, $,
    } = {}) {
      return this._makeRequest(`network/${networkId}/member`, {}, $);
    },
    async getNetworkNode({
      networkId, nodeId, $,
    } = {}) {
      return this._makeRequest(`network/${networkId}/member/${nodeId}`, {}, $);
    },
    async getUser({
      userId, $,
    } = {}) {
      return this._makeRequest(`user/${userId}`, {}, $);
    },
  },
};
