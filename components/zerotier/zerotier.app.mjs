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
    memberHidden: {
      type: "boolean",
      label: "Member Hidden?",
      description: "Whether or not the member is hidden in the UI",
      optional: true,
    },
    memberName: {
      type: "string",
      label: "Member Name",
      description: "User defined name of the member",
      optional: true,
    },
    memberDescription: {
      type: "string",
      label: "Member Description",
      description: "User defined description of the member",
      optional: true,
    },
    memberAuthorized: {
      type: "boolean",
      label: "Member Authorized?",
      description: "Is the member authorized on the network",
      optional: true,
    },
    memberActiveBridge: {
      type: "boolean",
      label: "Allow Ethernet Bridging?",
      description: "Allow the member to be a bridge on the network",
      optional: true,
    },
    memberNoAutoAssignIps: {
      type: "boolean",
      label: "Do Not Auto-Assign IPs",
      description:
        "Pass `TRUE` to exempt this member from the IP auto assignment pool on a Network",
      optional: true,
    },
    networkName: {
      type: "string",
      label: "Network Name",
      description: "User defined name of the network",
      optional: false,
    },
    privateNetwork: {
      type: "boolean",
      label: "Private Network",
      description: "If `FALSE`, members will _NOT_ need to be authorized to join.",
      default: true,
      optional: true,
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://api.zerotier.com/api/v1";
    },
    async _makeRequest(path, options = {}, $ = this) {
      return axios($, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `token ${this._accessToken()}`,
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
    async getStatus({ $ } = {}) {
      return this._makeRequest("status", {}, $);
    },
    async updateNetworkMember({
      networkId, nodeId, data, $,
    } = {}) {
      return this._makeRequest(
        `network/${networkId}/member/${nodeId}`,
        {
          method: "POST",
          data,
        },
        $,
      );
    },
    async createNetwork({
      data, $,
    } = {}) {
      return this._makeRequest("network", {
        method: "POST",
        data,
      }, $);
    },
    async deleteNetworkMember({
      networkId, nodeId, $,
    } = {}) {
      return this._makeRequest(`network/${networkId}/member/${nodeId}`, {
        method: "DELETE",
      }, $);
    },
  },
};
