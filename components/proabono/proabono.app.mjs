import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "proabono",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier of the customer",
      async options({ page }) {
        const { Items: customers } = await this.listCustomers({
          params: {
            Page: page + 1,
          },
        });
        return customers?.map(({
          ReferenceCustomer: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    offerId: {
      type: "string",
      label: "Offer ID",
      description: "The unique identifier of the offer",
      async options({ page }) {
        const { Items: offers } = await this.listOffers({
          params: {
            Page: page + 1,
          },
        });
        return offers?.map(({
          ReferenceOffer: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "A set of key/value pairs that you can add to a customer. Useful for storing additional information about the customer in a structured format.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_endpoint}/v1`;
    },
    _auth() {
      return {
        username: `${this.$auth.agent_key}`,
        password: `${this.$auth.api_key}`,
      };
    },
    _headers() {
      return {
        Accept: "application/json",
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        auth: this._auth(),
        headers: this._headers(),
      });
    },
    getCustomer(opts = {}) {
      return this._makeRequest({
        path: "/Customer",
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/Customers",
        ...opts,
      });
    },
    listOffers(opts = {}) {
      return this._makeRequest({
        path: "/Offers",
        ...opts,
      });
    },
    listSubscriptions(opts = {}) {
      return this._makeRequest({
        path: "/Subscriptions",
        ...opts,
      });
    },
    createOrUpdateCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Customer",
        ...opts,
      });
    },
    createSubscription(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/Subscription",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      max,
    }) {
      const params = {
        SizePage: constants.DEFAULT_LIMIT,
        Page: 1,
      };
      let total, count = 0;
      do {
        const { Items: items } = await resourceFn({
          params,
        });
        for (const item of items) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
          params.Page++;
        }
      } while (total === params.SizePage);
    },
  },
};
