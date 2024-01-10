import { axios } from "@pipedream/platform";
import {
  CURRENCY_OPTIONS, LIMIT,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "omise",
  propDefinitions: {
    card: {
      type: "string",
      label: "Card",
      description: "An unused token identifier to add as a new card to the customer",
      async options({
        page, customer,
      }) {
        if (customer) {
          const { data } = await this.listCards({
            customer,
            params: {
              limit: LIMIT,
              offset: LIMIT * page,
            },
          });

          return data.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          }));
        }
        return [];
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The unique identifier for a customer",
      async options({ page }) {
        const { data } = await this.listCustomers({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({
          id: value, email,
        }) => ({
          label: email || value,
          value,
        }));
      },
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "The amount for the charge in the smallest currency unit.",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency for the charge",
      options: CURRENCY_OPTIONS,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the customer. Supplying any additional details about the customer helps Opn Payments better conduct fraud analysis.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address for customer. Supplying the customer's email address helps Opn Payments better conduct fraud analysis.",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Custom metadata (e.g. `{\"answer\": 42}`) for customer.",
    },
    defaultCard: {
      type: "string",
      label: "Default Card ID",
      description: "Identifier of the default card for creating charges",
      optional: true,
    },
    capture: {
      type: "boolean",
      label: "Capture",
      description: "Whether the charge is set to be automatically captured (paid). Valid only for credit and debit card charges.",
      optional: true,
    },
    returnUri: {
      type: "string",
      label: "Return URI",
      description: "The URI to which the customer is redirected after authorization. Required if `card` and `customer` are not present.",
      optional: true,
    },
    sourceId: {
      type: "string",
      label: "Source ID",
      description: "A valid source identifier or source object",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.omise.co";
    },
    _auth() {
      return {
        username: `${this.$auth.secret_key}`,
        password: "",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    createCustomer(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/customers",
        ...opts,
      });
    },
    listCards({
      customer, ...opts
    }) {
      return this._makeRequest({
        path: `/customers/${customer}/cards`,
        ...opts,
      });
    },
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    updateCustomer({
      customerId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/customers/${customerId}`,
        ...opts,
      });
    },
    createCharge(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/charges",
        ...opts,
      });
    },
    listCharges(opts = {}) {
      return this._makeRequest({
        path: "/charges",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, filter = null, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page;
        page++;
        const { data } = await fn({
          params,
        });
        let tempData = [];
        let filteredData = data;
        let freezeDate = null;

        if (filter) {
          for (const item of data) {
            if (item[filter]) {
              tempData.push(item);
            } else {
              freezeDate = item.created_at;
            }
          }
          filteredData = tempData;
        }

        for (const item of filteredData) {
          yield {
            freezeDate,
            item,
          };

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
