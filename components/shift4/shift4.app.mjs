import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "shift4",
  propDefinitions: {
    amount: {
      type: "integer",
      label: "Amount",
      description: "The charge amount in minor units of a given currency. For example, 10€ is represented as '1000'.",
    },
    card: {
      type: "string",
      label: "Card",
      description: "Card token, card details or card identifier.",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The charge currency represented as a three-letter ISO currency code.",
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Identifier of the customer that will be associated with this charge.",
      async options({ prevContext }) {
        const { list } = await this.listCustomers({
          params: {
            limit: LIMIT,
            startingAfterId: prevContext.lastId,
          },
        });

        return {
          options: list.map(({
            id: value, email: label,
          }) => ({
            label,
            value,
          })),
          context: {
            lastId: list.length
              ? list[list.length - 1].id
              : null,
          },
        };
      },
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the charge.",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Metadata object.",
    },
    orderIdentifier: {
      type: "string",
      label: "Order Identifier",
      description: "The identifier of the order related to the charge that was updated.",
    },
    recursTo: {
      type: "string",
      label: "Recurs To",
      description: "The plan to which this plan will recur after the billing cycles have completed.",
      async options({ prevContext }) {
        const { list } = await this.listPlans({
          params: {
            limit: LIMIT,
            startingAfterId: prevContext.lastId,
          },
        });

        return {
          options: list.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            lastId: list.length
              ? list[list.length - 1].id
              : null,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.shift4.com";
    },
    _auth() {
      return {
        username: `${this.$auth.api_key_secret}`,
        password: "",
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        auth: this._auth(),
      });
    },
    createCharge(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/charges",
        ...opts,
      });
    },
    createPlan(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/plans",
        ...opts,
      });
    },
    createToken(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tokens",
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
    listCustomers(opts = {}) {
      return this._makeRequest({
        path: "/customers",
        ...opts,
      });
    },
    listEvents(opts = {}) {
      return this._makeRequest({
        path: "/events",
        ...opts,
      });
    },
    listPlans(opts = {}) {
      return this._makeRequest({
        path: "/plans",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, filterTypes, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let lastId = null;

      do {
        params.limit = LIMIT;
        params.startingAfterId = lastId;
        const {
          list,
          hasMore: hasMoreItems,
        } = await fn({
          params,
          ...opts,
        });
        for (const d of list) {
          if (filterTypes.includes(d.type)) {
            yield d;

            if (maxResults && ++count === maxResults) {
              return count;
            }
          }
        }

        hasMore = hasMoreItems;

      } while (hasMore);
    },
  },
};
