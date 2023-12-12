import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "memberspot",
  propDefinitions: {
    offerId: {
      label: "Offer ID",
      description: "The offer ID",
      type: "string",
      async options() {
        const offers = await this.getOffers();

        return offers.map((offer) => ({
          label: offer.name,
          value: offer.id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.memberspot.de/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "X-API-KEY": this._apiKey(),
        },
        ...args,
      });
    },
    async getOffers(args = {}) {
      return this._makeRequest({
        path: "/offers",
        ...args,
      });
    },
    async grantAccess(args = {}) {
      return this._makeRequest({
        path: "/users/grant-user-offer-by-mail",
        method: "post",
        ...args,
      });
    },
    async deleteAccess(args = {}) {
      return this._makeRequest({
        path: "/users/set-offer-state",
        method: "post",
        ...args,
      });
    },
  },
};
