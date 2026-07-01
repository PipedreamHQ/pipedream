import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "whisper",
  propDefinitions: {
    address: {
      type: "string",
      label: "Agent IPv6 Address",
      description: "The Whisper agent's routable IPv6 `/128` address to inspect, e.g. `2a04:2a01:b69a:6717:e3b0:51ff:3bf7:f478`. Whisper agent addresses live in the `2a04:2a01::/32` range (AS219419). Compressed or expanded IPv6 notation is accepted.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://rdap.whisper.online";
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        ...args,
      });
    },
    async verifyIdentity({
      address, ...args
    }) {
      return this._makeRequest({
        path: "/verify-identity",
        params: {
          ip: address,
        },
        ...args,
      });
    },
    async getRdapRecord({
      address, ...args
    }) {
      return this._makeRequest({
        path: `/ip/${address}`,
        ...args,
      });
    },
    async getTransparencyLog({
      address, ...args
    }) {
      return this._makeRequest({
        path: `/ip/${address}/transparency`,
        ...args,
      });
    },
    async getInboundLookups({
      address, ...args
    }) {
      return this._makeRequest({
        path: `/ip/${address}/lookups`,
        ...args,
      });
    },
  },
};
