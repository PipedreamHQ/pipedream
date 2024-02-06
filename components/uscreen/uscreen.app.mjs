import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "uscreen",
  propDefinitions: {
    offerId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product",
      async options() {
        const offers = await this.getOffers();

        return offers.map((offer) => ({
          label: offer.title,
          value: offer.id,
        }));
      },
    },
  },
  methods: {
    _publisherApiKey() {
      return this.$auth.publisher_api_key;
    },
    _apiUrl() {
      return "https://www.uscreen.io/publisher_api/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: this._publisherApiKey(),
        },
        ...args,
      });
    },
    async createUser(args = {}) {
      return this._makeRequest({
        path: "/customers",
        method: "post",
        ...args,
      });
    },
    async grantUserAccess({
      email, ...args
    }) {
      return this._makeRequest({
        path: `/customers/${email}/accesses`,
        method: "post",
        ...args,
      });
    },
    async getOffers(args = {}) {
      return this._makeRequest({
        path: "/offers",
        ...args,
      });
    },
  },
};
