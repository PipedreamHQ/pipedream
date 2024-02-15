import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "littlegreenlight",
  propDefinitions: {
    constituentId: {
      type: "string",
      label: "Constituent ID",
      description: "The ID of the constituent in Little Green Light.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the constituent.",
    },
    giftTypeId: {
      type: "string",
      label: "Gift Type ID",
      description: "The ID of the gift type.",
    },
    giftTypeName: {
      type: "string",
      label: "Gift Type Name",
      description: "The name of the gift type.",
    },
    clientKey: {
      type: "string",
      label: "Client Key",
      description: "The client key used for authentication.",
      secret: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.littlegreenlight.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.clientKey}`,
        },
      });
    },
    async createGift({
      constituentId, giftTypeId, giftTypeName, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/constituents/${constituentId}/gifts`,
        data: {
          gift_type_id: giftTypeId,
          gift_type_name: giftTypeName,
          ...opts,
        },
      });
    },
    async addConstituent({
      lastName, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/constituents",
        data: {
          last_name: lastName,
          ...opts,
        },
      });
    },
    async updateConstituent({
      constituentId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/constituents/${constituentId}`,
        data: opts,
      });
    },
    async fetchGifts({ constituentId }) {
      return this._makeRequest({
        method: "GET",
        path: `/constituents/${constituentId}/gifts`,
      });
    },
  },
};
